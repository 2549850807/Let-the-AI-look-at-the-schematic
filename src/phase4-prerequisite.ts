import type { StoredPhase3Plan } from './phase3-preflight';
import type { EnetConnectivitySnapshot } from './region-export';
import { sameSet } from './phase2-preflight';
import {
	PHASE3_PLAN_STORAGE_KEY,

} from './phase3-preflight';
import {
	confirmAction,
	getSelectedPrimitives,
	hashText,
	jsonPreviewTab,
	now,
	readNetlist,
	runProbe,
	safePrimitiveId,
	showPreview,
	startObservedCall,
	updateProbeState,
	waitForNewIds,
} from './probe-core';
import { buildEnetConnectivitySnapshot, readCurrentMemberNetworks } from './region-export';

interface NetlistHashSample {
	elapsedMs: number;
	length: number;
	hash: string;
	capturedAt: string;
}

interface MemberNetworkEvidence {
	elapsedMs: number;
	networks: Record<string, string>;
	passed: boolean;
	capturedAt: string;
	error?: string;
}

function delay(milliseconds: number): Promise<void> {
	return new Promise(resolve => globalThis.setTimeout(resolve, milliseconds));
}

async function captureNetlistHash(elapsedMs = 0): Promise<NetlistHashSample> {
	const { text } = await readNetlist();
	return {
		elapsedMs,
		length: text.length,
		hash: hashText(text),
		capturedAt: now(),
	};
}

async function captureNetlistHashSamples(delays: Array<number>): Promise<Array<NetlistHashSample>> {
	const samples: Array<NetlistHashSample> = [];
	let elapsed = 0;
	for (const milliseconds of delays) {
		await delay(milliseconds - elapsed);
		elapsed = milliseconds;
		samples.push(await captureNetlistHash(milliseconds));
	}
	return samples;
}

async function captureMemberNetworkEvidence(
	member: string,
	targetNet: string,
	delays: Array<number>,
): Promise<Array<MemberNetworkEvidence>> {
	const evidence: Array<MemberNetworkEvidence> = [];
	let elapsed = 0;
	for (const milliseconds of delays) {
		await delay(milliseconds - elapsed);
		elapsed = milliseconds;
		try {
			const networks = await readCurrentMemberNetworks([member]);
			const passed = networks[member] === targetNet;
			evidence.push({ elapsedMs: milliseconds, networks, passed, capturedAt: now() });
			if (passed) {
				break;
			}
		}
		catch (error) {
			evidence.push({
				elapsedMs: milliseconds,
				networks: {},
				passed: false,
				capturedAt: now(),
				error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
			});
		}
	}
	return evidence;
}

function connectivityValue(snapshot: EnetConnectivitySnapshot): string {
	return JSON.stringify({
		namedNetworks: snapshot.namedNetworks,
		generatedNetworks: snapshot.generatedNetworks,
	});
}

function connectivitySummary(snapshot: EnetConnectivitySnapshot): Record<string, unknown> {
	return {
		capturedAt: snapshot.capturedAt,
		sourceVersion: snapshot.sourceVersion,
		networkCount: snapshot.networkCount,
		connectedMemberCount: snapshot.connectedMemberCount,
		canonicalHash: snapshot.canonicalHash,
	};
}

async function waitForRemovedPortIds(primitiveIds: Array<string>): Promise<Array<string>> {
	let remaining = [...primitiveIds];
	for (const milliseconds of [100, 250, 500, 1000, 1500]) {
		await delay(milliseconds);
		const currentIds = new Set(await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT));
		remaining = primitiveIds.filter(id => currentIds.has(id));
		if (remaining.length === 0) {
			return [];
		}
	}
	return remaining;
}

function readStoredPhase3Plan(): StoredPhase3Plan | undefined {
	const stored = eda.sys_Storage.getExtensionUserConfig(PHASE3_PLAN_STORAGE_KEY) as StoredPhase3Plan | undefined;
	return stored && typeof stored === 'object' ? stored : undefined;
}

export async function runNetPortLifecycleProbe(): Promise<void> {
	await runProbe('阶段 4 前置端口闭环探针', async () => {
		const storedPlan = readStoredPhase3Plan();
		if (!storedPlan?.planReady || storedPlan.blockerCount !== 0 || !storedPlan.target) {
			throw new Error('没有可用的阶段 3 端口候选。请保持当前选择并先执行菜单 16，确认 planReady 为 true。');
		}
		const selected = await getSelectedPrimitives();
		const selectedIds = selected.map(safePrimitiveId).filter((id): id is string => Boolean(id));
		if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
			throw new Error('当前选择与菜单 16 冻结的选择不一致。请重新执行菜单 13 和菜单 16。');
		}
		const target = storedPlan.target;
		const confirmed = await confirmAction(
			`将在 ${target.member} 的 SDK 原始坐标临时创建 ${target.direction} 端口 ${target.net}，随后立即删除并比较网表。期间网络可能短暂变化，请只在已保存的测试副本中执行。`,
			'确认执行端口创建/删除闭环探针',
		);
		if (!confirmed) {
			return;
		}

		const beforeNetlist = await captureNetlistHash();
		const beforeConnectivity = await buildEnetConnectivitySnapshot();
		const beforePortIds = await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT);
		const observed = startObservedCall(
			eda.sch_PrimitiveComponent.createNetPort(
				target.direction,
				target.net,
				target.targetPoint.x,
				target.targetPoint.y,
				target.rotation,
				false,
			),
			'phase4Prerequisite.createNetPort',
		);
		const detectedIds = await waitForNewIds(
			() => eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
			beforePortIds,
		);
		const returned = observed.getReturned();
		const returnedId = returned ? safePrimitiveId(returned) : undefined;
		const beforeIdSet = new Set(beforePortIds);
		const createdIds = [...new Set([
			...detectedIds,
			...(returnedId && !beforeIdSet.has(returnedId) ? [returnedId] : []),
		])];

		if (createdIds.length === 1) {
			await updateProbeState({
				netPort: {
					primitiveId: createdIds[0],
					direction: target.direction,
					net: target.net,
					x: target.targetPoint.x,
					y: target.targetPoint.y,
					rotation: target.rotation,
					mirror: false,
					createdAt: now(),
				},
			});
		}
		const attachmentEvidence = createdIds.length === 1
			? await captureMemberNetworkEvidence(target.member, target.net, [0, 250, 1000, 3000, 5000])
			: [];
		const attachmentVerified = attachmentEvidence.at(-1)?.passed === true;
		let afterCreateSamples: Array<NetlistHashSample> = [];
		let afterCreateReadError: string | undefined;
		try {
			afterCreateSamples = await captureNetlistHashSamples([0, 250, 1000]);
		}
		catch (error) {
			afterCreateReadError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}

		let deleteReturned = false;
		let deleteError: string | undefined;
		try {
			deleteReturned = createdIds.length > 0
				? await eda.sch_PrimitiveComponent.delete(createdIds)
				: false;
		}
		catch (error) {
			deleteError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
		const remainingPortIds = createdIds.length > 0
			? await waitForRemovedPortIds(createdIds)
			: [];
		if (createdIds.length === 1 && remainingPortIds.length === 0) {
			await updateProbeState({ netPort: undefined });
		}
		let afterDeleteSamples: Array<NetlistHashSample> = [];
		let afterDeleteReadError: string | undefined;
		try {
			afterDeleteSamples = await captureNetlistHashSamples([0, 250, 1000, 3000]);
		}
		catch (error) {
			afterDeleteReadError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
		const finalNetlist = afterDeleteSamples.at(-1);
		const createUnique = createdIds.length === 1;
		const deleteVerified = createUnique && deleteReturned && !deleteError && remainingPortIds.length === 0;
		const rawNetlistRestored = Boolean(finalNetlist)
			&& finalNetlist?.length === beforeNetlist.length
			&& finalNetlist?.hash === beforeNetlist.hash;
		let afterConnectivity: EnetConnectivitySnapshot | undefined;
		let connectivityReadError: string | undefined;
		try {
			afterConnectivity = await buildEnetConnectivitySnapshot();
		}
		catch (error) {
			connectivityReadError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
		const connectivityRestored = Boolean(afterConnectivity)
			&& connectivityValue(beforeConnectivity) === connectivityValue(afterConnectivity as EnetConnectivitySnapshot);
		const netlistRestored = rawNetlistRestored || connectivityRestored;
		const passed = createUnique && attachmentVerified && deleteVerified && netlistRestored;

		await showPreview('阶段 4 前置：端口创建/删除闭环结果', [
			jsonPreviewTab('闭环摘要', {
				capturedAt: now(),
				target,
				createUnique,
				attachmentVerified,
				deleteVerified,
				rawNetlistRestored,
				connectivityRestored,
				netlistRestored,
				passed,
				executionEnabled: false,
				conclusion: passed
					? '单个网络端口已确认附着目标引脚、成功删除，且整图连接拓扑恢复。'
					: '端口附着或清理闭环未通过，不能开放任何导线转换。',
			}),
			jsonPreviewTab('创建与删除证据', {
				beforePortIds,
				detectedIds,
				returnedPrimitiveId: returnedId,
				createdIds,
				createApiSettled: observed.isSettled(),
				createApiError: observed.getError(),
				deleteReturned,
				deleteError,
				remainingPortIds,
			}),
			jsonPreviewTab('端口附着证据', attachmentEvidence),
			jsonPreviewTab('网表哈希', {
				before: beforeNetlist,
				afterCreate: afterCreateSamples,
				afterCreateReadError,
				afterDelete: afterDeleteSamples,
				afterDeleteReadError,
			}),
			jsonPreviewTab('连接拓扑证据', {
				before: connectivitySummary(beforeConnectivity),
				after: afterConnectivity ? connectivitySummary(afterConnectivity) : undefined,
				connectivityReadError,
				connectivityRestored,
			}),
		]);
	});
}
