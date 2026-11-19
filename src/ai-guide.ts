import { runProbe, showPreview } from './probe-core';
import { buildCurrentRegionSnapshot } from './region-export';

const connectionJsonPlaceholder = '【粘贴“导出连接关系”得到的 JSON】';

const formatDescription = `连接关系文本使用 JSON，字段规则如下：

- 根对象必须完整包含 format、version、components 和 nets。
- format：字符串，固定为 jlc-schematic-region。
- version：数字，固定为 1。
- components：数组，包含框选区域内的全部器件，不得省略未修改器件。
- 每个 components 项必须包含 designator、name 和 pins。designator 是原理图中的真实位号；subPart 和 symbol 为可选字段，但输入中存在时必须原样保留。
- referenceProperties：可选的只读参考字段，包含器件属性面板中的 key（关键属性）和 more（更多属性）。这些内容只用于帮助 AI 识别器件、型号、参数、制造商和物料信息，不属于需要导入或修改的连接结构。
- AI 在分析时可以使用 referenceProperties；设计或修改后输出可导入 JSON 时，可以完整省略所有 referenceProperties。即使保留该字段，插件导入时也会完全忽略其内容，不进行匹配、不写回原理图。
- pins：数组。每个引脚必须完整包含 number、name、type 和 noConnected。
- number：引脚编号字符串；name：引脚名称字符串；type：电气类型字符串；noConnected：布尔值，只能为 true 或 false。
- nets：数组，包含完整网络列表，不得只输出发生变化的网络。
- 每个 nets 项必须完整包含 name、scope、generated 和 members。
- name：非空网络名称字符串。
- scope：只能为 internal 或 external。internal 表示只连接框选区域内部，external 表示还连接区域外部。
- direction：当 scope 为 external 时必须提供，只能为 IN、OUT 或 BI；internal 网络可以不提供 direction。
- generated：必填布尔值。保留输入中已有网络的原值；AI 新建的命名网络必须填写 false。
- members：必填数组，元素格式为“位号.引脚编号”，只能引用 components 中真实存在的引脚。同一引脚不得出现在多个网络。internal 网络和 AI 新建的普通信号网络至少要有一个成员。
- 只有真实存在于最新输入中的 external 网络允许 members 为空，表示用户已框选同名的电源或地标识；不得虚构空成员网络。
- 普通信号网络可以直接由一个或多个真实器件引脚组成，不要求用户提前放置网络标识。

修改时必须保留除 referenceProperties 以外的完整 JSON 结构和所有未修改内容，不得省略 generated、noConnected 等必填字段。referenceProperties 可以省略，也不得把其中内容作为需要写回原理图的修改项。不得添加坐标字段，不得移动、旋转或镜像器件。`;

const designPrompt = `你是一名电子电路设计工程师。当前对话没有任何前置信息，请仅根据本提示中的需求，设计实现目标功能的原理图连接方案。

我正在使用一个原理图插件。插件的工作方式如下：

1. 插件不能自动新增、删除、移动、旋转或镜像器件。
2. 我需要先按照你的清单，在原理图中手动放置器件。
3. 我只需要手动放置方案使用的电源和地，例如 +5V、+3.3V 和 GND。其他信号网络不需要我提前放置网络标识，由你在后续修改 JSON 时根据真实器件引脚创建。
4. 器件放置完成后，我会导出一份 JSON 格式的当前连接关系，其中包含原理图软件实际分配的器件位号。
5. 届时你需要根据最新导出的 JSON 和其中的真实位号修改网络连接，插件再按照修改后的 JSON 自动完成连接。
6. 当前阶段不要输出 JSON，也不要假设原理图中已经存在任何器件或网络。

需要设计的功能：

【填写需要实现的功能】

已知条件：

- 供电电压：【填写供电条件；不确定可写“待定”】
- 输入信号或接口：【填写输入；没有可写“无”】
- 输出信号或接口：【填写输出；没有可写“无”】
- 已确定的器件或型号：【填写型号；没有可写“无”】
- 负载、电流、频率、通信标准等关键参数：【填写参数；没有可写“未知”】
- 尺寸、功耗、成本或其他限制：【填写限制；没有可写“无”】

请先判断现有信息是否足以完成设计。

如果设计过程中对需求、器件型号、参数、接口电平、引脚定义、网络连接或安全性存在任何疑问，必须立即停止设计，不得猜测，也不得继续给出最终方案。可以先搜索数据手册或其他资料，但搜索结果只能作为待确认信息。请将搜索结论、依据和仍存在的疑问列在“需要用户确认的问题”中，等待我明确确认后再继续。

如果信息已经足够，请按以下格式输出电路方案：

一、方案说明

说明电路的工作原理、功能模块、信号流向和关键设计依据。

二、需要放置的器件

使用表格列出：

- 器件类型
- 建议型号或参数
- 数量
- 用途
- 选型注意事项

必须包含实现目标功能所需的电源处理、去耦、限流、上拉、下拉、滤波、偏置和保护器件，不要只列核心器件，也不要添加与目标功能无关的器件。

电容容量中的微法必须统一写成 uF，不得使用 µF 或 μF，例如 0.1uF、1uF、10uF。

当前阶段不要建议或指定 R1、U1、C1 等器件位号。多个同类型器件应使用功能或连接对象区分，例如“按键 1 上拉电阻”和“按键 2 上拉电阻”。真实位号以后续导出的 JSON 为准。

三、完整连接表

按网络列出连接关系，每个网络必须说明：

- 网络名称
- 连接的器件引脚
- 网络用途
- 是否连接区域外部

电源和地网络应使用实际名称，例如 +5V、+3.3V 和 GND。

其他信号网络由你根据功能使用明确、稳定的名称，例如 NRST、SWDIO、OSC_IN。不要要求我提前放置这些信号网络标识。

当前阶段不得生成器件位号。连接表应使用“器件用途（器件类型）.引脚编号（引脚名称）”表示，并通过器件用途区分多个同类型器件。真实位号以后续导出的 JSON 为准。

只有在器件型号和数据手册引脚定义确定时，才能填写具体引脚编号。无法确定时应明确标记“需要根据最终型号确认”，不得猜测引脚编号。

同一个电气节点只能使用一个网络名称。需要互相连通的引脚必须列在同一个网络中。

四、设计检查

检查并说明：

- 供电电压和接口电平是否兼容
- 电源和地连接是否完整
- 去耦、限流、上拉、下拉、滤波和保护是否充分
- 输入和输出是否存在冲突
- 器件额定电压、电流和功耗是否满足要求
- 是否有悬空或未使用引脚
- 哪些未使用引脚需要设置为不连接

五、需要我执行的操作

给出一份简短、按顺序排列的操作清单，明确列出：

1. 需要在原理图中放置哪些器件；
2. 需要放置哪些电源和地；
3. 放置器件时需要确认哪些型号、参数或引脚定义。

不要要求我手动放置普通信号网络标识。普通信号网络由你在收到最新 JSON 后创建。

当前阶段不要输出 jlc-schematic-region JSON。器件尚未实际放置前，不得在 JSON 或连接结果中虚构器件。

完成后，我会重新导出连接关系，并把最新 JSON 发送给你继续修改。

收到我后续发送的最新 JSON 后，必须按照最初确认的目标功能继续完成连接修改，并遵守以下规则：

1. 必须以我最后一次发送的 JSON 为唯一依据，不得继续使用更早版本的器件、位号、引脚或网络信息。
2. 完整保留输入中的 format、version、components 及其全部引脚定义，只修改确实需要调整的 nets。components 中的 referenceProperties 只是只读参考信息，输出可导入 JSON 时可以省略。
3. members 只能引用最新 components 中真实存在的“位号.引脚编号”，不得虚构器件、位号或引脚。
4. 不得添加坐标、布局、导线形状或器件位置字段，不得新增、删除、移动、旋转或镜像器件。
5. 如果缺少必要器件、电源或地，只说明需要我补充的内容，不得在 JSON 中虚构。我补充并重新导出后再继续修改。
6. 对于电源和地以外的信号网络，可以根据目标功能创建新的命名网络，并连接最新 JSON 中真实存在且 noConnected 为 false 的引脚。
7. 新建的普通信号网络必须填写 generated: false；输入中已有网络的 generated 必须原样保留。
8. 如果修改过程中对器件身份、实际位号、引脚定义、目标网络、scope、direction 或连接意图存在任何疑问，必须立即停止修改并向我询问，不得输出修改后的 JSON。可以先搜索相关资料，但搜索结果只能放在对应的询问项下并明确标记为“待用户确认”，不得直接作为已确认事实。
9. 每次修改 JSON 时，都必须先给出简短的修改说明，再在单独的 json 代码块中输出修改后的完整 JSON。
10. 完整 JSON 必须包含全部 components 和全部 nets，包括没有变化的内容。不得只输出发生变化的网络、部分内容、差异内容或省略号。
11. 输出前检查每个 members 引用是否真实存在、同一引脚是否被加入多个网络，以及 noConnected 为 true 的引脚是否被错误连接。

后续连接关系 JSON 的格式含义如下：

${formatDescription}`;

const analysisPromptTemplate = `请你阅读以下文本形式的原理图连接关系，并进行完整分析。

文本的格式含义如下：
${formatDescription}

请先分析该电路实现了什么功能：
1. 根据器件类型、引脚名称、电气类型、网络名称和连接关系，判断电路的主要用途。
2. 用简洁语言概括电路的输入、处理过程和输出。
3. 划分电源、控制、驱动、保护、滤波、通信等功能模块，并说明每个模块的作用。
4. 按照信号流向说明电路的工作原理，包括上电默认状态、正常工作状态和关键控制状态。
5. 说明关键器件在电路中的用途，以及它们之间如何配合实现整体功能。
6. 如果仅凭连接关系无法确定某项功能，必须明确标注“无法确定”，并说明缺少哪些信息，不得猜测。

然后重点检查：
1. 电源、地、输入和输出连接是否合理。
2. 是否存在悬空、错误短接、方向冲突、重复连接或网络命名问题。
3. 是否缺少限流、上拉、下拉、滤波、保护、偏置或去耦器件。
4. 各器件之间的连接是否满足常见数据手册要求。
5. 电源电压、接口电平和器件额定参数是否可能存在不兼容。
6. 是否存在可能造成上电状态不确定、误触发、过流或器件损坏的连接。
7. 明确列出建议修改的网络、涉及的器件引脚、修改原因和预期效果。

请按照以下顺序输出：

一、电路功能概述
说明该电路主要实现什么功能，以及主要输入和输出。

二、工作原理
说明功能模块、信号流向、上电默认状态和主要工作过程。

三、器件作用
说明各关键器件在电路中的用途。

四、检查结果
分别列出确认正常、存在风险和无法确定的内容。

五、修改建议
明确列出需要修改的网络、器件引脚、原因和建议方案。

如果分析过程中对器件型号、引脚定义、网络用途、供电条件或连接意图存在疑问，必须停止对该部分下结论，并向我提出需要确认的问题。可以搜索相关资料，但搜索结果必须标注为“待用户确认”，不能直接作为确定结论。

实际连接关系文本如下：

~~~json
${connectionJsonPlaceholder}
~~~`;

const modificationPromptTemplate = `请你按照以下规则修改当前的原理图连接关系，实现【在这里填写目标功能】。

规则：
1. 必须以我最后一次发送的 JSON 为唯一依据。完整保留 format、version、components 及其全部引脚定义，只修改当前插件能够执行的 nets。components 中的 referenceProperties 只是提供给你识别器件和参数的只读参考信息，输出可导入 JSON 时可以省略，插件也不会导入或匹配其中内容。
2. members 只能引用 components 中真实存在的“位号.引脚编号”。
3. 不得添加坐标、布局、导线形状或器件位置字段。
4. 不得擅自新增、删除、移动、旋转或镜像器件。
5. 如果实现目标必须新增元件，请先说明需要新增的器件类型、建议型号或参数、数量、用途和需要连接的引脚，不要建议或指定器件位号，也不要在 JSON 中虚构该器件。电容容量中的微法必须统一写成 uF，不得使用 µF 或 μF。我会放置新的器件，并重新复制一份连接关系让你继续修改；后续只能使用最新 JSON 中的真实位号。
6. 如果新增元件已经放置，必须等待我发送重新导出的最新 JSON；不得把之前的 JSON 与新增元件信息自行拼接。
7. 不得凭空创建输入 JSON 中不存在的电源或地网络，例如 VCC、+3.3V、+5V、GND。若目标所需的真实电源或地没有出现在 nets 中，请说明需要把对应的电源或地网络标识一同框选后重新导出，此时不要输出修改后的 JSON。
8. 可以把当前未出现在任何 nets.members 中、且 noConnected 为 false 的真实悬空引脚加入已有网络，也可以由多个这类真实引脚组成目标功能所需的新命名网络。新网络的 members 必须全部引用最新 components 中存在的真实引脚，并填写 generated: false，不得仅凭网络名称虚构器件或连接。
9. noConnected 为 true 的引脚不得加入任何网络；如确实需要使用，请要求我先清除该引脚的不连接标记并重新导出。
10. 保持现有 external 网络的 name、scope 和 direction 与输入一致，除非我的目标明确要求修改且输入中存在可用的实体网络依据。
11. 只有确认不缺器件、不缺实际电源或地、所有目标引脚都来自最新输入时，才输出修改说明，并在单独的 json 代码块中输出完整、可直接导入的 JSON，不要省略未修改内容。
12. 如果修改过程中对器件身份、实际位号、引脚定义、目标网络、scope、direction 或连接意图存在任何疑问，必须立即停止修改并向我询问，不得输出修改后的 JSON。
13. 可以先搜索数据手册或其他资料，但不得直接将搜索结果视为已确认事实。必须把搜索结论、依据和疑问放在对应的询问项下，明确标记为“待用户确认”，得到我确认后才能继续修改。

输出前必须自检：
1. 除可省略的 referenceProperties 外，components 与最新输入逐字段一致；
2. 每个 members 引用都真实存在，且同一引脚没有出现在多个网络；
3. 没有虚构输入中不存在的电源或地；新建普通信号网络名称明确、generated 为 false，且 members 全部是真实引脚；
4. 新接入的悬空引脚 noConnected 为 false；如果目标网络是新增网络，其全部 members 都来自最新输入中的真实器件引脚；
5. 如果任一条件不满足，只输出需要我补充或重新框选的内容，不输出 JSON。

文本的格式含义如下：
${formatDescription}

当前原理图连接关系如下：

~~~json
${connectionJsonPlaceholder}
~~~`;

async function currentSelectionConnectionJson(): Promise<string> {
	const selectedIds = await eda.sch_SelectControl.getAllSelectedPrimitives_PrimitiveId();
	if (selectedIds.length === 0) {
		return connectionJsonPlaceholder;
	}
	try {
		const snapshot = await buildCurrentRegionSnapshot();
		return JSON.stringify(snapshot.region, null, 2);
	}
	catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (message.includes('当前选择中没有普通器件')) {
			return connectionJsonPlaceholder;
		}
		return `【当前框选自动导出失败：${message}】`;
	}
}

export async function showAiGuide(): Promise<void> {
	await runProbe('与AI联动', async (finishLoading) => {
		const connectionJson = await currentSelectionConnectionJson();
		const analysisPrompt = analysisPromptTemplate.replace(connectionJsonPlaceholder, () => connectionJson);
		const modificationPrompt = modificationPromptTemplate.replace(connectionJsonPlaceholder, () => connectionJson);
		finishLoading();
		await showPreview('让AI看看你的原理图：与AI联动', [
			{ label: '让 AI 设计', content: designPrompt },
			{ label: '让 AI 分析', content: analysisPrompt },
			{ label: '让 AI 修改', content: modificationPrompt },
			{ label: '格式含义', content: formatDescription },
		]);
	}, '正在加载 AI 联动内容，请稍候…');
}
