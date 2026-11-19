import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

const source = fileURLToPath(new URL('../src/phase4-prototype.ts', import.meta.url));
const bundle = await build({
	entryPoints: [source], bundle: true, write: false, platform: 'node', format: 'cjs',
	plugins: [{ name: 'connectivity-fixture', setup(builder) {
		builder.onLoad({ filter: /phase4-prototype\.ts$/ }, async args => ({
			contents: `${await readFile(args.path, 'utf8')}\nexport { captureMemberNetworkEvidence, captureExpectedMemberNetworkEvidence };`,
			loader: 'ts',
		}));
		builder.onResolve({ filter: /^\.\/region-export$/ }, () => ({ path: 'snapshot', namespace: 'fixture' }));
		builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `
			export const REGION_SNAPSHOT_STORAGE_KEY = 'snapshot';
			export const buildCurrentRegionSnapshot = async () => ({});
			export const buildEnetConnectivitySnapshot = async () => ({});
			export const readStoredRegionSnapshot = () => ({});
			export const readCurrentMemberNetworks = members => globalThis.readMembers(members);
		` }));
	} }],
});

function fixture(samples) {
	let reads = 0;
	const delays = [];
	const module = { exports: {} };
	runInNewContext(bundle.outputFiles[0].text, {
		module, exports: module.exports, console,
		readMembers: async () => {
			const sample = samples[Math.min(reads++, samples.length - 1)];
			if (sample instanceof Error) throw sample;
			return sample;
		},
		setTimeout: (callback, milliseconds) => { delays.push(milliseconds); return setImmediate(callback); },
	});
	return { verify: module.exports.captureMemberNetworkEvidence, verifyAll: module.exports.captureExpectedMemberNetworkEvidence, delays, reads: () => reads };
}

test('temporary $1N479 immediately after creating C2.1 is retried until +3.3V is exported', async () => {
	const context = fixture([{ 'C2.1': '$1N479' }, { 'C2.1': '$1N479' }, { 'C2.1': '+3.3V' }]);
	const evidence = await context.verify(['C2.1'], '+3.3V');
	assert.equal(evidence.length, 3);
	assert.equal(evidence[0].networks['C2.1'], '$1N479');
	assert.equal(evidence[0].passed, false);
	assert.equal(evidence.at(-1).passed, true);
	assert.equal(evidence.at(-1).elapsedMs, 250);
});

test('already refreshed connectivity passes immediately without extra polling', async () => {
	const context = fixture([{ 'C2.1': '+3.3V' }]);
	const evidence = await context.verify(['C2.1'], '+3.3V');
	assert.equal(evidence.length, 1);
	assert.equal(evidence[0].passed, true);
	assert.equal(context.reads(), 1);
});

test('persistent wrong connectivity never passes and retries stop at three seconds', async () => {
	const context = fixture([{ 'C2.1': '$1N479' }]);
	const evidence = await context.verify(['C2.1'], '+3.3V');
	assert.equal(evidence.length, 7);
	assert(evidence.every(sample => !sample.passed));
	assert.equal(evidence.at(-1).elapsedMs, 3000);
	assert.equal(context.delays.reduce((total, delay) => total + delay, 0), 3000);
});

test('all previously created members must match, including after a temporary netlist read failure', async () => {
	const context = fixture([
		new Error('ENET updating'),
		{ 'C2.1': '+3.3V', 'R17.1': '$1N480' },
		{ 'C2.1': '+3.3V', 'R17.1': '+3.3V' },
	]);
	const evidence = await context.verify(['C2.1', 'R17.1'], '+3.3V');
	assert.match(evidence[0].error, /ENET updating/);
	assert.equal(evidence[1].passed, false);
	assert.equal(evidence[2].passed, true);
});

test('final whole-region verification waits for every target network to update', async () => {
	const context = fixture([
		{ 'C2.1': '+3.3V', 'C2.2': '$1N481' },
		{ 'C2.1': '+3.3V', 'C2.2': 'GND' },
	]);
	const evidence = await context.verifyAll({ 'C2.1': '+3.3V', 'C2.2': 'GND' });
	assert.equal(evidence[0].passed, false);
	assert.equal(evidence.at(-1).passed, true);
	assert.equal(evidence.at(-1).elapsedMs, 100);
});
