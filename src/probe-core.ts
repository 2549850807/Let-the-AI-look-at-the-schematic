export interface WireSnapshot {
	originalPrimitiveId: string;
	line: Array<number> | Array<Array<number>>;
	net: string;
	color: string | null;
	lineWidth: number | null;
	lineType: ESCH_PrimitiveLineType | null;
	capturedAt: string;
}

export interface TrackedNetLabel {
	primitiveId?: string;
	net: string;
	x: number;
	y: number;
	rotation: number;
	createdAt: string;
}

export interface TrackedNetPort {
	primitiveId?: string;
	direction: 'IN' | 'OUT' | 'BI';
	net: string;
	x: number;
	y: number;
	rotation: number;
	mirror: boolean;
	createdAt: string;
}

export interface ProbeState {
	wireSnapshot?: WireSnapshot;
	netLabel?: TrackedNetLabel;
	netPort?: TrackedNetPort;
}

export interface PinTargetPoint {
	mode: 'REPORTED' | 'PLUS_LENGTH' | 'MINUS_LENGTH';
	x: number;
	y: number;
}

const STORAGE_STATE_KEY = 'phase0ProbeStateV2';
const STORAGE_EVENT_KEY = 'phase0ProbeEventsV2';
const EVENT_LISTENER_ID = 'schematic-structure-text-bridge-phase0-v2';

export interface PrimitiveEventRecord {
	timestamp: string;
	eventType: ESCH_PrimitiveEventType | 'probe';
	primitiveIds: Array<string>;
	detail?: string;
}

export interface PreviewTab {
	label: string;
	content: string;
}

interface PreviewPayload {
	title: string;
	tabs: Array<PreviewTab>;
	copyAll: boolean;
	updatedAt: string;
}

const PREVIEW_STORAGE_KEY = 'phase0PreviewPayloadV1';
const PREVIEW_IFRAME_ID = 'phase0-preview-window';

export function readProbeState(): ProbeState {
	const stored = eda.sys_Storage.getExtensionUserConfig(STORAGE_STATE_KEY) as ProbeState | undefined;
	return stored && typeof stored === 'object' ? stored : {};
}

export async function updateProbeState(update: Partial<ProbeState>): Promise<ProbeState> {
	const next = { ...readProbeState(), ...update };
	for (const key of Object.keys(next) as Array<keyof ProbeState>) {
		if (next[key] === undefined) {
			delete next[key];
		}
	}
	await eda.sys_Storage.setExtensionUserConfig(STORAGE_STATE_KEY, next);
	return next;
}

export function readEventLog(): Array<PrimitiveEventRecord> {
	const stored = eda.sys_Storage.getExtensionUserConfig(STORAGE_EVENT_KEY) as Array<PrimitiveEventRecord> | undefined;
	return Array.isArray(stored) ? stored : [];
}

export async function appendProbeEvent(detail: string, primitiveIds: Array<string> = []): Promise<void> {
	const events = readEventLog();
	events.push({ timestamp: now(), eventType: 'probe', primitiveIds, detail });
	await eda.sys_Storage.setExtensionUserConfig(STORAGE_EVENT_KEY, events.slice(-500));
}

export async function ensureProbeEventLog(): Promise<void> {
	if (eda.sch_Event.isEventListenerAlreadyExist(EVENT_LISTENER_ID)) {
		return;
	}
	eda.sch_Event.addPrimitiveEventListener(EVENT_LISTENER_ID, 'all', async (eventType, props) => {
		const events = readEventLog();
		events.push({ timestamp: now(), eventType, primitiveIds: [...props.primitiveIds] });
		await eda.sys_Storage.setExtensionUserConfig(STORAGE_EVENT_KEY, events.slice(-500));
	});
}

export function removeProbeEventLog(): void {
	if (eda.sch_Event.isEventListenerAlreadyExist(EVENT_LISTENER_ID)) {
		eda.sch_Event.removeEventListener(EVENT_LISTENER_ID);
	}
}

export function now(): string {
	return new Date().toISOString();
}

export function cloneLine(line: Array<number> | Array<Array<number>>): Array<number> | Array<Array<number>> {
	return JSON.parse(JSON.stringify(line)) as Array<number> | Array<Array<number>>;
}

export function safePrimitiveId(primitive: ISCH_Primitive): string | undefined {
	try {
		return primitive.getState_PrimitiveId();
	}
	catch {
		return undefined;
	}
}

export function newIds(before: Array<string>, after: Array<string>): Array<string> {
	const existing = new Set(before);
	return after.filter(id => !existing.has(id));
}

export async function waitForNewIds(readIds: () => Promise<Array<string>>, before: Array<string>): Promise<Array<string>> {
	for (const delay of [100, 250, 500, 1000, 1500]) {
		await new Promise(resolve => globalThis.setTimeout(resolve, delay));
		const created = newIds(before, await readIds());
		if (created.length > 0) {
			return created;
		}
	}
	return [];
}

export function startObservedCall<T>(call: Promise<T>, operation: string): {
	getError: () => string | undefined;
	getReturned: () => T | undefined;
	isSettled: () => boolean;
} {
	let settled = false;
	let returned: T | undefined;
	let errorMessage: string | undefined;
	void appendProbeEvent(`${operation}: started`);
	void call.then(async (value) => {
		settled = true;
		returned = value;
		await appendProbeEvent(`${operation}: resolved`);
	}).catch(async (error: unknown) => {
		settled = true;
		errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		await appendProbeEvent(`${operation}: rejected - ${errorMessage}`);
	});
	return {
		getError: () => errorMessage,
		getReturned: () => returned,
		isSettled: () => settled,
	};
}

export function showInfo(content: string, title = '阶段 0 SDK 探针'): void {
	eda.sys_Dialog.showInformationMessage(content, title);
}

export async function runProbe(title: string, action: () => Promise<void>): Promise<void> {
	try {
		await ensureProbeEventLog();
		await appendProbeEvent(`${title}: menu started`);
		await action();
		await appendProbeEvent(`${title}: menu completed`);
	}
	catch (error) {
		console.error(`[${title}]`, error);
		const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
		await appendProbeEvent(`${title}: menu failed - ${message}`);
		showInfo(message, `${title}失败`);
	}
}

export function confirmAction(content: string, title: string): Promise<boolean> {
	return new Promise((resolve) => {
		eda.sys_Dialog.showConfirmationMessage(content, title, '继续执行', '取消', resolve);
	});
}

export function inputText(content: string, title: string, value: string): Promise<string | undefined> {
	return new Promise((resolve) => {
		eda.sys_Dialog.showInputDialog(content, undefined, title, 'text', value, undefined, (result: unknown) => {
			resolve(typeof result === 'string' ? result.trim() : undefined);
		});
	});
}

export function inputNumber(content: string, title: string, value: number): Promise<number | undefined> {
	return new Promise((resolve) => {
		eda.sys_Dialog.showInputDialog(content, undefined, title, 'number', value, { step: 90 }, (result: unknown) => {
			if (result === undefined || result === null || result === '') {
				resolve(undefined);
				return;
			}
			const numberValue = Number(result);
			resolve(Number.isFinite(numberValue) ? numberValue : undefined);
		});
	});
}

export function selectOne(options: Array<{ value: string; displayContent: string }>, content: string, title: string): Promise<string | undefined> {
	return new Promise((resolve) => {
		eda.sys_Dialog.showSelectDialog(options, content, undefined, title, options[0]?.value, false, resolve);
	});
}

export function normalizeRotation(rotation: number): number {
	const normalized = ((rotation % 360) + 360) % 360;
	if (![0, 90, 180, 270].includes(normalized)) {
		throw new Error('旋转角度必须是 0、90、180 或 270。');
	}
	return normalized;
}

export function isComponent(primitive: ISCH_Primitive): primitive is ISCH_PrimitiveComponent {
	return primitive.getState_PrimitiveType() === ESCH_PrimitiveType.COMPONENT;
}

export function isWire(primitive: ISCH_Primitive): primitive is ISCH_PrimitiveWire {
	return primitive.getState_PrimitiveType() === ESCH_PrimitiveType.WIRE;
}

export function isAttribute(primitive: ISCH_Primitive): primitive is ISCH_PrimitiveAttribute {
	return primitive.getState_PrimitiveType() === ESCH_PrimitiveType.ATTRIBUTE;
}

export async function getSelectedPrimitives(): Promise<Array<ISCH_Primitive>> {
	const selectedIds = await eda.sch_SelectControl.getAllSelectedPrimitives_PrimitiveId();
	if (selectedIds.length === 0) {
		throw new Error('请先在原理图中框选至少一个图元。');
	}
	const selected = await eda.sch_Primitive.getPrimitivesByPrimitiveId(selectedIds);
	if (selected.length === 0) {
		throw new Error('已取得选择 ID，但无法从当前原理图画布重新读取图元。');
	}
	return selected;
}

export async function chooseSelectedComponent(): Promise<ISCH_PrimitiveComponent | undefined> {
	const selected = await getSelectedPrimitives();
	const components = selected.filter(isComponent).filter(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
	if (components.length === 0) {
		throw new Error('当前选择中没有普通器件。');
	}
	if (components.length === 1) {
		return components[0];
	}
	const componentId = await selectOne(components.map((component, index) => ({
		value: String(index),
		displayContent: `${component.getState_Designator() ?? '(无位号)'} - ${component.getState_Name() ?? '(无名称)'}`,
	})), '请选择要测试的器件。', '选择器件');
	return componentId === undefined ? undefined : components[Number(componentId)];
}

export async function chooseSelectedPin(): Promise<{ component: ISCH_PrimitiveComponent; pin: ISCH_PrimitiveComponentPin } | undefined> {
	const component = await chooseSelectedComponent();
	if (!component)
		return undefined;
	const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
	if (pins.length === 0)
		throw new Error('所选器件没有可读取的引脚。');
	if (pins.length === 1)
		return { component, pin: pins[0] };
	const pinId = await selectOne(pins.map((pin, index) => ({
		value: String(index),
		displayContent: `${component.getState_Designator() ?? '?'} . ${pin.getState_PinNumber()}  ${pin.getState_PinName() || '(无名称)'}`,
	})), '请选择要测试的引脚。坐标将直接使用 SDK 返回的 x/y。', '选择引脚');
	const pin = pinId === undefined ? undefined : pins[Number(pinId)];
	return pin ? { component, pin } : undefined;
}

export async function getAutomaticSelectedPin(): Promise<{ component: ISCH_PrimitiveComponent; pin: ISCH_PrimitiveComponentPin }> {
	const selected = await getSelectedPrimitives();
	const components = selected
		.filter(isComponent)
		.filter(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
	if (components.length !== 1) {
		throw new Error(`请只选中一个普通器件；当前选中 ${components.length} 个普通器件。`);
	}
	const component = components[0];
	const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
	if (pins.length === 0) {
		throw new Error('所选器件没有可读取的引脚。');
	}
	return { component, pin: pins[0] };
}

function wirePoints(wire: ISCH_PrimitiveWire): Array<{ x: number; y: number }> {
	const line = wire.getState_Line();
	const coordinates = (Array.isArray(line[0]) ? line.flat() : line) as Array<number>;
	const points: Array<{ x: number; y: number }> = [];
	for (let index = 0; index + 1 < coordinates.length; index += 2) {
		points.push({ x: coordinates[index], y: coordinates[index + 1] });
	}
	return points;
}

function distanceToSegmentSquared(
	point: { x: number; y: number },
	start: { x: number; y: number },
	end: { x: number; y: number },
): number {
	const deltaX = end.x - start.x;
	const deltaY = end.y - start.y;
	if (deltaX === 0 && deltaY === 0) {
		return (point.x - start.x) ** 2 + (point.y - start.y) ** 2;
	}
	const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * deltaX + (point.y - start.y) * deltaY) / (deltaX ** 2 + deltaY ** 2)));
	const nearestX = start.x + ratio * deltaX;
	const nearestY = start.y + ratio * deltaY;
	return (point.x - nearestX) ** 2 + (point.y - nearestY) ** 2;
}

function distanceToWireSquared(pin: ISCH_PrimitiveComponentPin, points: Array<{ x: number; y: number }>): number {
	const point = { x: pin.getState_X(), y: pin.getState_Y() };
	if (points.length < 2) {
		return points.length === 1
			? (point.x - points[0].x) ** 2 + (point.y - points[0].y) ** 2
			: Number.POSITIVE_INFINITY;
	}
	let distance = Number.POSITIVE_INFINITY;
	for (let index = 1; index < points.length; index += 1) {
		distance = Math.min(distance, distanceToSegmentSquared(point, points[index - 1], points[index]));
	}
	return distance;
}

export async function getAutomaticWireAndPin(): Promise<{
	wire: ISCH_PrimitiveWire;
	component: ISCH_PrimitiveComponent;
	pin: ISCH_PrimitiveComponentPin;
}> {
	const selected = await getSelectedPrimitives();
	const wires = selected.filter(isWire);
	const components = selected
		.filter(isComponent)
		.filter(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
	if (wires.length !== 1 || components.length !== 1) {
		throw new Error(`请同时只选中一条导线和一个普通器件；当前导线 ${wires.length} 条、普通器件 ${components.length} 个。`);
	}
	const component = components[0];
	const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
	if (pins.length === 0) {
		throw new Error('所选器件没有可读取的引脚。');
	}
	const points = wirePoints(wires[0]);
	const pin = pins.reduce((nearest, candidate) => {
		const nearestDistance = distanceToWireSquared(nearest, points);
		const candidateDistance = distanceToWireSquared(candidate, points);
		return candidateDistance < nearestDistance ? candidate : nearest;
	});
	return { wire: wires[0], component, pin };
}

export async function getSelectedWire(): Promise<ISCH_PrimitiveWire> {
	const wires = (await getSelectedPrimitives()).filter(isWire);
	if (wires.length !== 1)
		throw new Error(`请只选中一条导线进行此探针；当前选中 ${wires.length} 条。`);
	return wires[0];
}

export function createWireSnapshot(wire: ISCH_PrimitiveWire): WireSnapshot {
	return {
		originalPrimitiveId: wire.getState_PrimitiveId(),
		line: cloneLine(wire.getState_Line()),
		net: wire.getState_Net(),
		color: wire.getState_Color(),
		lineWidth: wire.getState_LineWidth(),
		lineType: wire.getState_LineType(),
		capturedAt: now(),
	};
}

export function pinEndpointCandidates(pin: ISCH_PrimitiveComponentPin): {
	reported: PinTargetPoint;
	plusLength: PinTargetPoint;
	minusLength: PinTargetPoint;
	rotation: number;
	pinLength: number;
	note: string;
} {
	const x = pin.getState_X();
	const y = pin.getState_Y();
	const length = pin.getState_PinLength();
	const rotation = ((pin.getState_Rotation() % 360) + 360) % 360;
	const direction: Record<number, [number, number]> = {
		0: [1, 0],
		90: [0, 1],
		180: [-1, 0],
		270: [0, -1],
	};
	const [dx, dy] = direction[rotation] ?? [0, 0];
	return {
		reported: { mode: 'REPORTED', x, y },
		rotation,
		pinLength: length,
		plusLength: { mode: 'PLUS_LENGTH', x: x + dx * length, y: y + dy * length },
		minusLength: { mode: 'MINUS_LENGTH', x: x - dx * length, y: y - dy * length },
		note: '旋转到坐标轴正负方向的映射尚未实测；请比较三组点与画布连接端。',
	};
}

export async function choosePinTargetPoint(pin: ISCH_PrimitiveComponentPin): Promise<PinTargetPoint | undefined> {
	const candidates = pinEndpointCandidates(pin);
	const selected = await selectOne([
		{
			value: 'REPORTED',
			displayContent: `SDK 原始坐标 (${candidates.reported.x}, ${candidates.reported.y})`,
		},
		{
			value: 'PLUS_LENGTH',
			displayContent: `原始坐标 + 引脚长度 (${candidates.plusLength.x}, ${candidates.plusLength.y})`,
		},
		{
			value: 'MINUS_LENGTH',
			displayContent: `原始坐标 - 引脚长度 (${candidates.minusLength.x}, ${candidates.minusLength.y})`,
		},
	], '请选择本次创建使用的候选连接点。请在专用测试图页分别验证三种坐标。', '选择引脚连接点');
	if (selected === 'REPORTED') {
		return candidates.reported;
	}
	if (selected === 'PLUS_LENGTH') {
		return candidates.plusLength;
	}
	if (selected === 'MINUS_LENGTH') {
		return candidates.minusLength;
	}
	return undefined;
}

export function hashText(text: string): string {
	let hash = 2166136261;
	for (let index = 0; index < text.length; index += 1) {
		hash ^= text.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0).toString(16).padStart(8, '0');
}

export function jsonPreviewTab(label: string, value: unknown): PreviewTab {
	return { label, content: JSON.stringify(value, null, 2) };
}

export async function showPreview(title: string, tabs: Array<PreviewTab>): Promise<void> {
	if (tabs.length === 0) {
		throw new Error('没有可预览的内容。');
	}
	const payload: PreviewPayload = { title, tabs, copyAll: title.includes('结果'), updatedAt: now() };
	await eda.sys_Storage.setExtensionUserConfig(PREVIEW_STORAGE_KEY, payload);
	if (await eda.sys_IFrame.isIFrameAlreadyExist(PREVIEW_IFRAME_ID)) {
		await eda.sys_IFrame.closeIFrame(PREVIEW_IFRAME_ID);
	}
	const opened = await eda.sys_IFrame.openIFrame('/iframe/index.html', 920, 680, PREVIEW_IFRAME_ID, {
		maximizeButton: true,
		minimizeButton: true,
		grayscaleMask: false,
		title,
	});
	if (!opened) {
		throw new Error('预览窗口打开失败。');
	}
}

export async function readNetlist(): Promise<{ file: File; text: string }> {
	const file = await eda.sch_ManufactureData.getNetlistFile('phase0-netlist', ESYS_NetlistType.JLCEDA_PRO);
	if (!file)
		throw new Error('当前图页网表读取失败。');
	return { file, text: await file.text() };
}

export function environmentInfo(): Record<string, unknown> {
	return {
		isWeb: eda.sys_Environment.isWeb(),
		isClient: eda.sys_Environment.isClient(),
		isJLCEDAProEdition: eda.sys_Environment.isJLCEDAProEdition(),
		isEasyEDAProEdition: eda.sys_Environment.isEasyEDAProEdition(),
	};
}

export async function collectNetlistSamples(reason: string): Promise<Record<string, unknown>> {
	const delays = [0, 250, 1000, 3000];
	const samples: Array<Record<string, unknown>> = [];
	let elapsed = 0;
	for (const milliseconds of delays) {
		await new Promise(resolve => globalThis.setTimeout(resolve, milliseconds - elapsed));
		elapsed = milliseconds;
		const { text } = await readNetlist();
		samples.push({ elapsedMs: milliseconds, length: text.length, hash: hashText(text), capturedAt: now() });
	}
	return { reason, environment: environmentInfo(), samples };
}
