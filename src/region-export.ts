import {
	getSelectedPrimitives,
	hashText,
	isComponent,
	jsonPreviewTab,
	now,
	readNetlist,
	runProbe,
	safePrimitiveId,
	showPreview,
} from './probe-core';

interface EnetPinInfo {
	name?: unknown;
	number?: unknown;
	net?: unknown;
	props?: unknown;
}

interface EnetComponent {
	props?: Record<string, unknown>;
	pinInfoMap?: Record<string, EnetPinInfo>;
}

interface EnetRoot {
	version?: unknown;
	components?: Record<string, EnetComponent>;
}

export interface RegionPin {
	number: string;
	name: string;
	type: string;
	noConnected: boolean;
}

export interface RegionComponent {
	designator: string;
	name: string;
	subPart?: string;
	symbol?: {
		libraryUuid: string;
		uuid: string;
	};
	referenceProperties?: {
		key: Record<string, string | number | boolean>;
		more: Record<string, string | number | boolean>;
	};
	pins: Array<RegionPin>;
}

export interface RegionNet {
	name: string;
	scope: 'internal' | 'external';
	direction?: 'IN' | 'OUT' | 'BI';
	generated: boolean;
	members: Array<string>;
}

export interface RegionExport {
	format: 'jlc-schematic-region';
	version: 1;
	components: Array<RegionComponent>;
	nets: Array<RegionNet>;
}

export interface StoredRegionSnapshot {
	capturedAt: string;
	selectedPrimitiveIds: Array<string>;
	region: RegionExport;
	diagnostics: Record<string, unknown>;
}

export interface EnetConnectivitySnapshot {
	capturedAt: string;
	sourceVersion: string;
	networkCount: number;
	connectedMemberCount: number;
	namedNetworks: Array<{
		name: string;
		members: Array<string>;
	}>;
	generatedNetworks: Array<Array<string>>;
	canonicalHash: string;
}

interface IndexedPin {
	member: string;
	designator: string;
	number: string;
	name: string;
	sourceNet: string;
}

const naturalCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
export const REGION_SNAPSHOT_STORAGE_KEY = 'phase1LastRegionSnapshotV1';

export function readStoredRegionSnapshot(): StoredRegionSnapshot | undefined {
	const stored = eda.sys_Storage.getExtensionUserConfig(REGION_SNAPSHOT_STORAGE_KEY) as StoredRegionSnapshot | undefined;
	return stored && typeof stored === 'object' ? stored : undefined;
}

function naturalCompare(left: string, right: string): number {
	return naturalCollator.compare(left, right);
}

function text(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function resolvePropertyExpression(value: string, props: Record<string, unknown>): string {
	const match = /^=\{(.+)\}$/.exec(value);
	return match ? text(props[match[1]]) : value;
}

function resolveComponentName(component: ISCH_PrimitiveComponent, enetComponent: EnetComponent): {
	name: string;
	diagnostic: Record<string, string>;
} {
	const props = enetComponent.props ?? {};
	const sdkName = text(component.getState_Name());
	const enetName = text(props.Name);
	const candidates = [
		resolvePropertyExpression(sdkName, props),
		resolvePropertyExpression(enetName, props),
		text(props.DeviceName),
		text(props['Manufacturer Part']),
		text(props.Value),
		sdkName,
		enetName,
	].filter(candidate => candidate && !/^=\{.+\}$/.test(candidate));
	const name = candidates[0] ?? '';
	return {
		name,
		diagnostic: {
			sdkName,
			enetName,
			resolvedName: name,
		},
	};
}

function compactProperties(entries: Array<[string, string | number | boolean | undefined]>): Record<string, string | number | boolean> {
	return Object.fromEntries(entries
		.filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined && entry[1] !== '')
		.sort(([left], [right]) => naturalCompare(left, right)));
}

function componentReferenceProperties(
	component: ISCH_PrimitiveComponent,
	resolvedName: string,
	props: Record<string, unknown>,
): NonNullable<RegionComponent['referenceProperties']> {
	const footprint = component.getState_Footprint();
	const key = compactProperties([
		['name', resolvedName],
		['value', text(props.Value)],
		['manufacturer', component.getState_Manufacturer() || text(props.Manufacturer)],
		['manufacturerPartNumber', component.getState_ManufacturerId() || text(props['Manufacturer Part'])],
		['supplier', component.getState_Supplier() || text(props.Supplier)],
		['supplierPartNumber', component.getState_SupplierId() || text(props['Supplier Part'])],
		['footprint', footprint?.name],
		['addIntoBom', component.getState_AddIntoBom()],
		['addIntoPcb', component.getState_AddIntoPcb()],
	]);
	const more = Object.fromEntries(Object.entries(component.getState_OtherProperty() ?? {})
		.sort(([left], [right]) => naturalCompare(left, right)));
	return { key, more };
}

function parseEnet(raw: string): EnetRoot {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw.replace(/^\uFEFF/, '')) as unknown;
	}
	catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`当前 ENET 不是有效 JSON：${detail}`);
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('当前 ENET 根节点不是对象。');
	}
	const root = parsed as EnetRoot;
	if (!root.components || typeof root.components !== 'object' || Array.isArray(root.components)) {
		throw new Error('当前 ENET 缺少 components 对象。');
	}
	return root;
}

function indexEnet(root: EnetRoot): {
	componentsByDesignator: Map<string, Array<EnetComponent>>;
	pinsByMember: Map<string, IndexedPin>;
	membersByNet: Map<string, Array<string>>;
} {
	const componentsByDesignator = new Map<string, Array<EnetComponent>>();
	const pinsByMember = new Map<string, IndexedPin>();
	const membersByNet = new Map<string, Array<string>>();
	for (const component of Object.values(root.components ?? {})) {
		const designator = text(component.props?.Designator);
		if (!designator) {
			continue;
		}
		const grouped = componentsByDesignator.get(designator) ?? [];
		grouped.push(component);
		componentsByDesignator.set(designator, grouped);
		for (const [pinKey, pin] of Object.entries(component.pinInfoMap ?? {})) {
			const number = text(pin.number) || pinKey;
			const member = `${designator}.${number}`;
			const sourceNet = text(pin.net);
			if (pinsByMember.has(member)) {
				throw new Error(`ENET 中存在重复引脚成员：${member}`);
			}
			pinsByMember.set(member, {
				member,
				designator,
				number,
				name: text(pin.name),
				sourceNet,
			});
			if (sourceNet) {
				const members = membersByNet.get(sourceNet) ?? [];
				members.push(member);
				membersByNet.set(sourceNet, members);
			}
		}
	}
	for (const members of membersByNet.values()) {
		members.sort(naturalCompare);
	}
	return { componentsByDesignator, pinsByMember, membersByNet };
}

export async function readCurrentMemberNetworks(members: Array<string>): Promise<Record<string, string>> {
	const { text: raw } = await readNetlist();
	const { pinsByMember } = indexEnet(parseEnet(raw));
	return Object.fromEntries(members.map(member => [member, pinsByMember.get(member)?.sourceNet ?? '']));
}

function isGeneratedSourceNet(name: string): boolean {
	return /^(?:N\$\d+|\$\d+(?:N\d+)?)$/i.test(name);
}

function generatedNetName(members: Array<string>, usedNames: Set<string>): string {
	const firstMember = [...members].sort(naturalCompare)[0];
	const base = `AUTO_${firstMember.replace('.', '_')}`;
	let name = base;
	let suffix = 2;
	while (usedNames.has(name)) {
		name = `${base}_${suffix}`;
		suffix += 1;
	}
	usedNames.add(name);
	return name;
}

export async function buildEnetConnectivitySnapshot(): Promise<EnetConnectivitySnapshot> {
	const { text: raw } = await readNetlist();
	const root = parseEnet(raw);
	const { membersByNet } = indexEnet(root);
	const namedNetworks = [...membersByNet.entries()]
		.filter(([name]) => !isGeneratedSourceNet(name))
		.map(([name, members]) => ({ name, members: [...members].sort(naturalCompare) }))
		.sort((left, right) => naturalCompare(left.name, right.name));
	const generatedNetworks = [...membersByNet.entries()]
		.filter(([name]) => isGeneratedSourceNet(name))
		.map(([, members]) => [...members].sort(naturalCompare))
		.sort((left, right) => naturalCompare(left.join('|'), right.join('|')));
	const canonical = JSON.stringify({ namedNetworks, generatedNetworks });
	return {
		capturedAt: now(),
		sourceVersion: text(root.version),
		networkCount: namedNetworks.length + generatedNetworks.length,
		connectedMemberCount: [...membersByNet.values()].reduce((count, members) => count + members.length, 0),
		namedNetworks,
		generatedNetworks,
		canonicalHash: hashText(canonical),
	};
}

function inferDirection(memberTypes: Array<string>): 'IN' | 'OUT' | 'BI' {
	const normalized = memberTypes.map(type => type.toUpperCase());
	if (normalized.length > 0 && normalized.every(type => type === 'IN')) {
		return 'IN';
	}
	if (normalized.length > 0 && normalized.every(type => ['OUT', 'OPEN COLLECTOR', 'OPEN EMITTER'].includes(type))) {
		return 'OUT';
	}
	return 'BI';
}

function validateExport(value: RegionExport): Array<string> {
	const errors: Array<string> = [];
	if (value.format !== 'jlc-schematic-region' || value.version !== 1) {
		errors.push('格式标识或版本不正确。');
	}
	const componentPins = new Set<string>();
	const designators = new Set<string>();
	for (const component of value.components) {
		if (designators.has(component.designator)) {
			errors.push(`重复位号：${component.designator}`);
		}
		designators.add(component.designator);
		const pinNumbers = new Set<string>();
		for (const pin of component.pins) {
			if (pinNumbers.has(pin.number)) {
				errors.push(`器件 ${component.designator} 存在重复引脚编号：${pin.number}`);
			}
			pinNumbers.add(pin.number);
			componentPins.add(`${component.designator}.${pin.number}`);
		}
	}
	const assignedPins = new Set<string>();
	const netNames = new Set<string>();
	for (const net of value.nets) {
		if (netNames.has(net.name)) {
			errors.push(`重复网络名：${net.name}`);
		}
		netNames.add(net.name);
		for (const member of net.members) {
			if (!componentPins.has(member)) {
				errors.push(`网络成员不存在：${member}`);
			}
			if (assignedPins.has(member)) {
				errors.push(`引脚被分配到多个网络：${member}`);
			}
			assignedPins.add(member);
		}
	}
	JSON.parse(JSON.stringify(value));
	return errors;
}

function findForbiddenStructureFields(value: unknown, path = '$'): Array<string> {
	const forbidden = new Set(['primitiveId', 'componentPrimitiveId', 'x', 'y', 'rotation', 'line']);
	if (value === null || typeof value !== 'object') {
		return [];
	}
	if (Array.isArray(value)) {
		return value.flatMap((child, index) => findForbiddenStructureFields(child, `${path}[${index}]`));
	}
	const found: Array<string> = [];
	for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
		const childPath = `${path}.${key}`;
		if (key === 'referenceProperties') {
			continue;
		}
		if (forbidden.has(key)) {
			found.push(childPath);
		}
		found.push(...findForbiddenStructureFields(child, childPath));
	}
	return found;
}

export async function buildCurrentRegionSnapshot(): Promise<StoredRegionSnapshot> {
	return await (async () => {
		const selected = await getSelectedPrimitives();
		const selectedComponents = selected
			.filter(isComponent)
			.filter(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
		const selectedNetworkAnchors = selected
			.filter(isComponent)
			.filter(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.NET_FLAG)
			.map(component => ({
				primitiveId: component.getState_PrimitiveId(),
				net: component.getState_Net() ?? '',
			}))
			.filter(anchor => anchor.net.length > 0);
		if (selectedComponents.length === 0) {
			throw new Error('当前选择中没有普通器件。请先框选一个完整功能区域。');
		}

		const designatorCounts = new Map<string, number>();
		for (const component of selectedComponents) {
			const designator = component.getState_Designator();
			if (!designator) {
				throw new Error('框选区域中存在没有位号的器件，无法建立稳定引用。');
			}
			designatorCounts.set(designator, (designatorCounts.get(designator) ?? 0) + 1);
		}
		const duplicateDesignators = [...designatorCounts.entries()].filter(([, count]) => count > 1).map(([designator]) => designator);
		if (duplicateDesignators.length > 0) {
			throw new Error(`框选区域中存在重复位号：${duplicateDesignators.join('、')}。当前版本暂不导出多单元重复位号。`);
		}

		const netlist = await readNetlist();
		const root = parseEnet(netlist.text);
		const index = indexEnet(root);
		const diagnostics: Record<string, unknown> = {
			capturedAt: now(),
			sourceVersion: text(root.version),
			selectedPrimitiveCount: selected.length,
			selectedComponentCount: selectedComponents.length,
			enetComponentCount: Object.keys(root.components ?? {}).length,
			unmappedPins: [] as Array<string>,
			unassignedPins: [] as Array<string>,
			undefinedPinTypes: [] as Array<string>,
			componentNameResolution: {} as Record<string, Record<string, string>>,
			externalMembersByNet: {} as Record<string, Array<string>>,
		};
		const unmappedPins = diagnostics.unmappedPins as Array<string>;
		const unassignedPins = diagnostics.unassignedPins as Array<string>;
		const undefinedPinTypes = diagnostics.undefinedPinTypes as Array<string>;
		const componentNameResolution = diagnostics.componentNameResolution as Record<string, Record<string, string>>;
		const externalMembersByNet = diagnostics.externalMembersByNet as Record<string, Array<string>>;
		const selectedMemberTypes = new Map<string, string>();
		const selectedMemberSet = new Set<string>();
		const components: Array<RegionComponent> = [];

		for (const component of selectedComponents) {
			const designator = component.getState_Designator();
			if (!designator) {
				throw new Error('框选区域中存在没有位号的器件，无法建立稳定引用。');
			}
			const enetComponents = index.componentsByDesignator.get(designator) ?? [];
			if (enetComponents.length === 0) {
				throw new Error(`ENET 中找不到框选器件：${designator}`);
			}
			if (enetComponents.length > 1) {
				throw new Error(`ENET 中位号 ${designator} 对应多个器件记录，当前版本无法安全合并。`);
			}
			const enetComponent = enetComponents[0];
			const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
			const exportedPins = pins.map((pin) => {
				const number = pin.getState_PinNumber();
				const member = `${designator}.${number}`;
				selectedMemberSet.add(member);
				selectedMemberTypes.set(member, String(pin.getState_pinType()));
				if (String(pin.getState_pinType()).toUpperCase() === 'UNDEFINED') {
					undefinedPinTypes.push(member);
				}
				if (!index.pinsByMember.has(member)) {
					unmappedPins.push(member);
				}
				else if (!index.pinsByMember.get(member)?.sourceNet) {
					unassignedPins.push(member);
				}
				return {
					number,
					name: pin.getState_PinName() || '',
					type: String(pin.getState_pinType()),
					noConnected: Boolean(pin.getState_NoConnected()),
				};
			}).sort((left, right) => naturalCompare(left.number, right.number));
			const subPart = component.getState_SubPartName();
			const symbol = component.getState_Symbol();
			const resolvedName = resolveComponentName(component, enetComponent);
			const referenceProperties = componentReferenceProperties(component, resolvedName.name, enetComponent.props ?? {});
			componentNameResolution[designator] = resolvedName.diagnostic;
			components.push({
				designator,
				name: resolvedName.name,
				...(subPart ? { subPart } : {}),
				...(symbol ? { symbol: { libraryUuid: symbol.libraryUuid, uuid: symbol.uuid } } : {}),
				referenceProperties,
				pins: exportedPins,
			});
		}
		components.sort((left, right) => naturalCompare(left.designator, right.designator));

		if (unmappedPins.length > 0) {
			throw new Error(`有 ${unmappedPins.length} 个 SDK 引脚未在 ENET 中找到对应成员：${unmappedPins.join('、')}`);
		}

		const usedNames = new Set([...index.membersByNet.keys()].filter(name => !isGeneratedSourceNet(name)));
		const nets: Array<RegionNet> = [];
		for (const [sourceNet, allMembers] of [...index.membersByNet.entries()].sort(([left], [right]) => naturalCompare(left, right))) {
			const selectedMembers = allMembers.filter(member => selectedMemberSet.has(member));
			if (selectedMembers.length === 0) {
				continue;
			}
			const externalMembers = allMembers.filter(member => !selectedMemberSet.has(member));
			const generated = isGeneratedSourceNet(sourceNet);
			const name = generated ? generatedNetName(allMembers, usedNames) : sourceNet;
			const scope = externalMembers.length > 0 ? 'external' as const : 'internal' as const;
			if (externalMembers.length > 0) {
				externalMembersByNet[name] = externalMembers;
			}
			nets.push({
				name,
				scope,
				...(scope === 'external'
					? { direction: inferDirection(selectedMembers.map(member => selectedMemberTypes.get(member) ?? '')) }
					: {}),
				generated,
				members: selectedMembers.sort(naturalCompare),
			});
		}
		for (const anchor of selectedNetworkAnchors) {
			if (nets.some(net => net.name === anchor.net)) {
				continue;
			}
			nets.push({
				name: anchor.net,
				scope: 'external',
				direction: 'BI',
				generated: false,
				members: [],
			});
		}
		nets.sort((left, right) => naturalCompare(left.name, right.name));

		const result: RegionExport = {
			format: 'jlc-schematic-region',
			version: 1,
			components,
			nets,
		};
		const validationErrors = validateExport(result);
		const forbiddenFields = findForbiddenStructureFields(result);
		if (forbiddenFields.length > 0) {
			validationErrors.push(`结构正文包含禁止字段：${forbiddenFields.join('、')}`);
		}
		if (validationErrors.length > 0) {
			throw new Error(`区域结构自校验失败：${validationErrors.join('；')}`);
		}
		Object.assign(diagnostics, {
			exportedComponentCount: components.length,
			exportedNetCount: nets.length,
			internalNetCount: nets.filter(net => net.scope === 'internal').length,
			externalNetCount: nets.filter(net => net.scope === 'external').length,
			generatedNetCount: nets.filter(net => net.generated).length,
			connectedSelectedPinCount: nets.reduce((count, net) => count + net.members.length, 0),
			selectedNetworkAnchors,
			validation: {
				status: 'passed',
				jsonRoundTrip: true,
				coordinateFree: true,
				selectedComponentsComplete: components.length === selectedComponents.length,
				pinMappingComplete: unmappedPins.length === 0,
			},
			note: '结构 JSON 不包含坐标；外部成员仅保留在诊断标签页，不进入可逆结构正文。',
		});
		const snapshot: StoredRegionSnapshot = {
			capturedAt: now(),
			selectedPrimitiveIds: selected.map(safePrimitiveId).filter((id): id is string => Boolean(id)).sort(naturalCompare),
			region: result,
			diagnostics,
		};
		return snapshot;
	})();
}

export async function exportRegionStructure(): Promise<void> {
	await runProbe('区域结构导出', async () => {
		const snapshot = await buildCurrentRegionSnapshot();
		await eda.sys_Storage.setExtensionUserConfig(REGION_SNAPSHOT_STORAGE_KEY, snapshot);
		await showPreview('原理图结构文本桥：导出连接关系', [
			jsonPreviewTab('区域结构 JSON', snapshot.region),
			jsonPreviewTab('导出诊断', snapshot.diagnostics),
		]);
	});
}
