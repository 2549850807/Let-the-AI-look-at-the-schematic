import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

const html = await readFile(new URL('../iframe/import.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const actionKey = 'phase2ImportActionV1';
const textKey = 'phase2ImportTextV1';
const input = JSON.stringify({ format: 'jlc-schematic-region', version: 1, components: [], nets: [] });

function windowFixture() {
	const content = { value: '', focus() {} };
	const status = { textContent: '', style: {} };
	const buttons = Object.fromEntries(['clear', 'save', 'import'].map(id => [id, { disabled: false, addEventListener() {} }]));
	const timers = new Map();
	let timerId = 0;
	let clock = 100000;
	const storage = new Map([[actionKey, { sessionId: 'current', status: 'ready' }]]);
	const state = { requests: 0, closes: 0, closeFails: false, beforeWrite: async () => {}, onRequest: () => storage.set(actionKey, { sessionId: 'current', status: 'accepted' }) };
	const context = {
		console,
		Date: class extends Date { static now() { return clock; } },
		document: {
			querySelector: selector => selector === '#content' ? content : selector === '#status' ? status : buttons[selector.slice(1)],
			querySelectorAll: () => Object.values(buttons),
		},
		setTimeout: (callback, delay) => {
			const id = ++timerId;
			if (delay === 250) {
				clock += delay;
				setImmediate(callback);
			}
			else timers.set(id, callback);
			return id;
		},
		clearTimeout: id => timers.delete(id),
		eda: {
			sys_Storage: {
				getExtensionUserConfig: key => storage.get(key),
				setExtensionUserConfig: async (key, value) => {
					await state.beforeWrite(key, value);
					storage.set(key, value);
					if (key === actionKey && value.status === 'requested') {
						state.requests++;
						state.onRequest(value);
					}
					return true;
				},
			},
			sys_IFrame: { closeIFrame: async id => {
				assert.equal(storage.get(actionKey).status, 'accepted');
				assert.equal(id, 'phase2-import-window');
				state.closes++;
				if (state.closeFails) throw new Error('SDK close failed');
				return true;
			} },
		},
	};
	runInNewContext(script, context);
	content.value = input;
	return { context, content, status, buttons, timers, storage, state, save: requestImport => runInNewContext(`save(${requestImport})`, context) };
}

test('full AI reply is extracted and the input window closes automatically only after host acceptance', async () => {
	const fixture = windowFixture();
	fixture.content.value = `修改说明\n\n\`\`\`json\n${input}\n\`\`\``;
	assert.equal(await fixture.save(true), true);
	assert.equal(fixture.state.requests, 1);
	assert.equal(fixture.state.closes, 1);
	assert.equal(fixture.storage.get(textKey), input);
	assert.match(fixture.status.textContent, /正在检查连接关系/);
});

test('Save alone tells the user to click Save and Import and does not submit a request', async () => {
	const fixture = windowFixture();
	assert.equal(await fixture.save(false), true);
	assert.equal(fixture.state.requests, 0);
	assert.match(fixture.status.textContent, /点击“保存并导入”/);
	assert.equal(fixture.buttons.import.disabled, false);
});

test('storage rejection is displayed and buttons become usable again', async () => {
	const fixture = windowFixture();
	fixture.state.beforeWrite = async () => { throw new Error('storage unavailable'); };
	assert.equal(await fixture.save(true), false);
	assert.match(fixture.status.textContent, /storage unavailable/);
	assert.equal(fixture.buttons.import.disabled, false);
	fixture.state.beforeWrite = async () => {};
	assert.equal(await fixture.save(true), true);
});

test('a stalled storage call times out visibly and restores the buttons', async () => {
	const fixture = windowFixture();
	fixture.state.beforeWrite = () => new Promise(() => {});
	const pending = fixture.save(true);
	for (const callback of [...fixture.timers.values()]) callback();
	assert.equal(await pending, false);
	assert.match(fixture.status.textContent, /存储响应超时/);
	assert.equal(fixture.buttons.import.disabled, false);
});

test('unresponsive host leaves the editor open and displays a persistent timeout', async () => {
	const fixture = windowFixture();
	fixture.state.onRequest = () => {};
	assert.equal(await fixture.save(true), false);
	assert.match(fixture.status.textContent, /导入暂时没有响应/);
	assert.equal(fixture.content.value, input);
	assert.equal(fixture.buttons.import.disabled, false);
	assert.equal(fixture.state.closes, 0);
});

test('window-close failure after acceptance does not allow another import and gives a clear message', async () => {
	const fixture = windowFixture();
	fixture.state.closeFails = true;
	assert.equal(await fixture.save(true), true);
	assert.match(fixture.status.textContent, /导入已启动.*关闭失败/);
	assert.equal(await fixture.save(true), false);
	assert.equal(fixture.state.requests, 1);
});

test('host rejection is visible and a stale window cannot submit another import', async () => {
	const fixture = windowFixture();
	fixture.state.onRequest = () => fixture.storage.set(actionKey, { sessionId: 'current', status: 'failed', message: '保存导入文本失败' });
	assert.equal(await fixture.save(true), false);
	assert.match(fixture.status.textContent, /保存导入文本失败/);
	assert.equal(await fixture.save(true), false);
	assert.equal(fixture.state.requests, 1);
	assert.match(fixture.status.textContent, /窗口已失效/);
});

test('double click cannot submit the same import twice', async () => {
	const fixture = windowFixture();
	let release;
	fixture.state.beforeWrite = () => new Promise(resolve => { release = resolve; });
	const first = fixture.save(true);
	assert.equal(await fixture.save(true), false);
	fixture.state.beforeWrite = async () => {};
	release();
	assert.equal(await first, true);
	assert.equal(fixture.state.requests, 1);
});

const hostBundle = await build({
	entryPoints: [fileURLToPath(new URL('../src/phase2-preflight.ts', import.meta.url))],
	bundle: true, write: false, platform: 'node', format: 'cjs',
	plugins: [{ name: 'snapshot-fixture', setup(builder) {
		builder.onResolve({ filter: /^\.\/region-export$/ }, () => ({ path: 'snapshot', namespace: 'fixture' }));
		builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `
			export const REGION_SNAPSHOT_STORAGE_KEY = 'snapshot';
			export const buildCurrentRegionSnapshot = async () => { await globalThis.onSnapshot?.(); return {}; };
			export const readStoredRegionSnapshot = () => ({});
		` }));
	} }],
});

function hostFixture(mode = 'normal') {
	const storage = new Map();
	const messages = [];
	const operations = [];
	let windowOpen = false;
	let openCalled = false;
	let existenceChecks = 0;
	let resolveOpening;
	let windowProps;
	let polls = 0;
	const loadingEvents = [];
	const state = { mode, onSnapshot: async () => {}, onWindowOpen: () => {} };
	const submit = () => storage.set(actionKey, {
		sessionId: mode === 'stale' ? 'old-session' : storage.get(actionKey).sessionId,
		status: 'requested', text: input, requestedAt: Date.now() - (mode === 'expired' ? 20000 : 0),
	});
	const module = { exports: {} };
	runInNewContext(hostBundle.outputFiles[0].text, {
		module, exports: module.exports, console: { error() {} },
		setTimeout: callback => setImmediate(callback),
		onSnapshot: () => state.onSnapshot(),
		eda: {
			sys_LoadingAndProgressBar: {
				showProgressBar: (progress, title) => loadingEvents.push(['show', progress, title]),
				destroyProgressBar: () => loadingEvents.push(['hide']),
			},
			sch_Event: { isEventListenerAlreadyExist: () => true },
			sys_Dialog: { showInformationMessage: message => messages.push(message) },
			sys_Storage: {
				getExtensionUserConfig: key => storage.get(key),
				setExtensionUserConfig: async (key, value) => {
					if (mode === 'storage-failure' && key === textKey && value) throw new Error('cannot save import');
					if (mode === 'storage-failure' && key === 'phase0ProbeEventsV2' && String(value.at(-1)?.detail).includes('menu failed')) throw new Error('cannot save error log');
					if (key === textKey && value) operations.push('text-saved');
					if (key === actionKey && value.status === 'accepted') operations.push('accepted');
					storage.set(key, value);
					return true;
				},
			},
			sys_IFrame: {
				isIFrameAlreadyExist: async () => {
					if (openCalled) polls++;
					if (openCalled && state.mode === 'cancel-query') {
						windowProps.onBeforeCloseCallFn();
						return false;
					}
					if (mode === 'cold-load' && openCalled && !windowOpen) {
						existenceChecks++;
						if (existenceChecks === 18) {
							windowOpen = true;
							submit();
						}
					}
					return mode === 'false-negative' ? false : windowOpen;
				},
				openIFrame: async (path, width, height, id, props) => {
					assert.equal(loadingEvents.at(-1)[0], 'hide');
					windowProps = props;
					openCalled = true;
					state.onWindowOpen(props);
					if (state.mode.startsWith('cancel-')) {
						if (state.mode === 'cancel-before-observed') props.onBeforeCloseCallFn();
						if (state.mode === 'cancel-button') props.buttonCallbackFn('close');
						if (state.mode === 'cancel-pending') {
							props.buttonCallbackFn('close');
							return new Promise(() => {});
						}
						return true;
					}
					if (mode === 'open-rejected') throw new Error('SDK open failed');
					if (mode === 'open-false') return false;
					if (mode === 'cold-load') return true;
					windowOpen = true;
					submit();
					if (mode === 'stale') windowOpen = false;
					if (mode === 'cold-open') return new Promise(resolve => { resolveOpening = resolve; });
					return true;
				},
				closeIFrame: async () => {
					assert.equal(storage.get(actionKey).status, 'accepted');
					windowProps.onBeforeCloseCallFn();
					operations.push('closed');
					if (mode === 'close-stalled') return new Promise(() => {});
					if (mode === 'close-rejected') throw new Error('SDK close failed');
					windowOpen = false;
					resolveOpening?.(true);
					return true;
				},
			},
		},
	});
	return { storage, messages, operations, loadingEvents, state, get windowProps() { return windowProps; }, get polls() { return polls; }, open: module.exports.openRegionImportInput };
}

test('closing import before the first visibility sample silently ends polling, including pending SDK open', { timeout: 1000 }, async () => {
	for (const mode of ['cancel-before-observed', 'cancel-button', 'cancel-pending', 'cancel-query']) {
		const fixture = hostFixture(mode);
		assert.equal(await fixture.open(), false);
		assert.equal(fixture.messages.length, 0);
		assert.equal(fixture.operations.includes('accepted'), false);
		assert.ok(fixture.polls <= 1);
		fixture.state.mode = 'normal';
		assert.equal(await fixture.open(), true);
		assert.equal(fixture.messages.length, 0);
	}
});

test('import displays loading immediately and releases it before the editor opens', async () => {
	const fixture = hostFixture();
	let release;
	fixture.state.onSnapshot = () => new Promise(resolve => { release = resolve; });
	const pending = fixture.open();
	assert.match(fixture.loadingEvents[0][2], /正在加载/);
	assert.equal(fixture.loadingEvents.length, 1);
	await new Promise(resolve => setImmediate(resolve));
	assert.equal(fixture.loadingEvents.length, 1);
	release();
	assert.equal(await pending, true);
	assert.deepEqual(fixture.loadingEvents.map(event => event[0]), ['show', 'hide']);
});

test('snapshot failure clears loading and reports the error without opening the import editor', async () => {
	const fixture = hostFixture();
	fixture.state.onSnapshot = async () => { throw new Error('snapshot failed'); };
	assert.equal(await fixture.open(), false);
	assert.deepEqual(fixture.loadingEvents.map(event => event[0]), ['show', 'hide']);
	assert.match(fixture.messages[0], /snapshot failed/);
	assert.equal(fixture.polls, 0);
});

test('late callbacks from a closed session cannot cancel the next import', async () => {
	const fixture = hostFixture('cancel-button');
	assert.equal(await fixture.open(), false);
	const oldProps = fixture.windowProps;
	fixture.state.mode = 'normal';
	fixture.state.onWindowOpen = () => {
		oldProps.onBeforeCloseCallFn();
		oldProps.buttonCallbackFn('close');
	};
	assert.equal(await fixture.open(), true);
	assert.equal(fixture.messages.length, 0);
});

test('minimize and maximize do not cancel an import request', async () => {
	const fixture = hostFixture();
	fixture.state.onWindowOpen = (props) => {
		props.buttonCallbackFn('minimize');
		props.buttonCallbackFn('maximize');
	};
	assert.equal(await fixture.open(), true);
	assert.equal(fixture.messages.length, 0);
});

test('host saves and accepts received text before closing the input window', async () => {
	const fixture = hostFixture();
	assert.equal(await fixture.open(), true);
	assert.equal(fixture.storage.get(textKey), input);
	assert.deepEqual(fixture.operations, ['text-saved', 'accepted', 'closed']);
	assert.equal(fixture.messages.length, 0);
});

test('host closes the requested input window even when the existence query incorrectly reports false', async () => {
	const fixture = hostFixture('false-negative');
	assert.equal(await fixture.open(), true);
	assert.deepEqual(fixture.operations, ['text-saved', 'accepted', 'closed']);
});

test('first import is handled even when opening resolves only after the input window closes', { timeout: 1000 }, async () => {
	const fixture = hostFixture('cold-open');
	assert.equal(await fixture.open(), true);
	assert.deepEqual(fixture.operations, ['text-saved', 'accepted', 'closed']);
	assert.equal(fixture.messages.length, 0);
});

test('slow first window visibility does not stop the import listener after three seconds', async () => {
	const fixture = hostFixture('cold-load');
	assert.equal(await fixture.open(), true);
	assert.deepEqual(fixture.operations, ['text-saved', 'accepted', 'closed']);
	assert.equal(fixture.messages.length, 0);
});

test('a stalled or rejected window-close call cannot hold an accepted import', { timeout: 1000 }, async () => {
	for (const mode of ['close-stalled', 'close-rejected']) {
		const fixture = hostFixture(mode);
		assert.equal(await fixture.open(), true);
		assert.deepEqual(fixture.operations, ['text-saved', 'accepted', 'closed']);
		assert.equal(fixture.messages.length, 0);
	}
});

test('window-opening failures still give feedback and cannot accept a conversion', async () => {
	for (const mode of ['open-rejected', 'open-false']) {
		const fixture = hostFixture(mode);
		assert.equal(await fixture.open(), false);
		assert.equal(fixture.messages.length, 1);
		assert.match(fixture.messages[0], /输入窗口打开失败/);
		assert.equal(fixture.operations.includes('accepted'), false);
	}
});

test('import screen messages do not mention implementation processes', () => {
	assert.equal(html.includes('主程序'), false);
});

test('expired and foreign-session requests cannot start a conversion', async () => {
	for (const mode of ['expired', 'stale']) {
		const fixture = hostFixture(mode);
		assert.equal(await fixture.open(), false);
		assert.equal(fixture.operations.includes('accepted'), false);
	}
});

test('save failure is reported even when writing the error log also fails', async () => {
	const fixture = hostFixture('storage-failure');
	assert.equal(await fixture.open(), false);
	assert.equal(fixture.storage.get(actionKey).status, 'failed');
	assert.equal(fixture.messages.length, 1);
	assert.match(fixture.messages[0], /cannot save import/);
});
