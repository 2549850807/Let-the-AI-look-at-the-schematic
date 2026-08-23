import {
	collectNetlistSamples,
	ensureProbeEventLog,
	environmentInfo,
	getSelectedPrimitives,
	hashText,
	isAttribute,
	isComponent,
	isWire,
	jsonPreviewTab,
	now,
	readEventLog,
	readNetlist,
	removeProbeEventLog,
	runProbe,
	safePrimitiveId,
	showPreview,
} from './probe-core';

function serializePin(pin: ISCH_PrimitiveComponentPin): Record<string, unknown> {
	return {
		primitiveId: safePrimitiveId(pin),
		pinNumber: pin.getState_PinNumber(),
		pinName: pin.getState_PinName(),
		pinType: pin.getState_pinType(),
		pinShape: pin.getState_PinShape(),
		x: pin.getState_X(),
		y: pin.getState_Y(),
		rotation: pin.getState_Rotation(),
		pinLength: pin.getState_PinLength(),
		noConnected: pin.getState_NoConnected(),
		otherProperty: pin.getState_OtherProperty(),
	};
}

async function serializeComponent(component: ISCH_PrimitiveComponent): Promise<Record<string, unknown>> {
	const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
	return {
		primitiveId: component.getState_PrimitiveId(),
		componentType: component.getState_ComponentType(),
		designator: component.getState_Designator(),
		name: component.getState_Name(),
		subPartName: component.getState_SubPartName(),
		x: component.getState_X(),
		y: component.getState_Y(),
		rotation: component.getState_Rotation(),
		mirror: component.getState_Mirror(),
		net: component.getState_Net(),
		component: component.getState_Component(),
		pins: pins.map(serializePin),
	};
}

function serializeAttribute(attribute: ISCH_PrimitiveAttribute): Record<string, unknown> {
	return {
		primitiveId: safePrimitiveId(attribute),
		parentPrimitiveId: attribute.getState_ParentPrimitiveId(),
		key: attribute.getState_Key(),
		value: attribute.getState_Value(),
		x: attribute.getState_X(),
		y: attribute.getState_Y(),
		rotation: attribute.getState_Rotation(),
		keyVisible: attribute.getState_KeyVisible(),
		valueVisible: attribute.getState_ValueVisible(),
	};
}

function serializeWire(wire: ISCH_PrimitiveWire): Record<string, unknown> {
	return {
		primitiveId: safePrimitiveId(wire),
		line: wire.getState_Line(),
		netWarning: 'SDK 类型定义提示 getState_Net() 可能错误；真实连接必须以网表为准。',
		net: wire.getState_Net(),
		color: wire.getState_Color(),
		lineWidth: wire.getState_LineWidth(),
		lineType: wire.getState_LineType(),
	};
}

export function activateProbeEventLog(): void {
	void ensureProbeEventLog();
}

export function deactivateProbeEventLog(): void {
	removeProbeEventLog();
}

export async function exportSelectionProbe(): Promise<void> {
	await runProbe('选择与网表只读探针', async () => {
		const selected = await getSelectedPrimitives();
		const components = selected.filter(isComponent);
		const wires = selected.filter(isWire);
		const attributes = selected.filter(isAttribute);
		const bbox = await eda.sch_Primitive.getPrimitivesBBox(selected);
		const netlist = await readNetlist();
		const firstRegularComponent = components.find(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
		const firstPin = firstRegularComponent
			? (await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(firstRegularComponent.getState_PrimitiveId()) ?? [])[0]
			: undefined;

		const report = {
			probe: 'phase0-selection-and-netlist',
			capturedAt: now(),
			environment: environmentInfo(),
			selection: {
				count: selected.length,
				bbox,
				countsByPrimitiveType: selected.reduce<Record<string, number>>((counts, primitive) => {
					const type = primitive.getState_PrimitiveType();
					counts[type] = (counts[type] ?? 0) + 1;
					return counts;
				}, {}),
				components: await Promise.all(components.map(serializeComponent)),
				wires: wires.map(serializeWire),
				attributes: attributes.map(serializeAttribute),
				otherPrimitives: selected
					.filter(primitive => !isComponent(primitive) && !isWire(primitive) && !isAttribute(primitive))
					.map(primitive => ({ primitiveId: primitive.getState_PrimitiveId(), primitiveType: primitive.getState_PrimitiveType() })),
				specialComponents: components
					.filter(component => component.getState_ComponentType() !== ESCH_PrimitiveComponentType.COMPONENT)
					.map(component => ({
						primitiveId: component.getState_PrimitiveId(),
						componentType: component.getState_ComponentType(),
						designator: component.getState_Designator(),
						name: component.getState_Name(),
						net: component.getState_Net(),
					})),
			},
			netlist: {
				fileName: netlist.file.name,
				length: netlist.text.length,
				hash: hashText(netlist.text),
				manualCheck: '请在保存的原始网表中手工核对 U1.1 等引脚与网络映射。',
			},
		};
		if (firstPin)
			await eda.sch_Document.navigateToCoordinates(firstPin.getState_X(), firstPin.getState_Y());
		await showPreview('选择、引脚与原始网表', [
			jsonPreviewTab('选择报告', report),
			{ label: '原始网表', content: netlist.text },
		]);
	});
}

export async function probeNetlistRefresh(): Promise<void> {
	await runProbe('网表刷新延迟探针', async () => {
		const report = await collectNetlistSamples('运行此菜单前可先手工执行撤销或重做。');
		await showPreview('网表刷新延迟采样', [jsonPreviewTab('采样结果', report)]);
	});
}

export async function exportEventLog(): Promise<void> {
	await runProbe('事件日志导出', async () => {
		const eventLog = readEventLog();
		await showPreview('图元事件日志', [jsonPreviewTab('事件日志', {
			exportedAt: now(),
			environment: environmentInfo(),
			note: '请在创建、删除、手工撤销和重做后导出，用于比较网页版与客户端行为。',
			events: eventLog,
		})]);
	});
}
