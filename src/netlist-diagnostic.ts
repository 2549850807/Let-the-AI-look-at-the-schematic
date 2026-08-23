import {
	environmentInfo,
	getSelectedPrimitives,
	isComponent,
	jsonPreviewTab,
	now,
	readNetlist,
	runProbe,
	showPreview,
} from './probe-core';

interface LineContext {
	lineNumber: number;
	lines: Array<string>;
}

function unique(values: Array<string>): Array<string> {
	return [...new Set(values)];
}

function detectFormat(text: string): string {
	const first = text.trimStart()[0];
	if (first === '{' || first === '[') {
		return 'json';
	}
	if (first === '(') {
		return 's-expression';
	}
	if (/^\s*\[[^\]]+\]/m.test(text)) {
		return 'sectioned-text';
	}
	return 'plain-text';
}

function summarizeJson(value: unknown, depth = 0): unknown {
	if (value === null || typeof value !== 'object') {
		return typeof value;
	}
	if (Array.isArray(value)) {
		return {
			type: 'array',
			length: value.length,
			itemStructure: depth < 4 && value.length > 0 ? summarizeJson(value[0], depth + 1) : undefined,
		};
	}
	const entries = Object.entries(value as Record<string, unknown>);
	return {
		type: 'object',
		keys: entries.map(([key]) => key),
		children: depth < 4
			? Object.fromEntries(entries.slice(0, 30).map(([key, child]) => [key, summarizeJson(child, depth + 1)]))
			: undefined,
	};
}

function collectJsonMatches(
	value: unknown,
	designators: Set<string>,
	path: string,
	matches: Array<Record<string, unknown>>,
): void {
	if (matches.length >= 200) {
		return;
	}
	if (typeof value === 'string') {
		const found = [...designators].filter(designator => value.includes(designator));
		if (found.length > 0) {
			matches.push({ path, value, designators: found });
		}
		return;
	}
	if (value === null || typeof value !== 'object') {
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((child, index) => collectJsonMatches(child, designators, `${path}[${index}]`, matches));
		return;
	}
	for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
		collectJsonMatches(child, designators, path ? `${path}.${key}` : key, matches);
	}
}

function lineContexts(text: string, designators: Array<string>): Array<LineContext> {
	const lines = text.split(/\r?\n/);
	const matchedIndexes = new Set<number>();
	for (let index = 0; index < lines.length; index += 1) {
		if (designators.some(designator => lines[index].includes(designator))) {
			matchedIndexes.add(index);
		}
	}
	return [...matchedIndexes].slice(0, 100).map((index) => {
		const start = Math.max(0, index - 2);
		const end = Math.min(lines.length, index + 3);
		return {
			lineNumber: index + 1,
			lines: lines.slice(start, end).map((line, offset) => `${start + offset + 1}: ${line}`),
		};
	});
}

export async function diagnoseNetlistStructure(): Promise<void> {
	await runProbe('阶段 1 网表结构诊断', async () => {
		const selected = await getSelectedPrimitives();
		const designators = unique(selected
			.filter(isComponent)
			.filter(component => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT)
			.map(component => component.getState_Designator())
			.filter((designator): designator is string => Boolean(designator)));
		if (designators.length === 0) {
			throw new Error('当前选择中没有带位号的普通器件。请先框选一个小型测试区域。');
		}

		const netlist = await readNetlist();
		const text = netlist.text.replace(/^\uFEFF/, '');
		const format = detectFormat(text);
		const lines = text.split(/\r?\n/);
		const nonEmptyLines = lines.filter(line => line.trim().length > 0);
		let jsonStructure: unknown;
		const jsonMatches: Array<Record<string, unknown>> = [];
		let jsonError: string | undefined;
		if (format === 'json') {
			try {
				const parsed = JSON.parse(text) as unknown;
				jsonStructure = summarizeJson(parsed);
				collectJsonMatches(parsed, new Set(designators), '', jsonMatches);
			}
			catch (error) {
				jsonError = error instanceof Error ? error.message : String(error);
			}
		}

		const contexts = lineContexts(text, designators);
		const report = {
			probe: 'phase1-netlist-structure-diagnostic',
			capturedAt: now(),
			environment: environmentInfo(),
			file: {
				name: netlist.file.name,
				length: text.length,
				lineCount: lines.length,
				nonEmptyLineCount: nonEmptyLines.length,
				detectedFormat: format,
				firstNonWhitespaceCharacter: text.trimStart()[0] ?? '',
			},
			selectedDesignators: designators,
			occurrenceCounts: Object.fromEntries(designators.map(designator => [
				designator,
				lines.filter(line => line.includes(designator)).length,
			])),
			delimiters: {
				leftParenthesis: (text.match(/\(/g) ?? []).length,
				rightParenthesis: (text.match(/\)/g) ?? []).length,
				leftBrace: (text.match(/\{/g) ?? []).length,
				rightBrace: (text.match(/\}/g) ?? []).length,
				tab: (text.match(/\t/g) ?? []).length,
				comma: (text.match(/,/g) ?? []).length,
			},
			jsonError,
			jsonStructure,
			jsonMatches,
			contextCount: contexts.length,
			nextStep: '请复制“诊断摘要”和“所选位号上下文”。根据真实字段结构实现正式网表解析器。',
		};

		await showPreview('阶段 1：网表结构诊断', [
			jsonPreviewTab('诊断摘要', report),
			jsonPreviewTab('所选位号上下文', contexts),
			{ label: '文件头部', content: nonEmptyLines.slice(0, 120).join('\n') },
		]);
	});
}
