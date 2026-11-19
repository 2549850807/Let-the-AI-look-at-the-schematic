import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

const bundle = await build({
	entryPoints: [fileURLToPath(new URL('../src/phase3-preflight.ts', import.meta.url))],
	bundle: true,
	write: false,
	platform: 'node',
	format: 'cjs',
	plugins: [{
		name: 'snapshot-fixture',
		setup(builder) {
			builder.onResolve({ filter: /^\.\/region-export$/ }, () => ({ path: 'snapshot', namespace: 'fixture' }));
			builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `
				export const REGION_SNAPSHOT_STORAGE_KEY = 'snapshot';
				export const buildCurrentRegionSnapshot = async () => globalThis.fixtureSnapshot;
				export const readStoredRegionSnapshot = () => globalThis.fixtureSnapshot;
			` }));
		},
	}],
});

function fixture() {
	const storage = new Map();
	const object = fields => Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, () => value]));
	const component = object({ getState_PrimitiveId: 'component', getState_PrimitiveType: 'component', getState_ComponentType: 'component', getState_Designator: 'R1' });
	const pins = ['1', '2'].map((number, index) => object({
		getState_PrimitiveId: `pin-${number}`, getState_PinNumber: number,
		getState_X: 20 + index * 20, getState_Y: 20,
		getState_Rotation: 0, getState_PinLength: 10,
	}));
	const snapshot = {
		capturedAt: '2026-11-19T00:00:00.000Z', selectedPrimitiveIds: ['component'],
		region: {
			format: 'jlc-schematic-region', version: 1,
			components: [{ designator: 'R1', name: '10K', pins: ['1', '2'].map(number => ({ number, name: number, type: 'IN', noConnected: false })) }],
			nets: [],
		},
	};
	storage.set('phase2ImportTextV1', JSON.stringify({ ...snapshot.region, nets: [{ name: 'SIGNAL', scope: 'internal', generated: false, members: ['R1.1', 'R1.2'] }] }));
	const state = { attributes: [], wires: [], selected: [component], components: [component], pinsByComponent: new Map([['component', pins]]) };
	const eda = {
		sch_Event: { isEventListenerAlreadyExist: () => true },
		sys_Storage: { getExtensionUserConfig: key => storage.get(key), setExtensionUserConfig: async (key, value) => { storage.set(key, value); return true; } },
		sys_Dialog: { showInformationMessage: message => { throw new Error(message); } },
		sch_SelectControl: { getAllSelectedPrimitives_PrimitiveId: async () => state.selected.map(primitive => primitive.getState_PrimitiveId()) },
		sch_Primitive: {
			getPrimitivesByPrimitiveId: async () => state.selected,
			getPrimitivesBBox: async () => ({ minX: 0, minY: 0, maxX: 100, maxY: 100 }),
		},
		sch_PrimitiveComponent: { getAll: async () => state.components, getAllPinsByPrimitiveId: async id => state.pinsByComponent.get(id) ?? [] },
		sch_PrimitiveWire: { getAll: async () => state.wires },
		sch_PrimitiveBus: { getAll: async () => [] },
		sch_PrimitiveAttribute: { getAll: async () => state.attributes },
	};
	const module = { exports: {} };
	runInNewContext(bundle.outputFiles[0].text, {
		module, exports: module.exports, eda, fixtureSnapshot: snapshot, console,
		ESCH_PrimitiveType: { COMPONENT: 'component', WIRE: 'wire', ATTRIBUTE: 'attribute', BUS: 'bus' },
		ESCH_PrimitiveComponentType: { COMPONENT: 'component', DRAWING: 'drawing', NET_FLAG: 'flag' },
	});
	return {
		state,
		snapshot,
		storage,
		object,
		attribute: (parent, overrides = {}) => object({
			getState_PrimitiveId: `attribute-${state.attributes.length}`, getState_ParentPrimitiveId: parent,
			getState_Key: 'NET', getState_Value: 'EXISTING', getState_X: 0, getState_Y: 0,
			getState_KeyVisible: false, getState_ValueVisible: false, ...overrides,
		}),
		wire: (id, line) => object({ getState_PrimitiveId: id, getState_PrimitiveType: 'wire', getState_Line: line, getState_Net: 'EXISTING' }),
		preflight: async () => {
			await module.exports.runWireConflictPreflight({ showPreview: false });
			return storage.get('phase3LatestPlanV1');
		},
	};
}

test('35 attributes positioned inside the selection but owned by outside wires do not block new connections', async () => {
	const context = fixture();
	for (let index = 0; index < 35; index++) {
		const wireId = `outside-${index}`;
		context.state.wires.push(context.wire(wireId, [200, 200 + index, 210, 200 + index]));
		context.state.attributes.push(context.attribute(wireId));
	}
	const plan = await context.preflight();
	assert.equal(plan.planReady, true);
	assert.equal(plan.preflightReport.attributeConflictCount, 0);
	assert.equal(plan.preflightReport.preservedAttributeCount, 35);
	assert.equal(plan.portPlans.length, 2);
});

test('component and selected-pin attributes are preserved', async () => {
	const context = fixture();
	context.state.attributes.push(context.attribute('component'), context.attribute('pin-1'));
	const plan = await context.preflight();
	assert.equal(plan.planReady, true);
	assert.equal(plan.preflightReport.preservedAttributeCount, 2);
});

test('BAT, +3.3V and GND flag-pin attributes from the reported failure are preserved', async () => {
	const context = fixture();
	const flags = [
		['3bcdb2ed4ed461fa', 'e11', 'BAT'],
		['c84c575047d68675', 'e11', '+3.3V'],
		['fac8f8c96b0915b7', 'e15', 'GND'],
	];
	const input = JSON.parse(context.storage.get('phase2ImportTextV1'));
	for (const [id, suffix, net] of flags) {
		const flag = context.object({ getState_PrimitiveId: id, getState_PrimitiveType: 'component', getState_ComponentType: 'flag', getState_Net: net, getState_X: 50, getState_Y: 50 });
		const pinId = `${id}-${suffix}`;
		context.state.selected.push(flag);
		context.state.components.push(flag);
		context.state.pinsByComponent.set(id, [context.object({ getState_PrimitiveId: pinId })]);
		context.snapshot.selectedPrimitiveIds.push(id);
		for (const [key, value] of [['Pin Name', 'Pin1'], ['Pin Number', '1'], ['Pin Type', 'IN']]) {
			context.state.attributes.push(context.attribute(pinId, { getState_Key: key, getState_Value: value }));
		}
		const network = { name: net, scope: 'external', direction: 'BI', generated: false, members: [] };
		context.snapshot.region.nets.push(network);
		input.nets.push(network);
	}
	context.storage.set('phase2ImportTextV1', JSON.stringify(input));
	const plan = await context.preflight();
	assert.equal(plan.planReady, true, JSON.stringify(plan.blockers));
	assert.equal(plan.preflightReport.attributeConflictCount, 0);
	assert.equal(plan.preflightReport.preservedNetworkAnchorCount, 3);
	assert.equal(plan.preflightReport.preservedAttributeCount, 9);
	assert(plan.attributeInspection.every(attribute => attribute.parentType === 'pin'));
});

test('unknown parents remain blocked even for hidden attributes and include useful diagnostics', async () => {
	const context = fixture();
	context.state.attributes.push(context.attribute('unresolved-parent'));
	const plan = await context.preflight();
	assert.equal(plan.planReady, false);
	assert.equal(plan.blockers[0].code, 'STANDALONE_ATTRIBUTE_IN_REGION');
	assert.match(plan.blockers[0].message, /NET=EXISTING/);
	assert.match(plan.blockers[0].message, /unresolved-parent/);
	assert.equal(plan.attributeInspection[0].parentType, 'unknown');
	assert.equal(plan.portPlans.length, 0);
});

test('attributes on selected regional wires still block even if the attribute is hidden', async () => {
	const context = fixture();
	const wire = context.wire('regional', [60, 60, 70, 60]);
	context.state.wires.push(wire);
	context.state.selected.push(wire);
	context.state.attributes.push(context.attribute('regional'));
	const plan = await context.preflight();
	assert.equal(plan.planReady, false);
	assert.equal(plan.preflightReport.attributeConflictCount, 1);
	assert.equal(plan.attributeInspection[0].parentType, 'wire');
	assert.equal(plan.attributeInspection[0].parentWireClassification, 'inside');
});

test('unselected regional wires still block independently of their attributes', async () => {
	const context = fixture();
	context.state.wires.push(context.wire('unselected', [60, 60, 70, 60]));
	context.state.attributes.push(context.attribute('unselected'));
	const plan = await context.preflight();
	assert.equal(plan.planReady, false);
	assert(plan.blockers.some(issue => issue.code === 'UNSELECTED_WIRE_IN_REGION'));
	assert(plan.blockers.some(issue => issue.code === 'STANDALONE_ATTRIBUTE_IN_REGION'));
});
