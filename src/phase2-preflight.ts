import type {
	RegionComponent,
	RegionExport,
	RegionNet,
	RegionPin,
} from './region-export';
import {
	getSelectedPrimitives,
	jsonPreviewTab,
	now,
	runProbe,
	safePrimitiveId,
	showPreview,
} from './probe-core';
import {
	buildCurrentRegionSnapshot,
	readStoredRegionSnapshot,
	REGION_SNAPSHOT_STORAGE_KEY,
} from './region-export';

export const IMPORT_TEXT_STORAGE_KEY = 'phase2ImportTextV1';
export const IMPORT_ACTION_STORAGE_KEY = 'phase2ImportActionV1';
const IMPORT_IFRAME_ID = 'phase2-import-window';
const naturalCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export interface InspectionIssue {
	level: 'blocker' | 'warning' | 'info';
	code: string;
	message: string;
	target?: string;
}

export interface ParseResult {
	value?: RegionExport;
	issues: Array<InspectionIssue>;
	ignoredFields: Array<string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isRegionExportRoot(value: unknown): value is Record<string, unknown> {
	return isRecord(value) && value.format === 'jlc-schematic-region';
}

function parseJsonObject(value: string): Record<string, unknown> | undefined {
	try {
		const parsed = JSON.parse(value) as unknown;
		return isRecord(parsed) ? parsed : undefined;
	}
	catch {
		return undefined;
	}
}

export function extractRegionJsonText(raw: string): string | undefined {
	const text = raw.replace(/^\uFEFF/, '').trim();
	if (!text) {
		return undefined;
	}
	if (isRegionExportRoot(parseJsonObject(text))) {
		return text;
	}
	let cursor = 0;
	while (cursor < text.length) {
		const opening = text.indexOf('```', cursor);
		if (opening < 0) {
			break;
		}
		const lineEnd = text.indexOf('\n', opening + 3);
		if (lineEnd < 0) {
			break;
		}
		const language = text.slice(opening + 3, lineEnd).trim().toLowerCase();
		const closing = text.indexOf('```', lineEnd + 1);
		if (closing < 0) {
			break;
		}
		if (!language || language === 'json') {
			const candidate = text.slice(lineEnd + 1, closing).trim();
			if (isRegionExportRoot(parseJsonObject(candidate))) {
				return candidate;
			}
		}
		cursor = closing + 3;
	}
	return undefined;
}

function stringValue(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function compareStrings(left: string, right: string): number {
	return naturalCollator.compare(left, right);
}

export function sameSet(left: Array<string>, right: Array<string>): boolean {
	const sortedLeft = [...left].sort(compareStrings);
	const sortedRight = [...right].sort(compareStrings);
	return sortedLeft.length === sortedRight.length && sortedLeft.every((value, index) => value === sortedRight[index]);
}

function collectUnknownFields(record: Record<string, unknown>, allowed: Set<string>, path: string, output: Array<string>): void {
	for (const key of Object.keys(record)) {
		if (!allowed.has(key)) {
			output.push(`${path}.${key}`);
		}
	}
}

function collectForbiddenFields(value: unknown, path = '$'): Array<string> {
	const forbidden = new Set(['primitiveId', 'componentPrimitiveId', 'x', 'y', 'rotation', 'line', 'delete', 'execute', 'commands']);
	if (!isRecord(value) && !Array.isArray(value)) {
		return [];
	}
	if (Array.isArray(value)) {
		return value.flatMap((child, index) => collectForbiddenFields(child, `${path}[${index}]`));
	}
	const found: Array<string> = [];
	for (const [key, child] of Object.entries(value)) {
		const childPath = `${path}.${key}`;
		if (key === 'referenceProperties') {
			continue;
		}
		if (forbidden.has(key)) {
			found.push(childPath);
		}
		found.push(...collectForbiddenFields(child, childPath));
	}
	return found;
}

function parsePin(rawPin: unknown, path: string, designator: string, issues: Array<InspectionIssue>, ignoredFields: Array<string>): RegionPin | undefined {
	if (!isRecord(rawPin)) {
		issues.push({ level: 'blocker', code: 'PIN_INVALID', message: `${path} 必须是对象。` });
		return undefined;
	}
	collectUnknownFields(rawPin, new Set(['number', 'name', 'type', 'noConnected']), path, ignoredFields);
	const number = stringValue(rawPin.number);
	const name = typeof rawPin.name === 'string' ? rawPin.name : undefined;
	const type = stringValue(rawPin.type);
	const noConnected = typeof rawPin.noConnected === 'boolean' ? rawPin.noConnected : undefined;
	const invalidFields = [
		...(!number ? ['number（非空字符串）'] : []),
		...(name === undefined ? ['name（字符串，可为空）'] : []),
		...(!type ? ['type（非空字符串）'] : []),
		...(noConnected === undefined ? ['noConnected（布尔值）'] : []),
	];
	if (invalidFields.length > 0 || !number || name === undefined || !type || noConnected === undefined) {
		issues.push({ level: 'blocker', code: 'PIN_REQUIRED_FIELD', message: `${path} 缺少或类型错误的字段：${invalidFields.join('、')}。` });
		return undefined;
	}
	return { number, name, type, noConnected };
}

function parseComponent(rawComponent: unknown, index: number, issues: Array<InspectionIssue>, ignoredFields: Array<string>): RegionComponent | undefined {
	const path = `$.components[${index}]`;
	if (!isRecord(rawComponent)) {
		issues.push({ level: 'blocker', code: 'COMPONENT_INVALID', message: `${path} 必须是对象。` });
		return undefined;
	}
	collectUnknownFields(rawComponent, new Set(['designator', 'name', 'subPart', 'symbol', 'referenceProperties', 'pins']), path, ignoredFields);
	const designator = stringValue(rawComponent.designator);
	const name = stringValue(rawComponent.name);
	const rawPins = Array.isArray(rawComponent.pins) ? rawComponent.pins : undefined;
	const invalidFields = [
		...(!designator ? ['designator（非空字符串）'] : []),
		...(!name ? ['name（非空字符串）'] : []),
		...(!rawPins ? ['pins（数组）'] : []),
	];
	if (invalidFields.length > 0 || !designator || !name || !rawPins) {
		issues.push({ level: 'blocker', code: 'COMPONENT_REQUIRED_FIELD', message: `${path} 缺少或类型错误的字段：${invalidFields.join('、')}。` });
		return undefined;
	}
	if (rawComponent.subPart !== undefined && typeof rawComponent.subPart !== 'string') {
		issues.push({ level: 'blocker', code: 'SUBPART_INVALID', message: `${path}.subPart 必须是字符串。` });
	}
	const pins = rawPins
		.map((pin, pinIndex) => parsePin(pin, `${path}.pins[${pinIndex}]`, designator, issues, ignoredFields))
		.filter((pin): pin is RegionPin => Boolean(pin));
	const pinNumbers = new Set<string>();
	for (const pin of pins) {
		if (pinNumbers.has(pin.number)) {
			issues.push({ level: 'blocker', code: 'DUPLICATE_PIN', message: `${designator} 存在重复引脚编号 ${pin.number}。`, target: `${designator}.${pin.number}` });
		}
		pinNumbers.add(pin.number);
	}
	let symbol: RegionComponent['symbol'];
	if (isRecord(rawComponent.symbol)) {
		collectUnknownFields(rawComponent.symbol, new Set(['libraryUuid', 'uuid']), `${path}.symbol`, ignoredFields);
		const libraryUuid = stringValue(rawComponent.symbol.libraryUuid);
		const uuid = stringValue(rawComponent.symbol.uuid);
		if (libraryUuid && uuid) {
			symbol = { libraryUuid, uuid };
		}
		else {
			issues.push({ level: 'blocker', code: 'SYMBOL_INVALID', message: `${path}.symbol 必须同时包含 libraryUuid 和 uuid。` });
		}
	}
	else if (rawComponent.symbol !== undefined) {
		issues.push({ level: 'blocker', code: 'SYMBOL_INVALID', message: `${path}.symbol 必须是包含 libraryUuid 和 uuid 的对象。` });
	}
	return {
		designator,
		name,
		...(typeof rawComponent.subPart === 'string' && rawComponent.subPart ? { subPart: rawComponent.subPart } : {}),
		...(symbol ? { symbol } : {}),
		pins,
	};
}

function parseNet(rawNet: unknown, index: number, knownMembers: Set<string>, issues: Array<InspectionIssue>, ignoredFields: Array<string>): RegionNet | undefined {
	const path = `$.nets[${index}]`;
	if (!isRecord(rawNet)) {
		issues.push({ level: 'blocker', code: 'NET_INVALID', message: `${path} 必须是对象。` });
		return undefined;
	}
	collectUnknownFields(rawNet, new Set(['name', 'scope', 'direction', 'generated', 'members']), path, ignoredFields);
	const name = stringValue(rawNet.name);
	const scope = rawNet.scope === 'internal' || rawNet.scope === 'external' ? rawNet.scope : undefined;
	const direction = rawNet.direction === 'IN' || rawNet.direction === 'OUT' || rawNet.direction === 'BI' ? rawNet.direction : undefined;
	const rawMembers = Array.isArray(rawNet.members) ? rawNet.members : undefined;
	const generatedInvalid = rawNet.generated !== undefined && typeof rawNet.generated !== 'boolean';
	const generated = typeof rawNet.generated === 'boolean' ? rawNet.generated : false;
	const invalidFields = [
		...(!name ? ['name（非空字符串）'] : []),
		...(!scope ? ['scope（internal 或 external）'] : []),
		...(generatedInvalid ? ['generated（布尔值）'] : []),
		...(!rawMembers ? ['members（数组）'] : []),
	];
	if (invalidFields.length > 0 || !name || !scope || generatedInvalid || !rawMembers) {
		issues.push({ level: 'blocker', code: 'NET_REQUIRED_FIELD', message: `${path} 缺少或类型错误的字段：${invalidFields.join('、')}。` });
		return undefined;
	}
	if (rawNet.generated === undefined) {
		issues.push({ level: 'info', code: 'NET_GENERATED_DEFAULTED', message: `${path} 缺少 generated，已按新命名网络安全补为 false。`, target: name });
	}
	if (scope === 'external' && !direction) {
		issues.push({ level: 'blocker', code: 'EXTERNAL_DIRECTION_MISSING', message: `外部网络 ${name} 的 direction 缺少或无效，必须为 IN、OUT 或 BI。`, target: name });
	}
	else if (rawNet.direction !== undefined && !direction) {
		issues.push({ level: 'blocker', code: 'NET_DIRECTION_INVALID', message: `网络 ${name} 的 direction 无效，只能为 IN、OUT 或 BI。`, target: name });
	}
	const members: Array<string> = [];
	for (const rawMember of rawMembers) {
		const member = stringValue(rawMember);
		if (!member || !knownMembers.has(member)) {
			issues.push({ level: 'blocker', code: 'UNKNOWN_NET_MEMBER', message: `网络 ${name} 引用了不存在的成员：${String(rawMember)}`, target: name });
			continue;
		}
		members.push(member);
	}
	if (scope === 'internal' && members.length === 0) {
		issues.push({ level: 'blocker', code: 'INTERNAL_NET_EMPTY', message: `内部网络 ${name} 的 members 不能为空。`, target: name });
	}
	return { name, scope, ...(direction ? { direction } : {}), generated, members };
}

export function parseRegionInput(raw: string): ParseResult {
	const issues: Array<InspectionIssue> = [];
	const ignoredFields: Array<string> = [];
	let parsed: unknown;
	try {
		const jsonText = extractRegionJsonText(raw);
		if (!jsonText) {
			throw new Error('未找到 jlc-schematic-region JSON。请粘贴纯 JSON，或包含完整 JSON 代码块的 AI 回复。');
		}
		parsed = JSON.parse(jsonText) as unknown;
	}
	catch (error) {
		issues.push({ level: 'blocker', code: 'INVALID_JSON', message: `JSON 解析失败：${error instanceof Error ? error.message : String(error)}` });
		return { issues, ignoredFields };
	}
	if (!isRecord(parsed)) {
		issues.push({ level: 'blocker', code: 'INVALID_ROOT', message: '根节点必须是对象。' });
		return { issues, ignoredFields };
	}
	collectUnknownFields(parsed, new Set(['format', 'version', 'components', 'nets']), '$', ignoredFields);
	if (parsed.format !== 'jlc-schematic-region') {
		issues.push({ level: 'blocker', code: 'FORMAT_MISMATCH', message: 'format 必须是 jlc-schematic-region。' });
	}
	if (parsed.version !== 1) {
		issues.push({ level: 'blocker', code: 'VERSION_UNSUPPORTED', message: '当前只支持 version 1。' });
	}
	if (!Array.isArray(parsed.components) || !Array.isArray(parsed.nets)) {
		issues.push({ level: 'blocker', code: 'ROOT_ARRAY_MISSING', message: 'components 和 nets 必须是数组。' });
		return { issues, ignoredFields };
	}
	const components = parsed.components
		.map((component, index) => parseComponent(component, index, issues, ignoredFields))
		.filter((component): component is RegionComponent => Boolean(component));
	const designators = new Set<string>();
	const knownMembers = new Set<string>();
	for (const component of components) {
		if (designators.has(component.designator)) {
			issues.push({ level: 'blocker', code: 'DUPLICATE_DESIGNATOR', message: `文本存在重复位号：${component.designator}`, target: component.designator });
		}
		designators.add(component.designator);
		for (const pin of component.pins) {
			knownMembers.add(`${component.designator}.${pin.number}`);
		}
	}
	const nets = parsed.nets
		.map((net, index) => parseNet(net, index, knownMembers, issues, ignoredFields))
		.filter((net): net is RegionNet => Boolean(net));
	const netNames = new Set<string>();
	const assignedMembers = new Set<string>();
	for (const net of nets) {
		if (netNames.has(net.name)) {
			issues.push({ level: 'blocker', code: 'DUPLICATE_NET', message: `文本存在重复网络名：${net.name}`, target: net.name });
		}
		netNames.add(net.name);
		for (const member of net.members) {
			if (assignedMembers.has(member)) {
				issues.push({ level: 'blocker', code: 'PIN_ASSIGNED_TWICE', message: `引脚 ${member} 被分配到多个网络。`, target: member });
			}
			assignedMembers.add(member);
		}
	}
	for (const path of collectForbiddenFields(parsed)) {
		issues.push({ level: 'blocker', code: 'FORBIDDEN_FIELD', message: `文本包含禁止字段：${path}` });
	}
	if (ignoredFields.length > 0) {
		issues.push({ level: 'info', code: 'UNKNOWN_FIELDS_IGNORED', message: `已忽略 ${ignoredFields.length} 个未知字段。` });
	}
	return {
		value: issues.some(issue => issue.level === 'blocker') ? undefined : { format: 'jlc-schematic-region', version: 1, components, nets },
		issues,
		ignoredFields,
	};
}

export function memberNetworkMap(region: RegionExport): Map<string, string> {
	const map = new Map<string, string>();
	for (const net of region.nets) {
		for (const member of net.members) {
			map.set(member, net.name);
		}
	}
	return map;
}

export function compareRegions(input: RegionExport, current: RegionExport): { issues: Array<InspectionIssue>; networkChanges: Array<Record<string, string>> } {
	const issues: Array<InspectionIssue> = [];
	const inputComponents = new Map(input.components.map(component => [component.designator, component]));
	const currentComponents = new Map(current.components.map(component => [component.designator, component]));
	for (const designator of [...inputComponents.keys()].filter(value => !currentComponents.has(value)).sort(compareStrings)) {
		issues.push({ level: 'blocker', code: 'COMPONENT_MISSING', message: `框选区域缺少文本器件 ${designator}。`, target: designator });
	}
	for (const designator of [...currentComponents.keys()].filter(value => !inputComponents.has(value)).sort(compareStrings)) {
		issues.push({ level: 'blocker', code: 'COMPONENT_EXTRA', message: `框选区域存在文本未包含的器件 ${designator}。`, target: designator });
	}
	for (const [designator, inputComponent] of inputComponents) {
		const currentComponent = currentComponents.get(designator);
		if (!currentComponent) {
			continue;
		}
		if (inputComponent.name !== currentComponent.name) {
			issues.push({ level: 'blocker', code: 'COMPONENT_NAME_MISMATCH', message: `${designator} 名称不一致：文本“${inputComponent.name}”，当前“${currentComponent.name}”。`, target: designator });
		}
		if ((inputComponent.subPart ?? '') !== (currentComponent.subPart ?? '')) {
			issues.push({ level: 'blocker', code: 'SUBPART_MISMATCH', message: `${designator} 子部件不一致。`, target: designator });
		}
		const inputPins = new Map(inputComponent.pins.map(pin => [pin.number, pin]));
		const currentPins = new Map(currentComponent.pins.map(pin => [pin.number, pin]));
		if (!sameSet([...inputPins.keys()], [...currentPins.keys()])) {
			issues.push({ level: 'blocker', code: 'PIN_SET_MISMATCH', message: `${designator} 引脚编号集合不一致。`, target: designator });
		}
		for (const [number, inputPin] of inputPins) {
			const currentPin = currentPins.get(number);
			if (!currentPin) {
				continue;
			}
			const target = `${designator}.${number}`;
			if (inputPin.name !== currentPin.name) {
				issues.push({ level: 'warning', code: 'PIN_NAME_MISMATCH', message: `${target} 引脚名称不同。`, target });
			}
			if (inputPin.type !== currentPin.type) {
				issues.push({ level: 'warning', code: 'PIN_TYPE_MISMATCH', message: `${target} 引脚电气类型不同。`, target });
			}
			if (inputPin.noConnected !== currentPin.noConnected) {
				issues.push({ level: 'warning', code: 'NO_CONNECTED_MISMATCH', message: `${target} noConnected 状态不同。`, target });
			}
		}
		if ((inputComponent.symbol?.uuid ?? '') !== (currentComponent.symbol?.uuid ?? '')) {
			issues.push({ level: 'warning', code: 'SYMBOL_MISMATCH', message: `${designator} 符号 UUID 不同。`, target: designator });
		}
	}
	const inputNetsByName = new Map(input.nets.map(net => [net.name, net]));
	const currentNetsByName = new Map(current.nets.map(net => [net.name, net]));
	for (const currentNet of current.nets.filter(net => net.scope === 'external' && net.members.length === 0)) {
		if (!inputNetsByName.has(currentNet.name)) {
			issues.push({
				level: 'blocker',
				code: 'SELECTED_NETWORK_ANCHOR_OMITTED',
				message: `文本遗漏了当前已框选的电源或地网络锚点 ${currentNet.name}。请保留该网络，即使其 members 为空。`,
				target: currentNet.name,
			});
		}
	}
	for (const inputNet of input.nets.filter(net => net.scope === 'external' && net.members.length === 0)) {
		if (!currentNetsByName.has(inputNet.name)) {
			issues.push({
				level: 'blocker',
				code: 'EMPTY_NETWORK_ANCHOR_NOT_SELECTED',
				message: `文本包含空成员外部网络 ${inputNet.name}，但当前框选中没有同名电源或地网络锚点。`,
				target: inputNet.name,
			});
		}
	}
	const inputNetworks = memberNetworkMap(input);
	const currentNetworks = memberNetworkMap(current);
	const allMembers = new Set([...inputNetworks.keys(), ...currentNetworks.keys()]);
	const networkChanges = [...allMembers].sort(compareStrings).flatMap((member) => {
		const from = currentNetworks.get(member) ?? '(未连接)';
		const to = inputNetworks.get(member) ?? '(未连接)';
		return from === to ? [] : [{ member, from, to }];
	});
	if (networkChanges.length > 0) {
		issues.push({ level: 'info', code: 'NETWORK_CHANGES', message: `文本包含 ${networkChanges.length} 个引脚网络变化。` });
	}
	return { issues, networkChanges };
}

export async function openRegionImportInput(): Promise<boolean> {
	let importRequested = false;
	const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	await runProbe('区域结构文本输入', async (finishLoading) => {
		const currentSnapshot = await buildCurrentRegionSnapshot();
		const snapshotSaved = await eda.sys_Storage.setExtensionUserConfig(REGION_SNAPSHOT_STORAGE_KEY, currentSnapshot);
		if (!snapshotSaved) {
			throw new Error('无法保存当前框选快照，已阻止导入。');
		}
		const textCleared = await eda.sys_Storage.setExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY, '');
		if (!textCleared) {
			throw new Error('无法初始化导入文本，已阻止导入。');
		}
		const actionCleared = await eda.sys_Storage.setExtensionUserConfig(IMPORT_ACTION_STORAGE_KEY, { sessionId, status: 'ready' });
		if (!actionCleared) {
			throw new Error('无法初始化导入窗口，已阻止导入。');
		}
		if (await eda.sys_IFrame.isIFrameAlreadyExist(IMPORT_IFRAME_ID)) {
			await eda.sys_IFrame.closeIFrame(IMPORT_IFRAME_ID);
		}
		let opened: boolean | undefined;
		let openError: string | undefined;
		let cancelled = false;
		finishLoading();
		void eda.sys_IFrame.openIFrame('/iframe/import.html', 920, 680, IMPORT_IFRAME_ID, {
			maximizeButton: true,
			minimizeButton: true,
			grayscaleMask: false,
			title: '原理图结构文本桥：粘贴区域结构 JSON',
			onBeforeCloseCallFn: () => {
				cancelled = true;
				return true;
			},
			buttonCallbackFn: (button) => {
				if (button === 'close') {
					cancelled = true;
				}
			},
		}).then((result) => {
			opened = result;
		}, (error: unknown) => {
			openError = error instanceof Error ? error.message : String(error);
		});
		let observedOpenWindow = false;
		let consecutiveClosedSamples = 0;
		for (let sampleIndex = 0; sampleIndex < 14_400; sampleIndex += 1) {
			if (cancelled) {
				break;
			}
			const action = eda.sys_Storage.getExtensionUserConfig(IMPORT_ACTION_STORAGE_KEY);
			if (!isRecord(action) || action.sessionId !== sessionId) {
				break;
			}
			if (isRecord(action) && action.sessionId === sessionId && action.status === 'requested') {
				try {
					if (typeof action.requestedAt !== 'number' || !Number.isFinite(action.requestedAt)
						|| Date.now() - action.requestedAt > 15_000) {
						throw new Error('导入请求已超时，请重新打开“导入连接关系”后再试。');
					}
					if (typeof action.text !== 'string' || !action.text.trim()) {
						throw new Error('导入请求中没有连接关系文本。');
					}
					if (!await eda.sys_Storage.setExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY, action.text)) {
						throw new Error('保存导入文本失败。');
					}
					if (!await eda.sys_Storage.setExtensionUserConfig(IMPORT_ACTION_STORAGE_KEY, {
						sessionId,
						status: 'accepted',
					})) {
						throw new Error('无法确认导入请求，已停止导入。');
					}
					void Promise.resolve().then(() => eda.sys_IFrame.closeIFrame(IMPORT_IFRAME_ID)).catch((error: unknown) => {
						console.error('关闭导入窗口失败', error);
					});
					importRequested = true;
					break;
				}
				catch (error) {
					try {
						await eda.sys_Storage.setExtensionUserConfig(IMPORT_ACTION_STORAGE_KEY, {
							sessionId,
							status: 'failed',
							message: error instanceof Error ? error.message : String(error),
						});
					}
					catch (storageError) {
						console.error('无法保存导入失败状态', storageError);
					}
					throw error;
				}
			}
			if (openError !== undefined || opened === false) {
				throw new Error(`结构 JSON 输入窗口打开失败。${openError ?? ''}`);
			}
			const windowOpen = await eda.sys_IFrame.isIFrameAlreadyExist(IMPORT_IFRAME_ID);
			if (cancelled) {
				break;
			}
			if (windowOpen) {
				observedOpenWindow = true;
				consecutiveClosedSamples = 0;
			}
			else {
				consecutiveClosedSamples += 1;
				if (observedOpenWindow && consecutiveClosedSamples >= 4) {
					break;
				}
				if (!observedOpenWindow && sampleIndex >= 120) {
					throw new Error('导入窗口加载超时，请重新打开“导入连接关系”。');
				}
			}
			await new Promise(resolve => globalThis.setTimeout(resolve, 250));
		}
	}, '正在加载导入窗口，请稍候…');
	return importRequested;
}

export async function runRegionImportPreflight(): Promise<void> {
	await runProbe('阶段 2 严格匹配预检', async () => {
		const raw = eda.sys_Storage.getExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY);
		if (typeof raw !== 'string' || !raw.trim()) {
			throw new Error('尚未保存结构 JSON。请先执行菜单 14。');
		}
		const snapshot = readStoredRegionSnapshot();
		if (!snapshot) {
			throw new Error('没有可用于匹配的区域快照。请先对当前框选区域执行菜单 13。');
		}
		const currentSnapshot = await buildCurrentRegionSnapshot();
		const selected = await getSelectedPrimitives();
		const currentSelectionIds = selected.map(safePrimitiveId).filter((id): id is string => Boolean(id)).sort(compareStrings);
		const issues: Array<InspectionIssue> = [];
		if (!sameSet(currentSelectionIds, snapshot.selectedPrimitiveIds)) {
			issues.push({ level: 'blocker', code: 'SELECTION_CHANGED', message: '当前选择与菜单 13 冻结的区域不一致。请保持当前框选并重新执行菜单 13。' });
		}
		const parsed = parseRegionInput(raw);
		issues.push(...parsed.issues);
		let networkChanges: Array<Record<string, string>> = [];
		if (parsed.value) {
			const comparison = compareRegions(parsed.value, currentSnapshot.region);
			issues.push(...comparison.issues);
			networkChanges = comparison.networkChanges;
		}
		const blockers = issues.filter(issue => issue.level === 'blocker');
		const warnings = issues.filter(issue => issue.level === 'warning');
		const information = issues.filter(issue => issue.level === 'info');
		const report = {
			capturedAt: now(),
			mode: 'strict',
			snapshotCapturedAt: snapshot.capturedAt,
			currentRegionCapturedAt: currentSnapshot.capturedAt,
			inputParsed: Boolean(parsed.value),
			componentCount: parsed.value?.components.length,
			netCount: parsed.value?.nets.length,
			blockerCount: blockers.length,
			warningCount: warnings.length,
			informationCount: information.length,
			networkChangeCount: networkChanges.length,
			matchPassed: blockers.length === 0,
			executionEnabled: false,
			note: blockers.length === 0
				? '严格匹配预检通过；当前阶段仍不修改原理图，只允许继续开发更完整的导线与特殊图元分析。'
				: '存在阻止项，不能进入后续规划。当前阶段不会修改原理图。',
		};
		await showPreview('阶段 2：严格匹配预检', [
			jsonPreviewTab('预检摘要', report),
			jsonPreviewTab('阻止项', blockers),
			jsonPreviewTab('警告项', warnings),
			jsonPreviewTab('网络变化', networkChanges),
			jsonPreviewTab('信息与忽略字段', { information, ignoredFields: parsed.ignoredFields }),
		]);
	});
}
