import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

async function bundleMenu(filename) {
	return build({
		entryPoints: [fileURLToPath(new URL(`../src/${filename}.ts`, import.meta.url))],
		bundle: true, write: false, platform: 'node', format: 'cjs',
		plugins: [{ name: 'snapshot-boundary', setup(builder) {
			builder.onLoad({ filter: /region-export\.ts$/ }, async (args) => {
				const source = await readFile(args.path, 'utf8');
				return {
					contents: source.replace('export async function buildCurrentRegionSnapshot(', 'async function unusedSnapshot(')
						+ '\nexport const buildCurrentRegionSnapshot = () => globalThis.onSnapshot();',
					loader: 'ts',
				};
			});
		} }],
	});
}

const bundles = await Promise.all(['region-export', 'ai-guide', 'probe-core'].map(bundleMenu));

function fixture(bundle) {
	const events = [];
	const storage = new Map();
	const state = { selected: ['R1'], onSnapshot: async () => ({ region: { components: [], nets: [] }, diagnostics: {} }) };
	const module = { exports: {} };
	runInNewContext(bundle.outputFiles[0].text, {
		module, exports: module.exports, console: { error() {} }, setTimeout,
		onSnapshot: () => { events.push('snapshot'); return state.onSnapshot(); },
		eda: {
			sch_Event: { isEventListenerAlreadyExist: () => true },
			sch_SelectControl: { getAllSelectedPrimitives_PrimitiveId: async () => state.selected },
			sys_LoadingAndProgressBar: {
				showProgressBar: (progress, title) => { assert.equal(progress, undefined); assert.match(title, /正在加载/); events.push('show'); },
				destroyProgressBar: () => events.push('hide'),
			},
			sys_Storage: {
				getExtensionUserConfig: key => storage.get(key),
				setExtensionUserConfig: async (key, value) => { storage.set(key, value); return true; },
			},
			sys_IFrame: {
				isIFrameAlreadyExist: async () => false,
				openIFrame: async () => { events.push('preview'); return true; },
			},
			sys_Dialog: { showInformationMessage: () => events.push('error') },
		},
	});
	return { events, state, api: module.exports };
}

for (const [index, method] of ['exportRegionStructure', 'showAiGuide'].entries()) {
	test(`${method} shows loading synchronously, keeps it during snapshots, and hides before preview`, async () => {
		const current = fixture(bundles[index]);
		let release;
		current.state.onSnapshot = () => new Promise(resolve => { release = resolve; });
		const pending = current.api[method]();
		assert.deepEqual(current.events, ['show']);
		await new Promise(resolve => setTimeout(resolve, 10));
		assert.deepEqual(current.events, ['show', 'snapshot']);
		release({ region: {}, diagnostics: {} });
		await pending;
		assert.deepEqual(current.events, ['show', 'snapshot', 'hide', 'preview']);
	});

	test(`${method} clears loading on snapshot failure`, async () => {
		const current = fixture(bundles[index]);
		current.state.onSnapshot = async () => { throw new Error('cannot read selection'); };
		await current.api[method]();
		assert.deepEqual(current.events, ['show', 'snapshot', 'hide', index === 0 ? 'error' : 'preview']);
	});
}

test('AI guide without a selection still clears loading before presenting its templates', async () => {
	const current = fixture(bundles[1]);
	current.state.selected = [];
	await current.api.showAiGuide();
	assert.deepEqual(current.events, ['show', 'hide', 'preview']);
});

test('probe cleanup runs once even if the operation fails after manually dismissing loading', async () => {
	const current = fixture(bundles[2]);
	await current.api.runProbe('test', async (finishLoading) => {
		finishLoading();
		throw new Error('preview failed');
	}, '正在加载…');
	assert.deepEqual(current.events, ['show', 'hide', 'error']);
});
