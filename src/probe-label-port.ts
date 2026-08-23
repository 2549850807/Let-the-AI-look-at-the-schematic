import {
	appendProbeEvent,
	confirmAction,
	getAutomaticSelectedPin,
	jsonPreviewTab,
	now,
	pinEndpointCandidates,
	readProbeState,
	runProbe,
	safePrimitiveId,
	showInfo,
	showPreview,
	startObservedCall,
	updateProbeState,
	waitForNewIds,
} from './probe-core';

export async function createNetLabelProbe(): Promise<void> {
	await runProbe('普通网络标签创建探针', async () => {
		await appendProbeEvent('createNetLabel: reading selected component and pins');
		const target = await getAutomaticSelectedPin();
		await appendProbeEvent('createNetLabel: automatic pin selected', [
			target.component.getState_PrimitiveId(),
		]);
		const net = `PROBE_LABEL_${Date.now()}`;
		const rotation = target.pin.getState_Rotation();
		const candidates = pinEndpointCandidates(target.pin);
		const targetPoint = candidates.reported;
		await appendProbeEvent('createNetLabel: reading primitive IDs');
		const beforeIds = await eda.sch_PrimitiveAttribute.getAllPrimitiveId();
		await appendProbeEvent('createNetLabel: invoking create API');
		const observed = startObservedCall(
			eda.sch_PrimitiveAttribute.createNetLabel(targetPoint.x, targetPoint.y, net),
			'createNetLabel',
		);
		const createdIds = await waitForNewIds(() => eda.sch_PrimitiveAttribute.getAllPrimitiveId(), beforeIds);
		const returned = observed.getReturned();
		const returnedId = returned ? safePrimitiveId(returned) : undefined;
		const primitiveId = createdIds.length === 1 ? createdIds[0] : returnedId;
		if (!primitiveId) {
			await showPreview('网络标签创建失败诊断', [jsonPreviewTab('失败诊断', {
				capturedAt: now(),
				net,
				coordinates: candidates,
				targetPoint,
				returnedObject: Boolean(returned),
				returnedPrimitiveId: returnedId,
				apiSettled: observed.isSettled(),
				apiError: observed.getError(),
				beforeCount: beforeIds.length,
				afterCount: (await eda.sch_PrimitiveAttribute.getAllPrimitiveId()).length,
				conclusion: observed.isSettled()
					? 'API 已结束，但画布没有形成唯一的新网络标签。'
					: 'API 在约 3.5 秒内没有返回，且画布没有形成唯一的新网络标签。桌面客户端当前不支持此创建链路。',
			})]);
			return;
		}
		const label = await eda.sch_PrimitiveAttribute.get(primitiveId);
		if (label && rotation !== (label.getState_Rotation() ?? 0)) {
			await eda.sch_PrimitiveAttribute.modify(label, { rotation });
		}
		await updateProbeState({
			netLabel: {
				primitiveId,
				net,
				x: targetPoint.x,
				y: targetPoint.y,
				rotation,
				createdAt: now(),
			},
		});
		await eda.sch_Document.navigateToCoordinates(targetPoint.x, targetPoint.y);
		await showPreview('网络标签创建结果', [jsonPreviewTab('创建结果', {
			primitiveId,
			net,
			rotation,
			coordinates: candidates,
			targetPoint,
			nextStep: '请检查标签是否可见、锚点、电气连接和网表变化。',
			automaticSelection: {
				component: target.component.getState_Designator(),
				pinNumber: target.pin.getState_PinNumber(),
				strategy: '唯一选中器件的 SDK 引脚列表首项；不读取鼠标位置，不显示前置弹窗。',
			},
		})]);
	});
}

export async function deleteTrackedNetLabel(): Promise<void> {
	await runProbe('普通网络标签删除能力探针', async () => {
		const tracked = readProbeState().netLabel;
		if (!tracked?.primitiveId) {
			throw new Error('持久化状态中没有可识别的网络标签 ID。请先用新版创建探针。');
		}
		const before = await eda.sch_PrimitiveAttribute.get(tracked.primitiveId);
		if (!before) {
			await updateProbeState({ netLabel: undefined });
			showInfo('跟踪的标签已不存在，可能已被手工撤销。', '标签删除探针');
			return;
		}
		const confirmed = await confirmAction(
			'当前 SDK 没有普通网络标签按 ID 删除接口。此操作只验证无参数 delete()，预计返回 false，不会尝试未公开绕过方式。',
			'验证标签删除能力',
		);
		if (!confirmed) {
			return;
		}
		const apiResult = eda.sch_PrimitiveAttribute.delete();
		const after = await eda.sch_PrimitiveAttribute.get(tracked.primitiveId);
		const result = {
			capturedAt: now(),
			trackedLabel: tracked,
			apiResult,
			stillExists: Boolean(after),
			conclusion: after ? '公开 API 无法可靠删除普通网络标签；转换执行必须保持禁用。' : '标签已不存在，仍需重复验证。',
		};
		if (!after) {
			await updateProbeState({ netLabel: undefined });
		}
		await showPreview('网络标签删除能力结果', [jsonPreviewTab('验证结果', result)]);
	});
}

export async function createNetPortProbe(): Promise<void> {
	await runProbe('网络端口创建探针', async () => {
		await appendProbeEvent('createNetPort: reading selected component and pins');
		const target = await getAutomaticSelectedPin();
		await appendProbeEvent('createNetPort: automatic pin selected', [
			target.component.getState_PrimitiveId(),
		]);
		const direction = 'BI' as const;
		const net = `PROBE_PORT_${Date.now()}`;
		const rotation = target.pin.getState_Rotation();
		const candidates = pinEndpointCandidates(target.pin);
		const targetPoint = candidates.reported;
		await appendProbeEvent('createNetPort: reading primitive IDs');
		const beforeIds = await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT);
		await appendProbeEvent('createNetPort: invoking create API');
		const observed = startObservedCall(
			eda.sch_PrimitiveComponent.createNetPort(direction, net, targetPoint.x, targetPoint.y, rotation, false),
			'createNetPort',
		);
		const createdIds = await waitForNewIds(
			() => eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
			beforeIds,
		);
		const returned = observed.getReturned();
		const returnedId = returned ? safePrimitiveId(returned) : undefined;
		const primitiveId = createdIds.length === 1 ? createdIds[0] : returnedId;
		if (!primitiveId) {
			await showPreview('网络端口创建失败诊断', [jsonPreviewTab('失败诊断', {
				capturedAt: now(),
				direction,
				net,
				coordinates: candidates,
				targetPoint,
				returnedObject: Boolean(returned),
				returnedPrimitiveId: returnedId,
				apiSettled: observed.isSettled(),
				apiError: observed.getError(),
				beforeCount: beforeIds.length,
				afterCount: (await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT)).length,
				conclusion: observed.isSettled()
					? 'API 已结束，但画布没有形成唯一的新网络端口。'
					: 'API 在约 3.5 秒内没有返回，且画布没有形成唯一的新网络端口。桌面客户端当前不支持此创建链路。',
			})]);
			return;
		}
		await updateProbeState({
			netPort: {
				primitiveId,
				direction,
				net,
				x: targetPoint.x,
				y: targetPoint.y,
				rotation,
				mirror: false,
				createdAt: now(),
			},
		});
		await eda.sch_Document.navigateToCoordinates(targetPoint.x, targetPoint.y);
		await showPreview('网络端口创建结果', [jsonPreviewTab('创建结果', {
			primitiveId,
			direction,
			net,
			rotation,
			coordinates: candidates,
			targetPoint,
			nextStep: '请检查方向、电气连接和网表变化。',
			automaticSelection: {
				component: target.component.getState_Designator(),
				pinNumber: target.pin.getState_PinNumber(),
				strategy: '自动创建 BI 端口；使用唯一选中器件的 SDK 引脚列表首项，不显示前置弹窗。',
			},
		})]);
	});
}

export async function deleteTrackedNetPort(): Promise<void> {
	await runProbe('网络端口删除探针', async () => {
		const tracked = readProbeState().netPort;
		if (!tracked?.primitiveId) {
			throw new Error('持久化状态中没有可识别的网络端口 ID。请先用新版创建探针。');
		}
		const port = await eda.sch_PrimitiveComponent.get(tracked.primitiveId);
		if (!port) {
			await updateProbeState({ netPort: undefined });
			showInfo('跟踪的端口已不存在，可能已被手工撤销。', '端口删除探针');
			return;
		}
		const confirmed = await confirmAction(`将删除探针创建的 ${tracked.direction} 端口 ${tracked.net}。`, '确认删除网络端口');
		if (!confirmed) {
			return;
		}
		const deleted = await eda.sch_PrimitiveComponent.delete(port);
		const stillExists = Boolean(await eda.sch_PrimitiveComponent.get(tracked.primitiveId));
		if (deleted && !stillExists) {
			await updateProbeState({ netPort: undefined });
		}
		await showPreview('网络端口删除结果', [jsonPreviewTab('删除结果', {
			trackedPort: tracked,
			deleted,
			stillExists,
		})]);
	});
}
