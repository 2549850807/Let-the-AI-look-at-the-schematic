import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

const source = fileURLToPath(new URL('../src/phase4-prototype.ts', import.meta.url));
const bundle = await build({
	entryPoints: [source], bundle: true, write: false, platform: 'node', format: 'cjs',
	plugins: [{ name: 'planning-entry', setup(builder) {
		builder.onLoad({ filter: /phase4-prototype\.ts$/ }, async args => ({
			contents: `${await readFile(args.path, 'utf8')}\nexport { planCandidateStubGeometry };`,
			loader: 'ts',
		}));
	} }],
});

const axes = [
	{ name: 'right', pinRotation: 0, delta: [1, 0], standardRotation: 0, inputRotation: 180 },
	{ name: 'left', pinRotation: 180, delta: [-1, 0], standardRotation: 180, inputRotation: 0 },
	{ name: 'positive-y', pinRotation: 90, delta: [0, 1], standardRotation: 270, inputRotation: 90 },
	{ name: 'negative-y', pinRotation: 270, delta: [0, -1], standardRotation: 90, inputRotation: 270 },
];

for (const sourceMode of ['floating-pin', 'existing-wire']) {
	for (const direction of ['IN', 'OUT', 'BI']) {
		for (const axis of axes) {
			test(`${sourceMode}: ${direction} port facing ${axis.name} uses its own rotation without changing connectivity`, async () => {
				const existingWire = sourceMode === 'existing-wire';
				const line = [20, 30, 20 + axis.delta[0] * 20, 30 + axis.delta[1] * 20];
				const wire = {
					getState_PrimitiveId: () => 'source-wire',
					getState_Line: () => line,
					getState_Net: () => 'OLD',
					getState_Color: () => null,
					getState_LineWidth: () => null,
					getState_LineType: () => null,
				};
				const module = { exports: {} };
				runInNewContext(bundle.outputFiles[0].text, {
					module, exports: module.exports,
					eda: { sch_PrimitiveWire: { get: async () => wire } },
				});
				const target = {
					member: 'U7.4', net: 'BAT', scope: 'external', direction,
					targetPoint: { x: 20, y: 30 },
					rotation: existingWire ? (axis.pinRotation + 180) % 360 : axis.pinRotation,
					currentNet: existingWire ? 'OLD' : '(未连接)',
					selectedWireIdsAtReportedPoint: existingWire ? ['source-wire'] : [],
					unselectedWireIdsAtReportedPoint: [], alternativeCoordinateEvidence: [],
				};
				const candidate = {
					net: 'BAT', portPlans: [target],
					...(existingWire ? { wirePlan: { primitiveId: 'source-wire' } } : {}),
				};
				const geometry = await module.exports.planCandidateStubGeometry(candidate);
				const plan = geometry.stubPlans[0];
				assert.equal(plan.stubPortPlan.rotation, direction === 'IN' ? axis.inputRotation : axis.standardRotation);
				assert.equal(plan.stubPortPlan.direction, direction);
				assert.equal(plan.stubPortPlan.net, 'BAT');
				assert.equal(plan.stubPortPlan.targetPoint.x, 20 + axis.delta[0] * 5);
				assert.equal(plan.stubPortPlan.targetPoint.y, 30 + axis.delta[1] * 5);
				assert.equal(JSON.stringify(plan.stubLine), JSON.stringify([20, 30, 20 + axis.delta[0] * 5, 30 + axis.delta[1] * 5]));
				assert.equal(plan.orientation.inputRotationOffset, direction === 'IN' ? 180 : 0);
			});
		}
	}
}
