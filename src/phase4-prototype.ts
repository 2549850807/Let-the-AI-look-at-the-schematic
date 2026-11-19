import type { PinNoConnectPlan, PortPlan, StoredPhase3Plan, WirePlan } from './phase3-preflight';
import type { WireSnapshot } from './probe-core';
import type { EnetConnectivitySnapshot } from './region-export';
import { compareRegions, IMPORT_TEXT_STORAGE_KEY, sameSet } from './phase2-preflight';
import { PHASE3_PLAN_STORAGE_KEY, runWireConflictPreflight } from './phase3-preflight';
import {
	cloneLine,
	confirmAction,
	createWireSnapshot,
	getSelectedPrimitives,
	hashText,
	jsonPreviewTab,
	now,
	readNetlist,
	runProbe,
	safePrimitiveId,
	showPreview,
	waitForNewIds,
} from './probe-core';
import {
	buildCurrentRegionSnapshot,
	buildEnetConnectivitySnapshot,
	readCurrentMemberNetworks,
	readStoredRegionSnapshot,
	REGION_SNAPSHOT_STORAGE_KEY,
} from './region-export';

interface NetlistHashSample {
	elapsedMs: number;
	length: number;
	hash: string;
	capturedAt: string;
}

interface PrototypeCandidate {
	net: string;
	portPlans: Array<PortPlan>;
	wirePlan?: WirePlan;
}

interface ComponentPose {
	primitiveId: string;
	designator: string;
	x: number;
	y: number;
	rotation: number;
	mirror: boolean;
}

interface Phase4RecoveryState {
	version: 1;
	active: true;
	capturedAt: string;
	network: string;
	selectedPrimitiveIds: Array<string>;
	beforeNetlist: NetlistHashSample;
	beforeConnectivity?: EnetConnectivitySnapshot;
	baselineWireIds?: Array<string>;
	baselinePortIds: Array<string>;
	plannedPorts: Array<PortPlan>;
	createdPortIds: Array<string>;
	createdStubWireIds?: Array<string>;
	stubLines?: Array<Array<number>>;
	wireSnapshot?: WireSnapshot;
	wireDeleted: boolean;
	currentWirePrimitiveId?: string;
}

interface BatchRecoveryEntry {
	networkIndex: number;
	status: 'prepared' | 'applied' | 'restored';
	state: Phase4RecoveryState;
}

interface Phase4BatchRecoveryState {
	version: 1;
	active: true;
	capturedAt: string;
	purpose?: 'temporary-probe' | 'persistent-conversion';
	completedAt?: string;
	selectedPrimitiveIds: Array<string>;
	beforeNetlist: NetlistHashSample;
	beforeConnectivity: EnetConnectivitySnapshot;
	convertedConnectivity?: EnetConnectivitySnapshot;
	entries: Array<BatchRecoveryEntry>;
	pinNoConnectChanges?: Array<PinNoConnectRecoveryEntry>;
}

interface PinNoConnectRecoveryEntry extends PinNoConnectPlan {
	pinPrimitiveId?: string;
	applied: boolean;
}

interface PinNoConnectChangeEvidence extends PinNoConnectRecoveryEntry {
	verified: boolean;
}

interface WireCloneProbeState {
	version: 1;
	active: true;
	capturedAt: string;
	beforeNetlist: NetlistHashSample;
	beforeNetlistLength: number;
	beforeNetlistHash: string;
	baselineWireIds: Array<string>;
	createdWireIds: Array<string>;
	plannedLine: Array<Array<number>>;
	probeNet: string;
	sourceWirePrimitiveId: string;
}

interface OriginalWireRestoreProbeState {
	version: 1;
	active: true;
	capturedAt: string;
	beforeNetlist: NetlistHashSample;
	beforeConnectivity?: EnetConnectivitySnapshot;
	baselineWireIds: Array<string>;
	createdWireIds: Array<string>;
	wireSnapshot: WireSnapshot;
	sourceWirePrimitiveId: string;
	plannedLine: Array<Array<number>>;
	targetMembers?: Array<string>;
	targetNetwork?: string;
	wireDeleted: boolean;
}

interface MemberNetworkEvidence {
	elapsedMs: number;
	networks: Record<string, string>;
	passed: boolean;
	capturedAt: string;
	error?: string;
}

interface ExpectedMemberNetworkEvidence {
	elapsedMs: number;
	networks: Record<string, string>;
	expectedNetworks: Record<string, string>;
	passed: boolean;
	capturedAt: string;
	error?: string;
}

interface StubPortProbePlan {
	target: PortPlan;
	stubPortPlan: PortPlan;
	stubLine: Array<number>;
	derivation: StubDerivationEvidence;
	orientation: StubPortOrientationEvidence;
}

interface StubDirectionCandidate {
	segmentIndex: number;
	direction: { x: number; y: number };
	availableDistance: number;
	nearestMemberDistance?: number;
	stubLine: Array<number>;
}

interface StubDerivationEvidence {
	mode: 'alternative-coordinate' | 'unique-wire-direction' | 'maximum-clearance-fallback' | 'pin-rotation-fallback';
	matchingSegmentIndexes: Array<number>;
	preferredDirectionKeys: Array<string>;
	directionCandidates: Array<StubDirectionCandidate>;
	selectedDirectionKey: string;
}

interface StubPortOrientationEvidence {
	stubStartPoint: { x: number; y: number };
	stubEndPoint: { x: number; y: number };
	stubDirection: { x: number; y: number };
	stubWireRotation: number;
	portRotation: number;
	portDirection: PortPlan['direction'];
	inputRotationOffset: number;
	mode: 'horizontal-aligned' | 'vertical-reversed' | 'input-reversed';
}

interface StubCreationEvidence {
	member: string;
	stubLine: Array<number>;
	primitiveId: string;
	readable: boolean;
}

interface NetPortNameVisibilityEvidence {
	attributeIds: Array<string>;
	matchedAttributeIds: Array<string>;
	modifiedAttributeIds: Array<string>;
	visibleAttributeIds: Array<string>;
	passed: boolean;
}

interface CreatedPortEvidence {
	member: string;
	primitiveId: string;
	nameVisibility: NetPortNameVisibilityEvidence;
}

interface IncrementalPortConnectivityEvidence {
	portIndex: number;
	member: string;
	primitiveId: string;
	verifiedMembers: Array<string>;
	passed: boolean;
	samples: Array<MemberNetworkEvidence>;
	portConnection?: Record<string, unknown>;
}

type WirePresenceStatus = 'present' | 'absent' | 'ambiguous';

interface WirePresenceEvidence {
	elapsedMs: number;
	primitiveIds: Array<string>;
	objectReadableIds: Array<string>;
	listedIds: Array<string>;
	status: WirePresenceStatus;
	capturedAt: string;
}

interface RollbackResult {
	trackedPortIds: Array<string>;
	deleteReturned: boolean;
	remainingPortIds: Array<string>;
	trackedStubWireIds: Array<string>;
	stubDeleteReturned: boolean;
	stubDeleteEvidence: Array<WirePresenceEvidence>;
	remainingStubWireIds: Array<string>;
	originalWireRestore?: OriginalWireRestoreResult;
	additiveOnly: boolean;
	recoveryStateCleared: boolean;
	passed: boolean;
}

interface BatchRollbackEntryEvidence {
	networkIndex: number;
	net: string;
	result?: RollbackResult;
	error?: string;
}

interface BatchRollbackResult {
	entries: Array<BatchRollbackEntryEvidence>;
	pinNoConnectChanges: Array<PinNoConnectChangeEvidence>;
	pinNoConnectRestored: boolean;
	pinNoConnectError?: string;
	finalConnectivity?: ConnectivityEvidenceSummary;
	expectedConnectivity: ConnectivityEvidenceSummary;
	connectivityRestored: boolean;
	connectivityError?: string;
	recoveryStateCleared: boolean;
	passed: boolean;
}

interface WireCloneCleanupResult {
	matchedWireIds: Array<string>;
	deleteTargetIds: Array<string>;
	deleteReturned: boolean;
	deleteError?: string;
	deleteEvidence: Array<WirePresenceEvidence>;
	remainingWireIds: Array<string>;
	finalNetlistSamples: Array<NetlistHashSample>;
	expectedNetlist: { length: number; hash: string };
	probeNetAbsent: boolean;
	netlistRestored: boolean;
	recoveryStateCleared: boolean;
	passed: boolean;
}

interface OriginalWireRestoreAttempt {
	segmentIndex: number;
	segment: Array<number>;
	netMode: 'snapshot' | 'automatic';
	returnedPrimitiveId?: string;
	detectedPrimitiveIds: Array<string>;
	coveredAfterAttempt: boolean;
	error?: string;
}

interface OriginalWireRestoreResult {
	matchedWireIdsBefore: Array<string>;
	coveredSegmentKeysBefore: Array<string>;
	missingSegmentKeysBefore: Array<string>;
	creationAttempts: Array<OriginalWireRestoreAttempt>;
	statePersistenceError?: string;
	matchedWireIdsAfter: Array<string>;
	coveredSegmentKeysAfter: Array<string>;
	missingSegmentKeysAfter: Array<string>;
	geometryRestored: boolean;
	finalNetlistSamples: Array<NetlistHashSample>;
	expectedNetlist: { length: number; hash: string };
	rawNetlistRestored: boolean;
	semanticEvidence: OriginalWireSemanticEvidence;
	connectivityRestored: boolean;
	netlistRestored: boolean;
	recoveryStateCleared: boolean;
	passed: boolean;
}

interface OriginalWireSemanticEvidence {
	mode: 'whole-enet-connectivity' | 'frozen-region-fallback';
	currentConnectivity: ConnectivityEvidenceSummary;
	expectedConnectivity?: ConnectivityEvidenceSummary;
	connectivityHashMatched?: boolean;
	frozenRegionCapturedAt?: string;
	currentRegionCapturedAt?: string;
	regionIssues?: Array<unknown>;
	networkChanges?: Array<Record<string, string>>;
	targetMembers?: Array<string>;
	targetSourceNetworks?: Record<string, string>;
	targetMemberGroup?: Array<string>;
	error?: string;
	passed: boolean;
}

interface ConnectivityEvidenceSummary {
	capturedAt: string;
	sourceVersion: string;
	networkCount: number;
	connectedMemberCount: number;
	canonicalHash: string;
}

export const PHASE4_RECOVERY_STORAGE_KEY = 'phase4PrototypeRecoveryV1';
const PHASE4_WIRE_CLONE_STORAGE_KEY = 'phase4WireCloneProbeV1';
const PHASE4_ORIGINAL_WIRE_RESTORE_STORAGE_KEY = 'phase4OriginalWireRestoreProbeV1';
const PHASE4_BATCH_RECOVERY_STORAGE_KEY = 'phase4BatchRecoveryV1';
const naturalCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

function delay(milliseconds: number): Promise<void> {
	return new Promise(resolve => globalThis.setTimeout(resolve, milliseconds));
}

function isSingleNetworkConversionPaused(): boolean {
	return true;
}

function probeWireNetNames(text: string): Array<string> {
	return [...new Set(text.match(/PROBE_WIRE_CLONE_\d+/g) ?? [])].sort((left, right) => naturalCollator.compare(left, right));
}

async function captureComponentPoses(selectedPrimitiveIds: Array<string>): Promise<Array<ComponentPose>> {
	const selectedIds = new Set(selectedPrimitiveIds);
	return (await eda.sch_PrimitiveComponent.getAll(ESCH_PrimitiveComponentType.COMPONENT))
		.filter(component => selectedIds.has(component.getState_PrimitiveId()))
		.map(component => ({
			primitiveId: component.getState_PrimitiveId(),
			designator: component.getState_Designator() ?? '',
			x: component.getState_X(),
			y: component.getState_Y(),
			rotation: component.getState_Rotation(),
			mirror: component.getState_Mirror(),
		}))
		.sort((left, right) => naturalCollator.compare(left.designator, right.designator));
}

async function selectedPinsByMember(selectedPrimitiveIds: Array<string>): Promise<Map<string, ISCH_PrimitiveComponentPin>> {
	const selectedIds = new Set(selectedPrimitiveIds);
	const pinsByMember = new Map<string, ISCH_PrimitiveComponentPin>();
	const components = (await eda.sch_PrimitiveComponent.getAll(ESCH_PrimitiveComponentType.COMPONENT))
		.filter(component => selectedIds.has(component.getState_PrimitiveId()));
	for (const component of components) {
		const designator = component.getState_Designator();
		if (!designator) {
			continue;
		}
		const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
		for (const pin of pins) {
			pinsByMember.set(`${designator}.${pin.getState_PinNumber()}`, pin);
		}
	}
	return pinsByMember;
}

async function applyPinNoConnectChanges(state: Phase4BatchRecoveryState): Promise<Array<PinNoConnectChangeEvidence>> {
	const pinsByMember = await selectedPinsByMember(state.selectedPrimitiveIds);
	const evidence: Array<PinNoConnectChangeEvidence> = [];
	for (const change of state.pinNoConnectChanges ?? []) {
		const pin = pinsByMember.get(change.member);
		if (!pin) {
			throw new Error(`无法找到需要修改非连接标识的引脚：${change.member}`);
		}
		const current = Boolean(pin.getState_NoConnected());
		if (current !== change.from) {
			throw new Error(`引脚 ${change.member} 的非连接标识状态已变化，已停止导入。`);
		}
		const modified = await eda.sch_PrimitivePin.modify(pin, { noConnected: change.to });
		const verified = modified ? Boolean(modified.getState_NoConnected()) === change.to : false;
		change.pinPrimitiveId = pin.getState_PrimitiveId();
		change.applied = verified;
		await writeBatchRecoveryState(state);
		evidence.push({ ...change, verified });
		if (!verified) {
			throw new Error(`引脚 ${change.member} 的非连接标识修改后未能通过校验。`);
		}
	}
	return evidence;
}

async function restorePinNoConnectChanges(state: Phase4BatchRecoveryState): Promise<Array<PinNoConnectChangeEvidence>> {
	const evidence: Array<PinNoConnectChangeEvidence> = [];
	for (const change of [...(state.pinNoConnectChanges ?? [])].reverse()) {
		if (!change.applied) {
			continue;
		}
		if (!change.pinPrimitiveId) {
			throw new Error(`引脚 ${change.member} 缺少恢复所需的图元 ID。`);
		}
		const pin = await eda.sch_PrimitivePin.get(change.pinPrimitiveId);
		if (!pin) {
			throw new Error(`无法读取需要恢复非连接标识的引脚：${change.member}`);
		}
		const modified = await eda.sch_PrimitivePin.modify(pin, { noConnected: change.from });
		const verified = modified ? Boolean(modified.getState_NoConnected()) === change.from : false;
		if (verified) {
			change.applied = false;
			await writeBatchRecoveryState(state);
		}
		evidence.push({ ...change, verified });
		if (!verified) {
			throw new Error(`引脚 ${change.member} 的非连接标识未能恢复。`);
		}
	}
	return evidence;
}

async function captureNetlistHash(elapsedMs = 0): Promise<NetlistHashSample> {
	const { text } = await readNetlist();
	return { elapsedMs, length: text.length, hash: hashText(text), capturedAt: now() };
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

async function captureCreatedPortConnection(primitiveId: string, plan: PortPlan): Promise<Record<string, unknown>> {
	try {
		const port = await eda.sch_PrimitiveComponent.get(primitiveId);
		const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(primitiveId) ?? [];
		return {
			primitiveId,
			expectedNet: plan.connectionNet ?? plan.net,
			expectedPoint: plan.targetPoint,
			actualNet: port?.getState_Net(),
			portOrigin: port ? { x: port.getState_X(), y: port.getState_Y() } : undefined,
			pins: pins.map(pin => ({
				primitiveId: safePrimitiveId(pin),
				x: pin.getState_X(),
				y: pin.getState_Y(),
				matchesExpectedPoint: Math.abs(pin.getState_X() - plan.targetPoint.x) <= 0.001
					&& Math.abs(pin.getState_Y() - plan.targetPoint.y) <= 0.001,
			})),
		};
	}
	catch (error) {
		return { primitiveId, error: error instanceof Error ? error.message : String(error) };
	}
}

async function captureMemberNetworkEvidence(
	members: Array<string>,
	targetNet: string,
	delays: Array<number> = [0, 100, 250, 500, 1000, 2000, 3000],
): Promise<Array<MemberNetworkEvidence>> {
	const evidence: Array<MemberNetworkEvidence> = [];
	let elapsed = 0;
	for (const milliseconds of delays) {
		await delay(milliseconds - elapsed);
		elapsed = milliseconds;
		try {
			const networks = await readCurrentMemberNetworks(members);
			const passed = members.every(member => networks[member] === targetNet);
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

async function captureExpectedMemberNetworkEvidence(
	expectedNetworks: Record<string, string>,
	delays: Array<number> = [0, 100, 250, 500, 1000, 2000, 3000],
): Promise<Array<ExpectedMemberNetworkEvidence>> {
	const members = Object.keys(expectedNetworks);
	const evidence: Array<ExpectedMemberNetworkEvidence> = [];
	let elapsed = 0;
	for (const milliseconds of delays) {
		await delay(milliseconds - elapsed);
		elapsed = milliseconds;
		try {
			const networks = await readCurrentMemberNetworks(members);
			const passed = members.every(member => networks[member] === expectedNetworks[member]);
			evidence.push({ elapsedMs: milliseconds, networks, expectedNetworks, passed, capturedAt: now() });
			if (passed) {
				break;
			}
		}
		catch (error) {
			evidence.push({
				elapsedMs: milliseconds,
				networks: {},
				expectedNetworks,
				passed: false,
				capturedAt: now(),
				error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
			});
		}
	}
	return evidence;
}

async function captureWirePresenceEvidence(
	primitiveIds: Array<string>,
	delays: Array<number>,
	stopWhen?: WirePresenceStatus,
): Promise<Array<WirePresenceEvidence>> {
	const uniqueIds = [...new Set(primitiveIds)];
	const evidence: Array<WirePresenceEvidence> = [];
	let elapsed = 0;
	for (const milliseconds of delays) {
		await delay(milliseconds - elapsed);
		elapsed = milliseconds;
		const allIds = new Set(await eda.sch_PrimitiveWire.getAllPrimitiveId());
		const objectReadableIds: Array<string> = [];
		for (const primitiveId of uniqueIds) {
			if (await eda.sch_PrimitiveWire.get(primitiveId)) {
				objectReadableIds.push(primitiveId);
			}
		}
		const listedIds = uniqueIds.filter(id => allIds.has(id));
		const confirmedPresentIds = objectReadableIds.filter(id => listedIds.includes(id));
		const status: WirePresenceStatus = confirmedPresentIds.length > 0
			? 'present'
			: objectReadableIds.length === 0 && listedIds.length === 0
				? 'absent'
				: 'ambiguous';
		evidence.push({
			elapsedMs: milliseconds,
			primitiveIds: uniqueIds,
			objectReadableIds,
			listedIds,
			status,
			capturedAt: now(),
		});
		if (status === stopWhen) {
			break;
		}
	}
	return evidence;
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

function readRecoveryState(): Phase4RecoveryState | undefined {
	const stored = eda.sys_Storage.getExtensionUserConfig(PHASE4_RECOVERY_STORAGE_KEY) as Phase4RecoveryState | undefined;
	return stored?.active === true && stored.version === 1 ? stored : undefined;
}

async function writeRecoveryState(state: Phase4RecoveryState): Promise<void> {
	const saved = await eda.sys_Storage.setExtensionUserConfig(PHASE4_RECOVERY_STORAGE_KEY, state);
	if (!saved) {
		throw new Error('无法保存转换恢复状态，已阻止执行。');
	}
}

async function clearRecoveryState(): Promise<boolean> {
	return await eda.sys_Storage.setExtensionUserConfig(PHASE4_RECOVERY_STORAGE_KEY, {
		active: false,
		clearedAt: now(),
	});
}

function readBatchRecoveryState(): Phase4BatchRecoveryState | undefined {
	const stored = eda.sys_Storage.getExtensionUserConfig(PHASE4_BATCH_RECOVERY_STORAGE_KEY) as Phase4BatchRecoveryState | undefined;
	return stored?.active === true && stored.version === 1 ? stored : undefined;
}

async function writeBatchRecoveryState(state: Phase4BatchRecoveryState): Promise<void> {
	const saved = await eda.sys_Storage.setExtensionUserConfig(PHASE4_BATCH_RECOVERY_STORAGE_KEY, state);
	if (!saved) {
		throw new Error('无法保存批量转换恢复状态，已阻止后续修改。');
	}
}

async function clearBatchRecoveryState(): Promise<boolean> {
	return await eda.sys_Storage.setExtensionUserConfig(PHASE4_BATCH_RECOVERY_STORAGE_KEY, {
		active: false,
		clearedAt: now(),
	});
}

function readWireCloneState(): WireCloneProbeState | undefined {
	const stored = eda.sys_Storage.getExtensionUserConfig(PHASE4_WIRE_CLONE_STORAGE_KEY) as WireCloneProbeState | undefined;
	return stored?.active === true && stored.version === 1 ? stored : undefined;
}

async function writeWireCloneState(state: WireCloneProbeState): Promise<void> {
	const saved = await eda.sys_Storage.setExtensionUserConfig(PHASE4_WIRE_CLONE_STORAGE_KEY, state);
	if (!saved) {
		throw new Error('无法持久化复杂导线克隆恢复状态，已阻止执行。');
	}
}

async function clearWireCloneState(): Promise<boolean> {
	return await eda.sys_Storage.setExtensionUserConfig(PHASE4_WIRE_CLONE_STORAGE_KEY, {
		active: false,
		clearedAt: now(),
	});
}

function readOriginalWireRestoreState(): OriginalWireRestoreProbeState | undefined {
	const stored = eda.sys_Storage.getExtensionUserConfig(PHASE4_ORIGINAL_WIRE_RESTORE_STORAGE_KEY) as OriginalWireRestoreProbeState | undefined;
	return stored?.active === true && stored.version === 1 ? stored : undefined;
}

async function writeOriginalWireRestoreState(state: OriginalWireRestoreProbeState): Promise<void> {
	const saved = await eda.sys_Storage.setExtensionUserConfig(PHASE4_ORIGINAL_WIRE_RESTORE_STORAGE_KEY, state);
	if (!saved) {
		throw new Error('无法持久化原导线逐段恢复状态，已阻止后续修改。');
	}
}

async function clearOriginalWireRestoreState(): Promise<boolean> {
	return await eda.sys_Storage.setExtensionUserConfig(PHASE4_ORIGINAL_WIRE_RESTORE_STORAGE_KEY, {
		active: false,
		clearedAt: now(),
	});
}

function collectPrototypeCandidates(
	storedPlan: StoredPhase3Plan,
	scopes: Array<PortPlan['scope']>,
): Array<PrototypeCandidate> {
	if (!Array.isArray(storedPlan.portPlans) || !Array.isArray(storedPlan.deletionPlan)) {
		throw new TypeError('安全转换计划版本过旧。请重新导出框选区域并粘贴结构 JSON。');
	}
	const plansByNet = new Map<string, Array<PortPlan>>();
	for (const plan of storedPlan.portPlans.filter(plan => scopes.includes(plan.scope))) {
		const plans = plansByNet.get(plan.net) ?? [];
		plans.push(plan);
		plansByNet.set(plan.net, plans);
	}
	const candidates: Array<PrototypeCandidate> = [];
	const deletionPlanById = new Map(storedPlan.deletionPlan.map(plan => [plan.primitiveId, plan]));
	for (const net of [...plansByNet.keys()].sort((left, right) => naturalCollator.compare(left, right))) {
		const portPlans = plansByNet.get(net) ?? [];
		const sourceWireIds = [...new Set(portPlans.flatMap(plan => plan.selectedWireIdsAtReportedPoint)
			.filter(wireId => deletionPlanById.has(wireId)))];
		if (sourceWireIds.length > 1) {
			continue;
		}
		const wirePlan = sourceWireIds[0] ? deletionPlanById.get(sourceWireIds[0]) : undefined;
		const endpointsAreUnique = portPlans.every(plan => (
			(plan.selectedWireIdsAtReportedPoint.length === 0
				|| Boolean(wirePlan && sameSet(plan.selectedWireIdsAtReportedPoint, [wirePlan.primitiveId])))
			&& plan.unselectedWireIdsAtReportedPoint.length === 0
		));
		if (endpointsAreUnique) {
			candidates.push({ net, portPlans, ...(wirePlan ? { wirePlan } : {}) });
		}
	}
	return candidates;
}

function candidateConnectionMode(
	storedPlan: StoredPhase3Plan,
	candidate: PrototypeCandidate,
): 'replace-source-wire' | 'add-to-existing-network-anchor' | 'create-new-named-network' {
	if (candidate.wirePlan) {
		return 'replace-source-wire';
	}
	return (storedPlan.networkAnchorNames ?? []).includes(candidate.net)
		? 'add-to-existing-network-anchor'
		: 'create-new-named-network';
}

function choosePrototypeCandidate(storedPlan: StoredPhase3Plan): PrototypeCandidate & { wirePlan: WirePlan } {
	const candidate = collectPrototypeCandidates(storedPlan, ['internal']).find(candidate => candidate.wirePlan);
	if (candidate) {
		return candidate as PrototypeCandidate & { wirePlan: WirePlan };
	}
	throw new Error('没有满足“一个内部网络、恰好一条导线、全部引脚端点唯一确认”的阶段 4 候选。');
}

function chooseAllPrototypeCandidates(storedPlan: StoredPhase3Plan): Array<PrototypeCandidate> {
	const candidates = collectPrototypeCandidates(storedPlan, ['internal', 'external']);
	const candidateWireIds = candidates.flatMap(candidate => candidate.wirePlan ? [candidate.wirePlan.primitiveId] : []);
	const candidateMembers = candidates.flatMap(candidate => candidate.portPlans.map(plan => plan.member));
	const plannedMembers = storedPlan.portPlans.map(plan => plan.member);
	if (!sameSet(candidateWireIds, storedPlan.deletionPlan.map(plan => plan.primitiveId))
		|| !sameSet(candidateMembers, plannedMembers)) {
		throw new Error('冻结计划中存在无法归入唯一网络短桩闭环的导线或端口，已阻止全候选网络测试。');
	}
	return candidates;
}

function resolveOriginalWireTargetNetwork(state: OriginalWireRestoreProbeState): string {
	if (state.targetNetwork) {
		return state.targetNetwork;
	}
	const storedPlan = readStoredPhase3Plan();
	if (storedPlan) {
		try {
			return choosePrototypeCandidate(storedPlan).net;
		}
		catch {
			return state.wireSnapshot.net;
		}
	}
	return state.wireSnapshot.net;
}

async function ensureNetPortNameVisible(primitiveId: string, net: string): Promise<NetPortNameVisibilityEvidence> {
	let attributes: Array<ISCH_PrimitiveAttribute> = [];
	for (const milliseconds of [0, 100, 250, 500, 1000]) {
		if (milliseconds > 0) {
			await delay(milliseconds);
		}
		attributes = await eda.sch_PrimitiveAttribute.getAll(primitiveId);
		if (attributes.length > 0) {
			break;
		}
	}
	const isNetworkNameAttribute = (attribute: ISCH_PrimitiveAttribute): boolean => {
		const normalizedKey = attribute.getState_Key().replaceAll(/\s+/g, '').toLowerCase();
		return attribute.getState_Value() === net
			|| ['net', 'network', '网络', '网络名称'].includes(normalizedKey);
	};
	const matchingAttributes = attributes.filter(isNetworkNameAttribute);
	if (matchingAttributes.length === 0) {
		const available = attributes.map(attribute => `${attribute.getState_Key()}=${attribute.getState_Value()}`).join('、');
		throw new Error(`网络端口 ${net} 未找到可显示的网络名属性。当前属性：${available || '(无)'}`);
	}
	const modifiedAttributeIds: Array<string> = [];
	for (const attribute of matchingAttributes) {
		const modified = await eda.sch_PrimitiveAttribute.modify(attribute, { valueVisible: true });
		if (modified) {
			modifiedAttributeIds.push(modified.getState_PrimitiveId());
		}
	}
	await delay(100);
	const refreshedAttributes = await eda.sch_PrimitiveAttribute.getAll(primitiveId);
	const refreshedMatchingAttributes = refreshedAttributes.filter(isNetworkNameAttribute);
	const visibleAttributeIds = refreshedMatchingAttributes
		.filter(attribute => attribute.getState_ValueVisible() === true)
		.map(attribute => attribute.getState_PrimitiveId());
	const passed = refreshedMatchingAttributes.length > 0
		&& visibleAttributeIds.length === refreshedMatchingAttributes.length;
	const evidence: NetPortNameVisibilityEvidence = {
		attributeIds: refreshedAttributes.map(attribute => attribute.getState_PrimitiveId()),
		matchedAttributeIds: refreshedMatchingAttributes.map(attribute => attribute.getState_PrimitiveId()),
		modifiedAttributeIds,
		visibleAttributeIds,
		passed,
	};
	if (!passed) {
		throw new Error(`网络端口 ${net} 的网络名属性未能设为可见。`);
	}
	return evidence;
}

async function createTrackedPort(plan: PortPlan, state: Phase4RecoveryState): Promise<{
	primitiveId: string;
	nameVisibility: NetPortNameVisibilityEvidence;
}> {
	const connectionNet = plan.connectionNet ?? plan.net;
	const beforeIds = await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT);
	const returned = await eda.sch_PrimitiveComponent.createNetPort(
		plan.direction,
		connectionNet,
		plan.targetPoint.x,
		plan.targetPoint.y,
		plan.rotation,
		false,
	);
	const returnedId = returned ? safePrimitiveId(returned) : undefined;
	const beforeIdSet = new Set(beforeIds);
	const detectedIds = await waitForNewIds(
		() => eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
		beforeIds,
	);
	const createdIds = [...new Set([
		...detectedIds,
		...(returnedId && !beforeIdSet.has(returnedId) ? [returnedId] : []),
	])];
	if (createdIds.length > 0) {
		state.createdPortIds.push(...createdIds.filter(id => !state.createdPortIds.includes(id)));
		await writeRecoveryState(state);
	}
	if (createdIds.length !== 1) {
		throw new Error(`端口 ${plan.member} 创建后检测到 ${createdIds.length} 个新图元，已停止后续修改。`);
	}
	const primitiveId = createdIds[0];
	const nameVisibility = await ensureNetPortNameVisible(primitiveId, connectionNet);
	return { primitiveId, nameVisibility };
}

async function findPrototypePortIds(state: Phase4RecoveryState): Promise<Array<string>> {
	const currentIds = await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT);
	const baselineIds = new Set(state.baselinePortIds);
	const matchedIds = new Set(state.createdPortIds.filter(id => currentIds.includes(id)));
	for (const primitiveId of currentIds.filter(id => !baselineIds.has(id))) {
		const component = await eda.sch_PrimitiveComponent.get(primitiveId);
		if (!component || component.getState_Net() !== state.network) {
			continue;
		}
		const matchesPlannedPoint = state.plannedPorts.some(plan => Math.abs(component.getState_X() - plan.targetPoint.x) <= 0.001
			&& Math.abs(component.getState_Y() - plan.targetPoint.y) <= 0.001);
		if (matchesPlannedPoint) {
			matchedIds.add(primitiveId);
		}
	}
	return [...matchedIds];
}

async function findPrototypeStubWireIds(state: Phase4RecoveryState): Promise<Array<string>> {
	if (!state.stubLines || state.stubLines.length === 0) {
		return [];
	}
	const currentIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
	const baselineIds = new Set(state.baselineWireIds ?? []);
	const candidateIds = new Set([
		...(state.createdStubWireIds ?? []),
		...currentIds.filter(id => !baselineIds.has(id)),
	]);
	const matchedIds: Array<string> = [];
	for (const primitiveId of candidateIds) {
		const wire = await eda.sch_PrimitiveWire.get(primitiveId);
		if (wire && lineMatchesCloneSegments(wire.getState_Line(), state.stubLines)) {
			matchedIds.push(primitiveId);
		}
	}
	return [...new Set(matchedIds)];
}

function splitFlatLineIntoSegments(line: WireSnapshot['line']): Array<Array<number>> | undefined {
	if (line.length === 0 || Array.isArray(line[0]) || line.length % 4 !== 0) {
		return undefined;
	}
	const values = line as Array<number>;
	const segments: Array<Array<number>> = [];
	for (let index = 0; index < values.length; index += 4) {
		const segment = values.slice(index, index + 4);
		const [startX, startY, endX, endY] = segment;
		if (![startX, startY, endX, endY].every(Number.isFinite)
			|| (startX === endX && startY === endY)
			|| (startX !== endX && startY !== endY)) {
			return undefined;
		}
		segments.push(segment);
	}
	return segments;
}

function deriveStubLine(
	target: PortPlan,
	plannedLine: Array<Array<number>>,
	sourceWirePrimitiveId: string,
	allTargetPoints: Array<{ x: number; y: number }>,
): { stubLine: Array<number>; derivation: StubDerivationEvidence } {
	const epsilon = 0.001;
	const normalizeCoordinate = (value: number): number => Math.round(value * 1_000_000) / 1_000_000;
	const pointOnSegment = (point: { x: number; y: number }, segment: Array<number>): boolean => {
		const [startX, startY, endX, endY] = segment;
		if (Math.abs(startX - endX) <= epsilon) {
			return Math.abs(point.x - startX) <= epsilon
				&& point.y >= Math.min(startY, endY) - epsilon
				&& point.y <= Math.max(startY, endY) + epsilon;
		}
		return Math.abs(point.y - startY) <= epsilon
			&& point.x >= Math.min(startX, endX) - epsilon
			&& point.x <= Math.max(startX, endX) + epsilon;
	};
	const matchingSegments = plannedLine
		.map((segment, segmentIndex) => ({ segment, segmentIndex }))
		.filter(({ segment }) => pointOnSegment(target.targetPoint, segment));
	if (matchingSegments.length === 0) {
		throw new Error(`目标点 (${String(target.targetPoint.x)}, ${String(target.targetPoint.y)}) 不在候选导线路径上。`);
	}
	const pinX = normalizeCoordinate(target.targetPoint.x);
	const pinY = normalizeCoordinate(target.targetPoint.y);
	const candidatesByDirection = new Map<string, StubDirectionCandidate>();
	for (const { segment, segmentIndex } of matchingSegments) {
		const [startX, startY, endX, endY] = segment;
		for (const endpoint of [{ x: startX, y: startY }, { x: endX, y: endY }]) {
			const deltaX = endpoint.x - pinX;
			const deltaY = endpoint.y - pinY;
			const availableDistance = Math.abs(deltaX) + Math.abs(deltaY);
			if (availableDistance <= epsilon) {
				continue;
			}
			const direction = {
				x: Math.abs(deltaX) <= epsilon ? 0 : Math.sign(deltaX),
				y: Math.abs(deltaY) <= epsilon ? 0 : Math.sign(deltaY),
			};
			const directionKey = `${String(direction.x)},${String(direction.y)}`;
			const nearestMemberDistance = allTargetPoints
				.filter(point => Math.abs(point.x - target.targetPoint.x) > epsilon || Math.abs(point.y - target.targetPoint.y) > epsilon)
				.map((point) => {
					const memberDeltaX = normalizeCoordinate(point.x) - pinX;
					const memberDeltaY = normalizeCoordinate(point.y) - pinY;
					const sameRay = direction.x === 0
						? Math.abs(memberDeltaX) <= epsilon && Math.sign(memberDeltaY) === direction.y
						: Math.abs(memberDeltaY) <= epsilon && Math.sign(memberDeltaX) === direction.x;
					return sameRay ? Math.abs(memberDeltaX) + Math.abs(memberDeltaY) : Number.POSITIVE_INFINITY;
				})
				.reduce((nearest, distance) => Math.min(nearest, distance), Number.POSITIVE_INFINITY);
			const stubLength = Math.min(5, availableDistance / 2);
			const candidate: StubDirectionCandidate = {
				segmentIndex,
				direction,
				availableDistance,
				...(Number.isFinite(nearestMemberDistance) ? { nearestMemberDistance } : {}),
				stubLine: [
					pinX,
					pinY,
					normalizeCoordinate(pinX + direction.x * stubLength),
					normalizeCoordinate(pinY + direction.y * stubLength),
				],
			};
			const existing = candidatesByDirection.get(directionKey);
			if (!existing || candidate.availableDistance > existing.availableDistance) {
				candidatesByDirection.set(directionKey, candidate);
			}
		}
	}
	const directionCandidates = [...candidatesByDirection.entries()];
	if (directionCandidates.length === 0) {
		throw new Error(`目标点 ${target.member} 周围没有可用的短桩方向。`);
	}
	const preferredDirectionKeys = [...new Set(target.alternativeCoordinateEvidence
		.filter(evidence => evidence.selectedWireIds.includes(sourceWirePrimitiveId))
		.map((evidence) => {
			const deltaX = evidence.point.x - target.targetPoint.x;
			const deltaY = evidence.point.y - target.targetPoint.y;
			return `${String(Math.abs(deltaX) <= epsilon ? 0 : Math.sign(deltaX))},${String(Math.abs(deltaY) <= epsilon ? 0 : Math.sign(deltaY))}`;
		})
		.filter(directionKey => candidatesByDirection.has(directionKey)))];
	let mode: StubDerivationEvidence['mode'];
	let selectedEntry: [string, StubDirectionCandidate];
	if (preferredDirectionKeys.length === 1) {
		mode = 'alternative-coordinate';
		selectedEntry = [preferredDirectionKeys[0], candidatesByDirection.get(preferredDirectionKeys[0])!];
	}
	else if (directionCandidates.length === 1) {
		mode = 'unique-wire-direction';
		selectedEntry = directionCandidates[0];
	}
	else {
		mode = 'maximum-clearance-fallback';
		selectedEntry = [...directionCandidates].sort(([leftKey, left], [rightKey, right]) => {
			const leftClearance = Math.min(left.availableDistance, left.nearestMemberDistance ?? Number.POSITIVE_INFINITY);
			const rightClearance = Math.min(right.availableDistance, right.nearestMemberDistance ?? Number.POSITIVE_INFINITY);
			return rightClearance - leftClearance || naturalCollator.compare(leftKey, rightKey);
		})[0];
	}
	return {
		stubLine: selectedEntry[1].stubLine,
		derivation: {
			mode,
			matchingSegmentIndexes: matchingSegments.map(item => item.segmentIndex),
			preferredDirectionKeys,
			directionCandidates: directionCandidates.map(([, candidate]) => candidate),
			selectedDirectionKey: selectedEntry[0],
		},
	};
}

function deriveFloatingStubLine(target: PortPlan): { stubLine: Array<number>; derivation: StubDerivationEvidence } {
	const directionByRotation: Record<number, { x: number; y: number }> = {
		0: { x: 1, y: 0 },
		90: { x: 0, y: 1 },
		180: { x: -1, y: 0 },
		270: { x: 0, y: -1 },
	};
	const rotation = ((target.rotation % 360) + 360) % 360;
	const direction = directionByRotation[rotation];
	if (!direction) {
		throw new Error(`悬空成员 ${target.member} 的引脚旋转角度 ${String(target.rotation)} 无法用于短桩规划。`);
	}
	const normalizeCoordinate = (value: number): number => Math.round(value * 1_000_000) / 1_000_000;
	const stubLine = [
		normalizeCoordinate(target.targetPoint.x),
		normalizeCoordinate(target.targetPoint.y),
		normalizeCoordinate(target.targetPoint.x + direction.x * 5),
		normalizeCoordinate(target.targetPoint.y + direction.y * 5),
	];
	return {
		stubLine,
		derivation: {
			mode: 'pin-rotation-fallback',
			matchingSegmentIndexes: [],
			preferredDirectionKeys: [`${String(direction.x)},${String(direction.y)}`],
			directionCandidates: [{
				segmentIndex: -1,
				direction,
				availableDistance: 5,
				stubLine,
			}],
			selectedDirectionKey: `${String(direction.x)},${String(direction.y)}`,
		},
	};
}

function deriveStubPortOrientation(stubLine: Array<number>, portDirection: PortPlan['direction']): StubPortOrientationEvidence {
	if (stubLine.length < 4) {
		throw new Error('短导线几何数据不完整，无法推导网络端口方向。');
	}
	const epsilon = 0.001;
	const [startX, startY, endX, endY] = stubLine;
	const direction = {
		x: Math.abs(endX - startX) <= epsilon ? 0 : Math.sign(endX - startX),
		y: Math.abs(endY - startY) <= epsilon ? 0 : Math.sign(endY - startY),
	};
	if ((direction.x === 0 && direction.y === 0) || (direction.x !== 0 && direction.y !== 0)) {
		throw new Error('短导线必须是非零的水平或垂直线段，无法推导网络端口方向。');
	}
	const rotationByDirection = new Map([
		['1,0', 0],
		['0,1', 90],
		['-1,0', 180],
		['0,-1', 270],
	]);
	const stubWireRotation = rotationByDirection.get(`${String(direction.x)},${String(direction.y)}`);
	if (stubWireRotation === undefined) {
		throw new Error('短导线方向不是受支持的正交方向，无法创建网络端口。');
	}
	const isVertical = direction.x === 0;
	const baseRotation = isVertical ? (stubWireRotation + 180) % 360 : stubWireRotation;
	const inputRotationOffset = portDirection === 'IN' ? 180 : 0;
	return {
		stubStartPoint: { x: startX, y: startY },
		stubEndPoint: { x: endX, y: endY },
		stubDirection: direction,
		stubWireRotation,
		portRotation: (baseRotation + inputRotationOffset) % 360,
		portDirection,
		inputRotationOffset,
		mode: portDirection === 'IN' ? 'input-reversed' : isVertical ? 'vertical-reversed' : 'horizontal-aligned',
	};
}

async function createTrackedStubWire(
	line: Array<number>,
	snapshot: WireSnapshot | undefined,
	state: Phase4RecoveryState,
): Promise<string> {
	const beforeIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
	const beforeIdSet = new Set(beforeIds);
	const created = await eda.sch_PrimitiveWire.create(
		cloneLine(line),
		undefined,
		snapshot?.color,
		snapshot?.lineWidth,
		snapshot?.lineType,
	);
	const returnedId = created ? safePrimitiveId(created) : undefined;
	let detectedIds = (await eda.sch_PrimitiveWire.getAllPrimitiveId()).filter(id => !beforeIdSet.has(id));
	if (!returnedId && detectedIds.length === 0) {
		detectedIds = await waitForNewIds(() => eda.sch_PrimitiveWire.getAllPrimitiveId(), beforeIds);
	}
	const createdIds = [...new Set([
		...detectedIds,
		...(returnedId && !beforeIdSet.has(returnedId) ? [returnedId] : []),
	])];
	state.createdStubWireIds = [...new Set([...(state.createdStubWireIds ?? []), ...createdIds])];
	await writeRecoveryState(state);
	if (createdIds.length !== 1) {
		throw new Error(`短导线桩创建后检测到 ${String(createdIds.length)} 个新图元。`);
	}
	return createdIds[0];
}

async function rollback(state: Phase4RecoveryState): Promise<RollbackResult> {
	const trackedPortIds = await findPrototypePortIds(state);
	const currentPortIds = new Set(await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT));
	const existingTrackedPortIds = trackedPortIds.filter(id => currentPortIds.has(id));
	const deleteReturned = existingTrackedPortIds.length === 0
		|| await eda.sch_PrimitiveComponent.delete(existingTrackedPortIds);
	const remainingPortIds = await waitForRemovedPortIds(existingTrackedPortIds);
	const trackedStubWireIds = await findPrototypeStubWireIds(state);
	const stubDeleteTargets = (await Promise.all(trackedStubWireIds.map(id => eda.sch_PrimitiveWire.get(id))))
		.filter((wire): wire is ISCH_PrimitiveWire => Boolean(wire));
	const stubDeleteReturned = trackedStubWireIds.length === 0
		|| await eda.sch_PrimitiveWire.delete(stubDeleteTargets.length > 0 ? stubDeleteTargets : trackedStubWireIds);
	const stubDeleteEvidence = await captureWirePresenceEvidence(
		trackedStubWireIds,
		[0, 100, 250, 500, 1000, 3000],
		'absent',
	);
	const remainingStubWireIds = await findPrototypeStubWireIds(state);
	let originalWireRestore: OriginalWireRestoreResult | undefined;
	if (state.wireSnapshot) {
		const plannedLine = splitFlatLineIntoSegments(state.wireSnapshot.line);
		if (!plannedLine) {
			throw new Error('恢复状态中的导线无法拆分为有效正交线段。');
		}
		let wireRestoreState = readOriginalWireRestoreState();
		if (!wireRestoreState || wireRestoreState.sourceWirePrimitiveId !== state.wireSnapshot.originalPrimitiveId) {
			wireRestoreState = {
				version: 1,
				active: true,
				capturedAt: now(),
				beforeNetlist: state.beforeNetlist,
				...(state.beforeConnectivity ? { beforeConnectivity: state.beforeConnectivity } : {}),
				baselineWireIds: state.baselineWireIds ?? await eda.sch_PrimitiveWire.getAllPrimitiveId(),
				createdWireIds: state.currentWirePrimitiveId && state.currentWirePrimitiveId !== state.wireSnapshot.originalPrimitiveId
					? [state.currentWirePrimitiveId]
					: [],
				wireSnapshot: state.wireSnapshot,
				sourceWirePrimitiveId: state.wireSnapshot.originalPrimitiveId,
				plannedLine,
				targetMembers: state.plannedPorts.map(plan => plan.member),
				targetNetwork: state.network,
				wireDeleted: state.wireDeleted,
			};
			await writeOriginalWireRestoreState(wireRestoreState);
		}
		originalWireRestore = await restoreOriginalWireIncrementally(wireRestoreState);
	}
	const rollbackPassed = deleteReturned
		&& remainingPortIds.length === 0
		&& stubDeleteReturned
		&& remainingStubWireIds.length === 0
		&& (originalWireRestore?.passed ?? true);
	const recoveryStateCleared = rollbackPassed ? await clearRecoveryState() : false;
	return {
		trackedPortIds,
		deleteReturned,
		remainingPortIds,
		trackedStubWireIds,
		stubDeleteReturned,
		stubDeleteEvidence,
		remainingStubWireIds,
		...(originalWireRestore ? { originalWireRestore } : {}),
		additiveOnly: !state.wireSnapshot,
		recoveryStateCleared,
		passed: rollbackPassed && recoveryStateCleared,
	};
}

async function rollbackBatch(state: Phase4BatchRecoveryState): Promise<BatchRollbackResult> {
	const entries: Array<BatchRollbackEntryEvidence> = [];
	for (const entry of [...state.entries].reverse()) {
		if (entry.status === 'restored') {
			continue;
		}
		try {
			await writeRecoveryState(entry.state);
			const result = await rollback(entry.state);
			entries.push({ networkIndex: entry.networkIndex, net: entry.state.network, result });
			if (!result.passed) {
				break;
			}
			entry.status = 'restored';
			await writeBatchRecoveryState(state);
		}
		catch (error) {
			entries.push({
				networkIndex: entry.networkIndex,
				net: entry.state.network,
				error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
			});
			break;
		}
	}
	let pinNoConnectChanges: Array<PinNoConnectChangeEvidence> = [];
	let pinNoConnectError: string | undefined;
	try {
		pinNoConnectChanges = await restorePinNoConnectChanges(state);
	}
	catch (error) {
		pinNoConnectError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
	}
	const pinNoConnectRestored = !pinNoConnectError
		&& (state.pinNoConnectChanges ?? []).every(change => !change.applied);
	let finalConnectivity: EnetConnectivitySnapshot | undefined;
	let connectivityError: string | undefined;
	try {
		finalConnectivity = await buildEnetConnectivitySnapshot();
	}
	catch (error) {
		connectivityError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
	}
	const connectivityRestored = finalConnectivity?.canonicalHash === state.beforeConnectivity.canonicalHash
		&& finalConnectivity.networkCount === state.beforeConnectivity.networkCount
		&& finalConnectivity.connectedMemberCount === state.beforeConnectivity.connectedMemberCount;
	const entriesRestored = state.entries.every(entry => entry.status === 'restored');
	const entryRollbacksPassed = entries.every(entry => entry.result?.passed === true && !entry.error);
	const canClear = entriesRestored
		&& entryRollbacksPassed
		&& pinNoConnectRestored
		&& connectivityRestored
		&& !connectivityError
		&& !readRecoveryState()
		&& !readOriginalWireRestoreState();
	const recoveryStateCleared = canClear ? await clearBatchRecoveryState() : false;
	return {
		entries,
		pinNoConnectChanges,
		pinNoConnectRestored,
		...(pinNoConnectError ? { pinNoConnectError } : {}),
		...(finalConnectivity ? { finalConnectivity: summarizeConnectivity(finalConnectivity) } : {}),
		expectedConnectivity: summarizeConnectivity(state.beforeConnectivity),
		connectivityRestored,
		...(connectivityError ? { connectivityError } : {}),
		recoveryStateCleared,
		passed: canClear && recoveryStateCleared,
	};
}

export async function runSingleNetworkPrototype(): Promise<void> {
	await runProbe('阶段 4 单网络转换自动回滚原型', async () => {
		if (isSingleNetworkConversionPaused()) {
			throw new Error('0.4.16 已暂停菜单 18：实测确认删线后创建单个网络端口会使当前图页 ENET 持续不可读取。');
		}
		if (readRecoveryState()) {
			throw new Error('检测到尚未清理的阶段 4 恢复状态。请先执行菜单 19。');
		}
		if (readOriginalWireRestoreState()) {
			throw new Error('检测到尚未完成的原导线逐段恢复状态。请先执行菜单 25。');
		}
		if (readWireCloneState()) {
			throw new Error('检测到尚未清理的复杂导线克隆状态。请先执行菜单 22。');
		}
		const { text: initialNetlistText } = await readNetlist();
		const existingProbeNets = probeWireNetNames(initialNetlistText);
		if (existingProbeNets.length > 0) {
			throw new Error(`当前 ENET 仍包含旧探针网络：${existingProbeNets.join('、')}。请先执行菜单 23。`);
		}
		const storedPlan = readStoredPhase3Plan();
		if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
			throw new Error('没有可用的阶段 3 冻结计划。请保持当前选择并先执行菜单 16。');
		}
		const selectedIds = (await getSelectedPrimitives())
			.map(safePrimitiveId)
			.filter((id): id is string => Boolean(id));
		if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
			throw new Error('当前选择与菜单 16 冻结的选择不一致。请重新执行菜单 13 和菜单 16。');
		}
		const candidate = choosePrototypeCandidate(storedPlan);
		const wire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
		if (!wire) {
			throw new Error(`候选导线已不存在：${candidate.wirePlan.primitiveId}。请重新执行菜单 16。`);
		}
		const confirmed = await confirmAction(
			`将先删除内部网络 ${candidate.net} 的导线 ${candidate.wirePlan.primitiveId}，确认删除后再临时创建 ${candidate.portPlans.length} 个 BI 端口并验证网络，随后无条件删除端口并恢复导线。最终不会保留转换结果。请仅在已保存的测试副本中执行。`,
			'确认执行删线后建端口/自动回滚闭环',
		);
		if (!confirmed) {
			return;
		}

		const beforeNetlist = await captureNetlistHash();
		const beforeConnectivity = await buildEnetConnectivitySnapshot();
		const baselineWireIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
		const componentPosesBefore = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
		const wireSnapshot = createWireSnapshot(wire);
		const plannedLine = splitFlatLineIntoSegments(wireSnapshot.line);
		if (!plannedLine) {
			throw new Error('候选导线无法拆分为有效正交线段，已阻止执行。');
		}
		const state: Phase4RecoveryState = {
			version: 1,
			active: true,
			capturedAt: now(),
			network: candidate.net,
			selectedPrimitiveIds: [...storedPlan.selectedPrimitiveIds],
			beforeNetlist,
			beforeConnectivity,
			baselineWireIds,
			baselinePortIds: await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
			plannedPorts: candidate.portPlans,
			createdPortIds: [],
			wireSnapshot,
			wireDeleted: false,
			currentWirePrimitiveId: candidate.wirePlan.primitiveId,
		};
		await writeRecoveryState(state);
		await writeOriginalWireRestoreState({
			version: 1,
			active: true,
			capturedAt: now(),
			beforeNetlist,
			beforeConnectivity,
			baselineWireIds,
			createdWireIds: [],
			wireSnapshot,
			sourceWirePrimitiveId: wireSnapshot.originalPrimitiveId,
			plannedLine,
			targetMembers: candidate.portPlans.map(plan => plan.member),
			targetNetwork: candidate.net,
			wireDeleted: false,
		});

		const createdPorts: Array<CreatedPortEvidence> = [];
		const incrementalPortEvidence: Array<Record<string, unknown>> = [];
		let wireDeleteEvidence: Array<WirePresenceEvidence> = [];
		let afterWireDeleteEvidence: Array<MemberNetworkEvidence> = [];
		let afterPortCreateEvidence: Array<MemberNetworkEvidence> = [];
		let wireDeleteReturned = false;
		let wireAbsentAfterDelete = false;
		let operationError: string | undefined;
		let rollbackResult: RollbackResult | undefined;
		let rollbackError: string | undefined;
		try {
			const members = candidate.portPlans.map(plan => plan.member);
			const freshWire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
			if (!freshWire) {
				throw new Error('无法重新读取候选导线对象，已阻止删除。');
			}
			wireDeleteReturned = await eda.sch_PrimitiveWire.delete(freshWire);
			wireDeleteEvidence = await captureWirePresenceEvidence(
				[candidate.wirePlan.primitiveId],
				[0, 100, 250, 500, 1000, 3000],
				'absent',
			);
			wireAbsentAfterDelete = wireDeleteEvidence.at(-1)?.status === 'absent';
			if (!wireDeleteReturned || !wireAbsentAfterDelete) {
				throw new Error(`候选导线删除未得到完整确认：返回 ${String(wireDeleteReturned)}，最终状态 ${wireDeleteEvidence.at(-1)?.status ?? 'unknown'}。`);
			}
			state.wireDeleted = true;
			await writeRecoveryState(state);
			const persistedWireRestoreState = readOriginalWireRestoreState();
			if (persistedWireRestoreState) {
				persistedWireRestoreState.wireDeleted = true;
				await writeOriginalWireRestoreState(persistedWireRestoreState);
			}
			afterWireDeleteEvidence = await captureMemberNetworkEvidence(members, candidate.net, [0]);
			for (const plan of candidate.portPlans) {
				const { primitiveId, nameVisibility } = await createTrackedPort(plan, state);
				createdPorts.push({ member: plan.member, primitiveId, nameVisibility });
				const memberEvidence = await captureMemberNetworkEvidence(
					[plan.member],
					candidate.net,
					[0, 250, 1000, 3000],
				);
				const memberVerified = memberEvidence.at(-1)?.passed === true;
				incrementalPortEvidence.push({
					portIndex: createdPorts.length - 1,
					member: plan.member,
					primitiveId,
					memberVerified,
					samples: memberEvidence,
				});
				if (!memberVerified) {
					throw new Error(`创建端口 ${plan.member} 后，ENET 未确认该引脚进入网络 ${candidate.net}。`);
				}
			}
			afterPortCreateEvidence = await captureMemberNetworkEvidence(members, candidate.net, [0, 250, 1000, 3000, 5000]);
			if (!afterPortCreateEvidence.at(-1)?.passed) {
				throw new Error('删线后创建全部端口，目标成员仍未稳定切换到目标网络。');
			}
		}
		catch (error) {
			operationError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
		finally {
			try {
				rollbackResult = await rollback(state);
			}
			catch (error) {
				rollbackError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
			}
		}

		const conversionPassed = !operationError
			&& wireDeleteReturned
			&& wireAbsentAfterDelete
			&& createdPorts.length === candidate.portPlans.length
			&& Boolean(afterPortCreateEvidence.at(-1)?.passed);
		const componentPosesAfter = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
		const componentPosesPreserved = JSON.stringify(componentPosesBefore) === JSON.stringify(componentPosesAfter);
		const passed = conversionPassed
			&& !rollbackError
			&& rollbackResult?.passed === true
			&& componentPosesPreserved;
		await showPreview('阶段 4：单网络转换/自动回滚结果', [
			jsonPreviewTab('闭环摘要', {
				capturedAt: now(),
				operationOrder: 'delete-wire-then-create-ports',
				targetNetwork: candidate.net,
				targetMembers: candidate.portPlans.map(plan => plan.member),
				targetWirePrimitiveId: candidate.wirePlan.primitiveId,
				plannedPortCount: candidate.portPlans.length,
				createdPortCount: createdPorts.length,
				wireDeleteReturned,
				wireAbsentAfterDelete,
				wireDeleteConfirmationStatus: wireDeleteEvidence.at(-1)?.status ?? 'unknown',
				networkVerifiedAfterPortCreation: Boolean(afterPortCreateEvidence.at(-1)?.passed),
				conversionPassed,
				automaticRollbackPassed: rollbackResult?.passed ?? false,
				componentPosesPreserved,
				passed,
				persistentConversionEnabled: false,
				operationError,
				rollbackError,
				conclusion: passed
					? '单个内部网络已完成“删除导线、创建全部端口、验证、自动回滚”，最终网表恢复。'
					: '闭环未完全通过，持久化转换仍保持禁用。若自动恢复未通过，请立即执行菜单 19。',
			}),
			jsonPreviewTab('候选与创建证据', { candidate, createdPorts }),
			jsonPreviewTab('导线删除证据', wireDeleteEvidence),
			jsonPreviewTab('删线后建端口前网络证据', afterWireDeleteEvidence),
			jsonPreviewTab('逐端口网表证据', incrementalPortEvidence),
			jsonPreviewTab('端口创建后网络证据', afterPortCreateEvidence),
			jsonPreviewTab('自动回滚证据', rollbackResult ?? { rollbackError }),
			jsonPreviewTab('器件姿态证据', {
				before: componentPosesBefore,
				after: componentPosesAfter,
				preserved: componentPosesPreserved,
			}),
		]);
	});
}

async function supersedeCompletedPersistentImportRecoveryForNewImport(clearRecoveryState = true): Promise<void> {
	const recoveryState = readBatchRecoveryState();
	if (!recoveryState) {
		return;
	}

	const state = recoveryState as unknown as {
		purpose?: string;
		completedAt?: unknown;
		convertedConnectivity?: {
			canonicalHash?: string;
			networkCount?: number;
			connectedMemberCount?: number;
		};
		entries?: Array<{ status?: string }>;
		pinNoConnectChanges?: Array<{ status?: string }>;
	};
	const isCompletedPersistentImport
		= state.purpose === 'persistent-conversion'
			&& Boolean(state.completedAt)
			&& Boolean(state.convertedConnectivity)
			&& Array.isArray(state.entries)
			&& state.entries.every(entry => entry.status === 'applied')
			&& (state.pinNoConnectChanges ?? []).every(change => change.status === 'applied');

	if (!isCompletedPersistentImport) {
		throw new Error(
			'检测到未完成的导入状态。请先执行“撤回上一次的导入”，或先处理上一次导入的异常。',
		);
	}

	const currentConnectivity = await buildEnetConnectivitySnapshot();
	const convertedConnectivity = state.convertedConnectivity!;
	const topologyUnchanged
		= currentConnectivity.canonicalHash === convertedConnectivity.canonicalHash
			&& currentConnectivity.networkCount === convertedConnectivity.networkCount
			&& currentConnectivity.connectedMemberCount === convertedConnectivity.connectedMemberCount;

	if (!topologyUnchanged) {
		throw new Error(
			'检测到上一次导入后的原理图连接关系已变化。为避免覆盖手工修改，请先执行“撤回上一次的导入”或处理该状态。',
		);
	}

	if (clearRecoveryState) {
		await clearBatchRecoveryState();
	}
}

function assertNoActivePhase4RecoveryState(): void {
	if (readBatchRecoveryState()) {
		throw new Error('检测到尚未撤回的导入状态。请先执行“撤回上一次的导入”。');
	}
	if (readRecoveryState()) {
		throw new Error('检测到尚未清理的导入恢复状态。请先执行“撤回上一次的导入”。');
	}
	if (readOriginalWireRestoreState()) {
		throw new Error('检测到尚未完成的原导线恢复状态。请先执行“撤回上一次的导入”。');
	}
	if (readWireCloneState()) {
		throw new Error('检测到尚未清理的导线恢复状态。请先执行“撤回上一次的导入”。');
	}
}

async function validateStubProbePrerequisites(): Promise<StoredPhase3Plan> {
	assertNoActivePhase4RecoveryState();
	const storedPlan = readStoredPhase3Plan();
	if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
		throw new Error('没有可用的安全转换计划。请重新导出框选区域并粘贴结构 JSON。');
	}
	const selectedIds = (await getSelectedPrimitives())
		.map(safePrimitiveId)
		.filter((id): id is string => Boolean(id));
	if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
		throw new Error('当前框选与安全转换计划不一致。请重新导出框选区域并粘贴结构 JSON。');
	}
	return storedPlan;
}

async function planCandidateStubGeometry(candidate: PrototypeCandidate) {
	let wireSnapshot: WireSnapshot | undefined;
	let plannedLine: Array<Array<number>> = [];
	if (candidate.wirePlan) {
		const sourceWire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
		if (!sourceWire) {
			throw new Error(`候选导线不存在：${candidate.wirePlan.primitiveId}。`);
		}
		wireSnapshot = createWireSnapshot(sourceWire);
		const sourceSegments = splitFlatLineIntoSegments(wireSnapshot.line);
		if (!sourceSegments) {
			throw new Error(`网络 ${candidate.net} 的候选导线无法拆分为有效正交线段。`);
		}
		plannedLine = sourceSegments;
	}
	const allTargetPoints = candidate.portPlans.map(plan => plan.targetPoint);
	const stubPlans: Array<StubPortProbePlan> = candidate.portPlans.map((target) => {
		const { stubLine, derivation } = candidate.wirePlan && target.selectedWireIdsAtReportedPoint.includes(candidate.wirePlan.primitiveId)
			? deriveStubLine(target, plannedLine, candidate.wirePlan.primitiveId, allTargetPoints)
			: deriveFloatingStubLine(target);
		const orientation = deriveStubPortOrientation(stubLine, target.direction);
		return {
			target,
			stubLine,
			derivation,
			orientation,
			stubPortPlan: {
				...target,
				targetPoint: { x: stubLine[2], y: stubLine[3] },
				rotation: orientation.portRotation,
			},
		};
	});
	return { wireSnapshot, plannedLine, stubPlans };
}

async function executeNetworkStubPortCandidate(
	storedPlan: StoredPhase3Plan,
	candidate: PrototypeCandidate,
) {
	const { wireSnapshot, plannedLine, stubPlans } = await planCandidateStubGeometry(candidate);
	const beforeNetlist = await captureNetlistHash();
	const beforeConnectivity = await buildEnetConnectivitySnapshot();
	const baselineWireIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
	const componentPosesBefore = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
	const state: Phase4RecoveryState = {
		version: 1,
		active: true,
		capturedAt: now(),
		network: candidate.net,
		selectedPrimitiveIds: [...storedPlan.selectedPrimitiveIds],
		beforeNetlist,
		beforeConnectivity,
		baselineWireIds,
		baselinePortIds: await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
		plannedPorts: stubPlans.map(plan => plan.stubPortPlan),
		createdPortIds: [],
		createdStubWireIds: [],
		stubLines: stubPlans.map(plan => plan.stubLine),
		wireDeleted: false,
	};
	if (wireSnapshot) {
		state.wireSnapshot = wireSnapshot;
		state.currentWirePrimitiveId = wireSnapshot.originalPrimitiveId;
	}
	await writeRecoveryState(state);
	if (wireSnapshot) {
		await writeOriginalWireRestoreState({
			version: 1,
			active: true,
			capturedAt: now(),
			beforeNetlist,
			beforeConnectivity,
			baselineWireIds,
			createdWireIds: [],
			wireSnapshot,
			sourceWirePrimitiveId: wireSnapshot.originalPrimitiveId,
			plannedLine,
			targetMembers: candidate.portPlans.map(plan => plan.member),
			targetNetwork: candidate.net,
			wireDeleted: false,
		});
	}

	let wireDeleteReturned = !wireSnapshot;
	let wireDeleteEvidence: Array<WirePresenceEvidence> = [];
	const createdStubs: Array<StubCreationEvidence> = [];
	const createdPorts: Array<CreatedPortEvidence> = [];
	const incrementalPortEvidence: Array<IncrementalPortConnectivityEvidence> = [];
	let allMemberEvidence: Array<MemberNetworkEvidence> = [];
	let operationError: string | undefined;
	let rollbackResult: RollbackResult | undefined;
	let rollbackError: string | undefined;
	try {
		if (wireSnapshot) {
			const freshSourceWire = await eda.sch_PrimitiveWire.get(wireSnapshot.originalPrimitiveId);
			if (!freshSourceWire) {
				throw new Error('删除前无法重新读取候选导线对象。');
			}
			wireDeleteReturned = await eda.sch_PrimitiveWire.delete(freshSourceWire);
			wireDeleteEvidence = await captureWirePresenceEvidence(
				[wireSnapshot.originalPrimitiveId],
				[0, 100, 250, 500, 1000, 3000],
				'absent',
			);
			if (!wireDeleteReturned || wireDeleteEvidence.at(-1)?.status !== 'absent') {
				throw new Error('候选导线删除未得到完整确认。');
			}
			state.wireDeleted = true;
			await writeRecoveryState(state);
			const wireRestoreState = readOriginalWireRestoreState();
			if (wireRestoreState) {
				wireRestoreState.wireDeleted = true;
				await writeOriginalWireRestoreState(wireRestoreState);
			}
		}
		for (const plan of stubPlans) {
			const primitiveId = await createTrackedStubWire(plan.stubLine, wireSnapshot, state);
			const readable = Boolean(await eda.sch_PrimitiveWire.get(primitiveId));
			createdStubs.push({ member: plan.target.member, stubLine: plan.stubLine, primitiveId, readable });
			if (!readable) {
				throw new Error(`成员 ${plan.target.member} 的短导线桩创建后无法按返回 ID 读取。`);
			}
		}
		for (const [portIndex, plan] of stubPlans.entries()) {
			const { primitiveId, nameVisibility } = await createTrackedPort(plan.stubPortPlan, state);
			createdPorts.push({ member: plan.target.member, primitiveId, nameVisibility });
			const verifiedMembers = stubPlans.slice(0, portIndex + 1).map(item => item.target.member);
			const samples = await captureMemberNetworkEvidence(verifiedMembers, candidate.net);
			const passed = samples.at(-1)?.passed === true;
			incrementalPortEvidence.push({
				portIndex,
				member: plan.target.member,
				primitiveId,
				verifiedMembers,
				passed,
				samples,
				...(!passed ? { portConnection: await captureCreatedPortConnection(primitiveId, plan.stubPortPlan) } : {}),
			});
			if (!passed) {
				throw new Error(`创建端口 ${plan.target.member} 后，ENET 未确认已创建端口的全部成员进入网络 ${candidate.net}。`);
			}
		}
		const allMembers = stubPlans.map(plan => plan.target.member);
		allMemberEvidence = await captureMemberNetworkEvidence(allMembers, candidate.net);
		if (!allMemberEvidence.at(-1)?.passed) {
			throw new Error(`全部短桩端口创建后，ENET 未确认 ${allMembers.length} 个成员统一进入网络 ${candidate.net}。`);
		}
	}
	catch (error) {
		operationError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
	}
	finally {
		try {
			rollbackResult = await rollback(state);
		}
		catch (error) {
			rollbackError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
	}

	const componentPosesAfter = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
	const componentPosesPreserved = JSON.stringify(componentPosesBefore) === JSON.stringify(componentPosesAfter);
	const allStubsReadable = createdStubs.length === stubPlans.length
		&& createdStubs.every(stub => stub.readable);
	const incrementalConnectivityVerified = incrementalPortEvidence.length === stubPlans.length
		&& incrementalPortEvidence.every(evidence => evidence.passed);
	const allMembersVerified = allMemberEvidence.at(-1)?.passed === true;
	const passed = !operationError
		&& !rollbackError
		&& wireDeleteReturned
		&& allStubsReadable
		&& createdPorts.length === stubPlans.length
		&& incrementalConnectivityVerified
		&& allMembersVerified
		&& rollbackResult?.passed === true
		&& componentPosesPreserved;
	return {
		candidate,
		wireSnapshot,
		plannedLine,
		stubPlans,
		createdStubs,
		createdPorts,
		wireDeleteReturned,
		wireDeleteEvidence,
		incrementalPortEvidence,
		allMemberEvidence,
		rollbackResult,
		componentPosesBefore,
		componentPosesAfter,
		allStubsReadable,
		incrementalConnectivityVerified,
		allMembersVerified,
		componentPosesPreserved,
		operationError,
		rollbackError,
		passed,
	};
}

export async function runNetworkStubPortProbe(): Promise<void> {
	await runProbe('单网络全成员短桩端口自动回滚闭环', async () => {
		const storedPlan = await validateStubProbePrerequisites();
		const candidate = choosePrototypeCandidate(storedPlan);
		const confirmed = await confirmAction(
			`将删除网络 ${candidate.net} 的导线 ${candidate.wirePlan.primitiveId}，为 ${candidate.portPlans.length} 个成员沿原路径各创建 5 单位以内短桩，并依次在桩端临时创建端口和核对网络；随后自动清理全部端口、短桩并恢复原导线。`,
			'确认执行单网络全成员短桩端口闭环',
		);
		if (!confirmed) {
			return;
		}
		const result = await executeNetworkStubPortCandidate(storedPlan, candidate);
		await showPreview('阶段 4：单网络全成员短桩端口闭环结果', [
			jsonPreviewTab('闭环摘要', {
				capturedAt: now(),
				targetMembers: result.stubPlans.map(plan => plan.target.member),
				targetNetwork: candidate.net,
				sourceWirePrimitiveId: candidate.wirePlan.primitiveId,
				plannedStubCount: result.stubPlans.length,
				createdStubCount: result.createdStubs.length,
				plannedPortCount: result.stubPlans.length,
				createdPortCount: result.createdPorts.length,
				wireDeleteReturned: result.wireDeleteReturned,
				allStubsReadable: result.allStubsReadable,
				incrementalConnectivityVerified: result.incrementalConnectivityVerified,
				allMembersVerified: result.allMembersVerified,
				automaticRollbackPassed: result.rollbackResult?.passed ?? false,
				componentPosesPreserved: result.componentPosesPreserved,
				passed: result.passed,
				persistentConversionEnabled: false,
				operationError: result.operationError,
				rollbackError: result.rollbackError,
				conclusion: result.passed
					? '单个内部网络的全部成员均已通过独立短导线桩连接同名端口，随后全部端口、短桩均清理且原导线完整恢复。'
					: '单网络全成员短桩端口闭环未完全通过。若自动回滚未通过，请立即执行菜单 19。',
			}),
			jsonPreviewTab('短桩路径与创建证据', {
				stubPlans: result.stubPlans,
				createdStubs: result.createdStubs,
				plannedLine: result.plannedLine,
			}),
			jsonPreviewTab('导线删除证据', result.wireDeleteEvidence),
			jsonPreviewTab('逐端口连接证据', result.incrementalPortEvidence),
			jsonPreviewTab('全成员连接证据', result.allMemberEvidence),
			jsonPreviewTab('自动回滚证据', result.rollbackResult ?? { rollbackError: result.rollbackError }),
			jsonPreviewTab('器件姿态证据', {
				before: result.componentPosesBefore,
				after: result.componentPosesAfter,
				preserved: result.componentPosesPreserved,
			}),
		]);
	});
}

export async function runAllNetworkSequentialStubPortProbe(): Promise<void> {
	await runProbe('全部候选网络逐网短桩端口自动回滚闭环', async () => {
		const storedPlan = await validateStubProbePrerequisites();
		const candidates = chooseAllPrototypeCandidates(storedPlan);
		const preflightStubGeometry = [];
		for (const candidate of candidates) {
			const geometry = await planCandidateStubGeometry(candidate);
			preflightStubGeometry.push({
				net: candidate.net,
				scope: candidate.portPlans[0]?.scope,
				sourceWirePrimitiveId: geometry.wireSnapshot?.originalPrimitiveId,
				connectionMode: candidateConnectionMode(storedPlan, candidate),
				plannedLine: geometry.plannedLine,
				stubPlans: geometry.stubPlans,
			});
		}
		const confirmed = await confirmAction(
			`将按顺序测试 ${candidates.length} 个候选网络、${storedPlan.deletionPlan.length} 条导线和 ${storedPlan.portPlans.length} 个端口。有源网络先删除并恢复原导线，无源网络直接建立命名网络；当前网络未完整回滚时不会继续下一个网络。`,
			'确认执行全部候选网络逐网闭环',
		);
		if (!confirmed) {
			return;
		}

		const beforeConnectivity = await buildEnetConnectivitySnapshot();
		const componentPosesBefore = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
		const networkResults: Array<Awaited<ReturnType<typeof executeNetworkStubPortCandidate>>> = [];
		let sequenceError: string | undefined;
		for (const candidate of candidates) {
			try {
				const result = await executeNetworkStubPortCandidate(storedPlan, candidate);
				networkResults.push(result);
				if (!result.passed) {
					sequenceError = `网络 ${candidate.net} 的闭环未通过，已停止后续网络。`;
					break;
				}
			}
			catch (error) {
				sequenceError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
				break;
			}
		}

		let afterConnectivity: EnetConnectivitySnapshot | undefined;
		let connectivityError: string | undefined;
		try {
			afterConnectivity = await buildEnetConnectivitySnapshot();
		}
		catch (error) {
			connectivityError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
		const componentPosesAfter = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
		const componentPosesPreserved = JSON.stringify(componentPosesBefore) === JSON.stringify(componentPosesAfter);
		const connectivityRestored = afterConnectivity?.canonicalHash === beforeConnectivity.canonicalHash
			&& afterConnectivity.networkCount === beforeConnectivity.networkCount
			&& afterConnectivity.connectedMemberCount === beforeConnectivity.connectedMemberCount;
		const allCandidatesProcessed = networkResults.length === candidates.length;
		const recoveryStateCleared = !readRecoveryState() && !readOriginalWireRestoreState();
		const passed = !sequenceError
			&& !connectivityError
			&& allCandidatesProcessed
			&& networkResults.every(result => result.passed)
			&& connectivityRestored
			&& componentPosesPreserved
			&& recoveryStateCleared;
		await showPreview('阶段 4：全部候选网络逐网短桩端口闭环结果', [
			jsonPreviewTab('闭环摘要', {
				capturedAt: now(),
				plannedNetworkCount: candidates.length,
				processedNetworkCount: networkResults.length,
				plannedWireCount: storedPlan.deletionPlan.length,
				plannedPortCount: storedPlan.portPlans.length,
				allCandidatesProcessed,
				allNetworkLoopsPassed: networkResults.every(result => result.passed),
				connectivityRestored,
				componentPosesPreserved,
				recoveryStateCleared,
				passed,
				persistentConversionEnabled: false,
				sequenceError,
				connectivityError,
				conclusion: passed
					? '全部候选网络均已逐网完成短桩端口连接验证和独立自动回滚，整图连接拓扑恢复。'
					: '全部候选网络逐网闭环未完全通过。若恢复状态未清除，请立即执行菜单 19，再执行菜单 25。',
			}),
			jsonPreviewTab('候选网络顺序', candidates.map((candidate, networkIndex) => ({
				networkIndex,
				net: candidate.net,
				scope: candidate.portPlans[0]?.scope,
				direction: candidate.portPlans[0]?.direction,
				sourceWirePrimitiveId: candidate.wirePlan?.primitiveId,
				members: candidate.portPlans.map(plan => plan.member),
			}))),
			jsonPreviewTab('预执行短桩规划', preflightStubGeometry),
			jsonPreviewTab('逐网络摘要', networkResults.map((result, networkIndex) => ({
				networkIndex,
				net: result.candidate.net,
				scope: result.candidate.portPlans[0]?.scope,
				memberCount: result.stubPlans.length,
				createdStubCount: result.createdStubs.length,
				createdPortCount: result.createdPorts.length,
				wireDeleteReturned: result.wireDeleteReturned,
				incrementalConnectivityVerified: result.incrementalConnectivityVerified,
				allMembersVerified: result.allMembersVerified,
				automaticRollbackPassed: result.rollbackResult?.passed ?? false,
				componentPosesPreserved: result.componentPosesPreserved,
				passed: result.passed,
				operationError: result.operationError,
				rollbackError: result.rollbackError,
			}))),
			jsonPreviewTab('短桩与端口证据', networkResults.map((result, networkIndex) => ({
				networkIndex,
				net: result.candidate.net,
				plannedLine: result.plannedLine,
				stubPlans: result.stubPlans,
				createdStubs: result.createdStubs,
				createdPorts: result.createdPorts,
				wireDeleteEvidence: result.wireDeleteEvidence,
				incrementalPortEvidence: result.incrementalPortEvidence,
				allMemberEvidence: result.allMemberEvidence,
			}))),
			jsonPreviewTab('逐网络自动回滚证据', networkResults.map((result, networkIndex) => ({
				networkIndex,
				net: result.candidate.net,
				rollbackResult: result.rollbackResult,
				rollbackError: result.rollbackError,
			}))),
			jsonPreviewTab('最终拓扑证据', {
				before: summarizeConnectivity(beforeConnectivity),
				after: afterConnectivity ? summarizeConnectivity(afterConnectivity) : undefined,
				connectivityRestored,
				connectivityError,
			}),
			jsonPreviewTab('器件姿态证据', {
				before: componentPosesBefore,
				after: componentPosesAfter,
				preserved: componentPosesPreserved,
			}),
		]);
	});
}

interface FullRegionProbeOptions {
	oneClickContext?: Record<string, unknown>;
	previewTitle?: string;
	retainConversion?: boolean;
}

export async function runFullRegionStubPortRollbackProbe(options: FullRegionProbeOptions = {}): Promise<void> {
	const retainConversion = options.retainConversion === true;
	await runProbe(retainConversion ? '完整区域短桩端口正式转换' : '完整区域短桩端口转换统一回滚闭环', async () => {
		const storedPlan = await validateStubProbePrerequisites();
		const candidates = chooseAllPrototypeCandidates(storedPlan);
		const plannedCandidates = [];
		for (const candidate of candidates) {
			plannedCandidates.push({ candidate, ...await planCandidateStubGeometry(candidate) });
		}
		const bootstrapNetworkCount = candidates.filter(candidate => candidateConnectionMode(storedPlan, candidate) === 'create-new-named-network').length;
		const pinNoConnectPlanCount = storedPlan.pinNoConnectPlans?.length ?? 0;
		const confirmed = await confirmAction(retainConversion
			? `将正式转换 ${candidates.length} 个网络：删除 ${storedPlan.deletionPlan.length} 条原导线，为 ${storedPlan.portPlans.length} 个目标引脚创建短桩端口，并修改 ${pinNoConnectPlanCount} 个引脚的非连接标识，其中 ${String(bootstrapNetworkCount)} 个网络将由首个真实悬空引脚建立。验证成功后保留转换结果，并保存可撤销状态。`
			: `将同时转换 ${candidates.length} 个网络：依次处理 ${storedPlan.deletionPlan.length} 条原导线和 ${storedPlan.portPlans.length} 个目标引脚，全部成员验证后按相反顺序统一自动恢复。最终不会保留转换结果。`, retainConversion ? '确认执行正式转换' : '确认执行完整区域转换/统一回滚闭环');
		if (!confirmed) {
			return;
		}

		const beforeNetlist = await captureNetlistHash();
		const beforeConnectivity = await buildEnetConnectivitySnapshot();
		const componentPosesBefore = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
		const batchState: Phase4BatchRecoveryState = {
			version: 1,
			active: true,
			capturedAt: now(),
			purpose: retainConversion ? 'persistent-conversion' : 'temporary-probe',
			selectedPrimitiveIds: [...storedPlan.selectedPrimitiveIds],
			beforeNetlist,
			beforeConnectivity,
			entries: [],
			pinNoConnectChanges: (storedPlan.pinNoConnectPlans ?? []).map(change => ({
				...change,
				applied: false,
			})),
		};
		await writeBatchRecoveryState(batchState);
		const networkEvidence: Array<Record<string, unknown>> = [];
		let finalMemberEvidence: Array<ExpectedMemberNetworkEvidence> = [];
		let convertedConnectivity: EnetConnectivitySnapshot | undefined;
		let sequenceError: string | undefined;
		let batchRollbackResult: BatchRollbackResult | undefined;
		let batchRollbackError: string | undefined;
		let recoveryStateRetained = false;
		try {
			await applyPinNoConnectChanges(batchState);
			for (const [networkIndex, planned] of plannedCandidates.entries()) {
				const { candidate, wireSnapshot, plannedLine, stubPlans } = planned;
				const state: Phase4RecoveryState = {
					version: 1,
					active: true,
					capturedAt: now(),
					network: candidate.net,
					selectedPrimitiveIds: [...storedPlan.selectedPrimitiveIds],
					beforeNetlist: await captureNetlistHash(),
					beforeConnectivity: await buildEnetConnectivitySnapshot(),
					baselineWireIds: await eda.sch_PrimitiveWire.getAllPrimitiveId(),
					baselinePortIds: await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
					plannedPorts: stubPlans.map(plan => plan.stubPortPlan),
					createdPortIds: [],
					createdStubWireIds: [],
					stubLines: stubPlans.map(plan => plan.stubLine),
					wireDeleted: false,
				};
				if (wireSnapshot) {
					state.wireSnapshot = wireSnapshot;
					state.currentWirePrimitiveId = wireSnapshot.originalPrimitiveId;
				}
				const batchEntry: BatchRecoveryEntry = { networkIndex, status: 'prepared', state };
				batchState.entries.push(batchEntry);
				await writeBatchRecoveryState(batchState);
				await writeRecoveryState(state);
				if (wireSnapshot) {
					await writeOriginalWireRestoreState({
						version: 1,
						active: true,
						capturedAt: now(),
						beforeNetlist: state.beforeNetlist,
						beforeConnectivity: state.beforeConnectivity,
						baselineWireIds: state.baselineWireIds ?? [],
						createdWireIds: [],
						wireSnapshot,
						sourceWirePrimitiveId: wireSnapshot.originalPrimitiveId,
						plannedLine,
						targetMembers: candidate.portPlans.map(plan => plan.member),
						targetNetwork: candidate.net,
						wireDeleted: false,
					});
				}

				let wireDeleteReturned = !wireSnapshot;
				let wireDeleteEvidence: Array<WirePresenceEvidence> = [];
				const createdStubs: Array<StubCreationEvidence> = [];
				const createdPorts: Array<CreatedPortEvidence> = [];
				const incrementalPortEvidence: Array<IncrementalPortConnectivityEvidence> = [];
				let allMemberEvidence: Array<MemberNetworkEvidence> = [];
				let operationError: string | undefined;
				try {
					if (wireSnapshot) {
						const freshSourceWire = await eda.sch_PrimitiveWire.get(wireSnapshot.originalPrimitiveId);
						if (!freshSourceWire) {
							throw new Error('删除前无法重新读取候选导线对象。');
						}
						wireDeleteReturned = await eda.sch_PrimitiveWire.delete(freshSourceWire);
						wireDeleteEvidence = await captureWirePresenceEvidence(
							[wireSnapshot.originalPrimitiveId],
							[0, 100, 250, 500, 1000, 3000],
							'absent',
						);
						if (!wireDeleteReturned || wireDeleteEvidence.at(-1)?.status !== 'absent') {
							throw new Error('候选导线删除未得到完整确认。');
						}
						state.wireDeleted = true;
						await writeRecoveryState(state);
						const wireRestoreState = readOriginalWireRestoreState();
						if (wireRestoreState) {
							wireRestoreState.wireDeleted = true;
							await writeOriginalWireRestoreState(wireRestoreState);
						}
						await writeBatchRecoveryState(batchState);
					}
					for (const plan of stubPlans) {
						const primitiveId = await createTrackedStubWire(plan.stubLine, wireSnapshot, state);
						const readable = Boolean(await eda.sch_PrimitiveWire.get(primitiveId));
						createdStubs.push({ member: plan.target.member, stubLine: plan.stubLine, primitiveId, readable });
						await writeBatchRecoveryState(batchState);
						if (!readable) {
							throw new Error(`成员 ${plan.target.member} 的短导线桩创建后无法按返回 ID 读取。`);
						}
					}
					for (const [portIndex, plan] of stubPlans.entries()) {
						const { primitiveId, nameVisibility } = await createTrackedPort(plan.stubPortPlan, state);
						createdPorts.push({ member: plan.target.member, primitiveId, nameVisibility });
						await writeBatchRecoveryState(batchState);
						const verifiedMembers = stubPlans.slice(0, portIndex + 1).map(item => item.target.member);
						const samples = await captureMemberNetworkEvidence(verifiedMembers, candidate.net);
						const passed = samples.at(-1)?.passed === true;
						incrementalPortEvidence.push({
							portIndex,
							member: plan.target.member,
							primitiveId,
							verifiedMembers,
							passed,
							samples,
							...(!passed ? { portConnection: await captureCreatedPortConnection(primitiveId, plan.stubPortPlan) } : {}),
						});
						if (!passed) {
							throw new Error(`创建端口 ${plan.target.member} 后，ENET 未确认已创建端口的全部成员进入网络 ${candidate.net}。`);
						}
					}
					allMemberEvidence = await captureMemberNetworkEvidence(
						stubPlans.map(plan => plan.target.member),
						candidate.net,
					);
					if (!allMemberEvidence.at(-1)?.passed) {
						throw new Error(`网络 ${candidate.net} 的全部成员连接验证失败。`);
					}
					batchEntry.status = 'applied';
					await writeBatchRecoveryState(batchState);
				}
				catch (error) {
					operationError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
				}
				networkEvidence.push({
					networkIndex,
					net: candidate.net,
					scope: candidate.portPlans[0]?.scope,
					plannedLine,
					stubPlans,
					createdStubs,
					createdPorts,
					wireDeleteReturned,
					wireDeleteEvidence,
					additiveOnly: !wireSnapshot,
					connectionMode: candidateConnectionMode(storedPlan, candidate),
					incrementalPortEvidence,
					allMemberEvidence,
					operationError,
					passed: !operationError && batchEntry.status === 'applied',
				});
				if (operationError) {
					sequenceError = `网络 ${candidate.net} 转换失败：${operationError}`;
					break;
				}
			}
			if (!sequenceError && batchState.entries.length === candidates.length
				&& batchState.entries.every(entry => entry.status === 'applied')) {
				const expectedNetworks = Object.fromEntries(storedPlan.portPlans.map(plan => [plan.member, plan.net]));
				finalMemberEvidence = Object.keys(expectedNetworks).length > 0
					? await captureExpectedMemberNetworkEvidence(expectedNetworks)
					: [{ elapsedMs: 0, networks: {}, expectedNetworks: {}, passed: true, capturedAt: now() }];
				const pinNoConnectApplied = (batchState.pinNoConnectChanges ?? []).every(change => change.applied);
				if (!finalMemberEvidence.at(-1)?.passed || !pinNoConnectApplied) {
					sequenceError = '完整区域端口创建后，全部计划成员未同时进入目标网络。';
				}
				else {
					convertedConnectivity = await buildEnetConnectivitySnapshot();
					const convertedComponentPoses = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
					if (JSON.stringify(componentPosesBefore) !== JSON.stringify(convertedComponentPoses)) {
						sequenceError = '正式转换验证期间检测到器件位置、旋转或镜像发生变化。';
					}
					else if (retainConversion) {
						batchState.completedAt = now();
						batchState.convertedConnectivity = convertedConnectivity;
						await writeBatchRecoveryState(batchState);
					}
				}
			}
		}
		catch (error) {
			sequenceError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
		finally {
			if (retainConversion && !sequenceError) {
				const persistedBatchState = readBatchRecoveryState();
				recoveryStateRetained = persistedBatchState?.capturedAt === batchState.capturedAt
					&& persistedBatchState.purpose === 'persistent-conversion'
					&& persistedBatchState.convertedConnectivity?.canonicalHash === convertedConnectivity?.canonicalHash
					&& persistedBatchState.entries.length === candidates.length
					&& persistedBatchState.entries.every(entry => entry.status === 'applied')
					&& (persistedBatchState.pinNoConnectChanges ?? []).every(change => change.applied)
					&& (candidates.length === 0 || Boolean(readRecoveryState()))
					&& (storedPlan.deletionPlan.length === 0 || Boolean(readOriginalWireRestoreState()));
				if (!recoveryStateRetained) {
					sequenceError = '正式转换完成后未能确认完整恢复状态已持久化，已转入自动回滚。';
				}
			}
			if (!retainConversion || sequenceError) {
				try {
					batchRollbackResult = await rollbackBatch(batchState);
				}
				catch (error) {
					batchRollbackError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
				}
			}
		}

		const componentPosesAfter = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
		const componentPosesPreserved = JSON.stringify(componentPosesBefore) === JSON.stringify(componentPosesAfter);
		const conversionPassed = !sequenceError
			&& batchState.entries.length === candidates.length
			&& networkEvidence.length === candidates.length
			&& networkEvidence.every(evidence => evidence.passed === true)
			&& (batchState.pinNoConnectChanges ?? []).every(change => change.applied)
			&& finalMemberEvidence.at(-1)?.passed === true;
		const passed = conversionPassed
			&& componentPosesPreserved
			&& (retainConversion
				? recoveryStateRetained
				: !batchRollbackError && batchRollbackResult?.passed === true);
		const previewTitle = options.previewTitle ?? (retainConversion
			? (options.oneClickContext ? '原理图结构文本桥：一键转换结果' : '原理图结构文本桥：正式转换结果')
			: (options.oneClickContext ? '原理图结构文本桥：完整自检结果' : '原理图结构文本桥：转换回滚自检结果'));
		await showPreview(previewTitle, [
			...(options.oneClickContext ? [jsonPreviewTab('一键预检摘要', options.oneClickContext)] : []),
			jsonPreviewTab('闭环摘要', {
				capturedAt: now(),
				plannedNetworkCount: candidates.length,
				appliedNetworkCount: networkEvidence.filter(evidence => evidence.passed === true).length,
				plannedWireCount: storedPlan.deletionPlan.length,
				plannedPortCount: storedPlan.portPlans.length,
				plannedNoConnectChangeCount: pinNoConnectPlanCount,
				conversionPassed,
				conversionRetained: retainConversion && passed,
				automaticRollbackPerformed: Boolean(batchRollbackResult),
				automaticRollbackPassed: batchRollbackResult?.passed,
				componentPosesPreserved,
				recoveryStateRetained,
				recoveryStateCleared: batchRollbackResult?.recoveryStateCleared,
				passed,
				persistentConversionEnabled: retainConversion,
				sequenceError,
				batchRollbackError,
				conclusion: passed
					? (retainConversion
							? '正式转换已完成并保留；恢复快照已保存，可通过正式撤销菜单恢复原导线。'
							: '完整区域的全部候选网络已同时完成短桩端口转换验证，随后按逆序统一恢复原导线和整图连接拓扑。')
					: (batchRollbackResult?.passed
							? '转换未通过，已自动恢复原导线和整图连接拓扑。'
							: '转换及自动恢复未完全通过。请保留结果并立即执行“撤回上一次的导入”。'),
			}),
			jsonPreviewTab('预执行完整规划', plannedCandidates.map((planned, networkIndex) => ({
				networkIndex,
				net: planned.candidate.net,
				scope: planned.candidate.portPlans[0]?.scope,
				sourceWirePrimitiveId: planned.wireSnapshot?.originalPrimitiveId,
				connectionMode: candidateConnectionMode(storedPlan, planned.candidate),
				plannedLine: planned.plannedLine,
				stubPlans: planned.stubPlans,
			}))),
			jsonPreviewTab('逐网络转换证据', networkEvidence),
			jsonPreviewTab('完整区域成员证据', finalMemberEvidence),
			jsonPreviewTab('非连接标识变化', batchState.pinNoConnectChanges ?? []),
			jsonPreviewTab('转换态拓扑证据', convertedConnectivity ? summarizeConnectivity(convertedConnectivity) : {}),
			jsonPreviewTab(retainConversion && passed ? '正式恢复状态' : '统一自动回滚证据', retainConversion && passed
				? {
						capturedAt: batchState.capturedAt,
						purpose: batchState.purpose,
						networkCount: batchState.entries.length,
						appliedNetworkCount: batchState.entries.filter(entry => entry.status === 'applied').length,
						recoveryStateRetained,
					}
				: (batchRollbackResult ?? { batchRollbackError })),
			jsonPreviewTab('器件姿态证据', {
				before: componentPosesBefore,
				after: componentPosesAfter,
				preserved: componentPosesPreserved,
			}),
		]);
	});
}

export async function runPersistentFullRegionConversion(): Promise<void> {
	await runProbe('自动预检并正式转换已粘贴文本', async () => {
		await supersedeCompletedPersistentImportRecoveryForNewImport(false);
		await runWireConflictPreflight({ showPreview: false });
		const storedPlan = readStoredPhase3Plan();
		if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
			await showPreview('让AI看看你的原理图：导入连接关系预检结果', [
				jsonPreviewTab('预检摘要', storedPlan?.preflightReport ?? {
					capturedAt: now(),
					passed: false,
					conclusion: '自动预检未生成可执行计划。请重新导出当前框选区域后再试。',
				}),
				jsonPreviewTab('阻止项', storedPlan?.blockers ?? []),
				jsonPreviewTab('警告项', storedPlan?.warnings ?? []),
				jsonPreviewTab('属性归属诊断', storedPlan?.attributeInspection ?? []),
				jsonPreviewTab('网络变化', storedPlan?.networkChanges ?? []),
			]);
			return;
		}
		if (storedPlan.portPlans.length === 0
			&& storedPlan.deletionPlan.length === 0
			&& (storedPlan.pinNoConnectPlans?.length ?? 0) === 0) {
			await showPreview('让AI看看你的原理图：导入连接关系结果', [
				jsonPreviewTab('导入摘要', {
					capturedAt: now(),
					passed: true,
					changeApplied: false,
					componentPosesPreserved: true,
					recoveryStateRetained: false,
					conclusion: '连接关系文本与当前框选区域一致，没有需要执行的网络变化；原导线和网络标签保持原样。',
				}),
				jsonPreviewTab('预检摘要', storedPlan.preflightReport ?? {}),
				jsonPreviewTab('网络变化', storedPlan.networkChanges ?? []),
			]);
			return;
		}
		await supersedeCompletedPersistentImportRecoveryForNewImport();
		await runFullRegionStubPortRollbackProbe({
			previewTitle: '原理图结构文本桥：导入连接关系结果',
			retainConversion: true,
		});
	});
}

async function prepareCurrentSelectionPlan(mode: 'one-click-full-debug' | 'one-click-persistent-conversion') {
	if (mode === 'one-click-persistent-conversion') {
		await supersedeCompletedPersistentImportRecoveryForNewImport(false);
	}
	else {
		assertNoActivePhase4RecoveryState();
	}
	const snapshot = await buildCurrentRegionSnapshot();
	await eda.sys_Storage.setExtensionUserConfig(REGION_SNAPSHOT_STORAGE_KEY, snapshot);
	await eda.sys_Storage.setExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY, JSON.stringify(snapshot.region, null, 2));
	await runWireConflictPreflight({ showPreview: false, includeUnchangedNetworks: true });

	const storedPlan = readStoredPhase3Plan();
	if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
		throw new Error('一键预检未生成可执行计划。请检查当前框选是否完整且不包含冲突图元。');
	}
	const persistent = mode === 'one-click-persistent-conversion';
	return {
		storedPlan,
		context: {
			capturedAt: now(),
			mode,
			snapshotCapturedAt: snapshot.capturedAt,
			selectedPrimitiveCount: snapshot.selectedPrimitiveIds.length,
			componentCount: snapshot.region.components.length,
			netCount: snapshot.region.nets.length,
			strictMatchPassed: true,
			wireConflictPreflightPassed: true,
			plannedNetworkCount: new Set(storedPlan.portPlans.map(plan => plan.net)).size,
			plannedWireCount: storedPlan.deletionPlan.length,
			plannedPortCount: storedPlan.portPlans.length,
			blockerCount: storedPlan.blockerCount,
			planReady: storedPlan.planReady,
			executionMode: persistent ? 'persistent-conversion-with-saved-recovery' : 'temporary-conversion-with-automatic-rollback',
			persistentConversionEnabled: persistent,
			note: persistent
				? '当前框选已自动完成快照、结构输入和导线冲突预检，随后执行正式转换并保存可撤销状态。'
				: '当前框选已自动完成快照、结构输入和导线冲突预检，随后执行完整区域临时转换与统一自动回滚。',
		},
	};
}

export async function runOneClickFullDebug(): Promise<void> {
	await runProbe('一键完整调试', async () => {
		const preparation = await prepareCurrentSelectionPlan('one-click-full-debug');
		await runFullRegionStubPortRollbackProbe({
			oneClickContext: preparation.context,
			previewTitle: '原理图结构文本桥：全面检查结果',
		});
	});
}

export async function runOneClickPersistentConversion(): Promise<void> {
	await runProbe('一键正式转换当前框选', async () => {
		const preparation = await prepareCurrentSelectionPlan('one-click-persistent-conversion');
		await supersedeCompletedPersistentImportRecoveryForNewImport();
		await runFullRegionStubPortRollbackProbe({
			oneClickContext: preparation.context,
			retainConversion: true,
		});
	});
}

export async function recoverFullRegionStubPortProbe(): Promise<void> {
	await runProbe('撤销最近一次转换', async () => {
		const state = readBatchRecoveryState();
		const persistentConversion = state?.purpose === 'persistent-conversion';
		if (!state) {
			await showPreview('原理图结构文本桥：撤回上一次的导入结果', [jsonPreviewTab('恢复摘要', {
				capturedAt: now(),
				statePresent: false,
				passed: true,
				recoveryStateCleared: true,
				canvasModified: false,
				conclusion: '当前没有待恢复的完整区域短桩端口状态。',
			})]);
			return;
		}
		if (persistentConversion && state.convertedConnectivity) {
			const currentConnectivity = await buildEnetConnectivitySnapshot();
			const convertedStateUnchanged = currentConnectivity.canonicalHash === state.convertedConnectivity.canonicalHash
				&& currentConnectivity.networkCount === state.convertedConnectivity.networkCount
				&& currentConnectivity.connectedMemberCount === state.convertedConnectivity.connectedMemberCount;
			if (!convertedStateUnchanged) {
				throw new Error('正式转换后整图电气拓扑已发生变化。为避免覆盖后续编辑，已阻止自动撤销。');
			}
		}
		const confirmed = await confirmAction(
			`将按逆序${persistentConversion ? '撤销正式转换并' : '恢复'}批量状态中的 ${state.entries.length} 个网络，并核对整图连接拓扑。`,
			persistentConversion ? '确认撤回上一次的导入' : '确认恢复完整区域短桩端口闭环',
		);
		if (!confirmed) {
			return;
		}
		const result = await rollbackBatch(state);
		await showPreview('原理图结构文本桥：撤回上一次的导入结果', [
			jsonPreviewTab('恢复摘要', {
				capturedAt: now(),
				statePresent: true,
				purpose: state.purpose,
				networkCount: state.entries.length,
				passed: result.passed,
				recoveryStateCleared: result.recoveryStateCleared,
				conclusion: result.passed
					? (persistentConversion ? '最近一次正式转换已撤销，原导线和整图连接拓扑已恢复。' : '完整区域批量恢复状态已全部处理并清除。')
					: '完整区域批量恢复未完全通过，请不要继续其他写入测试。',
			}),
			jsonPreviewTab('恢复证据', result),
			jsonPreviewTab('批量恢复快照', state),
		]);
	});
}

export async function recoverSingleNetworkPrototype(): Promise<void> {
	await runProbe('恢复最近单网络原型', async () => {
		if (readBatchRecoveryState()) {
			throw new Error('检测到完整区域批量恢复状态。请执行菜单 29，不要单独恢复当前网络。');
		}
		const state = readRecoveryState();
		if (!state) {
			await showPreview('阶段 4：持久化恢复结果', [jsonPreviewTab('恢复摘要', {
				capturedAt: now(),
				statePresent: false,
				passed: true,
				recoveryStateCleared: true,
				canvasModified: false,
				conclusion: '当前没有待恢复的阶段 4 单网络转换状态。',
			})]);
			return;
		}
		const confirmed = await confirmAction(
			`将删除原型跟踪的 ${state.createdPortIds.length} 个网络端口，并在导线不存在时按快照恢复网络 ${state.network}。`,
			'确认恢复最近单网络原型',
		);
		if (!confirmed) {
			return;
		}
		const result = await rollback(state);
		await showPreview('阶段 4：持久化恢复结果', [
			jsonPreviewTab('恢复摘要', {
				capturedAt: now(),
				network: state.network,
				passed: result.passed,
				recoveryStateCleared: result.passed,
				conclusion: result.passed
					? '跟踪端口已清理、导线几何和整图连接拓扑恢复。'
					: '自动恢复未完全通过，请保留本窗口内容并不要继续执行其他转换。',
			}),
			jsonPreviewTab('恢复证据', result),
			jsonPreviewTab('恢复快照', state),
		]);
	});
}

export async function verifyManualRecoveryAndClearState(): Promise<void> {
	await runProbe('验证手动恢复并清除状态', async () => {
		if (readBatchRecoveryState()) {
			throw new Error('检测到完整区域批量恢复状态。请执行菜单 29，不要清除单网络状态。');
		}
		const state = readRecoveryState();
		if (!state) {
			await showPreview('阶段 4：手动恢复只读核验', [jsonPreviewTab('核验摘要', {
				capturedAt: now(),
				statePresent: false,
				passed: true,
				recoveryStateCleared: true,
				canvasModified: false,
				conclusion: '当前没有待处理的阶段 4 恢复状态，无需清理。',
			})]);
			return;
		}
		const remainingPrototypePortIds = await findPrototypePortIds(state);
		const netlistSamples = await captureNetlistHashSamples([0, 250, 1000, 3000]);
		const rawNetlistRestored = netlistSamples.length > 0
			&& netlistSamples.every(sample => sample.length === state.beforeNetlist.length
				&& sample.hash === state.beforeNetlist.hash);
		const currentConnectivity = state.beforeConnectivity ? await buildEnetConnectivitySnapshot() : undefined;
		const connectivityRestored = state.beforeConnectivity && currentConnectivity
			? connectivityComparableValue(state.beforeConnectivity) === connectivityComparableValue(currentConnectivity)
			: false;
		const netlistStableAndRestored = rawNetlistRestored || connectivityRestored;
		const recoveryReady = remainingPrototypePortIds.length === 0 && netlistStableAndRestored;
		const originalWireRestoreState = readOriginalWireRestoreState();
		const originalWireStateCleared = recoveryReady && originalWireRestoreState
			? await clearOriginalWireRestoreState()
			: !originalWireRestoreState;
		const recoveryStateCleared = recoveryReady && originalWireStateCleared ? await clearRecoveryState() : false;
		await showPreview('阶段 4：手动恢复只读核验', [
			jsonPreviewTab('核验摘要', {
				capturedAt: now(),
				network: state.network,
				remainingPrototypePortCount: remainingPrototypePortIds.length,
				rawNetlistRestored,
				connectivityRestored,
				netlistStableAndRestored,
				passed: recoveryReady && originalWireStateCleared && recoveryStateCleared,
				originalWireStateCleared,
				recoveryStateCleared,
				canvasModified: false,
				conclusion: recoveryReady && originalWireStateCleared && recoveryStateCleared
					? '已确认临时端口清空且整图连接拓扑恢复，仅清除了插件恢复状态。'
					: '手动恢复尚未通过只读核验，未清除恢复状态，也未修改画布。',
			}),
			jsonPreviewTab('网表核验证据', {
				expected: state.beforeNetlist,
				samples: netlistSamples,
				expectedConnectivity: state.beforeConnectivity ? summarizeConnectivity(state.beforeConnectivity) : undefined,
				currentConnectivity: currentConnectivity ? summarizeConnectivity(currentConnectivity) : undefined,
			}),
			jsonPreviewTab('端口核验证据', {
				baselinePortIds: state.baselinePortIds,
				trackedPortIds: state.createdPortIds,
				remainingPrototypePortIds,
			}),
		]);
	});
}

function segmentKey(startX: number, startY: number, endX: number, endY: number): string {
	const start = `${String(startX)},${String(startY)}`;
	const end = `${String(endX)},${String(endY)}`;
	return start < end ? `${start}|${end}` : `${end}|${start}`;
}

function sequentialSegmentKeys(paths: Array<Array<number>>): Array<string> {
	const keys: Array<string> = [];
	for (const path of paths) {
		for (let index = 2; index < path.length; index += 2) {
			keys.push(segmentKey(path[index - 2], path[index - 1], path[index], path[index + 1]));
		}
	}
	return keys.sort((left, right) => naturalCollator.compare(left, right));
}

function lineSegmentKeyVariants(line: WireSnapshot['line']): Array<Array<string>> {
	const variants: Array<Array<string>> = [];
	const paths = Array.isArray(line[0]) ? line as Array<Array<number>> : [line as Array<number>];
	variants.push(sequentialSegmentKeys(paths));
	const segmentPairs = splitFlatLineIntoSegments(line);
	if (segmentPairs) {
		const keys = sequentialSegmentKeys(segmentPairs);
		if (!variants.some(variant => sameSet(variant, keys))) {
			variants.push(keys);
		}
	}
	return variants;
}

interface CloneBounds {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

function numericLineBounds(line: WireSnapshot['line']): CloneBounds | undefined {
	const paths = Array.isArray(line[0]) ? line as Array<Array<number>> : [line as Array<number>];
	const values = paths.flat();
	if (values.length < 4 || values.some(value => !Number.isFinite(value))) {
		return undefined;
	}
	const xValues = values.filter((_, index) => index % 2 === 0);
	const yValues = values.filter((_, index) => index % 2 === 1);
	return {
		minX: Math.min(...xValues),
		minY: Math.min(...yValues),
		maxX: Math.max(...xValues),
		maxY: Math.max(...yValues),
	};
}

function boundsOverlapWithClearance(left: CloneBounds, right: CloneBounds, clearance: number): boolean {
	return left.minX < right.maxX + clearance
		&& left.maxX > right.minX - clearance
		&& left.minY < right.maxY + clearance
		&& left.maxY > right.minY - clearance;
}

async function findEmptyCloneOffset(
	segmentedLine: Array<Array<number>>,
	wires: Array<ISCH_PrimitiveWire>,
	components: Array<ISCH_PrimitiveComponent>,
): Promise<{ x: number; y: number; sheetBounds: CloneBounds; targetBounds: CloneBounds }> {
	const sourceBounds = numericLineBounds(segmentedLine);
	if (!sourceBounds) {
		throw new Error('无法计算分段导线边界。');
	}
	const drawingComponents = components.filter(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.DRAWING);
	const sheetBounds = await eda.sch_Primitive.getPrimitivesBBox(drawingComponents);
	if (!sheetBounds) {
		throw new Error('无法读取图纸边界，不能安全选择克隆位置。');
	}
	const wireBounds = wires.map(wire => numericLineBounds(wire.getState_Line())).filter((bounds): bounds is CloneBounds => Boolean(bounds));
	const componentBounds = (await Promise.all(components
		.filter(component => component.getState_ComponentType() !== ESCH_PrimitiveComponentType.DRAWING)
		.map(component => eda.sch_Primitive.getPrimitivesBBox([component]))))
		.filter((bounds): bounds is CloneBounds => Boolean(bounds));
	const obstacles = [...wireBounds, ...componentBounds];
	const width = sourceBounds.maxX - sourceBounds.minX;
	const height = sourceBounds.maxY - sourceBounds.minY;
	const margin = 30;
	const clearance = 20;
	const step = 10;
	for (let y = sheetBounds.minY + margin; y <= sheetBounds.maxY - margin - height; y += step) {
		for (let x = sheetBounds.minX + margin; x <= sheetBounds.maxX - margin - width; x += step) {
			const targetBounds = { minX: x, minY: y, maxX: x + width, maxY: y + height };
			if (!obstacles.some(obstacle => boundsOverlapWithClearance(targetBounds, obstacle, clearance))) {
				return {
					x: x - sourceBounds.minX,
					y: y - sourceBounds.minY,
					sheetBounds,
					targetBounds,
				};
			}
		}
	}
	throw new Error('图纸内部没有找到满足 20 单位间距的克隆空白区域。');
}

function lineMatchesCloneSegments(line: WireSnapshot['line'], plannedLine: Array<Array<number>>): boolean {
	const plannedKeys = new Set(sequentialSegmentKeys(plannedLine));
	return lineSegmentKeyVariants(line).some(keys => keys.length > 0 && keys.every(key => plannedKeys.has(key)));
}

async function findWireCloneIds(state: WireCloneProbeState): Promise<Array<string>> {
	const currentIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
	const baselineIds = new Set(state.baselineWireIds);
	const matchedIds = new Set<string>();
	for (const primitiveId of state.createdWireIds) {
		const wire = await eda.sch_PrimitiveWire.get(primitiveId);
		if (wire) {
			matchedIds.add(primitiveId);
		}
	}
	for (const primitiveId of currentIds.filter(id => !baselineIds.has(id))) {
		const wire = await eda.sch_PrimitiveWire.get(primitiveId);
		if (wire && lineMatchesCloneSegments(wire.getState_Line(), state.plannedLine)) {
			matchedIds.add(primitiveId);
		}
	}
	return [...matchedIds];
}

async function cloneGeometryComplete(primitiveIds: Array<string>, plannedLine: Array<Array<number>>): Promise<boolean> {
	const actualKeys = new Set<string>();
	for (const primitiveId of primitiveIds) {
		const wire = await eda.sch_PrimitiveWire.get(primitiveId);
		if (!wire) {
			continue;
		}
		const variants = lineSegmentKeyVariants(wire.getState_Line());
		const plannedKeys = new Set(sequentialSegmentKeys(plannedLine));
		const matchingVariant = variants.find(keys => keys.every(key => plannedKeys.has(key)));
		for (const key of matchingVariant ?? []) {
			actualKeys.add(key);
		}
	}
	return sameSet([...actualKeys], sequentialSegmentKeys(plannedLine));
}

function wireMatchesOriginalRestorePlan(
	wire: ISCH_PrimitiveWire,
	state: OriginalWireRestoreProbeState,
): boolean {
	return (!state.wireSnapshot.net || wire.getState_Net() === state.wireSnapshot.net)
		&& lineMatchesCloneSegments(wire.getState_Line(), state.plannedLine);
}

async function findOriginalWireRestoreIds(state: OriginalWireRestoreProbeState): Promise<Array<string>> {
	const currentIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
	const baselineIds = new Set(state.baselineWireIds);
	const candidateIds = new Set([
		state.sourceWirePrimitiveId,
		...state.createdWireIds,
		...currentIds.filter(id => id === state.sourceWirePrimitiveId || !baselineIds.has(id)),
	]);
	const matchedIds: Array<string> = [];
	for (const primitiveId of candidateIds) {
		const wire = await eda.sch_PrimitiveWire.get(primitiveId);
		if (wire && wireMatchesOriginalRestorePlan(wire, state)) {
			matchedIds.push(primitiveId);
		}
	}
	return [...new Set(matchedIds)];
}

async function collectCoveredOriginalWireSegmentKeys(
	primitiveIds: Array<string>,
	plannedLine: Array<Array<number>>,
): Promise<Array<string>> {
	const plannedKeys = new Set(sequentialSegmentKeys(plannedLine));
	const coveredKeys = new Set<string>();
	for (const primitiveId of primitiveIds) {
		const wire = await eda.sch_PrimitiveWire.get(primitiveId);
		if (!wire) {
			continue;
		}
		const matchingVariant = lineSegmentKeyVariants(wire.getState_Line())
			.find(keys => keys.length > 0 && keys.every(key => plannedKeys.has(key)));
		for (const key of matchingVariant ?? []) {
			coveredKeys.add(key);
		}
	}
	return [...coveredKeys].sort((left, right) => naturalCollator.compare(left, right));
}

function missingOriginalWireSegmentKeys(
	plannedLine: Array<Array<number>>,
	coveredKeys: Array<string>,
): Array<string> {
	const covered = new Set(coveredKeys);
	return sequentialSegmentKeys(plannedLine).filter(key => !covered.has(key));
}

function connectivityComparableValue(snapshot: EnetConnectivitySnapshot): string {
	return JSON.stringify({
		namedNetworks: snapshot.namedNetworks,
		generatedNetworks: snapshot.generatedNetworks,
	});
}

function summarizeConnectivity(snapshot: EnetConnectivitySnapshot): ConnectivityEvidenceSummary {
	return {
		capturedAt: snapshot.capturedAt,
		sourceVersion: snapshot.sourceVersion,
		networkCount: snapshot.networkCount,
		connectedMemberCount: snapshot.connectedMemberCount,
		canonicalHash: snapshot.canonicalHash,
	};
}

async function captureOriginalWireSemanticEvidence(
	state: OriginalWireRestoreProbeState,
): Promise<OriginalWireSemanticEvidence> {
	const currentConnectivity = await buildEnetConnectivitySnapshot();
	if (state.beforeConnectivity) {
		const connectivityHashMatched = state.beforeConnectivity.canonicalHash === currentConnectivity.canonicalHash;
		const passed = connectivityHashMatched
			&& connectivityComparableValue(state.beforeConnectivity) === connectivityComparableValue(currentConnectivity);
		return {
			mode: 'whole-enet-connectivity',
			currentConnectivity: summarizeConnectivity(currentConnectivity),
			expectedConnectivity: summarizeConnectivity(state.beforeConnectivity),
			connectivityHashMatched,
			passed,
		};
	}

	let targetMembers = state.targetMembers;
	if (!targetMembers || targetMembers.length === 0) {
		const storedPlan = readStoredPhase3Plan();
		if (storedPlan) {
			targetMembers = choosePrototypeCandidate(storedPlan).portPlans.map(plan => plan.member);
		}
	}
	const frozenRegion = readStoredRegionSnapshot();
	if (!frozenRegion || !targetMembers || targetMembers.length === 0) {
		return {
			mode: 'frozen-region-fallback',
			currentConnectivity: summarizeConnectivity(currentConnectivity),
			error: '旧恢复状态缺少整图连接基线，且无法读取冻结区域或目标成员。',
			passed: false,
		};
	}
	try {
		const currentRegion = await buildCurrentRegionSnapshot();
		const comparison = compareRegions(frozenRegion.region, currentRegion.region);
		const targetSourceNetworks = await readCurrentMemberNetworks(targetMembers);
		const sourceNetworkNames = [...new Set(Object.values(targetSourceNetworks).filter(Boolean))];
		const allCurrentGroups = [
			...currentConnectivity.namedNetworks.map(network => network.members),
			...currentConnectivity.generatedNetworks,
		];
		const targetMemberGroup = allCurrentGroups.find(members => sameSet(members, targetMembers));
		const blockers = comparison.issues.filter(issue => issue.level === 'blocker');
		const passed = blockers.length === 0
			&& comparison.networkChanges.length === 0
			&& sourceNetworkNames.length === 1
			&& Boolean(targetMemberGroup);
		return {
			mode: 'frozen-region-fallback',
			currentConnectivity: summarizeConnectivity(currentConnectivity),
			frozenRegionCapturedAt: frozenRegion.capturedAt,
			currentRegionCapturedAt: currentRegion.capturedAt,
			regionIssues: comparison.issues,
			networkChanges: comparison.networkChanges,
			targetMembers,
			targetSourceNetworks,
			...(targetMemberGroup ? { targetMemberGroup } : {}),
			passed,
		};
	}
	catch (error) {
		return {
			mode: 'frozen-region-fallback',
			currentConnectivity: summarizeConnectivity(currentConnectivity),
			frozenRegionCapturedAt: frozenRegion.capturedAt,
			targetMembers,
			error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
			passed: false,
		};
	}
}

async function restoreOriginalWireIncrementally(
	state: OriginalWireRestoreProbeState,
): Promise<OriginalWireRestoreResult> {
	const matchedWireIdsBefore = await findOriginalWireRestoreIds(state);
	const coveredSegmentKeysBefore = await collectCoveredOriginalWireSegmentKeys(matchedWireIdsBefore, state.plannedLine);
	const missingSegmentKeysBefore = missingOriginalWireSegmentKeys(state.plannedLine, coveredSegmentKeysBefore);
	const creationAttempts: Array<OriginalWireRestoreAttempt> = [];
	let statePersistenceError: string | undefined;

	for (let segmentIndex = 0; segmentIndex < state.plannedLine.length; segmentIndex += 1) {
		const segment = state.plannedLine[segmentIndex];
		const targetKey = sequentialSegmentKeys([segment])[0];
		const currentMatchedIds = await findOriginalWireRestoreIds(state);
		const currentCoveredKeys = await collectCoveredOriginalWireSegmentKeys(currentMatchedIds, state.plannedLine);
		if (currentCoveredKeys.includes(targetKey)) {
			continue;
		}

		const netModes: Array<{ mode: OriginalWireRestoreAttempt['netMode']; net?: string }> = state.wireSnapshot.net
			? [{ mode: 'snapshot', net: state.wireSnapshot.net }, { mode: 'automatic' }]
			: [{ mode: 'automatic' }];
		let segmentCovered = false;
		for (const netMode of netModes) {
			const beforeIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
			const beforeIdSet = new Set(beforeIds);
			let returnedPrimitiveId: string | undefined;
			let attemptError: string | undefined;
			try {
				const created = await eda.sch_PrimitiveWire.create(
					cloneLine(segment),
					netMode.net,
					state.wireSnapshot.color,
					state.wireSnapshot.lineWidth,
					state.wireSnapshot.lineType,
				);
				returnedPrimitiveId = created ? safePrimitiveId(created) : undefined;
			}
			catch (error) {
				attemptError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
			}
			let detectedPrimitiveIds = (await eda.sch_PrimitiveWire.getAllPrimitiveId())
				.filter(id => !beforeIdSet.has(id));
			if (!returnedPrimitiveId && detectedPrimitiveIds.length === 0 && !attemptError) {
				detectedPrimitiveIds = await waitForNewIds(() => eda.sch_PrimitiveWire.getAllPrimitiveId(), beforeIds);
			}
			const trackedIds = [...new Set([
				...detectedPrimitiveIds,
				...(returnedPrimitiveId && !beforeIdSet.has(returnedPrimitiveId) ? [returnedPrimitiveId] : []),
			])];
			state.createdWireIds.push(...trackedIds.filter(id => !state.createdWireIds.includes(id)));
			try {
				await writeOriginalWireRestoreState(state);
			}
			catch (error) {
				statePersistenceError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
			}
			const matchedIdsAfterAttempt = await findOriginalWireRestoreIds(state);
			const coveredKeysAfterAttempt = await collectCoveredOriginalWireSegmentKeys(matchedIdsAfterAttempt, state.plannedLine);
			segmentCovered = coveredKeysAfterAttempt.includes(targetKey);
			creationAttempts.push({
				segmentIndex,
				segment,
				netMode: netMode.mode,
				...(returnedPrimitiveId ? { returnedPrimitiveId } : {}),
				detectedPrimitiveIds,
				coveredAfterAttempt: segmentCovered,
				...(attemptError ? { error: attemptError } : {}),
			});
			if (segmentCovered || !attemptError || statePersistenceError) {
				break;
			}
		}
		if (!segmentCovered || statePersistenceError) {
			break;
		}
	}

	const matchedWireIdsAfter = await findOriginalWireRestoreIds(state);
	const coveredSegmentKeysAfter = await collectCoveredOriginalWireSegmentKeys(matchedWireIdsAfter, state.plannedLine);
	const missingSegmentKeysAfter = missingOriginalWireSegmentKeys(state.plannedLine, coveredSegmentKeysAfter);
	const geometryRestored = missingSegmentKeysAfter.length === 0;
	const finalNetlistSamples = await captureNetlistHashSamples([0, 250, 1000, 3000]);
	const expectedNetlist = {
		length: state.beforeNetlist.length,
		hash: state.beforeNetlist.hash,
	};
	const rawNetlistRestored = finalNetlistSamples.length > 0
		&& finalNetlistSamples.every(sample => sample.length === expectedNetlist.length
			&& sample.hash === expectedNetlist.hash);
	const semanticEvidence = await captureOriginalWireSemanticEvidence(state);
	const connectivityRestored = semanticEvidence.passed;
	const netlistRestored = rawNetlistRestored || connectivityRestored;
	const restorationPassed = geometryRestored && netlistRestored && !statePersistenceError;
	const recoveryStateCleared = restorationPassed ? await clearOriginalWireRestoreState() : false;
	return {
		matchedWireIdsBefore,
		coveredSegmentKeysBefore,
		missingSegmentKeysBefore,
		creationAttempts,
		...(statePersistenceError ? { statePersistenceError } : {}),
		matchedWireIdsAfter,
		coveredSegmentKeysAfter,
		missingSegmentKeysAfter,
		geometryRestored,
		finalNetlistSamples,
		expectedNetlist,
		rawNetlistRestored,
		semanticEvidence,
		connectivityRestored,
		netlistRestored,
		recoveryStateCleared,
		passed: restorationPassed && recoveryStateCleared,
	};
}

async function cleanupWireClone(state: WireCloneProbeState): Promise<WireCloneCleanupResult> {
	const matchedWireIds = await findWireCloneIds(state);
	const deleteTargets = (await Promise.all(matchedWireIds.map(id => eda.sch_PrimitiveWire.get(id))))
		.filter((wire): wire is ISCH_PrimitiveWire => Boolean(wire));
	const deleteTargetIds = deleteTargets.map(wire => wire.getState_PrimitiveId());
	let deleteReturned = matchedWireIds.length === 0;
	let deleteError: string | undefined;
	if (matchedWireIds.length > 0) {
		try {
			deleteReturned = await eda.sch_PrimitiveWire.delete(deleteTargets.length > 0 ? deleteTargets : matchedWireIds);
		}
		catch (error) {
			deleteError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
	}
	const deleteEvidence = await captureWirePresenceEvidence(matchedWireIds, [0, 100, 250, 500, 1000, 3000], 'absent');
	const remainingIdSet = new Set(await eda.sch_PrimitiveWire.getAllPrimitiveId());
	const remainingWireIds: Array<string> = [];
	for (const primitiveId of matchedWireIds) {
		if (remainingIdSet.has(primitiveId) || await eda.sch_PrimitiveWire.get(primitiveId)) {
			remainingWireIds.push(primitiveId);
		}
	}
	const finalNetlistSamples = await captureNetlistHashSamples([0, 250, 1000, 3000]);
	const expectedNetlist = {
		length: state.beforeNetlistLength ?? state.beforeNetlist.length,
		hash: state.beforeNetlistHash ?? state.beforeNetlist.hash,
	};
	const { text: finalNetlistText } = await readNetlist();
	const probeNetAbsent = !finalNetlistText.includes(state.probeNet);
	const netlistRestored = finalNetlistSamples.length > 0
		&& finalNetlistSamples.every(sample => sample.length === expectedNetlist.length
			&& sample.hash === expectedNetlist.hash)
		&& probeNetAbsent;
	const cleanupPassed = deleteReturned && !deleteError && remainingWireIds.length === 0 && netlistRestored;
	const recoveryStateCleared = cleanupPassed ? await clearWireCloneState() : false;
	return {
		matchedWireIds,
		deleteTargetIds,
		deleteReturned,
		...(deleteError ? { deleteError } : {}),
		deleteEvidence,
		remainingWireIds,
		finalNetlistSamples,
		expectedNetlist,
		probeNetAbsent,
		netlistRestored,
		recoveryStateCleared,
		passed: cleanupPassed && recoveryStateCleared,
	};
}

export async function runComplexWireCloneProbe(): Promise<void> {
	await runProbe('复杂导线分段克隆删除闭环', async () => {
		if (readBatchRecoveryState()) {
			throw new Error('检测到完整区域批量恢复状态。请先执行菜单 29。');
		}
		if (readOriginalWireRestoreState()) {
			throw new Error('检测到尚未完成的原导线逐段恢复状态。请先执行菜单 25。');
		}
		if (readWireCloneState()) {
			throw new Error('检测到尚未清理的复杂导线克隆状态。请先执行菜单 22。');
		}
		if (readRecoveryState()) {
			throw new Error('检测到阶段 4 转换恢复状态。请先执行菜单 20，不要运行克隆探针。');
		}
		const { text: initialNetlistText } = await readNetlist();
		const existingProbeNets = probeWireNetNames(initialNetlistText);
		if (existingProbeNets.length > 0) {
			throw new Error(`当前 ENET 仍包含旧探针网络：${existingProbeNets.join('、')}。请先执行菜单 23 并恢复到干净状态。`);
		}
		const storedPlan = readStoredPhase3Plan();
		if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
			throw new Error('没有可用的阶段 3 冻结计划。请先按本版测试流程执行菜单 13 至 16。');
		}
		const selectedIds = (await getSelectedPrimitives())
			.map(safePrimitiveId)
			.filter((id): id is string => Boolean(id));
		if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
			throw new Error('当前选择与菜单 16 冻结的选择不一致。请重新执行菜单 13 至 16。');
		}
		const candidate = choosePrototypeCandidate(storedPlan);
		const sourceWire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
		if (!sourceWire) {
			throw new Error(`源导线不存在：${candidate.wirePlan.primitiveId}。`);
		}
		const snapshot = createWireSnapshot(sourceWire);
		const segmentedLine = splitFlatLineIntoSegments(snapshot.line);
		if (!segmentedLine) {
			throw new Error('源导线无法按每 4 个数字拆分为有效正交线段，已阻止克隆。');
		}
		const allWires = await eda.sch_PrimitiveWire.getAll();
		const allComponents = await eda.sch_PrimitiveComponent.getAll();
		const placement = await findEmptyCloneOffset(segmentedLine, allWires, allComponents);
		const offsetX = placement.x;
		const offsetY = placement.y;
		const translatedLine = segmentedLine.map(segment => segment.map((value, index) => value + (index % 2 === 0 ? offsetX : offsetY)));
		const probeNet = `PROBE_WIRE_CLONE_${String(Date.now())}`;
		const confirmed = await confirmAction(
			`将在图纸内部空白位置逐段创建 ${translatedLine.length} 条相连导线，随后立即删除并比较网表。原导线 ${snapshot.originalPrimitiveId} 不会被修改。`,
			'确认执行复杂导线分段克隆/删除闭环',
		);
		if (!confirmed) {
			return;
		}
		const beforeNetlist = await captureNetlistHash();
		const state: WireCloneProbeState = {
			version: 1,
			active: true,
			capturedAt: now(),
			beforeNetlist,
			beforeNetlistLength: beforeNetlist.length,
			beforeNetlistHash: beforeNetlist.hash,
			baselineWireIds: await eda.sch_PrimitiveWire.getAllPrimitiveId(),
			createdWireIds: [],
			plannedLine: translatedLine,
			probeNet,
			sourceWirePrimitiveId: snapshot.originalPrimitiveId,
		};
		await writeWireCloneState(state);

		const creationAttempts: Array<Record<string, unknown>> = [];
		const detectedPrimitiveIds: Array<string> = [];
		let createError: string | undefined;
		for (let index = 0; index < translatedLine.length; index += 1) {
			const segment = translatedLine[index];
			const beforeIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
			const beforeIdSet = new Set(beforeIds);
			let returnedPrimitiveId: string | undefined;
			let attemptError: string | undefined;
			try {
				const created = await eda.sch_PrimitiveWire.create(
					cloneLine(segment),
					probeNet,
					snapshot.color,
					snapshot.lineWidth,
					snapshot.lineType,
				);
				returnedPrimitiveId = created ? safePrimitiveId(created) : undefined;
			}
			catch (error) {
				attemptError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
			}
			let newIds = (await eda.sch_PrimitiveWire.getAllPrimitiveId()).filter(id => !beforeIdSet.has(id));
			if (!returnedPrimitiveId && newIds.length === 0) {
				newIds = await waitForNewIds(() => eda.sch_PrimitiveWire.getAllPrimitiveId(), beforeIds);
			}
			detectedPrimitiveIds.push(...newIds.filter(id => !detectedPrimitiveIds.includes(id)));
			state.createdWireIds.push(...newIds.filter(id => !state.createdWireIds.includes(id)));
			if (returnedPrimitiveId && !beforeIdSet.has(returnedPrimitiveId) && !state.createdWireIds.includes(returnedPrimitiveId)) {
				state.createdWireIds.push(returnedPrimitiveId);
			}
			await writeWireCloneState(state);
			const mergedIntoTrackedClone = Boolean(returnedPrimitiveId && state.createdWireIds.includes(returnedPrimitiveId));
			const attemptPassed = !attemptError && (newIds.length > 0 || mergedIntoTrackedClone);
			creationAttempts.push({
				segmentIndex: index,
				segment,
				returnedPrimitiveId,
				detectedPrimitiveIds: newIds,
				mergedIntoTrackedClone,
				passed: attemptPassed,
				attemptError,
			});
			if (!attemptPassed) {
				createError = attemptError ?? `第 ${String(index + 1)} 条线段创建后没有返回或检测到图元。`;
				break;
			}
		}
		const matchedCreatedWireIds = await findWireCloneIds(state);
		const createAllSegmentsMatched = await cloneGeometryComplete(matchedCreatedWireIds, translatedLine);
		const cleanup = await cleanupWireClone(state);
		const passed = !createError && createAllSegmentsMatched && cleanup.passed;
		await showPreview('阶段 4：复杂导线分段克隆/删除结果', [
			jsonPreviewTab('闭环摘要', {
				capturedAt: now(),
				sourceWirePrimitiveId: snapshot.originalPrimitiveId,
				segmentCount: translatedLine.length,
				offset: { x: offsetX, y: offsetY },
				sheetBounds: placement.sheetBounds,
				targetBounds: placement.targetBounds,
				createdPrimitiveCount: state.createdWireIds.length,
				createAllSegmentsMatched,
				automaticCleanupPassed: cleanup.passed,
				originalWireUntouched: Boolean(await eda.sch_PrimitiveWire.get(snapshot.originalPrimitiveId)),
				passed,
				createError,
				conclusion: passed
					? '复杂分支导线已在偏移位置唯一创建、删除，原导线未修改且最终网表恢复。'
					: '复杂导线克隆闭环未通过。若存在残留，请执行菜单 22；不要执行菜单 18。',
			}),
			jsonPreviewTab('路径转换证据', {
				originalLine: snapshot.line,
				segmentedLine,
				translatedLine,
				sheetBounds: placement.sheetBounds,
				targetBounds: placement.targetBounds,
				probeNet,
			}),
			jsonPreviewTab('创建证据', {
				creationAttempts,
				detectedPrimitiveIds,
				createdWireIds: state.createdWireIds,
				matchedCreatedWireIds,
				createAllSegmentsMatched,
				createError,
			}),
			jsonPreviewTab('删除与网表证据', cleanup),
		]);
	});
}

export async function runOriginalWireDeleteRestoreProbe(): Promise<void> {
	await runProbe('原导线删除逐段恢复闭环', async () => {
		if (readBatchRecoveryState()) {
			throw new Error('检测到完整区域批量恢复状态。请先执行菜单 29。');
		}
		if (readOriginalWireRestoreState()) {
			throw new Error('检测到尚未完成的原导线逐段恢复状态。请先执行菜单 25。');
		}
		if (readWireCloneState()) {
			throw new Error('检测到尚未清理的复杂导线克隆状态。请先执行菜单 22。');
		}
		if (readRecoveryState()) {
			throw new Error('检测到阶段 4 转换恢复状态。请先执行菜单 20。');
		}
		const { text: initialNetlistText } = await readNetlist();
		const existingProbeNets = probeWireNetNames(initialNetlistText);
		if (existingProbeNets.length > 0) {
			throw new Error(`当前 ENET 仍包含旧探针网络：${existingProbeNets.join('、')}。请先执行菜单 23 并恢复到干净状态。`);
		}
		const storedPlan = readStoredPhase3Plan();
		if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
			throw new Error('没有可用的阶段 3 冻结计划。请先执行菜单 13 至 16。');
		}
		const selectedIds = (await getSelectedPrimitives())
			.map(safePrimitiveId)
			.filter((id): id is string => Boolean(id));
		if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
			throw new Error('当前选择与菜单 16 冻结的选择不一致。请重新执行菜单 13 至 16。');
		}
		const candidate = choosePrototypeCandidate(storedPlan);
		const sourceWire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
		if (!sourceWire) {
			throw new Error(`源导线不存在：${candidate.wirePlan.primitiveId}。`);
		}
		const wireSnapshot = createWireSnapshot(sourceWire);
		const plannedLine = splitFlatLineIntoSegments(wireSnapshot.line);
		if (!plannedLine) {
			throw new Error('源导线无法按每 4 个数字拆分为有效正交线段，已阻止删除。');
		}
		const confirmed = await confirmAction(
			`将删除原导线 ${wireSnapshot.originalPrimitiveId}，确认消失后按 ${String(plannedLine.length)} 个线段逐段恢复。不会创建网络端口；恢复状态会在删除前持久化。`,
			'确认执行原导线删除/逐段恢复闭环',
		);
		if (!confirmed) {
			return;
		}

		const state: OriginalWireRestoreProbeState = {
			version: 1,
			active: true,
			capturedAt: now(),
			beforeNetlist: await captureNetlistHash(),
			beforeConnectivity: await buildEnetConnectivitySnapshot(),
			baselineWireIds: await eda.sch_PrimitiveWire.getAllPrimitiveId(),
			createdWireIds: [],
			wireSnapshot,
			sourceWirePrimitiveId: wireSnapshot.originalPrimitiveId,
			plannedLine,
			targetMembers: candidate.portPlans.map(plan => plan.member),
			targetNetwork: candidate.net,
			wireDeleted: false,
		};
		await writeOriginalWireRestoreState(state);

		let deleteReturned = false;
		let deleteEvidence: Array<WirePresenceEvidence> = [];
		let wireAbsentAfterDelete = false;
		let deleteError: string | undefined;
		let deletionStateUpdateError: string | undefined;
		try {
			const freshSourceWire = await eda.sch_PrimitiveWire.get(state.sourceWirePrimitiveId);
			if (!freshSourceWire) {
				throw new Error('删除前无法重新读取源导线对象。');
			}
			deleteReturned = await eda.sch_PrimitiveWire.delete(freshSourceWire);
			deleteEvidence = await captureWirePresenceEvidence(
				[state.sourceWirePrimitiveId],
				[0, 100, 250, 500, 1000, 3000],
				'absent',
			);
			wireAbsentAfterDelete = deleteEvidence.at(-1)?.status === 'absent';
			if (wireAbsentAfterDelete) {
				state.wireDeleted = true;
				try {
					await writeOriginalWireRestoreState(state);
				}
				catch (error) {
					deletionStateUpdateError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
				}
			}
			if (!deleteReturned || !wireAbsentAfterDelete) {
				throw new Error(`原导线删除未得到完整确认：返回 ${String(deleteReturned)}，最终状态 ${deleteEvidence.at(-1)?.status ?? 'unknown'}。`);
			}
		}
		catch (error) {
			deleteError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
			if (deleteEvidence.length === 0) {
				deleteEvidence = await captureWirePresenceEvidence(
					[state.sourceWirePrimitiveId],
					[0, 100, 250, 500, 1000],
				);
				wireAbsentAfterDelete = deleteEvidence.at(-1)?.status === 'absent';
			}
		}

		let restoreResult: OriginalWireRestoreResult | undefined;
		let restoreError: string | undefined;
		try {
			restoreResult = await restoreOriginalWireIncrementally(state);
		}
		catch (error) {
			restoreError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
		const passed = deleteReturned
			&& wireAbsentAfterDelete
			&& !deleteError
			&& !deletionStateUpdateError
			&& !restoreError
			&& restoreResult?.passed === true;
		await showPreview('阶段 4：原导线删除/逐段恢复结果', [
			jsonPreviewTab('闭环摘要', {
				capturedAt: now(),
				sourceWirePrimitiveId: state.sourceWirePrimitiveId,
				targetNetwork: candidate.net,
				sourceWireNetField: wireSnapshot.net,
				segmentCount: plannedLine.length,
				deleteReturned,
				wireAbsentAfterDelete,
				deleteConfirmationStatus: deleteEvidence.at(-1)?.status ?? 'unknown',
				geometryRestored: restoreResult?.geometryRestored ?? false,
				rawNetlistRestored: restoreResult?.rawNetlistRestored ?? false,
				connectivityRestored: restoreResult?.connectivityRestored ?? false,
				netlistRestored: restoreResult?.netlistRestored ?? false,
				recoveryStateCleared: restoreResult?.recoveryStateCleared ?? false,
				passed,
				persistentConversionEnabled: false,
				...(deleteError ? { deleteError } : {}),
				...(deletionStateUpdateError ? { deletionStateUpdateError } : {}),
				...(restoreError ? { restoreError } : {}),
				conclusion: passed
					? '原导线已确认删除并按缺失线段完整恢复，最终网表恢复。'
					: '原导线删除/恢复闭环未完全通过。请保留结果并执行菜单 25。',
			}),
			jsonPreviewTab('导线删除证据', deleteEvidence),
			jsonPreviewTab('逐段恢复证据', restoreResult ?? { restoreError }),
			jsonPreviewTab('恢复状态快照', state),
		]);
	});
}

export async function recoverOriginalWireDeleteRestoreProbe(): Promise<void> {
	await runProbe('恢复最近原导线逐段探针', async () => {
		if (readBatchRecoveryState()) {
			throw new Error('检测到完整区域批量恢复状态。请执行菜单 29，不要单独恢复当前导线。');
		}
		if (readRecoveryState()) {
			throw new Error('检测到单网络转换恢复状态。请先执行菜单 19 清理临时端口并恢复导线。');
		}
		const state = readOriginalWireRestoreState();
		if (!state) {
			await showPreview('阶段 4：原导线逐段恢复', [jsonPreviewTab('恢复摘要', {
				capturedAt: now(),
				statePresent: false,
				passed: true,
				recoveryStateCleared: true,
				canvasModified: false,
				conclusion: '当前没有待处理的原导线逐段恢复状态。',
			})]);
			return;
		}
		const confirmed = await confirmAction(
			`将检查原导线 ${state.sourceWirePrimitiveId} 的 ${String(state.plannedLine.length)} 个目标线段，并只创建缺失线段。`,
			'确认恢复最近原导线逐段探针',
		);
		if (!confirmed) {
			return;
		}
		let result: OriginalWireRestoreResult | undefined;
		let restoreError: string | undefined;
		try {
			result = await restoreOriginalWireIncrementally(state);
		}
		catch (error) {
			restoreError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		}
		await showPreview('阶段 4：原导线逐段恢复', [
			jsonPreviewTab('恢复摘要', {
				capturedAt: now(),
				statePresent: true,
				sourceWirePrimitiveId: state.sourceWirePrimitiveId,
				targetNetwork: resolveOriginalWireTargetNetwork(state),
				sourceWireNetField: state.wireSnapshot.net,
				segmentCount: state.plannedLine.length,
				geometryRestored: result?.geometryRestored ?? false,
				rawNetlistRestored: result?.rawNetlistRestored ?? false,
				connectivityRestored: result?.connectivityRestored ?? false,
				netlistRestored: result?.netlistRestored ?? false,
				recoveryStateCleared: result?.recoveryStateCleared ?? false,
				passed: !restoreError && result?.passed === true,
				...(restoreError ? { restoreError } : {}),
				conclusion: !restoreError && result?.passed
					? '缺失线段已补齐，最终网表恢复，恢复状态已清除。'
					: '逐段恢复未完全通过，恢复状态已保留。请不要继续其他写入测试。',
			}),
			jsonPreviewTab('逐段恢复证据', result ?? { restoreError }),
			jsonPreviewTab('恢复状态快照', state),
		]);
	});
}

export async function cleanupComplexWireCloneProbe(): Promise<void> {
	await runProbe('清理最近复杂导线克隆', async () => {
		const state = readWireCloneState();
		if (!state) {
			await showPreview('阶段 4：复杂导线克隆清理', [jsonPreviewTab('清理摘要', {
				capturedAt: now(),
				statePresent: false,
				passed: true,
				canvasModified: false,
				conclusion: '当前没有待清理的复杂导线克隆状态。',
			})]);
			return;
		}
		const confirmed = await confirmAction('将只删除本轮基线之外且路径与计划完全匹配的克隆导线。', '确认清理复杂导线克隆');
		if (!confirmed) {
			return;
		}
		const cleanup = await cleanupWireClone(state);
		await showPreview('阶段 4：复杂导线克隆清理', [
			jsonPreviewTab('清理摘要', {
				capturedAt: now(),
				passed: cleanup.passed,
				conclusion: cleanup.passed
					? '复杂导线克隆已清理，最终网表恢复。'
					: '克隆清理未完全通过，请保留证据且不要继续其他写入测试。',
			}),
			jsonPreviewTab('清理证据', cleanup),
			jsonPreviewTab('克隆状态', state),
		]);
	});
}

export async function diagnoseWireCloneResidue(): Promise<void> {
	await runProbe('复杂导线克隆残留诊断', async () => {
		const { text } = await readNetlist();
		const probeNets = probeWireNetNames(text);
		const matchingWires = (await eda.sch_PrimitiveWire.getAll())
			.filter(wire => probeNets.includes(wire.getState_Net()))
			.map(wire => ({
				primitiveId: wire.getState_PrimitiveId(),
				net: wire.getState_Net(),
				line: wire.getState_Line(),
			}));
		await showPreview('阶段 4：复杂导线克隆残留诊断', [
			jsonPreviewTab('诊断摘要', {
				capturedAt: now(),
				netlistLength: text.length,
				netlistHash: hashText(text),
				probeNetCount: probeNets.length,
				matchingWireCount: matchingWires.length,
				clean: probeNets.length === 0 && matchingWires.length === 0,
				canvasModified: false,
				conclusion: probeNets.length === 0 && matchingWires.length === 0
					? '当前 ENET 和导线列表中均未发现复杂导线克隆残留。'
					: '检测到复杂导线克隆残留。请先手工恢复到测试前状态，再重新执行本诊断。',
			}),
			jsonPreviewTab('残留明细', { probeNets, matchingWires }),
		]);
	});
}
