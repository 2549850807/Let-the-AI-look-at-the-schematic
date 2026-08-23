import {
	appendProbeEvent,
	cloneLine,
	collectNetlistSamples,
	confirmAction,
	createWireSnapshot,
	getAutomaticWireAndPin,
	getSelectedWire,
	jsonPreviewTab,
	now,
	readProbeState,
	runProbe,
	safePrimitiveId,
	showPreview,
	startObservedCall,
	updateProbeState,
	waitForNewIds,
} from './probe-core';

export async function snapshotSelectedWire(): Promise<void> {
	await runProbe('导线快照探针', async () => {
		const wire = await getSelectedWire();
		const snapshot = createWireSnapshot(wire);
		await updateProbeState({ wireSnapshot: snapshot });
		await showPreview('导线快照', [jsonPreviewTab('快照内容', snapshot)]);
	});
}

export async function deleteSelectedWire(): Promise<void> {
	await runProbe('导线删除探针', async () => {
		const wire = await getSelectedWire();
		const snapshot = createWireSnapshot(wire);
		await updateProbeState({ wireSnapshot: snapshot });
		const confirmed = await confirmAction(
			`将删除唯一选中的导线 ${snapshot.originalPrimitiveId}。完整路径会先导出 JSON，删除后请立即测试恢复。`,
			'确认删除导线',
		);
		if (!confirmed)
			return;
		const deleted = await eda.sch_PrimitiveWire.delete(wire);
		const stillExists = Boolean(await eda.sch_PrimitiveWire.get(snapshot.originalPrimitiveId));
		await showPreview('导线删除结果', [
			jsonPreviewTab('删除结果', {
				deleted,
				stillExists,
				nextStep: '请执行“恢复最近导线快照”。',
			}),
			jsonPreviewTab('恢复快照', snapshot),
		]);
	});
}

export async function restoreWireSnapshot(): Promise<void> {
	await runProbe('导线恢复探针', async () => {
		const snapshot = readProbeState().wireSnapshot;
		if (!snapshot)
			throw new Error('当前会话没有导线快照。请先执行快照或删除探针。');
		if (await eda.sch_PrimitiveWire.get(snapshot.originalPrimitiveId)) {
			throw new Error('原导线仍然存在，已阻止重复创建。');
		}
		const confirmed = await confirmAction('将使用最近快照重建导线。新导线会获得新的图元 ID。', '确认恢复导线');
		if (!confirmed)
			return;
		const restored = await eda.sch_PrimitiveWire.create(
			cloneLine(snapshot.line),
			snapshot.net || undefined,
			snapshot.color,
			snapshot.lineWidth,
			snapshot.lineType,
		);
		if (!restored)
			throw new Error('导线恢复创建失败。');
		await showPreview('导线恢复结果', [jsonPreviewTab('恢复结果', {
			originalPrimitiveId: snapshot.originalPrimitiveId,
			newPrimitiveId: restored.getState_PrimitiveId(),
			snapshot,
			nextStep: '请检查路径、网络和撤销历史。',
		})]);
	});
}

export async function probeLabelThenDeleteWire(): Promise<void> {
	await runProbe('先建标签后删导线探针', async () => {
		await appendProbeEvent('createNetLabel-before-delete-wire: reading selected wire, component and pins');
		const target = await getAutomaticWireAndPin();
		await appendProbeEvent('createNetLabel-before-delete-wire: automatic targets selected', [
			target.wire.getState_PrimitiveId(),
			target.component.getState_PrimitiveId(),
		]);
		const wire = target.wire;
		const targetPoint = {
			mode: 'REPORTED' as const,
			x: target.pin.getState_X(),
			y: target.pin.getState_Y(),
		};
		const net = `PROBE_ORDER_${Date.now()}`;
		const snapshot = createWireSnapshot(wire);
		await updateProbeState({ wireSnapshot: snapshot });
		await appendProbeEvent('createNetLabel-before-delete-wire: reading primitive IDs');
		const beforeAttributeIds = await eda.sch_PrimitiveAttribute.getAllPrimitiveId();
		await appendProbeEvent('createNetLabel-before-delete-wire: invoking create API');
		const observed = startObservedCall(
			eda.sch_PrimitiveAttribute.createNetLabel(targetPoint.x, targetPoint.y, net),
			'createNetLabel-before-delete-wire',
		);
		const createdIds = await waitForNewIds(() => eda.sch_PrimitiveAttribute.getAllPrimitiveId(), beforeAttributeIds);
		const label = observed.getReturned();
		const returnedId = label ? safePrimitiveId(label) : undefined;
		if (returnedId && !createdIds.includes(returnedId)) {
			createdIds.push(returnedId);
		}
		if (createdIds.length !== 1) {
			await showPreview('顺序测试已阻止', [jsonPreviewTab('标签创建诊断', {
				apiSettled: observed.isSettled(),
				apiError: observed.getError(),
				returnedObject: Boolean(label),
				returnedPrimitiveId: returnedId,
				createdIds,
				beforeCount: beforeAttributeIds.length,
				afterCount: (await eda.sch_PrimitiveAttribute.getAllPrimitiveId()).length,
				conclusion: '没有形成唯一的新标签，因此未删除导线。',
				automaticSelection: {
					component: target.component.getState_Designator(),
					pinNumber: target.pin.getState_PinNumber(),
					wirePrimitiveId: snapshot.originalPrimitiveId,
					strategy: '自动使用距离所选导线路径最近的器件引脚，不读取鼠标位置，不显示前置弹窗。',
				},
			})]);
			return;
		}
		const trackedLabel = {
			primitiveId: createdIds[0],
			net,
			x: targetPoint.x,
			y: targetPoint.y,
			rotation: label?.getState_Rotation() ?? 0,
			createdAt: now(),
		};
		await updateProbeState({ netLabel: trackedLabel });
		const deleted = await eda.sch_PrimitiveWire.delete(wire);
		if (!deleted)
			throw new Error(`标签已创建（${trackedLabel.primitiveId}），但导线删除失败。请手工撤销标签创建。`);
		const netlistSamples = await collectNetlistSamples('先创建标签、后删除导线');
		await showPreview('先建标签后删导线结果', [jsonPreviewTab('顺序测试结果', {
			capturedAt: now(),
			label: trackedLabel,
			targetPoint,
			wireSnapshot: snapshot,
			netlistSamples,
			note: '删除的是选中导线，不是器件引脚；标签留在原坐标可能只是悬空标签，必须通过网表确认网络是否仍正确。',
		})]);
	});
}
