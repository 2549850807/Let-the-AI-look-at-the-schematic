import type { InspectionIssue } from './phase2-preflight';
import type { RegionNet } from './region-export';
import {
	compareRegions,
	IMPORT_TEXT_STORAGE_KEY,

	memberNetworkMap,
	parseRegionInput,
	sameSet,
} from './phase2-preflight';
import {
	getSelectedPrimitives,
	isComponent,
	isWire,
	jsonPreviewTab,
	now,
	pinEndpointCandidates,
	runProbe,
	safePrimitiveId,
	showPreview,
} from './probe-core';
import {
	buildCurrentRegionSnapshot,
	readStoredRegionSnapshot,
} from './region-export';

interface Point {
	x: number;
	y: number;
}

interface Bounds {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

export type WireClassification = 'inside' | 'crossing' | 'outside' | 'invalid';

interface WireGeometry {
	primitiveId: string;
	selected: boolean;
	line: Array<number> | Array<Array<number>>;
	paths: Array<Array<Point>>;
	classification: WireClassification;
}

interface PinContext {
	member: string;
	pin: ISCH_PrimitiveComponentPin;
	reported: Point;
	plusLength: Point;
	minusLength: Point;
	rotation: number;
	pinLength: number;
}

export interface PortPlan {
	member: string;
	net: string;
	connectionNet?: string;
	direction: 'IN' | 'OUT' | 'BI';
	scope: 'internal' | 'external';
	targetPoint: Point;
	rotation: number;
	currentNet: string;
	selectedWireIdsAtReportedPoint: Array<string>;
	unselectedWireIdsAtReportedPoint: Array<string>;
	alternativeCoordinateEvidence: Array<{
		mode: 'PLUS_LENGTH' | 'MINUS_LENGTH';
		point: Point;
		selectedWireIds: Array<string>;
		unselectedWireIds: Array<string>;
	}>;
}

export interface PinNoConnectPlan {
	member: string;
	from: boolean;
	to: boolean;
}

export interface WirePlan {
	primitiveId: string;
	selected: boolean;
	classification: WireClassification;
	line: Array<number> | Array<Array<number>>;
	touchedMembers: Array<string>;
}

const EPSILON = 0.001;
const naturalCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
export const PHASE3_PLAN_STORAGE_KEY = 'phase3LatestPlanV1';

export interface StoredPhase3Plan {
	capturedAt: string;
	selectedPrimitiveIds: Array<string>;
	planReady: boolean;
	blockerCount: number;
	portPlans: Array<PortPlan>;
	pinNoConnectPlans?: Array<PinNoConnectPlan>;
	deletionPlan: Array<WirePlan>;
	preflightReport?: Record<string, unknown>;
	blockers?: Array<InspectionIssue>;
	warnings?: Array<InspectionIssue>;
	information?: Array<InspectionIssue>;
	networkChanges?: Array<Record<string, string>>;
	networkAnchorNames?: Array<string>;
	target?: PortPlan;
}

function compareStrings(left: string, right: string): number {
	return naturalCollator.compare(left, right);
}

function pointKey(point: Point): string {
	return `${String(point.x)},${String(point.y)}`;
}

function numbersToPoints(values: Array<number>): Array<Point> {
	if (values.length < 2 || values.length % 2 !== 0 || values.some(value => !Number.isFinite(value))) {
		return [];
	}
	const points: Array<Point> = [];
	for (let index = 0; index < values.length; index += 2) {
		points.push({ x: values[index], y: values[index + 1] });
	}
	return points;
}

function normalizeLine(line: Array<number> | Array<Array<number>>): Array<Array<Point>> {
	if (line.length === 0) {
		return [];
	}
	if (Array.isArray(line[0])) {
		return (line as Array<Array<number>>).map(numbersToPoints).filter(points => points.length >= 2);
	}
	const points = numbersToPoints(line as Array<number>);
	return points.length >= 2 ? [points] : [];
}

function pointInsideBounds(point: Point, bounds: Bounds): boolean {
	return point.x >= bounds.minX - EPSILON
		&& point.x <= bounds.maxX + EPSILON
		&& point.y >= bounds.minY - EPSILON
		&& point.y <= bounds.maxY + EPSILON;
}

function boundsOverlap(left: Bounds, right: Bounds): boolean {
	return left.minX <= right.maxX + EPSILON
		&& left.maxX >= right.minX - EPSILON
		&& left.minY <= right.maxY + EPSILON
		&& left.maxY >= right.minY - EPSILON;
}

function orientation(first: Point, second: Point, third: Point): number {
	return (second.x - first.x) * (third.y - first.y) - (second.y - first.y) * (third.x - first.x);
}

function pointOnSegment(point: Point, start: Point, end: Point): boolean {
	if (Math.abs(orientation(start, end, point)) > EPSILON) {
		return false;
	}
	return point.x >= Math.min(start.x, end.x) - EPSILON
		&& point.x <= Math.max(start.x, end.x) + EPSILON
		&& point.y >= Math.min(start.y, end.y) - EPSILON
		&& point.y <= Math.max(start.y, end.y) + EPSILON;
}

function segmentsIntersect(firstStart: Point, firstEnd: Point, secondStart: Point, secondEnd: Point): boolean {
	const firstA = orientation(firstStart, firstEnd, secondStart);
	const firstB = orientation(firstStart, firstEnd, secondEnd);
	const secondA = orientation(secondStart, secondEnd, firstStart);
	const secondB = orientation(secondStart, secondEnd, firstEnd);
	if (((firstA > EPSILON && firstB < -EPSILON) || (firstA < -EPSILON && firstB > EPSILON))
		&& ((secondA > EPSILON && secondB < -EPSILON) || (secondA < -EPSILON && secondB > EPSILON))) {
		return true;
	}
	return pointOnSegment(secondStart, firstStart, firstEnd)
		|| pointOnSegment(secondEnd, firstStart, firstEnd)
		|| pointOnSegment(firstStart, secondStart, secondEnd)
		|| pointOnSegment(firstEnd, secondStart, secondEnd);
}

function pathSegments(paths: Array<Array<Point>>): Array<[Point, Point]> {
	const segments: Array<[Point, Point]> = [];
	for (const path of paths) {
		for (let index = 1; index < path.length; index += 1) {
			segments.push([path[index - 1], path[index]]);
		}
	}
	return segments;
}

function segmentIntersectsBounds(start: Point, end: Point, bounds: Bounds): boolean {
	if (pointInsideBounds(start, bounds) || pointInsideBounds(end, bounds)) {
		return true;
	}
	const topLeft = { x: bounds.minX, y: bounds.minY };
	const topRight = { x: bounds.maxX, y: bounds.minY };
	const bottomRight = { x: bounds.maxX, y: bounds.maxY };
	const bottomLeft = { x: bounds.minX, y: bounds.maxY };
	return segmentsIntersect(start, end, topLeft, topRight)
		|| segmentsIntersect(start, end, topRight, bottomRight)
		|| segmentsIntersect(start, end, bottomRight, bottomLeft)
		|| segmentsIntersect(start, end, bottomLeft, topLeft);
}

function classifyPaths(paths: Array<Array<Point>>, bounds: Bounds): WireClassification {
	const points = paths.flat();
	if (points.length < 2) {
		return 'invalid';
	}
	if (points.every(point => pointInsideBounds(point, bounds))) {
		return 'inside';
	}
	if (pathSegments(paths).some(([start, end]) => segmentIntersectsBounds(start, end, bounds))) {
		return 'crossing';
	}
	return 'outside';
}

function geometryContainsPoint(geometry: WireGeometry, point: Point): boolean {
	return pathSegments(geometry.paths).some(([start, end]) => pointOnSegment(point, start, end));
}

function geometriesIntersect(left: WireGeometry, right: WireGeometry): boolean {
	const leftSegments = pathSegments(left.paths);
	const rightSegments = pathSegments(right.paths);
	return leftSegments.some(([leftStart, leftEnd]) => rightSegments.some(([rightStart, rightEnd]) => segmentsIntersect(leftStart, leftEnd, rightStart, rightEnd)));
}

function wireSummary(geometry: WireGeometry, touchedMembers: Array<string> = []): WirePlan {
	return {
		primitiveId: geometry.primitiveId,
		selected: geometry.selected,
		classification: geometry.classification,
		line: geometry.line,
		touchedMembers: [...touchedMembers].sort(compareStrings),
	};
}

function netByMember(nets: Array<RegionNet>): Map<string, RegionNet> {
	const map = new Map<string, RegionNet>();
	for (const net of nets) {
		for (const member of net.members) {
			map.set(member, net);
		}
	}
	return map;
}

function issue(level: InspectionIssue['level'], code: string, message: string, target?: string): InspectionIssue {
	return { level, code, message, ...(target ? { target } : {}) };
}

async function primitiveBounds(primitive: ISCH_Primitive): Promise<Bounds | undefined> {
	return await eda.sch_Primitive.getPrimitivesBBox([primitive]);
}

async function buildPinContexts(components: Array<ISCH_PrimitiveComponent>): Promise<Map<string, PinContext>> {
	const contexts = new Map<string, PinContext>();
	for (const component of components) {
		const designator = component.getState_Designator();
		if (!designator) {
			continue;
		}
		const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
		for (const pin of pins) {
			const candidates = pinEndpointCandidates(pin);
			contexts.set(`${designator}.${pin.getState_PinNumber()}`, {
				member: `${designator}.${pin.getState_PinNumber()}`,
				pin,
				reported: { x: candidates.reported.x, y: candidates.reported.y },
				plusLength: { x: candidates.plusLength.x, y: candidates.plusLength.y },
				minusLength: { x: candidates.minusLength.x, y: candidates.minusLength.y },
				rotation: candidates.rotation,
				pinLength: candidates.pinLength,
			});
		}
	}
	return contexts;
}

function touchingWireIds(geometries: Array<WireGeometry>, point: Point): Array<string> {
	return geometries.filter(geometry => geometryContainsPoint(geometry, point)).map(geometry => geometry.primitiveId).sort(compareStrings);
}

function reachableWireIds(geometries: Array<WireGeometry>, seedIds: Set<string>): Set<string> {
	const byId = new Map(geometries.map(geometry => [geometry.primitiveId, geometry]));
	const reachable = new Set(seedIds);
	const queue = [...seedIds];
	while (queue.length > 0) {
		const currentId = queue.shift();
		if (!currentId) {
			continue;
		}
		const current = byId.get(currentId);
		if (!current) {
			continue;
		}
		for (const candidate of geometries) {
			if (reachable.has(candidate.primitiveId)) {
				continue;
			}
			if (geometriesIntersect(current, candidate)) {
				reachable.add(candidate.primitiveId);
				queue.push(candidate.primitiveId);
			}
		}
	}
	return reachable;
}

export async function runWireConflictPreflight(options: { showPreview?: boolean; includeUnchangedNetworks?: boolean } = {}): Promise<void> {
	await runProbe('阶段 3 导线与冲突预检', async () => {
		await eda.sys_Storage.setExtensionUserConfig(PHASE3_PLAN_STORAGE_KEY, {
			capturedAt: now(),
			selectedPrimitiveIds: [],
			planReady: false,
			blockerCount: 1,
			portPlans: [],
			deletionPlan: [],
		} satisfies StoredPhase3Plan);
		const raw = eda.sys_Storage.getExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY);
		if (typeof raw !== 'string' || !raw.trim()) {
			throw new Error('尚未保存结构 JSON。请先执行“粘贴区域结构 JSON”。');
		}
		const frozenSnapshot = readStoredRegionSnapshot();
		if (!frozenSnapshot) {
			throw new Error('没有区域快照。请保持当前框选并执行“导出框选区域结构”。');
		}
		const currentSnapshot = await buildCurrentRegionSnapshot();
		const selected = await getSelectedPrimitives();
		const selectedIds = selected.map(safePrimitiveId).filter((id): id is string => Boolean(id)).sort(compareStrings);
		const issues: Array<InspectionIssue> = [];
		if (!sameSet(selectedIds, frozenSnapshot.selectedPrimitiveIds)) {
			issues.push(issue('blocker', 'SELECTION_CHANGED', '当前框选与导出时冻结的区域不一致。请重新导出框选区域结构。'));
		}

		const parsed = parseRegionInput(raw);
		issues.push(...parsed.issues);
		let networkChanges: Array<Record<string, string>> = [];
		if (parsed.value) {
			const comparison = compareRegions(parsed.value, currentSnapshot.region);
			issues.push(...comparison.issues);
			networkChanges = comparison.networkChanges;
		}
		const strictBlockerCount = issues.filter(item => item.level === 'blocker').length;
		const changedTargetNetNames = new Set(networkChanges.flatMap(change => change.to !== '(未连接)' ? [change.to] : []));

		const inputNets = parsed.value?.nets ?? [];
		const targetNetByMember = netByMember(inputNets);
		const targetNetByName = new Map(inputNets.map(net => [net.name, net]));
		const currentNetByMember = memberNetworkMap(currentSnapshot.region);
		const currentPinNoConnectedByMember: Map<string, boolean> = new Map(currentSnapshot.region.components.flatMap(component => component.pins.map(pin => [
			`${component.designator}.${pin.number}`,
			pin.noConnected,
		] as const)));
		const targetPinNoConnectedByMember: Map<string, boolean> = new Map((parsed.value?.components ?? []).flatMap(component => component.pins.map((pin) => {
			const member = `${component.designator}.${pin.number}`;
			return [member, pin.noConnected || !targetNetByMember.has(member)] as const;
		})));
		const pinNoConnectPlans: Array<PinNoConnectPlan> = [...targetPinNoConnectedByMember.entries()]
			.filter(([member, targetNoConnected]) => currentPinNoConnectedByMember.get(member) !== targetNoConnected)
			.map(([member, to]) => ({ member, from: currentPinNoConnectedByMember.get(member) ?? false, to }))
			.sort((left, right) => compareStrings(left.member, right.member));
		for (const plan of pinNoConnectPlans) {
			issues.push(issue('info', plan.to ? 'NO_CONNECT_MARK_PLANNED' : 'NO_CONNECT_MARK_CLEAR_PLANNED', plan.to
				? `空着的引脚 ${plan.member} 将在导入时添加非连接标识。`
				: `重新接入网络的引脚 ${plan.member} 将清除原有非连接标识。`, plan.member));
		}
		const selectedComponents = selected
			.filter(isComponent)
			.filter(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
		const selectedComponentIds = new Set(selectedComponents.map(component => component.getState_PrimitiveId()));
		const selectedElectricalPrimitives = selected.filter((primitive) => {
			const primitiveType = primitive.getState_PrimitiveType();
			if (primitiveType === ESCH_PrimitiveType.WIRE || primitiveType === ESCH_PrimitiveType.BUS) {
				return true;
			}
			return isComponent(primitive) && primitive.getState_ComponentType() !== ESCH_PrimitiveComponentType.DRAWING;
		});
		const componentEnvelope = await eda.sch_Primitive.getPrimitivesBBox(selectedComponents);
		const boundary = await eda.sch_Primitive.getPrimitivesBBox(selectedElectricalPrimitives);
		const selectionEnvelope = await eda.sch_Primitive.getPrimitivesBBox(selected);
		if (!boundary) {
			issues.push(issue('blocker', 'REGION_BOUNDARY_UNAVAILABLE', '无法根据所选电气图元建立区域边界。'));
		}
		else {
			issues.push(issue('warning', 'REGION_BOUNDARY_INFERRED', 'SDK 不提供原始框选矩形；当前边界由所选普通器件、导线和网络标识的联合外接矩形推导。'));
		}
		const selectedWireIds = new Set(selected.filter(isWire).map(wire => wire.getState_PrimitiveId()));
		const allWires = await eda.sch_PrimitiveWire.getAll();
		const wireGeometries: Array<WireGeometry> = boundary
			? allWires.map((wire) => {
					const primitiveId = wire.getState_PrimitiveId();
					const line = wire.getState_Line();
					const paths = normalizeLine(line);
					return {
						primitiveId,
						selected: selectedWireIds.has(primitiveId),
						line,
						paths,
						classification: classifyPaths(paths, boundary),
					};
				})
			: [];
		const selectedWireGeometries = wireGeometries.filter(geometry => geometry.selected);
		const selectedInsideWires = selectedWireGeometries.filter(geometry => geometry.classification === 'inside');
		const selectedUnsafeWires = selectedWireGeometries.filter(geometry => geometry.classification !== 'inside');
		for (const geometry of selectedUnsafeWires) {
			issues.push(issue('blocker', 'SELECTED_WIRE_NOT_INTERNAL', `所选导线未完全位于推导区域内，不能列入删除计划：${geometry.primitiveId}`, geometry.primitiveId));
		}

		const unselectedRegionWires = wireGeometries.filter(geometry => !geometry.selected && (geometry.classification === 'inside' || geometry.classification === 'crossing'));
		for (const geometry of unselectedRegionWires) {
			issues.push(issue('blocker', 'UNSELECTED_WIRE_IN_REGION', `区域内或穿越区域的导线未被选中：${geometry.primitiveId}`, geometry.primitiveId));
		}

		const selectedUnselectedIntersections: Array<{ selectedWireId: string; unselectedWireId: string }> = [];
		for (const selectedWire of selectedInsideWires) {
			for (const unselectedWire of wireGeometries.filter(geometry => !geometry.selected)) {
				if (geometriesIntersect(selectedWire, unselectedWire)) {
					selectedUnselectedIntersections.push({ selectedWireId: selectedWire.primitiveId, unselectedWireId: unselectedWire.primitiveId });
				}
			}
		}

		const busConflicts: Array<Record<string, unknown>> = [];
		if (boundary) {
			for (const bus of await eda.sch_PrimitiveBus.getAll()) {
				const primitiveId = bus.getState_PrimitiveId();
				const paths = normalizeLine(bus.getState_Line());
				const classification = classifyPaths(paths, boundary);
				if (classification === 'inside' || classification === 'crossing' || selectedIds.includes(primitiveId)) {
					busConflicts.push({ primitiveId, busName: bus.getState_BusName(), classification, line: bus.getState_Line() });
					issues.push(issue('blocker', 'BUS_IN_REGION', `区域内存在总线或总线穿越区域：${primitiveId}`, primitiveId));
				}
			}
		}

		const allComponents = await eda.sch_PrimitiveComponent.getAll();
		const allComponentIds = new Set(allComponents.map(component => component.getState_PrimitiveId()));
		const unselectedComponentConflicts: Array<Record<string, unknown>> = [];
		const specialComponentConflicts: Array<Record<string, unknown>> = [];
		const preservedNetworkAnchors: Array<Record<string, unknown>> = [];
		const anchorSeedWireIds = new Set<string>();
		if (boundary) {
			for (const component of allComponents) {
				const primitiveId = component.getState_PrimitiveId();
				const componentType = component.getState_ComponentType();
				if (componentType === ESCH_PrimitiveComponentType.DRAWING) {
					continue;
				}
				const componentBox = await primitiveBounds(component);
				const overlaps = componentBox ? boundsOverlap(componentBox, boundary) : pointInsideBounds({ x: component.getState_X(), y: component.getState_Y() }, boundary);
				if (!overlaps && !selectedIds.includes(primitiveId)) {
					continue;
				}
				if (componentType === ESCH_PrimitiveComponentType.COMPONENT) {
					if (!selectedComponentIds.has(primitiveId)) {
						unselectedComponentConflicts.push({ primitiveId, designator: component.getState_Designator(), componentType, bounds: componentBox });
						issues.push(issue('blocker', 'UNSELECTED_COMPONENT_IN_REGION', `推导区域内存在未选中的普通器件：${component.getState_Designator() || primitiveId}`, component.getState_Designator() || primitiveId));
					}
					continue;
				}
				if (componentType === ESCH_PrimitiveComponentType.NET_FLAG) {
					const net = component.getState_Net() ?? '';
					const point = { x: component.getState_X(), y: component.getState_Y() };
					const selectedAnchor = selectedIds.includes(primitiveId);
					const selectedWireIdsAtAnchor = touchingWireIds(selectedInsideWires, point);
					if (selectedAnchor && targetNetByName.has(net)) {
						for (const wireId of selectedWireIdsAtAnchor) {
							anchorSeedWireIds.add(wireId);
						}
						preservedNetworkAnchors.push({ primitiveId, componentType, net, point, selectedWireIdsAtAnchor });
						issues.push(issue('info', 'MATCHING_NET_FLAG_PRESERVED', `保留与目标网络一致的已选网络标识${selectedWireIdsAtAnchor.length > 0 ? '及其导线' : ''}：${net}`, primitiveId));
						continue;
					}
				}
				specialComponentConflicts.push({
					primitiveId,
					componentType,
					designator: component.getState_Designator(),
					net: component.getState_Net(),
					x: component.getState_X(),
					y: component.getState_Y(),
				});
				issues.push(issue('blocker', 'SPECIAL_COMPONENT_IN_REGION', `区域内存在无法安全保留的网络端口、网络标识或其他特殊器件：${componentType}`, primitiveId));
			}
		}
		const preservedWireIds = reachableWireIds(selectedInsideWires, anchorSeedWireIds);
		const deletableInsideWires = selectedInsideWires.filter(geometry => !preservedWireIds.has(geometry.primitiveId));
		const attributeConflicts: Array<Record<string, unknown>> = [];
		if (boundary) {
			for (const attribute of await eda.sch_PrimitiveAttribute.getAll()) {
				const x = attribute.getState_X();
				const y = attribute.getState_Y();
				if (x === null || y === null || !pointInsideBounds({ x, y }, boundary)) {
					continue;
				}
				const parentPrimitiveId = attribute.getState_ParentPrimitiveId();
				if (parentPrimitiveId && allComponentIds.has(parentPrimitiveId)) {
					continue;
				}
				attributeConflicts.push({
					primitiveId: attribute.getState_PrimitiveId(),
					parentPrimitiveId,
					key: attribute.getState_Key(),
					value: attribute.getState_Value(),
					x,
					y,
				});
				issues.push(issue('blocker', 'STANDALONE_ATTRIBUTE_IN_REGION', '区域内存在游离属性或可能的普通网络标签，当前版本无法安全区分。', attribute.getState_PrimitiveId()));
			}
		}

		const selectedUnsupportedPrimitives = selected.flatMap((primitive) => {
			const type = primitive.getState_PrimitiveType();
			if (type === ESCH_PrimitiveType.COMPONENT || type === ESCH_PrimitiveType.WIRE || type === ESCH_PrimitiveType.ATTRIBUTE || type === ESCH_PrimitiveType.BUS) {
				return [];
			}
			return [{ primitiveId: safePrimitiveId(primitive), primitiveType: type }];
		});
		if (selectedUnsupportedPrimitives.length > 0) {
			issues.push(issue('warning', 'NON_ELECTRICAL_PRIMITIVES_SELECTED', `选择中包含 ${selectedUnsupportedPrimitives.length} 个非电气图元；它们不会进入任何修改计划。`));
		}

		const pinContexts = await buildPinContexts(selectedComponents);
		const selectedWireNetById = new Map(selected.filter(isWire).map(wire => [wire.getState_PrimitiveId(), wire.getState_Net()]));
		const localAliasByCanonicalNet = new Map<string, string>();
		for (const [member, canonicalNet] of currentNetByMember) {
			const context = pinContexts.get(member);
			if (!context) {
				continue;
			}
			const aliases = [...new Set(touchingWireIds(selectedInsideWires, context.reported)
				.map(wireId => selectedWireNetById.get(wireId) ?? '')
				.filter(Boolean))];
			if (aliases.length === 1) {
				localAliasByCanonicalNet.set(canonicalNet, aliases[0]);
			}
		}
		const preservedNetNames = new Set(preservedNetworkAnchors.map(anchor => String(anchor.net)));
		const existingNamedExternalNetNames = new Set(currentSnapshot.region.nets
			.filter(net => net.scope === 'external' && !net.generated)
			.map(net => net.name));
		const availableNetworkAnchorNames = new Set([...preservedNetNames, ...existingNamedExternalNetNames]);
		const targetNetNamesToProcess = options.includeUnchangedNetworks
			? new Set(inputNets.map(net => net.name))
			: changedTargetNetNames;
		const noConnectedMembers = new Set([...targetPinNoConnectedByMember.entries()]
			.filter(([, noConnected]) => noConnected)
			.map(([member]) => member));
		const preservedMembers = [...targetNetByMember.entries()]
			.filter(([member, targetNet]) => preservedNetNames.has(targetNet.name) && currentNetByMember.get(member) === targetNet.name)
			.map(([member, targetNet]) => ({ member, net: targetNet.name }))
			.sort((left, right) => compareStrings(left.member, right.member));
		const portPlans: Array<PortPlan> = [];
		const seedWireIds = new Set<string>();
		const touchedMembersByWire = new Map<string, Set<string>>();
		for (const [member, targetNet] of [...targetNetByMember.entries()].sort(([left], [right]) => compareStrings(left, right))) {
			if (!targetNetNamesToProcess.has(targetNet.name)) {
				continue;
			}
			if (preservedNetNames.has(targetNet.name) && currentNetByMember.get(member) === targetNet.name) {
				continue;
			}
			if (options.includeUnchangedNetworks !== true
				&& availableNetworkAnchorNames.has(targetNet.name)
				&& currentNetByMember.get(member) === targetNet.name) {
				continue;
			}
			if (noConnectedMembers.has(member)) {
				issues.push(issue('blocker', 'TARGET_MEMBER_MARKED_NO_CONNECT', `目标成员 ${member} 带有不连接标记，不能自动接入网络 ${targetNet.name}。请先清除不连接标记并重新导出。`, member));
				continue;
			}
			const context = pinContexts.get(member);
			if (!context) {
				issues.push(issue('blocker', 'PIN_CONTEXT_MISSING', `无法读取目标引脚的 SDK 坐标：${member}`, member));
				continue;
			}
			const selectedAtReported = touchingWireIds(deletableInsideWires, context.reported);
			const unselectedAtReported = touchingWireIds(wireGeometries.filter(geometry => !geometry.selected), context.reported);
			for (const wireId of selectedAtReported) {
				seedWireIds.add(wireId);
				const touched = touchedMembersByWire.get(wireId) ?? new Set<string>();
				touched.add(member);
				touchedMembersByWire.set(wireId, touched);
			}
			const alternatives = [
				{ mode: 'PLUS_LENGTH' as const, point: context.plusLength },
				{ mode: 'MINUS_LENGTH' as const, point: context.minusLength },
			].filter(candidate => pointKey(candidate.point) !== pointKey(context.reported)).map(candidate => ({
				mode: candidate.mode,
				point: candidate.point,
				selectedWireIds: touchingWireIds(deletableInsideWires, candidate.point),
				unselectedWireIds: touchingWireIds(wireGeometries.filter(geometry => !geometry.selected), candidate.point),
			}));
			if (selectedAtReported.length === 0 && currentNetByMember.has(member)) {
				const alternativeHits = alternatives.filter(candidate => candidate.selectedWireIds.length > 0 || candidate.unselectedWireIds.length > 0);
				issues.push(issue('blocker', 'PIN_ENDPOINT_NOT_CONFIRMED', alternativeHits.length > 0
					? `引脚 ${member} 的 SDK 原始坐标未接触所选导线，但其他候选坐标存在导线；连接端映射尚未验证。`
					: `引脚 ${member} 当前有网络，但 SDK 原始坐标未接触任何所选导线。`, member));
			}
			if (unselectedAtReported.length > 0) {
				issues.push(issue('blocker', 'PIN_TOUCHES_UNSELECTED_WIRE', `引脚 ${member} 的目标点接触未选导线，可能跨越区域边界。`, member));
			}
			portPlans.push({
				member,
				net: targetNet.name,
				...(existingNamedExternalNetNames.has(targetNet.name) && localAliasByCanonicalNet.has(targetNet.name)
					? { connectionNet: localAliasByCanonicalNet.get(targetNet.name) }
					: {}),
				direction: targetNet.scope === 'external' ? (targetNet.direction ?? 'BI') : 'BI',
				scope: targetNet.scope,
				targetPoint: context.reported,
				rotation: context.rotation,
				currentNet: currentNetByMember.get(member) ?? '(未连接)',
				selectedWireIdsAtReportedPoint: selectedAtReported,
				unselectedWireIdsAtReportedPoint: unselectedAtReported,
				alternativeCoordinateEvidence: alternatives,
			});
		}

		const reachableIds = reachableWireIds(deletableInsideWires, seedWireIds);
		const untouchedSelectedWires = deletableInsideWires.filter(geometry => !reachableIds.has(geometry.primitiveId));
		if (untouchedSelectedWires.length > 0) {
			issues.push(issue('info', 'UNCHANGED_SELECTED_WIRES_PRESERVED', `有 ${String(untouchedSelectedWires.length)} 条已选导线不属于实际网络变化，将保持原样。`));
		}

		const internalPortNets = [...new Set(portPlans.filter(plan => plan.scope === 'internal').map(plan => plan.net))].sort(compareStrings);
		if (internalPortNets.length > 0) {
			issues.push(issue('warning', 'INTERNAL_NET_PORT_FALLBACK', `普通网络标签创建已实测不可用；内部网络将只能规划为 BI 网络端口：${internalPortNets.join('、')}`));
		}
		issues.push(issue('info', 'PORT_ONLY_PLAN', '阶段 3 仅生成网络端口候选计划；普通网络标签创建和所有实际执行仍保持禁用。'));

		const deletionPlan = deletableInsideWires
			.filter(geometry => reachableIds.has(geometry.primitiveId))
			.map(geometry => wireSummary(geometry, [...(touchedMembersByWire.get(geometry.primitiveId) ?? [])]));
		const deletionWireIntersections = selectedUnselectedIntersections.filter(connection => deletionPlan.some(plan => plan.primitiveId === connection.selectedWireId));
		for (const connection of deletionWireIntersections) {
			issues.push(issue('blocker', 'WIRE_TOUCHES_UNSELECTED_WIRE', '候选删除导线与未选导线存在几何接触或相交，无法安全确认是否为跨边界连接。', connection.selectedWireId));
		}
		const preservedWirePlan = selectedInsideWires
			.filter(geometry => preservedWireIds.has(geometry.primitiveId) || !reachableIds.has(geometry.primitiveId))
			.map(geometry => wireSummary(geometry));
		const plansByNet = new Map<string, Array<PortPlan>>();
		for (const plan of portPlans) {
			const plans = plansByNet.get(plan.net) ?? [];
			plans.push(plan);
			plansByNet.set(plan.net, plans);
		}
		const bootstrapNetworkNames: Array<string> = [];
		for (const [net, plans] of plansByNet) {
			const sourceWireIds = [...new Set(plans.flatMap(plan => plan.selectedWireIdsAtReportedPoint)
				.filter(wireId => deletionPlan.some(wire => wire.primitiveId === wireId)))];
			if (sourceWireIds.length === 0 && !availableNetworkAnchorNames.has(net)) {
				bootstrapNetworkNames.push(net);
				continue;
			}
			if (sourceWireIds.length > 1) {
				issues.push(issue('blocker', 'TARGET_NET_MULTIPLE_SOURCE_WIRES', `目标网络 ${net} 同时涉及多条独立源导线，当前版本无法在一次导入中安全合并。`, net));
				continue;
			}
			const sourceWireId = sourceWireIds[0];
			if (!sourceWireId) {
				continue;
			}
			const unsupportedMembers = plans
				.filter(plan => (plan.selectedWireIdsAtReportedPoint.length > 0 && !sameSet(plan.selectedWireIdsAtReportedPoint, [sourceWireId]))
					|| plan.unselectedWireIdsAtReportedPoint.length > 0)
				.map(plan => plan.member);
			if (unsupportedMembers.length > 0) {
				issues.push(issue(
					'blocker',
					'TARGET_MEMBER_NOT_ON_SOURCE_WIRE',
					`目标网络 ${net} 包含接触其他导线的成员：${unsupportedMembers.join('、')}。当前版本不能自动跨导线合并。`,
					net,
				));
			}
		}
		if (bootstrapNetworkNames.length > 0) {
			issues.push(issue(
				'info',
				'NEW_NAMED_NETWORK_BOOTSTRAP',
				`以下网络没有现有导线或网络标识，将由各网络的第一个真实悬空引脚建立命名网络，再依次接入其余成员：${bootstrapNetworkNames.join('、')}`,
			));
		}
		const blockers = issues.filter(item => item.level === 'blocker');
		const warnings = issues.filter(item => item.level === 'warning');
		const information = issues.filter(item => item.level === 'info');
		const report = {
			capturedAt: now(),
			mode: 'wire-conflict-readonly',
			frozenSnapshotCapturedAt: frozenSnapshot.capturedAt,
			currentRegionCapturedAt: currentSnapshot.capturedAt,
			inputParsed: Boolean(parsed.value),
			strictMatchPassed: strictBlockerCount === 0,
			boundaryModel: boundary ? 'selected-electrical-bbox' : 'unavailable',
			selectedPrimitiveCount: selected.length,
			selectedComponentCount: selectedComponents.length,
			selectedWireCount: selectedWireGeometries.length,
			canvasWireCount: wireGeometries.length,
			internalSelectedWireCount: selectedInsideWires.length,
			unsafeSelectedWireCount: selectedUnsafeWires.length,
			unselectedRegionWireCount: unselectedRegionWires.length,
			wireIntersectionConflictCount: deletionWireIntersections.length,
			busConflictCount: busConflicts.length,
			specialComponentConflictCount: specialComponentConflicts.length,
			preservedNetworkAnchorCount: preservedNetworkAnchors.length,
			preservedWireCount: preservedWirePlan.length,
			preservedMemberCount: preservedMembers.length,
			unselectedComponentConflictCount: unselectedComponentConflicts.length,
			attributeConflictCount: attributeConflicts.length,
			networkChangeCount: networkChanges.length,
			plannedDeleteWireCount: deletionPlan.length,
			plannedCreatePortCount: portPlans.length,
			plannedNoConnectChangeCount: pinNoConnectPlans.length,
			plannedBootstrapNetworkCount: bootstrapNetworkNames.length,
			bootstrapNetworkNames,
			blockerCount: blockers.length,
			warningCount: warnings.length,
			informationCount: information.length,
			planReady: blockers.length === 0,
			executionEnabled: false,
			note: blockers.length === 0
				? '导线与冲突只读预检未发现阻止项；仍需真实测试报告验证边界和引脚连接端推断，当前不会修改原理图。'
				: '存在阻止项，不能进入任何执行阶段。当前不会修改原理图。',
		};
		await eda.sys_Storage.setExtensionUserConfig(PHASE3_PLAN_STORAGE_KEY, {
			capturedAt: report.capturedAt,
			selectedPrimitiveIds: selectedIds,
			planReady: report.planReady,
			blockerCount: blockers.length,
			portPlans: report.planReady ? portPlans : [],
			pinNoConnectPlans: report.planReady ? pinNoConnectPlans : [],
			deletionPlan: report.planReady ? deletionPlan : [],
			preflightReport: report,
			blockers,
			warnings,
			information,
			networkChanges,
			networkAnchorNames: [...availableNetworkAnchorNames].sort(compareStrings),
			...(report.planReady && portPlans[0] ? { target: portPlans[0] } : {}),
		} satisfies StoredPhase3Plan);

		if (options.showPreview !== false) {
			await showPreview('原理图结构文本桥：安全预检', [
				jsonPreviewTab('预检摘要', report),
				jsonPreviewTab('阻止项', blockers),
				jsonPreviewTab('警告项', warnings),
				jsonPreviewTab('区域边界与图元', {
					boundary,
					componentEnvelope,
					selectionEnvelope,
					boundarySource: '所选普通器件、导线和网络标识的联合外接矩形；SDK 未提供原始框选矩形。',
					selectedUnsafeWires: selectedUnsafeWires.map(geometry => wireSummary(geometry)),
					unselectedRegionWires: unselectedRegionWires.map(geometry => wireSummary(geometry)),
					wireIntersections: deletionWireIntersections,
					busConflicts,
					specialComponentConflicts,
					preservedNetworkAnchors,
					preservedMembers,
					preservedWirePlan,
					unselectedComponentConflicts,
					attributeConflicts,
					selectedUnsupportedPrimitives,
				}),
				jsonPreviewTab('保留计划', {
					preservedNetworkAnchors,
					preservedMembers,
					preservedWires: preservedWirePlan,
				}),
				jsonPreviewTab('导线删除计划', deletionPlan),
				jsonPreviewTab('端口创建计划', portPlans),
				jsonPreviewTab('网络变化', networkChanges),
				jsonPreviewTab('信息与忽略字段', { information, ignoredFields: parsed.ignoredFields }),
			]);
		}
	});
}
