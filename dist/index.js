"use strict";
var edaEsbuildExportName = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    about: () => about,
    activate: () => activate,
    deactivate: () => deactivate,
    phase0CreateNetLabel: () => phase0CreateNetLabel,
    phase0CreateNetPort: () => phase0CreateNetPort,
    phase0DeleteNetLabel: () => phase0DeleteNetLabel,
    phase0DeleteNetPort: () => phase0DeleteNetPort,
    phase0DeleteWire: () => phase0DeleteWire,
    phase0ExportEventLog: () => phase0ExportEventLog,
    phase0ExportSelection: () => phase0ExportSelection,
    phase0LabelThenDeleteWire: () => phase0LabelThenDeleteWire,
    phase0ProbeNetlistRefresh: () => phase0ProbeNetlistRefresh,
    phase0RestoreWire: () => phase0RestoreWire,
    phase0SnapshotWire: () => phase0SnapshotWire,
    phase1DiagnoseNetlistStructure: () => phase1DiagnoseNetlistStructure,
    phase1ExportRegionStructure: () => phase1ExportRegionStructure,
    phase2OpenRegionImportInput: () => phase2OpenRegionImportInput,
    phase2RunRegionImportPreflight: () => phase2RunRegionImportPreflight,
    phase3RunWireConflictPreflight: () => phase3RunWireConflictPreflight,
    phase4CleanupComplexWireCloneProbe: () => phase4CleanupComplexWireCloneProbe,
    phase4DiagnoseWireCloneResidue: () => phase4DiagnoseWireCloneResidue,
    phase4RecoverFullRegionStubPortProbe: () => phase4RecoverFullRegionStubPortProbe,
    phase4RecoverOriginalWireDeleteRestoreProbe: () => phase4RecoverOriginalWireDeleteRestoreProbe,
    phase4RecoverSingleNetworkPrototype: () => phase4RecoverSingleNetworkPrototype,
    phase4RunAllNetworkSequentialStubPortProbe: () => phase4RunAllNetworkSequentialStubPortProbe,
    phase4RunComplexWireCloneProbe: () => phase4RunComplexWireCloneProbe,
    phase4RunFullRegionStubPortRollbackProbe: () => phase4RunFullRegionStubPortRollbackProbe,
    phase4RunNetPortLifecycleProbe: () => phase4RunNetPortLifecycleProbe,
    phase4RunNetworkStubPortProbe: () => phase4RunNetworkStubPortProbe,
    phase4RunOneClickFullDebug: () => phase4RunOneClickFullDebug,
    phase4RunOneClickPersistentConversion: () => phase4RunOneClickPersistentConversion,
    phase4RunOriginalWireDeleteRestoreProbe: () => phase4RunOriginalWireDeleteRestoreProbe,
    phase4RunPersistentFullRegionConversion: () => phase4RunPersistentFullRegionConversion,
    phase4RunSingleNetworkPrototype: () => phase4RunSingleNetworkPrototype,
    phase4UndoPersistentFullRegionConversion: () => phase4UndoPersistentFullRegionConversion,
    phase4VerifyManualRecoveryAndClearState: () => phase4VerifyManualRecoveryAndClearState,
    showAiCollaborationGuide: () => showAiCollaborationGuide
  });

  // extension.json
  var extension_default = {
    name: "schematic-structure-text-bridge",
    uuid: "a0e032396e0443d8980e74d9c547a4ef",
    displayName: "\u8BA9AI\u770B\u770B\u4F60\u7684\u539F\u7406\u56FE",
    description: "\u672C\u63D2\u4EF6\u63D0\u4F9B\u8BA9AI\u8FDB\u884C\u539F\u7406\u56FE\u8BBE\u8BA1\u3001\u5206\u6790\u3001\u4FEE\u6539\u7684\u80FD\u529B\uFF0C\u652F\u6301\u5305\u62EC\u7F51\u9875\u7248\u5728\u5185\u7684\u4EFB\u610FAI\u5DE5\u5177\u3002",
    version: "1.1.23",
    publisher: "Yt\u79BE\u6597rY",
    engines: {
      eda: "^4.2.0"
    },
    license: "Apache-2.0",
    repository: {
      type: "extension-store",
      url: "https://github.com/2549850807/Let-the-AI-look-at-the-schematic.git"
    },
    categories: "Other",
    keywords: [
      "Schematic",
      "Structure",
      "Netlist",
      "AI"
    ],
    images: {
      logo: "./images/logo.png"
    },
    homepage: "",
    bugs: "",
    activationEvents: {
      onStartupFinished: "activate"
    },
    entry: "./dist/index",
    dependentExtensions: {},
    headerMenus: {
      sch: [
        {
          id: "schematicStructureTextBridge",
          title: "\u8BA9AI\u770B\u770B\u4F60\u7684\u539F\u7406\u56FE",
          menuItems: [
            {
              id: "phase1ExportRegionStructure",
              title: "\u5BFC\u51FA\u8FDE\u63A5\u5173\u7CFB",
              registerFn: "phase1ExportRegionStructure"
            },
            {
              id: "phase2OpenRegionImportInput",
              title: "\u5BFC\u5165\u8FDE\u63A5\u5173\u7CFB",
              registerFn: "phase2OpenRegionImportInput"
            },
            {
              id: "phase4UndoPersistentFullRegionConversion",
              title: "\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165",
              registerFn: "phase4UndoPersistentFullRegionConversion"
            },
            {
              id: "showAiCollaborationGuide",
              title: "\u4E0EAI\u8054\u52A8",
              registerFn: "showAiCollaborationGuide"
            },
            {
              id: "about",
              title: "\u5173\u4E8E",
              menuItems: [
                {
                  id: "aboutExtension",
                  title: "\u63D2\u4EF6\u4FE1\u606F",
                  registerFn: "about"
                },
                {
                  id: "phase4RunOneClickFullDebug",
                  title: "\u5168\u9762\u68C0\u67E5",
                  registerFn: "phase4RunOneClickFullDebug"
                }
              ]
            }
          ]
        }
      ]
    }
  };

  // src/probe-core.ts
  var STORAGE_STATE_KEY = "phase0ProbeStateV2";
  var STORAGE_EVENT_KEY = "phase0ProbeEventsV2";
  var EVENT_LISTENER_ID = "schematic-structure-text-bridge-phase0-v2";
  var PREVIEW_STORAGE_KEY = "phase0PreviewPayloadV1";
  var PREVIEW_IFRAME_ID = "phase0-preview-window";
  function readProbeState() {
    const stored = eda.sys_Storage.getExtensionUserConfig(STORAGE_STATE_KEY);
    return stored && typeof stored === "object" ? stored : {};
  }
  async function updateProbeState(update) {
    const next = { ...readProbeState(), ...update };
    for (const key of Object.keys(next)) {
      if (next[key] === void 0) {
        delete next[key];
      }
    }
    await eda.sys_Storage.setExtensionUserConfig(STORAGE_STATE_KEY, next);
    return next;
  }
  function readEventLog() {
    const stored = eda.sys_Storage.getExtensionUserConfig(STORAGE_EVENT_KEY);
    return Array.isArray(stored) ? stored : [];
  }
  async function appendProbeEvent(detail, primitiveIds = []) {
    const events = readEventLog();
    events.push({ timestamp: now(), eventType: "probe", primitiveIds, detail });
    await eda.sys_Storage.setExtensionUserConfig(STORAGE_EVENT_KEY, events.slice(-500));
  }
  async function ensureProbeEventLog() {
    if (eda.sch_Event.isEventListenerAlreadyExist(EVENT_LISTENER_ID)) {
      return;
    }
    eda.sch_Event.addPrimitiveEventListener(EVENT_LISTENER_ID, "all", async (eventType, props) => {
      const events = readEventLog();
      events.push({ timestamp: now(), eventType, primitiveIds: [...props.primitiveIds] });
      await eda.sys_Storage.setExtensionUserConfig(STORAGE_EVENT_KEY, events.slice(-500));
    });
  }
  function removeProbeEventLog() {
    if (eda.sch_Event.isEventListenerAlreadyExist(EVENT_LISTENER_ID)) {
      eda.sch_Event.removeEventListener(EVENT_LISTENER_ID);
    }
  }
  function now() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function cloneLine(line) {
    return JSON.parse(JSON.stringify(line));
  }
  function safePrimitiveId(primitive) {
    try {
      return primitive.getState_PrimitiveId();
    } catch {
      return void 0;
    }
  }
  function newIds(before, after) {
    const existing = new Set(before);
    return after.filter((id) => !existing.has(id));
  }
  async function waitForNewIds(readIds, before) {
    for (const delay3 of [100, 250, 500, 1e3, 1500]) {
      await new Promise((resolve) => globalThis.setTimeout(resolve, delay3));
      const created = newIds(before, await readIds());
      if (created.length > 0) {
        return created;
      }
    }
    return [];
  }
  function startObservedCall(call, operation) {
    let settled = false;
    let returned;
    let errorMessage;
    void appendProbeEvent(`${operation}: started`);
    void call.then(async (value) => {
      settled = true;
      returned = value;
      await appendProbeEvent(`${operation}: resolved`);
    }).catch(async (error) => {
      settled = true;
      errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      await appendProbeEvent(`${operation}: rejected - ${errorMessage}`);
    });
    return {
      getError: () => errorMessage,
      getReturned: () => returned,
      isSettled: () => settled
    };
  }
  function showInfo(content, title = "\u9636\u6BB5 0 SDK \u63A2\u9488") {
    eda.sys_Dialog.showInformationMessage(content, title);
  }
  async function runProbe(title, action) {
    try {
      await ensureProbeEventLog();
      await appendProbeEvent(`${title}: menu started`);
      await action();
      await appendProbeEvent(`${title}: menu completed`);
    } catch (error) {
      console.error(`[${title}]`, error);
      const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      await appendProbeEvent(`${title}: menu failed - ${message}`);
      showInfo(message, `${title}\u5931\u8D25`);
    }
  }
  function confirmAction(content, title) {
    return new Promise((resolve) => {
      eda.sys_Dialog.showConfirmationMessage(content, title, "\u7EE7\u7EED\u6267\u884C", "\u53D6\u6D88", resolve);
    });
  }
  function isComponent(primitive) {
    return primitive.getState_PrimitiveType() === ESCH_PrimitiveType.COMPONENT;
  }
  function isWire(primitive) {
    return primitive.getState_PrimitiveType() === ESCH_PrimitiveType.WIRE;
  }
  function isAttribute(primitive) {
    return primitive.getState_PrimitiveType() === ESCH_PrimitiveType.ATTRIBUTE;
  }
  async function getSelectedPrimitives() {
    const selectedIds = await eda.sch_SelectControl.getAllSelectedPrimitives_PrimitiveId();
    if (selectedIds.length === 0) {
      throw new Error("\u8BF7\u5148\u5728\u539F\u7406\u56FE\u4E2D\u6846\u9009\u81F3\u5C11\u4E00\u4E2A\u56FE\u5143\u3002");
    }
    const selected = await eda.sch_Primitive.getPrimitivesByPrimitiveId(selectedIds);
    if (selected.length === 0) {
      throw new Error("\u5DF2\u53D6\u5F97\u9009\u62E9 ID\uFF0C\u4F46\u65E0\u6CD5\u4ECE\u5F53\u524D\u539F\u7406\u56FE\u753B\u5E03\u91CD\u65B0\u8BFB\u53D6\u56FE\u5143\u3002");
    }
    return selected;
  }
  async function getAutomaticSelectedPin() {
    const selected = await getSelectedPrimitives();
    const components = selected.filter(isComponent).filter((component2) => component2.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
    if (components.length !== 1) {
      throw new Error(`\u8BF7\u53EA\u9009\u4E2D\u4E00\u4E2A\u666E\u901A\u5668\u4EF6\uFF1B\u5F53\u524D\u9009\u4E2D ${components.length} \u4E2A\u666E\u901A\u5668\u4EF6\u3002`);
    }
    const component = components[0];
    const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
    if (pins.length === 0) {
      throw new Error("\u6240\u9009\u5668\u4EF6\u6CA1\u6709\u53EF\u8BFB\u53D6\u7684\u5F15\u811A\u3002");
    }
    return { component, pin: pins[0] };
  }
  function wirePoints(wire) {
    const line = wire.getState_Line();
    const coordinates = Array.isArray(line[0]) ? line.flat() : line;
    const points = [];
    for (let index = 0; index + 1 < coordinates.length; index += 2) {
      points.push({ x: coordinates[index], y: coordinates[index + 1] });
    }
    return points;
  }
  function distanceToSegmentSquared(point, start, end) {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    if (deltaX === 0 && deltaY === 0) {
      return (point.x - start.x) ** 2 + (point.y - start.y) ** 2;
    }
    const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * deltaX + (point.y - start.y) * deltaY) / (deltaX ** 2 + deltaY ** 2)));
    const nearestX = start.x + ratio * deltaX;
    const nearestY = start.y + ratio * deltaY;
    return (point.x - nearestX) ** 2 + (point.y - nearestY) ** 2;
  }
  function distanceToWireSquared(pin, points) {
    const point = { x: pin.getState_X(), y: pin.getState_Y() };
    if (points.length < 2) {
      return points.length === 1 ? (point.x - points[0].x) ** 2 + (point.y - points[0].y) ** 2 : Number.POSITIVE_INFINITY;
    }
    let distance = Number.POSITIVE_INFINITY;
    for (let index = 1; index < points.length; index += 1) {
      distance = Math.min(distance, distanceToSegmentSquared(point, points[index - 1], points[index]));
    }
    return distance;
  }
  async function getAutomaticWireAndPin() {
    const selected = await getSelectedPrimitives();
    const wires = selected.filter(isWire);
    const components = selected.filter(isComponent).filter((component2) => component2.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
    if (wires.length !== 1 || components.length !== 1) {
      throw new Error(`\u8BF7\u540C\u65F6\u53EA\u9009\u4E2D\u4E00\u6761\u5BFC\u7EBF\u548C\u4E00\u4E2A\u666E\u901A\u5668\u4EF6\uFF1B\u5F53\u524D\u5BFC\u7EBF ${wires.length} \u6761\u3001\u666E\u901A\u5668\u4EF6 ${components.length} \u4E2A\u3002`);
    }
    const component = components[0];
    const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
    if (pins.length === 0) {
      throw new Error("\u6240\u9009\u5668\u4EF6\u6CA1\u6709\u53EF\u8BFB\u53D6\u7684\u5F15\u811A\u3002");
    }
    const points = wirePoints(wires[0]);
    const pin = pins.reduce((nearest, candidate) => {
      const nearestDistance = distanceToWireSquared(nearest, points);
      const candidateDistance = distanceToWireSquared(candidate, points);
      return candidateDistance < nearestDistance ? candidate : nearest;
    });
    return { wire: wires[0], component, pin };
  }
  async function getSelectedWire() {
    const wires = (await getSelectedPrimitives()).filter(isWire);
    if (wires.length !== 1)
      throw new Error(`\u8BF7\u53EA\u9009\u4E2D\u4E00\u6761\u5BFC\u7EBF\u8FDB\u884C\u6B64\u63A2\u9488\uFF1B\u5F53\u524D\u9009\u4E2D ${wires.length} \u6761\u3002`);
    return wires[0];
  }
  function createWireSnapshot(wire) {
    return {
      originalPrimitiveId: wire.getState_PrimitiveId(),
      line: cloneLine(wire.getState_Line()),
      net: wire.getState_Net(),
      color: wire.getState_Color(),
      lineWidth: wire.getState_LineWidth(),
      lineType: wire.getState_LineType(),
      capturedAt: now()
    };
  }
  function pinEndpointCandidates(pin) {
    const x = pin.getState_X();
    const y = pin.getState_Y();
    const length = pin.getState_PinLength();
    const rotation = (pin.getState_Rotation() % 360 + 360) % 360;
    const direction = {
      0: [1, 0],
      90: [0, 1],
      180: [-1, 0],
      270: [0, -1]
    };
    const [dx, dy] = direction[rotation] ?? [0, 0];
    return {
      reported: { mode: "REPORTED", x, y },
      rotation,
      pinLength: length,
      plusLength: { mode: "PLUS_LENGTH", x: x + dx * length, y: y + dy * length },
      minusLength: { mode: "MINUS_LENGTH", x: x - dx * length, y: y - dy * length },
      note: "\u65CB\u8F6C\u5230\u5750\u6807\u8F74\u6B63\u8D1F\u65B9\u5411\u7684\u6620\u5C04\u5C1A\u672A\u5B9E\u6D4B\uFF1B\u8BF7\u6BD4\u8F83\u4E09\u7EC4\u70B9\u4E0E\u753B\u5E03\u8FDE\u63A5\u7AEF\u3002"
    };
  }
  function hashText(text2) {
    let hash = 2166136261;
    for (let index = 0; index < text2.length; index += 1) {
      hash ^= text2.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
  function jsonPreviewTab(label, value) {
    return { label, content: JSON.stringify(value, null, 2) };
  }
  async function showPreview(title, tabs) {
    if (tabs.length === 0) {
      throw new Error("\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u5185\u5BB9\u3002");
    }
    const payload = { title, tabs, copyAll: title.includes("\u7ED3\u679C"), updatedAt: now() };
    await eda.sys_Storage.setExtensionUserConfig(PREVIEW_STORAGE_KEY, payload);
    if (await eda.sys_IFrame.isIFrameAlreadyExist(PREVIEW_IFRAME_ID)) {
      await eda.sys_IFrame.closeIFrame(PREVIEW_IFRAME_ID);
    }
    const opened = await eda.sys_IFrame.openIFrame("/iframe/index.html", 920, 680, PREVIEW_IFRAME_ID, {
      maximizeButton: true,
      minimizeButton: true,
      grayscaleMask: false,
      title
    });
    if (!opened) {
      throw new Error("\u9884\u89C8\u7A97\u53E3\u6253\u5F00\u5931\u8D25\u3002");
    }
  }
  async function readNetlist() {
    const file = await eda.sch_ManufactureData.getNetlistFile("phase0-netlist", ESYS_NetlistType.JLCEDA_PRO);
    if (!file)
      throw new Error("\u5F53\u524D\u56FE\u9875\u7F51\u8868\u8BFB\u53D6\u5931\u8D25\u3002");
    return { file, text: await file.text() };
  }
  function environmentInfo() {
    return {
      isWeb: eda.sys_Environment.isWeb(),
      isClient: eda.sys_Environment.isClient(),
      isJLCEDAProEdition: eda.sys_Environment.isJLCEDAProEdition(),
      isEasyEDAProEdition: eda.sys_Environment.isEasyEDAProEdition()
    };
  }
  async function collectNetlistSamples(reason) {
    const delays = [0, 250, 1e3, 3e3];
    const samples = [];
    let elapsed = 0;
    for (const milliseconds of delays) {
      await new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds - elapsed));
      elapsed = milliseconds;
      const { text: text2 } = await readNetlist();
      samples.push({ elapsedMs: milliseconds, length: text2.length, hash: hashText(text2), capturedAt: now() });
    }
    return { reason, environment: environmentInfo(), samples };
  }

  // src/region-export.ts
  var naturalCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  var REGION_SNAPSHOT_STORAGE_KEY = "phase1LastRegionSnapshotV1";
  function readStoredRegionSnapshot() {
    const stored = eda.sys_Storage.getExtensionUserConfig(REGION_SNAPSHOT_STORAGE_KEY);
    return stored && typeof stored === "object" ? stored : void 0;
  }
  function naturalCompare(left, right) {
    return naturalCollator.compare(left, right);
  }
  function text(value) {
    return typeof value === "string" ? value.trim() : "";
  }
  function resolvePropertyExpression(value, props) {
    const match = /^=\{(.+)\}$/.exec(value);
    return match ? text(props[match[1]]) : value;
  }
  function resolveComponentName(component, enetComponent) {
    const props = enetComponent.props ?? {};
    const sdkName = text(component.getState_Name());
    const enetName = text(props.Name);
    const candidates = [
      resolvePropertyExpression(sdkName, props),
      resolvePropertyExpression(enetName, props),
      text(props.DeviceName),
      text(props["Manufacturer Part"]),
      text(props.Value),
      sdkName,
      enetName
    ].filter((candidate) => candidate && !/^=\{.+\}$/.test(candidate));
    const name = candidates[0] ?? "";
    return {
      name,
      diagnostic: {
        sdkName,
        enetName,
        resolvedName: name
      }
    };
  }
  function compactProperties(entries) {
    return Object.fromEntries(entries.filter((entry) => entry[1] !== void 0 && entry[1] !== "").sort(([left], [right]) => naturalCompare(left, right)));
  }
  function componentReferenceProperties(component, resolvedName, props) {
    const footprint = component.getState_Footprint();
    const key = compactProperties([
      ["name", resolvedName],
      ["value", text(props.Value)],
      ["manufacturer", component.getState_Manufacturer() || text(props.Manufacturer)],
      ["manufacturerPartNumber", component.getState_ManufacturerId() || text(props["Manufacturer Part"])],
      ["supplier", component.getState_Supplier() || text(props.Supplier)],
      ["supplierPartNumber", component.getState_SupplierId() || text(props["Supplier Part"])],
      ["footprint", footprint?.name],
      ["addIntoBom", component.getState_AddIntoBom()],
      ["addIntoPcb", component.getState_AddIntoPcb()]
    ]);
    const more = Object.fromEntries(Object.entries(component.getState_OtherProperty() ?? {}).sort(([left], [right]) => naturalCompare(left, right)));
    return { key, more };
  }
  function parseEnet(raw) {
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`\u5F53\u524D ENET \u4E0D\u662F\u6709\u6548 JSON\uFF1A${detail}`);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("\u5F53\u524D ENET \u6839\u8282\u70B9\u4E0D\u662F\u5BF9\u8C61\u3002");
    }
    const root = parsed;
    if (!root.components || typeof root.components !== "object" || Array.isArray(root.components)) {
      throw new Error("\u5F53\u524D ENET \u7F3A\u5C11 components \u5BF9\u8C61\u3002");
    }
    return root;
  }
  function indexEnet(root) {
    const componentsByDesignator = /* @__PURE__ */ new Map();
    const pinsByMember = /* @__PURE__ */ new Map();
    const membersByNet = /* @__PURE__ */ new Map();
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
          throw new Error(`ENET \u4E2D\u5B58\u5728\u91CD\u590D\u5F15\u811A\u6210\u5458\uFF1A${member}`);
        }
        pinsByMember.set(member, {
          member,
          designator,
          number,
          name: text(pin.name),
          sourceNet
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
  async function readCurrentMemberNetworks(members) {
    const { text: raw } = await readNetlist();
    const { pinsByMember } = indexEnet(parseEnet(raw));
    return Object.fromEntries(members.map((member) => [member, pinsByMember.get(member)?.sourceNet ?? ""]));
  }
  function isGeneratedSourceNet(name) {
    return /^(?:N\$\d+|\$\d+(?:N\d+)?)$/i.test(name);
  }
  function generatedNetName(members, usedNames) {
    const firstMember = [...members].sort(naturalCompare)[0];
    const base = `AUTO_${firstMember.replace(".", "_")}`;
    let name = base;
    let suffix = 2;
    while (usedNames.has(name)) {
      name = `${base}_${suffix}`;
      suffix += 1;
    }
    usedNames.add(name);
    return name;
  }
  async function buildEnetConnectivitySnapshot() {
    const { text: raw } = await readNetlist();
    const root = parseEnet(raw);
    const { membersByNet } = indexEnet(root);
    const namedNetworks = [...membersByNet.entries()].filter(([name]) => !isGeneratedSourceNet(name)).map(([name, members]) => ({ name, members: [...members].sort(naturalCompare) })).sort((left, right) => naturalCompare(left.name, right.name));
    const generatedNetworks = [...membersByNet.entries()].filter(([name]) => isGeneratedSourceNet(name)).map(([, members]) => [...members].sort(naturalCompare)).sort((left, right) => naturalCompare(left.join("|"), right.join("|")));
    const canonical = JSON.stringify({ namedNetworks, generatedNetworks });
    return {
      capturedAt: now(),
      sourceVersion: text(root.version),
      networkCount: namedNetworks.length + generatedNetworks.length,
      connectedMemberCount: [...membersByNet.values()].reduce((count, members) => count + members.length, 0),
      namedNetworks,
      generatedNetworks,
      canonicalHash: hashText(canonical)
    };
  }
  function inferDirection(memberTypes) {
    const normalized = memberTypes.map((type) => type.toUpperCase());
    if (normalized.length > 0 && normalized.every((type) => type === "IN")) {
      return "IN";
    }
    if (normalized.length > 0 && normalized.every((type) => ["OUT", "OPEN COLLECTOR", "OPEN EMITTER"].includes(type))) {
      return "OUT";
    }
    return "BI";
  }
  function validateExport(value) {
    const errors = [];
    if (value.format !== "jlc-schematic-region" || value.version !== 1) {
      errors.push("\u683C\u5F0F\u6807\u8BC6\u6216\u7248\u672C\u4E0D\u6B63\u786E\u3002");
    }
    const componentPins = /* @__PURE__ */ new Set();
    const designators = /* @__PURE__ */ new Set();
    for (const component of value.components) {
      if (designators.has(component.designator)) {
        errors.push(`\u91CD\u590D\u4F4D\u53F7\uFF1A${component.designator}`);
      }
      designators.add(component.designator);
      const pinNumbers = /* @__PURE__ */ new Set();
      for (const pin of component.pins) {
        if (pinNumbers.has(pin.number)) {
          errors.push(`\u5668\u4EF6 ${component.designator} \u5B58\u5728\u91CD\u590D\u5F15\u811A\u7F16\u53F7\uFF1A${pin.number}`);
        }
        pinNumbers.add(pin.number);
        componentPins.add(`${component.designator}.${pin.number}`);
      }
    }
    const assignedPins = /* @__PURE__ */ new Set();
    const netNames = /* @__PURE__ */ new Set();
    for (const net of value.nets) {
      if (netNames.has(net.name)) {
        errors.push(`\u91CD\u590D\u7F51\u7EDC\u540D\uFF1A${net.name}`);
      }
      netNames.add(net.name);
      for (const member of net.members) {
        if (!componentPins.has(member)) {
          errors.push(`\u7F51\u7EDC\u6210\u5458\u4E0D\u5B58\u5728\uFF1A${member}`);
        }
        if (assignedPins.has(member)) {
          errors.push(`\u5F15\u811A\u88AB\u5206\u914D\u5230\u591A\u4E2A\u7F51\u7EDC\uFF1A${member}`);
        }
        assignedPins.add(member);
      }
    }
    JSON.parse(JSON.stringify(value));
    return errors;
  }
  function findForbiddenStructureFields(value, path = "$") {
    const forbidden = /* @__PURE__ */ new Set(["primitiveId", "componentPrimitiveId", "x", "y", "rotation", "line"]);
    if (value === null || typeof value !== "object") {
      return [];
    }
    if (Array.isArray(value)) {
      return value.flatMap((child, index) => findForbiddenStructureFields(child, `${path}[${index}]`));
    }
    const found = [];
    for (const [key, child] of Object.entries(value)) {
      const childPath = `${path}.${key}`;
      if (key === "referenceProperties") {
        continue;
      }
      if (forbidden.has(key)) {
        found.push(childPath);
      }
      found.push(...findForbiddenStructureFields(child, childPath));
    }
    return found;
  }
  async function buildCurrentRegionSnapshot() {
    return await (async () => {
      const selected = await getSelectedPrimitives();
      const selectedComponents = selected.filter(isComponent).filter((component) => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
      const selectedNetworkAnchors = selected.filter(isComponent).filter((component) => component.getState_ComponentType() === ESCH_PrimitiveComponentType.NET_FLAG).map((component) => ({
        primitiveId: component.getState_PrimitiveId(),
        net: component.getState_Net() ?? ""
      })).filter((anchor) => anchor.net.length > 0);
      if (selectedComponents.length === 0) {
        throw new Error("\u5F53\u524D\u9009\u62E9\u4E2D\u6CA1\u6709\u666E\u901A\u5668\u4EF6\u3002\u8BF7\u5148\u6846\u9009\u4E00\u4E2A\u5B8C\u6574\u529F\u80FD\u533A\u57DF\u3002");
      }
      const designatorCounts = /* @__PURE__ */ new Map();
      for (const component of selectedComponents) {
        const designator = component.getState_Designator();
        if (!designator) {
          throw new Error("\u6846\u9009\u533A\u57DF\u4E2D\u5B58\u5728\u6CA1\u6709\u4F4D\u53F7\u7684\u5668\u4EF6\uFF0C\u65E0\u6CD5\u5EFA\u7ACB\u7A33\u5B9A\u5F15\u7528\u3002");
        }
        designatorCounts.set(designator, (designatorCounts.get(designator) ?? 0) + 1);
      }
      const duplicateDesignators = [...designatorCounts.entries()].filter(([, count]) => count > 1).map(([designator]) => designator);
      if (duplicateDesignators.length > 0) {
        throw new Error(`\u6846\u9009\u533A\u57DF\u4E2D\u5B58\u5728\u91CD\u590D\u4F4D\u53F7\uFF1A${duplicateDesignators.join("\u3001")}\u3002\u5F53\u524D\u7248\u672C\u6682\u4E0D\u5BFC\u51FA\u591A\u5355\u5143\u91CD\u590D\u4F4D\u53F7\u3002`);
      }
      const netlist = await readNetlist();
      const root = parseEnet(netlist.text);
      const index = indexEnet(root);
      const diagnostics = {
        capturedAt: now(),
        sourceVersion: text(root.version),
        selectedPrimitiveCount: selected.length,
        selectedComponentCount: selectedComponents.length,
        enetComponentCount: Object.keys(root.components ?? {}).length,
        unmappedPins: [],
        unassignedPins: [],
        undefinedPinTypes: [],
        componentNameResolution: {},
        externalMembersByNet: {}
      };
      const unmappedPins = diagnostics.unmappedPins;
      const unassignedPins = diagnostics.unassignedPins;
      const undefinedPinTypes = diagnostics.undefinedPinTypes;
      const componentNameResolution = diagnostics.componentNameResolution;
      const externalMembersByNet = diagnostics.externalMembersByNet;
      const selectedMemberTypes = /* @__PURE__ */ new Map();
      const selectedMemberSet = /* @__PURE__ */ new Set();
      const components = [];
      for (const component of selectedComponents) {
        const designator = component.getState_Designator();
        if (!designator) {
          throw new Error("\u6846\u9009\u533A\u57DF\u4E2D\u5B58\u5728\u6CA1\u6709\u4F4D\u53F7\u7684\u5668\u4EF6\uFF0C\u65E0\u6CD5\u5EFA\u7ACB\u7A33\u5B9A\u5F15\u7528\u3002");
        }
        const enetComponents = index.componentsByDesignator.get(designator) ?? [];
        if (enetComponents.length === 0) {
          throw new Error(`ENET \u4E2D\u627E\u4E0D\u5230\u6846\u9009\u5668\u4EF6\uFF1A${designator}`);
        }
        if (enetComponents.length > 1) {
          throw new Error(`ENET \u4E2D\u4F4D\u53F7 ${designator} \u5BF9\u5E94\u591A\u4E2A\u5668\u4EF6\u8BB0\u5F55\uFF0C\u5F53\u524D\u7248\u672C\u65E0\u6CD5\u5B89\u5168\u5408\u5E76\u3002`);
        }
        const enetComponent = enetComponents[0];
        const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
        const exportedPins = pins.map((pin) => {
          const number = pin.getState_PinNumber();
          const member = `${designator}.${number}`;
          selectedMemberSet.add(member);
          selectedMemberTypes.set(member, String(pin.getState_pinType()));
          if (String(pin.getState_pinType()).toUpperCase() === "UNDEFINED") {
            undefinedPinTypes.push(member);
          }
          if (!index.pinsByMember.has(member)) {
            unmappedPins.push(member);
          } else if (!index.pinsByMember.get(member)?.sourceNet) {
            unassignedPins.push(member);
          }
          return {
            number,
            name: pin.getState_PinName() || "",
            type: String(pin.getState_pinType()),
            noConnected: Boolean(pin.getState_NoConnected())
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
          ...subPart ? { subPart } : {},
          ...symbol ? { symbol: { libraryUuid: symbol.libraryUuid, uuid: symbol.uuid } } : {},
          referenceProperties,
          pins: exportedPins
        });
      }
      components.sort((left, right) => naturalCompare(left.designator, right.designator));
      if (unmappedPins.length > 0) {
        throw new Error(`\u6709 ${unmappedPins.length} \u4E2A SDK \u5F15\u811A\u672A\u5728 ENET \u4E2D\u627E\u5230\u5BF9\u5E94\u6210\u5458\uFF1A${unmappedPins.join("\u3001")}`);
      }
      const usedNames = new Set([...index.membersByNet.keys()].filter((name) => !isGeneratedSourceNet(name)));
      const nets = [];
      for (const [sourceNet, allMembers] of [...index.membersByNet.entries()].sort(([left], [right]) => naturalCompare(left, right))) {
        const selectedMembers = allMembers.filter((member) => selectedMemberSet.has(member));
        if (selectedMembers.length === 0) {
          continue;
        }
        const externalMembers = allMembers.filter((member) => !selectedMemberSet.has(member));
        const generated = isGeneratedSourceNet(sourceNet);
        const name = generated ? generatedNetName(allMembers, usedNames) : sourceNet;
        const scope = externalMembers.length > 0 ? "external" : "internal";
        if (externalMembers.length > 0) {
          externalMembersByNet[name] = externalMembers;
        }
        nets.push({
          name,
          scope,
          ...scope === "external" ? { direction: inferDirection(selectedMembers.map((member) => selectedMemberTypes.get(member) ?? "")) } : {},
          generated,
          members: selectedMembers.sort(naturalCompare)
        });
      }
      for (const anchor of selectedNetworkAnchors) {
        if (nets.some((net) => net.name === anchor.net)) {
          continue;
        }
        nets.push({
          name: anchor.net,
          scope: "external",
          direction: "BI",
          generated: false,
          members: []
        });
      }
      nets.sort((left, right) => naturalCompare(left.name, right.name));
      const result = {
        format: "jlc-schematic-region",
        version: 1,
        components,
        nets
      };
      const validationErrors = validateExport(result);
      const forbiddenFields = findForbiddenStructureFields(result);
      if (forbiddenFields.length > 0) {
        validationErrors.push(`\u7ED3\u6784\u6B63\u6587\u5305\u542B\u7981\u6B62\u5B57\u6BB5\uFF1A${forbiddenFields.join("\u3001")}`);
      }
      if (validationErrors.length > 0) {
        throw new Error(`\u533A\u57DF\u7ED3\u6784\u81EA\u6821\u9A8C\u5931\u8D25\uFF1A${validationErrors.join("\uFF1B")}`);
      }
      Object.assign(diagnostics, {
        exportedComponentCount: components.length,
        exportedNetCount: nets.length,
        internalNetCount: nets.filter((net) => net.scope === "internal").length,
        externalNetCount: nets.filter((net) => net.scope === "external").length,
        generatedNetCount: nets.filter((net) => net.generated).length,
        connectedSelectedPinCount: nets.reduce((count, net) => count + net.members.length, 0),
        selectedNetworkAnchors,
        validation: {
          status: "passed",
          jsonRoundTrip: true,
          coordinateFree: true,
          selectedComponentsComplete: components.length === selectedComponents.length,
          pinMappingComplete: unmappedPins.length === 0
        },
        note: "\u7ED3\u6784 JSON \u4E0D\u5305\u542B\u5750\u6807\uFF1B\u5916\u90E8\u6210\u5458\u4EC5\u4FDD\u7559\u5728\u8BCA\u65AD\u6807\u7B7E\u9875\uFF0C\u4E0D\u8FDB\u5165\u53EF\u9006\u7ED3\u6784\u6B63\u6587\u3002"
      });
      const snapshot = {
        capturedAt: now(),
        selectedPrimitiveIds: selected.map(safePrimitiveId).filter((id) => Boolean(id)).sort(naturalCompare),
        region: result,
        diagnostics
      };
      return snapshot;
    })();
  }
  async function exportRegionStructure() {
    await runProbe("\u533A\u57DF\u7ED3\u6784\u5BFC\u51FA", async () => {
      const snapshot = await buildCurrentRegionSnapshot();
      await eda.sys_Storage.setExtensionUserConfig(REGION_SNAPSHOT_STORAGE_KEY, snapshot);
      await showPreview("\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u5BFC\u51FA\u8FDE\u63A5\u5173\u7CFB", [
        jsonPreviewTab("\u533A\u57DF\u7ED3\u6784 JSON", snapshot.region),
        jsonPreviewTab("\u5BFC\u51FA\u8BCA\u65AD", snapshot.diagnostics)
      ]);
    });
  }

  // src/ai-guide.ts
  var connectionJsonPlaceholder = "\u3010\u7C98\u8D34\u201C\u5BFC\u51FA\u8FDE\u63A5\u5173\u7CFB\u201D\u5F97\u5230\u7684 JSON\u3011";
  var formatDescription = `\u8FDE\u63A5\u5173\u7CFB\u6587\u672C\u4F7F\u7528 JSON\uFF0C\u5B57\u6BB5\u89C4\u5219\u5982\u4E0B\uFF1A

- \u6839\u5BF9\u8C61\u5FC5\u987B\u5B8C\u6574\u5305\u542B format\u3001version\u3001components \u548C nets\u3002
- format\uFF1A\u5B57\u7B26\u4E32\uFF0C\u56FA\u5B9A\u4E3A jlc-schematic-region\u3002
- version\uFF1A\u6570\u5B57\uFF0C\u56FA\u5B9A\u4E3A 1\u3002
- components\uFF1A\u6570\u7EC4\uFF0C\u5305\u542B\u6846\u9009\u533A\u57DF\u5185\u7684\u5168\u90E8\u5668\u4EF6\uFF0C\u4E0D\u5F97\u7701\u7565\u672A\u4FEE\u6539\u5668\u4EF6\u3002
- \u6BCF\u4E2A components \u9879\u5FC5\u987B\u5305\u542B designator\u3001name \u548C pins\u3002designator \u662F\u539F\u7406\u56FE\u4E2D\u7684\u771F\u5B9E\u4F4D\u53F7\uFF1BsubPart \u548C symbol \u4E3A\u53EF\u9009\u5B57\u6BB5\uFF0C\u4F46\u8F93\u5165\u4E2D\u5B58\u5728\u65F6\u5FC5\u987B\u539F\u6837\u4FDD\u7559\u3002
- referenceProperties\uFF1A\u53EF\u9009\u7684\u53EA\u8BFB\u53C2\u8003\u5B57\u6BB5\uFF0C\u5305\u542B\u5668\u4EF6\u5C5E\u6027\u9762\u677F\u4E2D\u7684 key\uFF08\u5173\u952E\u5C5E\u6027\uFF09\u548C more\uFF08\u66F4\u591A\u5C5E\u6027\uFF09\u3002\u8FD9\u4E9B\u5185\u5BB9\u53EA\u7528\u4E8E\u5E2E\u52A9 AI \u8BC6\u522B\u5668\u4EF6\u3001\u578B\u53F7\u3001\u53C2\u6570\u3001\u5236\u9020\u5546\u548C\u7269\u6599\u4FE1\u606F\uFF0C\u4E0D\u5C5E\u4E8E\u9700\u8981\u5BFC\u5165\u6216\u4FEE\u6539\u7684\u8FDE\u63A5\u7ED3\u6784\u3002
- AI \u5728\u5206\u6790\u65F6\u53EF\u4EE5\u4F7F\u7528 referenceProperties\uFF1B\u8BBE\u8BA1\u6216\u4FEE\u6539\u540E\u8F93\u51FA\u53EF\u5BFC\u5165 JSON \u65F6\uFF0C\u53EF\u4EE5\u5B8C\u6574\u7701\u7565\u6240\u6709 referenceProperties\u3002\u5373\u4F7F\u4FDD\u7559\u8BE5\u5B57\u6BB5\uFF0C\u63D2\u4EF6\u5BFC\u5165\u65F6\u4E5F\u4F1A\u5B8C\u5168\u5FFD\u7565\u5176\u5185\u5BB9\uFF0C\u4E0D\u8FDB\u884C\u5339\u914D\u3001\u4E0D\u5199\u56DE\u539F\u7406\u56FE\u3002
- pins\uFF1A\u6570\u7EC4\u3002\u6BCF\u4E2A\u5F15\u811A\u5FC5\u987B\u5B8C\u6574\u5305\u542B number\u3001name\u3001type \u548C noConnected\u3002
- number\uFF1A\u5F15\u811A\u7F16\u53F7\u5B57\u7B26\u4E32\uFF1Bname\uFF1A\u5F15\u811A\u540D\u79F0\u5B57\u7B26\u4E32\uFF1Btype\uFF1A\u7535\u6C14\u7C7B\u578B\u5B57\u7B26\u4E32\uFF1BnoConnected\uFF1A\u5E03\u5C14\u503C\uFF0C\u53EA\u80FD\u4E3A true \u6216 false\u3002
- nets\uFF1A\u6570\u7EC4\uFF0C\u5305\u542B\u5B8C\u6574\u7F51\u7EDC\u5217\u8868\uFF0C\u4E0D\u5F97\u53EA\u8F93\u51FA\u53D1\u751F\u53D8\u5316\u7684\u7F51\u7EDC\u3002
- \u6BCF\u4E2A nets \u9879\u5FC5\u987B\u5B8C\u6574\u5305\u542B name\u3001scope\u3001generated \u548C members\u3002
- name\uFF1A\u975E\u7A7A\u7F51\u7EDC\u540D\u79F0\u5B57\u7B26\u4E32\u3002
- scope\uFF1A\u53EA\u80FD\u4E3A internal \u6216 external\u3002internal \u8868\u793A\u53EA\u8FDE\u63A5\u6846\u9009\u533A\u57DF\u5185\u90E8\uFF0Cexternal \u8868\u793A\u8FD8\u8FDE\u63A5\u533A\u57DF\u5916\u90E8\u3002
- direction\uFF1A\u5F53 scope \u4E3A external \u65F6\u5FC5\u987B\u63D0\u4F9B\uFF0C\u53EA\u80FD\u4E3A IN\u3001OUT \u6216 BI\uFF1Binternal \u7F51\u7EDC\u53EF\u4EE5\u4E0D\u63D0\u4F9B direction\u3002
- generated\uFF1A\u5FC5\u586B\u5E03\u5C14\u503C\u3002\u4FDD\u7559\u8F93\u5165\u4E2D\u5DF2\u6709\u7F51\u7EDC\u7684\u539F\u503C\uFF1BAI \u65B0\u5EFA\u7684\u547D\u540D\u7F51\u7EDC\u5FC5\u987B\u586B\u5199 false\u3002
- members\uFF1A\u5FC5\u586B\u6570\u7EC4\uFF0C\u5143\u7D20\u683C\u5F0F\u4E3A\u201C\u4F4D\u53F7.\u5F15\u811A\u7F16\u53F7\u201D\uFF0C\u53EA\u80FD\u5F15\u7528 components \u4E2D\u771F\u5B9E\u5B58\u5728\u7684\u5F15\u811A\u3002\u540C\u4E00\u5F15\u811A\u4E0D\u5F97\u51FA\u73B0\u5728\u591A\u4E2A\u7F51\u7EDC\u3002internal \u7F51\u7EDC\u548C AI \u65B0\u5EFA\u7684\u666E\u901A\u4FE1\u53F7\u7F51\u7EDC\u81F3\u5C11\u8981\u6709\u4E00\u4E2A\u6210\u5458\u3002
- \u53EA\u6709\u771F\u5B9E\u5B58\u5728\u4E8E\u6700\u65B0\u8F93\u5165\u4E2D\u7684 external \u7F51\u7EDC\u5141\u8BB8 members \u4E3A\u7A7A\uFF0C\u8868\u793A\u7528\u6237\u5DF2\u6846\u9009\u540C\u540D\u7684\u7535\u6E90\u6216\u5730\u6807\u8BC6\uFF1B\u4E0D\u5F97\u865A\u6784\u7A7A\u6210\u5458\u7F51\u7EDC\u3002
- \u666E\u901A\u4FE1\u53F7\u7F51\u7EDC\u53EF\u4EE5\u76F4\u63A5\u7531\u4E00\u4E2A\u6216\u591A\u4E2A\u771F\u5B9E\u5668\u4EF6\u5F15\u811A\u7EC4\u6210\uFF0C\u4E0D\u8981\u6C42\u7528\u6237\u63D0\u524D\u653E\u7F6E\u7F51\u7EDC\u6807\u8BC6\u3002

\u4FEE\u6539\u65F6\u5FC5\u987B\u4FDD\u7559\u9664 referenceProperties \u4EE5\u5916\u7684\u5B8C\u6574 JSON \u7ED3\u6784\u548C\u6240\u6709\u672A\u4FEE\u6539\u5185\u5BB9\uFF0C\u4E0D\u5F97\u7701\u7565 generated\u3001noConnected \u7B49\u5FC5\u586B\u5B57\u6BB5\u3002referenceProperties \u53EF\u4EE5\u7701\u7565\uFF0C\u4E5F\u4E0D\u5F97\u628A\u5176\u4E2D\u5185\u5BB9\u4F5C\u4E3A\u9700\u8981\u5199\u56DE\u539F\u7406\u56FE\u7684\u4FEE\u6539\u9879\u3002\u4E0D\u5F97\u6DFB\u52A0\u5750\u6807\u5B57\u6BB5\uFF0C\u4E0D\u5F97\u79FB\u52A8\u3001\u65CB\u8F6C\u6216\u955C\u50CF\u5668\u4EF6\u3002`;
  var designPrompt = `\u4F60\u662F\u4E00\u540D\u7535\u5B50\u7535\u8DEF\u8BBE\u8BA1\u5DE5\u7A0B\u5E08\u3002\u5F53\u524D\u5BF9\u8BDD\u6CA1\u6709\u4EFB\u4F55\u524D\u7F6E\u4FE1\u606F\uFF0C\u8BF7\u4EC5\u6839\u636E\u672C\u63D0\u793A\u4E2D\u7684\u9700\u6C42\uFF0C\u8BBE\u8BA1\u5B9E\u73B0\u76EE\u6807\u529F\u80FD\u7684\u539F\u7406\u56FE\u8FDE\u63A5\u65B9\u6848\u3002

\u6211\u6B63\u5728\u4F7F\u7528\u4E00\u4E2A\u539F\u7406\u56FE\u63D2\u4EF6\u3002\u63D2\u4EF6\u7684\u5DE5\u4F5C\u65B9\u5F0F\u5982\u4E0B\uFF1A

1. \u63D2\u4EF6\u4E0D\u80FD\u81EA\u52A8\u65B0\u589E\u3001\u5220\u9664\u3001\u79FB\u52A8\u3001\u65CB\u8F6C\u6216\u955C\u50CF\u5668\u4EF6\u3002
2. \u6211\u9700\u8981\u5148\u6309\u7167\u4F60\u7684\u6E05\u5355\uFF0C\u5728\u539F\u7406\u56FE\u4E2D\u624B\u52A8\u653E\u7F6E\u5668\u4EF6\u3002
3. \u6211\u53EA\u9700\u8981\u624B\u52A8\u653E\u7F6E\u65B9\u6848\u4F7F\u7528\u7684\u7535\u6E90\u548C\u5730\uFF0C\u4F8B\u5982 +5V\u3001+3.3V \u548C GND\u3002\u5176\u4ED6\u4FE1\u53F7\u7F51\u7EDC\u4E0D\u9700\u8981\u6211\u63D0\u524D\u653E\u7F6E\u7F51\u7EDC\u6807\u8BC6\uFF0C\u7531\u4F60\u5728\u540E\u7EED\u4FEE\u6539 JSON \u65F6\u6839\u636E\u771F\u5B9E\u5668\u4EF6\u5F15\u811A\u521B\u5EFA\u3002
4. \u5668\u4EF6\u653E\u7F6E\u5B8C\u6210\u540E\uFF0C\u6211\u4F1A\u5BFC\u51FA\u4E00\u4EFD JSON \u683C\u5F0F\u7684\u5F53\u524D\u8FDE\u63A5\u5173\u7CFB\uFF0C\u5176\u4E2D\u5305\u542B\u539F\u7406\u56FE\u8F6F\u4EF6\u5B9E\u9645\u5206\u914D\u7684\u5668\u4EF6\u4F4D\u53F7\u3002
5. \u5C4A\u65F6\u4F60\u9700\u8981\u6839\u636E\u6700\u65B0\u5BFC\u51FA\u7684 JSON \u548C\u5176\u4E2D\u7684\u771F\u5B9E\u4F4D\u53F7\u4FEE\u6539\u7F51\u7EDC\u8FDE\u63A5\uFF0C\u63D2\u4EF6\u518D\u6309\u7167\u4FEE\u6539\u540E\u7684 JSON \u81EA\u52A8\u5B8C\u6210\u8FDE\u63A5\u3002
6. \u5F53\u524D\u9636\u6BB5\u4E0D\u8981\u8F93\u51FA JSON\uFF0C\u4E5F\u4E0D\u8981\u5047\u8BBE\u539F\u7406\u56FE\u4E2D\u5DF2\u7ECF\u5B58\u5728\u4EFB\u4F55\u5668\u4EF6\u6216\u7F51\u7EDC\u3002

\u9700\u8981\u8BBE\u8BA1\u7684\u529F\u80FD\uFF1A

\u3010\u586B\u5199\u9700\u8981\u5B9E\u73B0\u7684\u529F\u80FD\u3011

\u5DF2\u77E5\u6761\u4EF6\uFF1A

- \u4F9B\u7535\u7535\u538B\uFF1A\u3010\u586B\u5199\u4F9B\u7535\u6761\u4EF6\uFF1B\u4E0D\u786E\u5B9A\u53EF\u5199\u201C\u5F85\u5B9A\u201D\u3011
- \u8F93\u5165\u4FE1\u53F7\u6216\u63A5\u53E3\uFF1A\u3010\u586B\u5199\u8F93\u5165\uFF1B\u6CA1\u6709\u53EF\u5199\u201C\u65E0\u201D\u3011
- \u8F93\u51FA\u4FE1\u53F7\u6216\u63A5\u53E3\uFF1A\u3010\u586B\u5199\u8F93\u51FA\uFF1B\u6CA1\u6709\u53EF\u5199\u201C\u65E0\u201D\u3011
- \u5DF2\u786E\u5B9A\u7684\u5668\u4EF6\u6216\u578B\u53F7\uFF1A\u3010\u586B\u5199\u578B\u53F7\uFF1B\u6CA1\u6709\u53EF\u5199\u201C\u65E0\u201D\u3011
- \u8D1F\u8F7D\u3001\u7535\u6D41\u3001\u9891\u7387\u3001\u901A\u4FE1\u6807\u51C6\u7B49\u5173\u952E\u53C2\u6570\uFF1A\u3010\u586B\u5199\u53C2\u6570\uFF1B\u6CA1\u6709\u53EF\u5199\u201C\u672A\u77E5\u201D\u3011
- \u5C3A\u5BF8\u3001\u529F\u8017\u3001\u6210\u672C\u6216\u5176\u4ED6\u9650\u5236\uFF1A\u3010\u586B\u5199\u9650\u5236\uFF1B\u6CA1\u6709\u53EF\u5199\u201C\u65E0\u201D\u3011

\u8BF7\u5148\u5224\u65AD\u73B0\u6709\u4FE1\u606F\u662F\u5426\u8DB3\u4EE5\u5B8C\u6210\u8BBE\u8BA1\u3002

\u5982\u679C\u8BBE\u8BA1\u8FC7\u7A0B\u4E2D\u5BF9\u9700\u6C42\u3001\u5668\u4EF6\u578B\u53F7\u3001\u53C2\u6570\u3001\u63A5\u53E3\u7535\u5E73\u3001\u5F15\u811A\u5B9A\u4E49\u3001\u7F51\u7EDC\u8FDE\u63A5\u6216\u5B89\u5168\u6027\u5B58\u5728\u4EFB\u4F55\u7591\u95EE\uFF0C\u5FC5\u987B\u7ACB\u5373\u505C\u6B62\u8BBE\u8BA1\uFF0C\u4E0D\u5F97\u731C\u6D4B\uFF0C\u4E5F\u4E0D\u5F97\u7EE7\u7EED\u7ED9\u51FA\u6700\u7EC8\u65B9\u6848\u3002\u53EF\u4EE5\u5148\u641C\u7D22\u6570\u636E\u624B\u518C\u6216\u5176\u4ED6\u8D44\u6599\uFF0C\u4F46\u641C\u7D22\u7ED3\u679C\u53EA\u80FD\u4F5C\u4E3A\u5F85\u786E\u8BA4\u4FE1\u606F\u3002\u8BF7\u5C06\u641C\u7D22\u7ED3\u8BBA\u3001\u4F9D\u636E\u548C\u4ECD\u5B58\u5728\u7684\u7591\u95EE\u5217\u5728\u201C\u9700\u8981\u7528\u6237\u786E\u8BA4\u7684\u95EE\u9898\u201D\u4E2D\uFF0C\u7B49\u5F85\u6211\u660E\u786E\u786E\u8BA4\u540E\u518D\u7EE7\u7EED\u3002

\u5982\u679C\u4FE1\u606F\u5DF2\u7ECF\u8DB3\u591F\uFF0C\u8BF7\u6309\u4EE5\u4E0B\u683C\u5F0F\u8F93\u51FA\u7535\u8DEF\u65B9\u6848\uFF1A

\u4E00\u3001\u65B9\u6848\u8BF4\u660E

\u8BF4\u660E\u7535\u8DEF\u7684\u5DE5\u4F5C\u539F\u7406\u3001\u529F\u80FD\u6A21\u5757\u3001\u4FE1\u53F7\u6D41\u5411\u548C\u5173\u952E\u8BBE\u8BA1\u4F9D\u636E\u3002

\u4E8C\u3001\u9700\u8981\u653E\u7F6E\u7684\u5668\u4EF6

\u4F7F\u7528\u8868\u683C\u5217\u51FA\uFF1A

- \u5668\u4EF6\u7C7B\u578B
- \u5EFA\u8BAE\u578B\u53F7\u6216\u53C2\u6570
- \u6570\u91CF
- \u7528\u9014
- \u9009\u578B\u6CE8\u610F\u4E8B\u9879

\u5FC5\u987B\u5305\u542B\u5B9E\u73B0\u76EE\u6807\u529F\u80FD\u6240\u9700\u7684\u7535\u6E90\u5904\u7406\u3001\u53BB\u8026\u3001\u9650\u6D41\u3001\u4E0A\u62C9\u3001\u4E0B\u62C9\u3001\u6EE4\u6CE2\u3001\u504F\u7F6E\u548C\u4FDD\u62A4\u5668\u4EF6\uFF0C\u4E0D\u8981\u53EA\u5217\u6838\u5FC3\u5668\u4EF6\uFF0C\u4E5F\u4E0D\u8981\u6DFB\u52A0\u4E0E\u76EE\u6807\u529F\u80FD\u65E0\u5173\u7684\u5668\u4EF6\u3002

\u7535\u5BB9\u5BB9\u91CF\u4E2D\u7684\u5FAE\u6CD5\u5FC5\u987B\u7EDF\u4E00\u5199\u6210 uF\uFF0C\u4E0D\u5F97\u4F7F\u7528 \xB5F \u6216 \u03BCF\uFF0C\u4F8B\u5982 0.1uF\u30011uF\u300110uF\u3002

\u5F53\u524D\u9636\u6BB5\u4E0D\u8981\u5EFA\u8BAE\u6216\u6307\u5B9A R1\u3001U1\u3001C1 \u7B49\u5668\u4EF6\u4F4D\u53F7\u3002\u591A\u4E2A\u540C\u7C7B\u578B\u5668\u4EF6\u5E94\u4F7F\u7528\u529F\u80FD\u6216\u8FDE\u63A5\u5BF9\u8C61\u533A\u5206\uFF0C\u4F8B\u5982\u201C\u6309\u952E 1 \u4E0A\u62C9\u7535\u963B\u201D\u548C\u201C\u6309\u952E 2 \u4E0A\u62C9\u7535\u963B\u201D\u3002\u771F\u5B9E\u4F4D\u53F7\u4EE5\u540E\u7EED\u5BFC\u51FA\u7684 JSON \u4E3A\u51C6\u3002

\u4E09\u3001\u5B8C\u6574\u8FDE\u63A5\u8868

\u6309\u7F51\u7EDC\u5217\u51FA\u8FDE\u63A5\u5173\u7CFB\uFF0C\u6BCF\u4E2A\u7F51\u7EDC\u5FC5\u987B\u8BF4\u660E\uFF1A

- \u7F51\u7EDC\u540D\u79F0
- \u8FDE\u63A5\u7684\u5668\u4EF6\u5F15\u811A
- \u7F51\u7EDC\u7528\u9014
- \u662F\u5426\u8FDE\u63A5\u533A\u57DF\u5916\u90E8

\u7535\u6E90\u548C\u5730\u7F51\u7EDC\u5E94\u4F7F\u7528\u5B9E\u9645\u540D\u79F0\uFF0C\u4F8B\u5982 +5V\u3001+3.3V \u548C GND\u3002

\u5176\u4ED6\u4FE1\u53F7\u7F51\u7EDC\u7531\u4F60\u6839\u636E\u529F\u80FD\u4F7F\u7528\u660E\u786E\u3001\u7A33\u5B9A\u7684\u540D\u79F0\uFF0C\u4F8B\u5982 NRST\u3001SWDIO\u3001OSC_IN\u3002\u4E0D\u8981\u8981\u6C42\u6211\u63D0\u524D\u653E\u7F6E\u8FD9\u4E9B\u4FE1\u53F7\u7F51\u7EDC\u6807\u8BC6\u3002

\u5F53\u524D\u9636\u6BB5\u4E0D\u5F97\u751F\u6210\u5668\u4EF6\u4F4D\u53F7\u3002\u8FDE\u63A5\u8868\u5E94\u4F7F\u7528\u201C\u5668\u4EF6\u7528\u9014\uFF08\u5668\u4EF6\u7C7B\u578B\uFF09.\u5F15\u811A\u7F16\u53F7\uFF08\u5F15\u811A\u540D\u79F0\uFF09\u201D\u8868\u793A\uFF0C\u5E76\u901A\u8FC7\u5668\u4EF6\u7528\u9014\u533A\u5206\u591A\u4E2A\u540C\u7C7B\u578B\u5668\u4EF6\u3002\u771F\u5B9E\u4F4D\u53F7\u4EE5\u540E\u7EED\u5BFC\u51FA\u7684 JSON \u4E3A\u51C6\u3002

\u53EA\u6709\u5728\u5668\u4EF6\u578B\u53F7\u548C\u6570\u636E\u624B\u518C\u5F15\u811A\u5B9A\u4E49\u786E\u5B9A\u65F6\uFF0C\u624D\u80FD\u586B\u5199\u5177\u4F53\u5F15\u811A\u7F16\u53F7\u3002\u65E0\u6CD5\u786E\u5B9A\u65F6\u5E94\u660E\u786E\u6807\u8BB0\u201C\u9700\u8981\u6839\u636E\u6700\u7EC8\u578B\u53F7\u786E\u8BA4\u201D\uFF0C\u4E0D\u5F97\u731C\u6D4B\u5F15\u811A\u7F16\u53F7\u3002

\u540C\u4E00\u4E2A\u7535\u6C14\u8282\u70B9\u53EA\u80FD\u4F7F\u7528\u4E00\u4E2A\u7F51\u7EDC\u540D\u79F0\u3002\u9700\u8981\u4E92\u76F8\u8FDE\u901A\u7684\u5F15\u811A\u5FC5\u987B\u5217\u5728\u540C\u4E00\u4E2A\u7F51\u7EDC\u4E2D\u3002

\u56DB\u3001\u8BBE\u8BA1\u68C0\u67E5

\u68C0\u67E5\u5E76\u8BF4\u660E\uFF1A

- \u4F9B\u7535\u7535\u538B\u548C\u63A5\u53E3\u7535\u5E73\u662F\u5426\u517C\u5BB9
- \u7535\u6E90\u548C\u5730\u8FDE\u63A5\u662F\u5426\u5B8C\u6574
- \u53BB\u8026\u3001\u9650\u6D41\u3001\u4E0A\u62C9\u3001\u4E0B\u62C9\u3001\u6EE4\u6CE2\u548C\u4FDD\u62A4\u662F\u5426\u5145\u5206
- \u8F93\u5165\u548C\u8F93\u51FA\u662F\u5426\u5B58\u5728\u51B2\u7A81
- \u5668\u4EF6\u989D\u5B9A\u7535\u538B\u3001\u7535\u6D41\u548C\u529F\u8017\u662F\u5426\u6EE1\u8DB3\u8981\u6C42
- \u662F\u5426\u6709\u60AC\u7A7A\u6216\u672A\u4F7F\u7528\u5F15\u811A
- \u54EA\u4E9B\u672A\u4F7F\u7528\u5F15\u811A\u9700\u8981\u8BBE\u7F6E\u4E3A\u4E0D\u8FDE\u63A5

\u4E94\u3001\u9700\u8981\u6211\u6267\u884C\u7684\u64CD\u4F5C

\u7ED9\u51FA\u4E00\u4EFD\u7B80\u77ED\u3001\u6309\u987A\u5E8F\u6392\u5217\u7684\u64CD\u4F5C\u6E05\u5355\uFF0C\u660E\u786E\u5217\u51FA\uFF1A

1. \u9700\u8981\u5728\u539F\u7406\u56FE\u4E2D\u653E\u7F6E\u54EA\u4E9B\u5668\u4EF6\uFF1B
2. \u9700\u8981\u653E\u7F6E\u54EA\u4E9B\u7535\u6E90\u548C\u5730\uFF1B
3. \u653E\u7F6E\u5668\u4EF6\u65F6\u9700\u8981\u786E\u8BA4\u54EA\u4E9B\u578B\u53F7\u3001\u53C2\u6570\u6216\u5F15\u811A\u5B9A\u4E49\u3002

\u4E0D\u8981\u8981\u6C42\u6211\u624B\u52A8\u653E\u7F6E\u666E\u901A\u4FE1\u53F7\u7F51\u7EDC\u6807\u8BC6\u3002\u666E\u901A\u4FE1\u53F7\u7F51\u7EDC\u7531\u4F60\u5728\u6536\u5230\u6700\u65B0 JSON \u540E\u521B\u5EFA\u3002

\u5F53\u524D\u9636\u6BB5\u4E0D\u8981\u8F93\u51FA jlc-schematic-region JSON\u3002\u5668\u4EF6\u5C1A\u672A\u5B9E\u9645\u653E\u7F6E\u524D\uFF0C\u4E0D\u5F97\u5728 JSON \u6216\u8FDE\u63A5\u7ED3\u679C\u4E2D\u865A\u6784\u5668\u4EF6\u3002

\u5B8C\u6210\u540E\uFF0C\u6211\u4F1A\u91CD\u65B0\u5BFC\u51FA\u8FDE\u63A5\u5173\u7CFB\uFF0C\u5E76\u628A\u6700\u65B0 JSON \u53D1\u9001\u7ED9\u4F60\u7EE7\u7EED\u4FEE\u6539\u3002

\u6536\u5230\u6211\u540E\u7EED\u53D1\u9001\u7684\u6700\u65B0 JSON \u540E\uFF0C\u5FC5\u987B\u6309\u7167\u6700\u521D\u786E\u8BA4\u7684\u76EE\u6807\u529F\u80FD\u7EE7\u7EED\u5B8C\u6210\u8FDE\u63A5\u4FEE\u6539\uFF0C\u5E76\u9075\u5B88\u4EE5\u4E0B\u89C4\u5219\uFF1A

1. \u5FC5\u987B\u4EE5\u6211\u6700\u540E\u4E00\u6B21\u53D1\u9001\u7684 JSON \u4E3A\u552F\u4E00\u4F9D\u636E\uFF0C\u4E0D\u5F97\u7EE7\u7EED\u4F7F\u7528\u66F4\u65E9\u7248\u672C\u7684\u5668\u4EF6\u3001\u4F4D\u53F7\u3001\u5F15\u811A\u6216\u7F51\u7EDC\u4FE1\u606F\u3002
2. \u5B8C\u6574\u4FDD\u7559\u8F93\u5165\u4E2D\u7684 format\u3001version\u3001components \u53CA\u5176\u5168\u90E8\u5F15\u811A\u5B9A\u4E49\uFF0C\u53EA\u4FEE\u6539\u786E\u5B9E\u9700\u8981\u8C03\u6574\u7684 nets\u3002components \u4E2D\u7684 referenceProperties \u53EA\u662F\u53EA\u8BFB\u53C2\u8003\u4FE1\u606F\uFF0C\u8F93\u51FA\u53EF\u5BFC\u5165 JSON \u65F6\u53EF\u4EE5\u7701\u7565\u3002
3. members \u53EA\u80FD\u5F15\u7528\u6700\u65B0 components \u4E2D\u771F\u5B9E\u5B58\u5728\u7684\u201C\u4F4D\u53F7.\u5F15\u811A\u7F16\u53F7\u201D\uFF0C\u4E0D\u5F97\u865A\u6784\u5668\u4EF6\u3001\u4F4D\u53F7\u6216\u5F15\u811A\u3002
4. \u4E0D\u5F97\u6DFB\u52A0\u5750\u6807\u3001\u5E03\u5C40\u3001\u5BFC\u7EBF\u5F62\u72B6\u6216\u5668\u4EF6\u4F4D\u7F6E\u5B57\u6BB5\uFF0C\u4E0D\u5F97\u65B0\u589E\u3001\u5220\u9664\u3001\u79FB\u52A8\u3001\u65CB\u8F6C\u6216\u955C\u50CF\u5668\u4EF6\u3002
5. \u5982\u679C\u7F3A\u5C11\u5FC5\u8981\u5668\u4EF6\u3001\u7535\u6E90\u6216\u5730\uFF0C\u53EA\u8BF4\u660E\u9700\u8981\u6211\u8865\u5145\u7684\u5185\u5BB9\uFF0C\u4E0D\u5F97\u5728 JSON \u4E2D\u865A\u6784\u3002\u6211\u8865\u5145\u5E76\u91CD\u65B0\u5BFC\u51FA\u540E\u518D\u7EE7\u7EED\u4FEE\u6539\u3002
6. \u5BF9\u4E8E\u7535\u6E90\u548C\u5730\u4EE5\u5916\u7684\u4FE1\u53F7\u7F51\u7EDC\uFF0C\u53EF\u4EE5\u6839\u636E\u76EE\u6807\u529F\u80FD\u521B\u5EFA\u65B0\u7684\u547D\u540D\u7F51\u7EDC\uFF0C\u5E76\u8FDE\u63A5\u6700\u65B0 JSON \u4E2D\u771F\u5B9E\u5B58\u5728\u4E14 noConnected \u4E3A false \u7684\u5F15\u811A\u3002
7. \u65B0\u5EFA\u7684\u666E\u901A\u4FE1\u53F7\u7F51\u7EDC\u5FC5\u987B\u586B\u5199 generated: false\uFF1B\u8F93\u5165\u4E2D\u5DF2\u6709\u7F51\u7EDC\u7684 generated \u5FC5\u987B\u539F\u6837\u4FDD\u7559\u3002
8. \u5982\u679C\u4FEE\u6539\u8FC7\u7A0B\u4E2D\u5BF9\u5668\u4EF6\u8EAB\u4EFD\u3001\u5B9E\u9645\u4F4D\u53F7\u3001\u5F15\u811A\u5B9A\u4E49\u3001\u76EE\u6807\u7F51\u7EDC\u3001scope\u3001direction \u6216\u8FDE\u63A5\u610F\u56FE\u5B58\u5728\u4EFB\u4F55\u7591\u95EE\uFF0C\u5FC5\u987B\u7ACB\u5373\u505C\u6B62\u4FEE\u6539\u5E76\u5411\u6211\u8BE2\u95EE\uFF0C\u4E0D\u5F97\u8F93\u51FA\u4FEE\u6539\u540E\u7684 JSON\u3002\u53EF\u4EE5\u5148\u641C\u7D22\u76F8\u5173\u8D44\u6599\uFF0C\u4F46\u641C\u7D22\u7ED3\u679C\u53EA\u80FD\u653E\u5728\u5BF9\u5E94\u7684\u8BE2\u95EE\u9879\u4E0B\u5E76\u660E\u786E\u6807\u8BB0\u4E3A\u201C\u5F85\u7528\u6237\u786E\u8BA4\u201D\uFF0C\u4E0D\u5F97\u76F4\u63A5\u4F5C\u4E3A\u5DF2\u786E\u8BA4\u4E8B\u5B9E\u3002
9. \u6BCF\u6B21\u4FEE\u6539 JSON \u65F6\uFF0C\u90FD\u5FC5\u987B\u5148\u7ED9\u51FA\u7B80\u77ED\u7684\u4FEE\u6539\u8BF4\u660E\uFF0C\u518D\u5728\u5355\u72EC\u7684 json \u4EE3\u7801\u5757\u4E2D\u8F93\u51FA\u4FEE\u6539\u540E\u7684\u5B8C\u6574 JSON\u3002
10. \u5B8C\u6574 JSON \u5FC5\u987B\u5305\u542B\u5168\u90E8 components \u548C\u5168\u90E8 nets\uFF0C\u5305\u62EC\u6CA1\u6709\u53D8\u5316\u7684\u5185\u5BB9\u3002\u4E0D\u5F97\u53EA\u8F93\u51FA\u53D1\u751F\u53D8\u5316\u7684\u7F51\u7EDC\u3001\u90E8\u5206\u5185\u5BB9\u3001\u5DEE\u5F02\u5185\u5BB9\u6216\u7701\u7565\u53F7\u3002
11. \u8F93\u51FA\u524D\u68C0\u67E5\u6BCF\u4E2A members \u5F15\u7528\u662F\u5426\u771F\u5B9E\u5B58\u5728\u3001\u540C\u4E00\u5F15\u811A\u662F\u5426\u88AB\u52A0\u5165\u591A\u4E2A\u7F51\u7EDC\uFF0C\u4EE5\u53CA noConnected \u4E3A true \u7684\u5F15\u811A\u662F\u5426\u88AB\u9519\u8BEF\u8FDE\u63A5\u3002

\u540E\u7EED\u8FDE\u63A5\u5173\u7CFB JSON \u7684\u683C\u5F0F\u542B\u4E49\u5982\u4E0B\uFF1A

${formatDescription}`;
  var analysisPromptTemplate = `\u8BF7\u4F60\u9605\u8BFB\u4EE5\u4E0B\u6587\u672C\u5F62\u5F0F\u7684\u539F\u7406\u56FE\u8FDE\u63A5\u5173\u7CFB\uFF0C\u5E76\u8FDB\u884C\u5B8C\u6574\u5206\u6790\u3002

\u6587\u672C\u7684\u683C\u5F0F\u542B\u4E49\u5982\u4E0B\uFF1A
${formatDescription}

\u8BF7\u5148\u5206\u6790\u8BE5\u7535\u8DEF\u5B9E\u73B0\u4E86\u4EC0\u4E48\u529F\u80FD\uFF1A
1. \u6839\u636E\u5668\u4EF6\u7C7B\u578B\u3001\u5F15\u811A\u540D\u79F0\u3001\u7535\u6C14\u7C7B\u578B\u3001\u7F51\u7EDC\u540D\u79F0\u548C\u8FDE\u63A5\u5173\u7CFB\uFF0C\u5224\u65AD\u7535\u8DEF\u7684\u4E3B\u8981\u7528\u9014\u3002
2. \u7528\u7B80\u6D01\u8BED\u8A00\u6982\u62EC\u7535\u8DEF\u7684\u8F93\u5165\u3001\u5904\u7406\u8FC7\u7A0B\u548C\u8F93\u51FA\u3002
3. \u5212\u5206\u7535\u6E90\u3001\u63A7\u5236\u3001\u9A71\u52A8\u3001\u4FDD\u62A4\u3001\u6EE4\u6CE2\u3001\u901A\u4FE1\u7B49\u529F\u80FD\u6A21\u5757\uFF0C\u5E76\u8BF4\u660E\u6BCF\u4E2A\u6A21\u5757\u7684\u4F5C\u7528\u3002
4. \u6309\u7167\u4FE1\u53F7\u6D41\u5411\u8BF4\u660E\u7535\u8DEF\u7684\u5DE5\u4F5C\u539F\u7406\uFF0C\u5305\u62EC\u4E0A\u7535\u9ED8\u8BA4\u72B6\u6001\u3001\u6B63\u5E38\u5DE5\u4F5C\u72B6\u6001\u548C\u5173\u952E\u63A7\u5236\u72B6\u6001\u3002
5. \u8BF4\u660E\u5173\u952E\u5668\u4EF6\u5728\u7535\u8DEF\u4E2D\u7684\u7528\u9014\uFF0C\u4EE5\u53CA\u5B83\u4EEC\u4E4B\u95F4\u5982\u4F55\u914D\u5408\u5B9E\u73B0\u6574\u4F53\u529F\u80FD\u3002
6. \u5982\u679C\u4EC5\u51ED\u8FDE\u63A5\u5173\u7CFB\u65E0\u6CD5\u786E\u5B9A\u67D0\u9879\u529F\u80FD\uFF0C\u5FC5\u987B\u660E\u786E\u6807\u6CE8\u201C\u65E0\u6CD5\u786E\u5B9A\u201D\uFF0C\u5E76\u8BF4\u660E\u7F3A\u5C11\u54EA\u4E9B\u4FE1\u606F\uFF0C\u4E0D\u5F97\u731C\u6D4B\u3002

\u7136\u540E\u91CD\u70B9\u68C0\u67E5\uFF1A
1. \u7535\u6E90\u3001\u5730\u3001\u8F93\u5165\u548C\u8F93\u51FA\u8FDE\u63A5\u662F\u5426\u5408\u7406\u3002
2. \u662F\u5426\u5B58\u5728\u60AC\u7A7A\u3001\u9519\u8BEF\u77ED\u63A5\u3001\u65B9\u5411\u51B2\u7A81\u3001\u91CD\u590D\u8FDE\u63A5\u6216\u7F51\u7EDC\u547D\u540D\u95EE\u9898\u3002
3. \u662F\u5426\u7F3A\u5C11\u9650\u6D41\u3001\u4E0A\u62C9\u3001\u4E0B\u62C9\u3001\u6EE4\u6CE2\u3001\u4FDD\u62A4\u3001\u504F\u7F6E\u6216\u53BB\u8026\u5668\u4EF6\u3002
4. \u5404\u5668\u4EF6\u4E4B\u95F4\u7684\u8FDE\u63A5\u662F\u5426\u6EE1\u8DB3\u5E38\u89C1\u6570\u636E\u624B\u518C\u8981\u6C42\u3002
5. \u7535\u6E90\u7535\u538B\u3001\u63A5\u53E3\u7535\u5E73\u548C\u5668\u4EF6\u989D\u5B9A\u53C2\u6570\u662F\u5426\u53EF\u80FD\u5B58\u5728\u4E0D\u517C\u5BB9\u3002
6. \u662F\u5426\u5B58\u5728\u53EF\u80FD\u9020\u6210\u4E0A\u7535\u72B6\u6001\u4E0D\u786E\u5B9A\u3001\u8BEF\u89E6\u53D1\u3001\u8FC7\u6D41\u6216\u5668\u4EF6\u635F\u574F\u7684\u8FDE\u63A5\u3002
7. \u660E\u786E\u5217\u51FA\u5EFA\u8BAE\u4FEE\u6539\u7684\u7F51\u7EDC\u3001\u6D89\u53CA\u7684\u5668\u4EF6\u5F15\u811A\u3001\u4FEE\u6539\u539F\u56E0\u548C\u9884\u671F\u6548\u679C\u3002

\u8BF7\u6309\u7167\u4EE5\u4E0B\u987A\u5E8F\u8F93\u51FA\uFF1A

\u4E00\u3001\u7535\u8DEF\u529F\u80FD\u6982\u8FF0
\u8BF4\u660E\u8BE5\u7535\u8DEF\u4E3B\u8981\u5B9E\u73B0\u4EC0\u4E48\u529F\u80FD\uFF0C\u4EE5\u53CA\u4E3B\u8981\u8F93\u5165\u548C\u8F93\u51FA\u3002

\u4E8C\u3001\u5DE5\u4F5C\u539F\u7406
\u8BF4\u660E\u529F\u80FD\u6A21\u5757\u3001\u4FE1\u53F7\u6D41\u5411\u3001\u4E0A\u7535\u9ED8\u8BA4\u72B6\u6001\u548C\u4E3B\u8981\u5DE5\u4F5C\u8FC7\u7A0B\u3002

\u4E09\u3001\u5668\u4EF6\u4F5C\u7528
\u8BF4\u660E\u5404\u5173\u952E\u5668\u4EF6\u5728\u7535\u8DEF\u4E2D\u7684\u7528\u9014\u3002

\u56DB\u3001\u68C0\u67E5\u7ED3\u679C
\u5206\u522B\u5217\u51FA\u786E\u8BA4\u6B63\u5E38\u3001\u5B58\u5728\u98CE\u9669\u548C\u65E0\u6CD5\u786E\u5B9A\u7684\u5185\u5BB9\u3002

\u4E94\u3001\u4FEE\u6539\u5EFA\u8BAE
\u660E\u786E\u5217\u51FA\u9700\u8981\u4FEE\u6539\u7684\u7F51\u7EDC\u3001\u5668\u4EF6\u5F15\u811A\u3001\u539F\u56E0\u548C\u5EFA\u8BAE\u65B9\u6848\u3002

\u5982\u679C\u5206\u6790\u8FC7\u7A0B\u4E2D\u5BF9\u5668\u4EF6\u578B\u53F7\u3001\u5F15\u811A\u5B9A\u4E49\u3001\u7F51\u7EDC\u7528\u9014\u3001\u4F9B\u7535\u6761\u4EF6\u6216\u8FDE\u63A5\u610F\u56FE\u5B58\u5728\u7591\u95EE\uFF0C\u5FC5\u987B\u505C\u6B62\u5BF9\u8BE5\u90E8\u5206\u4E0B\u7ED3\u8BBA\uFF0C\u5E76\u5411\u6211\u63D0\u51FA\u9700\u8981\u786E\u8BA4\u7684\u95EE\u9898\u3002\u53EF\u4EE5\u641C\u7D22\u76F8\u5173\u8D44\u6599\uFF0C\u4F46\u641C\u7D22\u7ED3\u679C\u5FC5\u987B\u6807\u6CE8\u4E3A\u201C\u5F85\u7528\u6237\u786E\u8BA4\u201D\uFF0C\u4E0D\u80FD\u76F4\u63A5\u4F5C\u4E3A\u786E\u5B9A\u7ED3\u8BBA\u3002

\u5B9E\u9645\u8FDE\u63A5\u5173\u7CFB\u6587\u672C\u5982\u4E0B\uFF1A

~~~json
${connectionJsonPlaceholder}
~~~`;
  var modificationPromptTemplate = `\u8BF7\u4F60\u6309\u7167\u4EE5\u4E0B\u89C4\u5219\u4FEE\u6539\u5F53\u524D\u7684\u539F\u7406\u56FE\u8FDE\u63A5\u5173\u7CFB\uFF0C\u5B9E\u73B0\u3010\u5728\u8FD9\u91CC\u586B\u5199\u76EE\u6807\u529F\u80FD\u3011\u3002

\u89C4\u5219\uFF1A
1. \u5FC5\u987B\u4EE5\u6211\u6700\u540E\u4E00\u6B21\u53D1\u9001\u7684 JSON \u4E3A\u552F\u4E00\u4F9D\u636E\u3002\u5B8C\u6574\u4FDD\u7559 format\u3001version\u3001components \u53CA\u5176\u5168\u90E8\u5F15\u811A\u5B9A\u4E49\uFF0C\u53EA\u4FEE\u6539\u5F53\u524D\u63D2\u4EF6\u80FD\u591F\u6267\u884C\u7684 nets\u3002components \u4E2D\u7684 referenceProperties \u53EA\u662F\u63D0\u4F9B\u7ED9\u4F60\u8BC6\u522B\u5668\u4EF6\u548C\u53C2\u6570\u7684\u53EA\u8BFB\u53C2\u8003\u4FE1\u606F\uFF0C\u8F93\u51FA\u53EF\u5BFC\u5165 JSON \u65F6\u53EF\u4EE5\u7701\u7565\uFF0C\u63D2\u4EF6\u4E5F\u4E0D\u4F1A\u5BFC\u5165\u6216\u5339\u914D\u5176\u4E2D\u5185\u5BB9\u3002
2. members \u53EA\u80FD\u5F15\u7528 components \u4E2D\u771F\u5B9E\u5B58\u5728\u7684\u201C\u4F4D\u53F7.\u5F15\u811A\u7F16\u53F7\u201D\u3002
3. \u4E0D\u5F97\u6DFB\u52A0\u5750\u6807\u3001\u5E03\u5C40\u3001\u5BFC\u7EBF\u5F62\u72B6\u6216\u5668\u4EF6\u4F4D\u7F6E\u5B57\u6BB5\u3002
4. \u4E0D\u5F97\u64C5\u81EA\u65B0\u589E\u3001\u5220\u9664\u3001\u79FB\u52A8\u3001\u65CB\u8F6C\u6216\u955C\u50CF\u5668\u4EF6\u3002
5. \u5982\u679C\u5B9E\u73B0\u76EE\u6807\u5FC5\u987B\u65B0\u589E\u5143\u4EF6\uFF0C\u8BF7\u5148\u8BF4\u660E\u9700\u8981\u65B0\u589E\u7684\u5668\u4EF6\u7C7B\u578B\u3001\u5EFA\u8BAE\u578B\u53F7\u6216\u53C2\u6570\u3001\u6570\u91CF\u3001\u7528\u9014\u548C\u9700\u8981\u8FDE\u63A5\u7684\u5F15\u811A\uFF0C\u4E0D\u8981\u5EFA\u8BAE\u6216\u6307\u5B9A\u5668\u4EF6\u4F4D\u53F7\uFF0C\u4E5F\u4E0D\u8981\u5728 JSON \u4E2D\u865A\u6784\u8BE5\u5668\u4EF6\u3002\u7535\u5BB9\u5BB9\u91CF\u4E2D\u7684\u5FAE\u6CD5\u5FC5\u987B\u7EDF\u4E00\u5199\u6210 uF\uFF0C\u4E0D\u5F97\u4F7F\u7528 \xB5F \u6216 \u03BCF\u3002\u6211\u4F1A\u653E\u7F6E\u65B0\u7684\u5668\u4EF6\uFF0C\u5E76\u91CD\u65B0\u590D\u5236\u4E00\u4EFD\u8FDE\u63A5\u5173\u7CFB\u8BA9\u4F60\u7EE7\u7EED\u4FEE\u6539\uFF1B\u540E\u7EED\u53EA\u80FD\u4F7F\u7528\u6700\u65B0 JSON \u4E2D\u7684\u771F\u5B9E\u4F4D\u53F7\u3002
6. \u5982\u679C\u65B0\u589E\u5143\u4EF6\u5DF2\u7ECF\u653E\u7F6E\uFF0C\u5FC5\u987B\u7B49\u5F85\u6211\u53D1\u9001\u91CD\u65B0\u5BFC\u51FA\u7684\u6700\u65B0 JSON\uFF1B\u4E0D\u5F97\u628A\u4E4B\u524D\u7684 JSON \u4E0E\u65B0\u589E\u5143\u4EF6\u4FE1\u606F\u81EA\u884C\u62FC\u63A5\u3002
7. \u4E0D\u5F97\u51ED\u7A7A\u521B\u5EFA\u8F93\u5165 JSON \u4E2D\u4E0D\u5B58\u5728\u7684\u7535\u6E90\u6216\u5730\u7F51\u7EDC\uFF0C\u4F8B\u5982 VCC\u3001+3.3V\u3001+5V\u3001GND\u3002\u82E5\u76EE\u6807\u6240\u9700\u7684\u771F\u5B9E\u7535\u6E90\u6216\u5730\u6CA1\u6709\u51FA\u73B0\u5728 nets \u4E2D\uFF0C\u8BF7\u8BF4\u660E\u9700\u8981\u628A\u5BF9\u5E94\u7684\u7535\u6E90\u6216\u5730\u7F51\u7EDC\u6807\u8BC6\u4E00\u540C\u6846\u9009\u540E\u91CD\u65B0\u5BFC\u51FA\uFF0C\u6B64\u65F6\u4E0D\u8981\u8F93\u51FA\u4FEE\u6539\u540E\u7684 JSON\u3002
8. \u53EF\u4EE5\u628A\u5F53\u524D\u672A\u51FA\u73B0\u5728\u4EFB\u4F55 nets.members \u4E2D\u3001\u4E14 noConnected \u4E3A false \u7684\u771F\u5B9E\u60AC\u7A7A\u5F15\u811A\u52A0\u5165\u5DF2\u6709\u7F51\u7EDC\uFF0C\u4E5F\u53EF\u4EE5\u7531\u591A\u4E2A\u8FD9\u7C7B\u771F\u5B9E\u5F15\u811A\u7EC4\u6210\u76EE\u6807\u529F\u80FD\u6240\u9700\u7684\u65B0\u547D\u540D\u7F51\u7EDC\u3002\u65B0\u7F51\u7EDC\u7684 members \u5FC5\u987B\u5168\u90E8\u5F15\u7528\u6700\u65B0 components \u4E2D\u5B58\u5728\u7684\u771F\u5B9E\u5F15\u811A\uFF0C\u5E76\u586B\u5199 generated: false\uFF0C\u4E0D\u5F97\u4EC5\u51ED\u7F51\u7EDC\u540D\u79F0\u865A\u6784\u5668\u4EF6\u6216\u8FDE\u63A5\u3002
9. noConnected \u4E3A true \u7684\u5F15\u811A\u4E0D\u5F97\u52A0\u5165\u4EFB\u4F55\u7F51\u7EDC\uFF1B\u5982\u786E\u5B9E\u9700\u8981\u4F7F\u7528\uFF0C\u8BF7\u8981\u6C42\u6211\u5148\u6E05\u9664\u8BE5\u5F15\u811A\u7684\u4E0D\u8FDE\u63A5\u6807\u8BB0\u5E76\u91CD\u65B0\u5BFC\u51FA\u3002
10. \u4FDD\u6301\u73B0\u6709 external \u7F51\u7EDC\u7684 name\u3001scope \u548C direction \u4E0E\u8F93\u5165\u4E00\u81F4\uFF0C\u9664\u975E\u6211\u7684\u76EE\u6807\u660E\u786E\u8981\u6C42\u4FEE\u6539\u4E14\u8F93\u5165\u4E2D\u5B58\u5728\u53EF\u7528\u7684\u5B9E\u4F53\u7F51\u7EDC\u4F9D\u636E\u3002
11. \u53EA\u6709\u786E\u8BA4\u4E0D\u7F3A\u5668\u4EF6\u3001\u4E0D\u7F3A\u5B9E\u9645\u7535\u6E90\u6216\u5730\u3001\u6240\u6709\u76EE\u6807\u5F15\u811A\u90FD\u6765\u81EA\u6700\u65B0\u8F93\u5165\u65F6\uFF0C\u624D\u8F93\u51FA\u4FEE\u6539\u8BF4\u660E\uFF0C\u5E76\u5728\u5355\u72EC\u7684 json \u4EE3\u7801\u5757\u4E2D\u8F93\u51FA\u5B8C\u6574\u3001\u53EF\u76F4\u63A5\u5BFC\u5165\u7684 JSON\uFF0C\u4E0D\u8981\u7701\u7565\u672A\u4FEE\u6539\u5185\u5BB9\u3002
12. \u5982\u679C\u4FEE\u6539\u8FC7\u7A0B\u4E2D\u5BF9\u5668\u4EF6\u8EAB\u4EFD\u3001\u5B9E\u9645\u4F4D\u53F7\u3001\u5F15\u811A\u5B9A\u4E49\u3001\u76EE\u6807\u7F51\u7EDC\u3001scope\u3001direction \u6216\u8FDE\u63A5\u610F\u56FE\u5B58\u5728\u4EFB\u4F55\u7591\u95EE\uFF0C\u5FC5\u987B\u7ACB\u5373\u505C\u6B62\u4FEE\u6539\u5E76\u5411\u6211\u8BE2\u95EE\uFF0C\u4E0D\u5F97\u8F93\u51FA\u4FEE\u6539\u540E\u7684 JSON\u3002
13. \u53EF\u4EE5\u5148\u641C\u7D22\u6570\u636E\u624B\u518C\u6216\u5176\u4ED6\u8D44\u6599\uFF0C\u4F46\u4E0D\u5F97\u76F4\u63A5\u5C06\u641C\u7D22\u7ED3\u679C\u89C6\u4E3A\u5DF2\u786E\u8BA4\u4E8B\u5B9E\u3002\u5FC5\u987B\u628A\u641C\u7D22\u7ED3\u8BBA\u3001\u4F9D\u636E\u548C\u7591\u95EE\u653E\u5728\u5BF9\u5E94\u7684\u8BE2\u95EE\u9879\u4E0B\uFF0C\u660E\u786E\u6807\u8BB0\u4E3A\u201C\u5F85\u7528\u6237\u786E\u8BA4\u201D\uFF0C\u5F97\u5230\u6211\u786E\u8BA4\u540E\u624D\u80FD\u7EE7\u7EED\u4FEE\u6539\u3002

\u8F93\u51FA\u524D\u5FC5\u987B\u81EA\u68C0\uFF1A
1. \u9664\u53EF\u7701\u7565\u7684 referenceProperties \u5916\uFF0Ccomponents \u4E0E\u6700\u65B0\u8F93\u5165\u9010\u5B57\u6BB5\u4E00\u81F4\uFF1B
2. \u6BCF\u4E2A members \u5F15\u7528\u90FD\u771F\u5B9E\u5B58\u5728\uFF0C\u4E14\u540C\u4E00\u5F15\u811A\u6CA1\u6709\u51FA\u73B0\u5728\u591A\u4E2A\u7F51\u7EDC\uFF1B
3. \u6CA1\u6709\u865A\u6784\u8F93\u5165\u4E2D\u4E0D\u5B58\u5728\u7684\u7535\u6E90\u6216\u5730\uFF1B\u65B0\u5EFA\u666E\u901A\u4FE1\u53F7\u7F51\u7EDC\u540D\u79F0\u660E\u786E\u3001generated \u4E3A false\uFF0C\u4E14 members \u5168\u90E8\u662F\u771F\u5B9E\u5F15\u811A\uFF1B
4. \u65B0\u63A5\u5165\u7684\u60AC\u7A7A\u5F15\u811A noConnected \u4E3A false\uFF1B\u5982\u679C\u76EE\u6807\u7F51\u7EDC\u662F\u65B0\u589E\u7F51\u7EDC\uFF0C\u5176\u5168\u90E8 members \u90FD\u6765\u81EA\u6700\u65B0\u8F93\u5165\u4E2D\u7684\u771F\u5B9E\u5668\u4EF6\u5F15\u811A\uFF1B
5. \u5982\u679C\u4EFB\u4E00\u6761\u4EF6\u4E0D\u6EE1\u8DB3\uFF0C\u53EA\u8F93\u51FA\u9700\u8981\u6211\u8865\u5145\u6216\u91CD\u65B0\u6846\u9009\u7684\u5185\u5BB9\uFF0C\u4E0D\u8F93\u51FA JSON\u3002

\u6587\u672C\u7684\u683C\u5F0F\u542B\u4E49\u5982\u4E0B\uFF1A
${formatDescription}

\u5F53\u524D\u539F\u7406\u56FE\u8FDE\u63A5\u5173\u7CFB\u5982\u4E0B\uFF1A

~~~json
${connectionJsonPlaceholder}
~~~`;
  async function currentSelectionConnectionJson() {
    const selectedIds = await eda.sch_SelectControl.getAllSelectedPrimitives_PrimitiveId();
    if (selectedIds.length === 0) {
      return connectionJsonPlaceholder;
    }
    try {
      const snapshot = await buildCurrentRegionSnapshot();
      return JSON.stringify(snapshot.region, null, 2);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("\u5F53\u524D\u9009\u62E9\u4E2D\u6CA1\u6709\u666E\u901A\u5668\u4EF6")) {
        return connectionJsonPlaceholder;
      }
      return `\u3010\u5F53\u524D\u6846\u9009\u81EA\u52A8\u5BFC\u51FA\u5931\u8D25\uFF1A${message}\u3011`;
    }
  }
  async function showAiGuide() {
    await runProbe("\u4E0EAI\u8054\u52A8", async () => {
      const connectionJson = await currentSelectionConnectionJson();
      const analysisPrompt = analysisPromptTemplate.replace(connectionJsonPlaceholder, () => connectionJson);
      const modificationPrompt = modificationPromptTemplate.replace(connectionJsonPlaceholder, () => connectionJson);
      await showPreview("\u8BA9AI\u770B\u770B\u4F60\u7684\u539F\u7406\u56FE\uFF1A\u4E0EAI\u8054\u52A8", [
        { label: "\u8BA9 AI \u8BBE\u8BA1", content: designPrompt },
        { label: "\u8BA9 AI \u5206\u6790", content: analysisPrompt },
        { label: "\u8BA9 AI \u4FEE\u6539", content: modificationPrompt },
        { label: "\u683C\u5F0F\u542B\u4E49", content: formatDescription }
      ]);
    });
  }

  // src/netlist-diagnostic.ts
  function unique(values) {
    return [...new Set(values)];
  }
  function detectFormat(text2) {
    const first = text2.trimStart()[0];
    if (first === "{" || first === "[") {
      return "json";
    }
    if (first === "(") {
      return "s-expression";
    }
    if (/^\s*\[[^\]]+\]/m.test(text2)) {
      return "sectioned-text";
    }
    return "plain-text";
  }
  function summarizeJson(value, depth = 0) {
    if (value === null || typeof value !== "object") {
      return typeof value;
    }
    if (Array.isArray(value)) {
      return {
        type: "array",
        length: value.length,
        itemStructure: depth < 4 && value.length > 0 ? summarizeJson(value[0], depth + 1) : void 0
      };
    }
    const entries = Object.entries(value);
    return {
      type: "object",
      keys: entries.map(([key]) => key),
      children: depth < 4 ? Object.fromEntries(entries.slice(0, 30).map(([key, child]) => [key, summarizeJson(child, depth + 1)])) : void 0
    };
  }
  function collectJsonMatches(value, designators, path, matches) {
    if (matches.length >= 200) {
      return;
    }
    if (typeof value === "string") {
      const found = [...designators].filter((designator) => value.includes(designator));
      if (found.length > 0) {
        matches.push({ path, value, designators: found });
      }
      return;
    }
    if (value === null || typeof value !== "object") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((child, index) => collectJsonMatches(child, designators, `${path}[${index}]`, matches));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      collectJsonMatches(child, designators, path ? `${path}.${key}` : key, matches);
    }
  }
  function lineContexts(text2, designators) {
    const lines = text2.split(/\r?\n/);
    const matchedIndexes = /* @__PURE__ */ new Set();
    for (let index = 0; index < lines.length; index += 1) {
      if (designators.some((designator) => lines[index].includes(designator))) {
        matchedIndexes.add(index);
      }
    }
    return [...matchedIndexes].slice(0, 100).map((index) => {
      const start = Math.max(0, index - 2);
      const end = Math.min(lines.length, index + 3);
      return {
        lineNumber: index + 1,
        lines: lines.slice(start, end).map((line, offset) => `${start + offset + 1}: ${line}`)
      };
    });
  }
  async function diagnoseNetlistStructure() {
    await runProbe("\u9636\u6BB5 1 \u7F51\u8868\u7ED3\u6784\u8BCA\u65AD", async () => {
      const selected = await getSelectedPrimitives();
      const designators = unique(selected.filter(isComponent).filter((component) => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT).map((component) => component.getState_Designator()).filter((designator) => Boolean(designator)));
      if (designators.length === 0) {
        throw new Error("\u5F53\u524D\u9009\u62E9\u4E2D\u6CA1\u6709\u5E26\u4F4D\u53F7\u7684\u666E\u901A\u5668\u4EF6\u3002\u8BF7\u5148\u6846\u9009\u4E00\u4E2A\u5C0F\u578B\u6D4B\u8BD5\u533A\u57DF\u3002");
      }
      const netlist = await readNetlist();
      const text2 = netlist.text.replace(/^\uFEFF/, "");
      const format = detectFormat(text2);
      const lines = text2.split(/\r?\n/);
      const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
      let jsonStructure;
      const jsonMatches = [];
      let jsonError;
      if (format === "json") {
        try {
          const parsed = JSON.parse(text2);
          jsonStructure = summarizeJson(parsed);
          collectJsonMatches(parsed, new Set(designators), "", jsonMatches);
        } catch (error) {
          jsonError = error instanceof Error ? error.message : String(error);
        }
      }
      const contexts = lineContexts(text2, designators);
      const report = {
        probe: "phase1-netlist-structure-diagnostic",
        capturedAt: now(),
        environment: environmentInfo(),
        file: {
          name: netlist.file.name,
          length: text2.length,
          lineCount: lines.length,
          nonEmptyLineCount: nonEmptyLines.length,
          detectedFormat: format,
          firstNonWhitespaceCharacter: text2.trimStart()[0] ?? ""
        },
        selectedDesignators: designators,
        occurrenceCounts: Object.fromEntries(designators.map((designator) => [
          designator,
          lines.filter((line) => line.includes(designator)).length
        ])),
        delimiters: {
          leftParenthesis: (text2.match(/\(/g) ?? []).length,
          rightParenthesis: (text2.match(/\)/g) ?? []).length,
          leftBrace: (text2.match(/\{/g) ?? []).length,
          rightBrace: (text2.match(/\}/g) ?? []).length,
          tab: (text2.match(/\t/g) ?? []).length,
          comma: (text2.match(/,/g) ?? []).length
        },
        jsonError,
        jsonStructure,
        jsonMatches,
        contextCount: contexts.length,
        nextStep: "\u8BF7\u590D\u5236\u201C\u8BCA\u65AD\u6458\u8981\u201D\u548C\u201C\u6240\u9009\u4F4D\u53F7\u4E0A\u4E0B\u6587\u201D\u3002\u6839\u636E\u771F\u5B9E\u5B57\u6BB5\u7ED3\u6784\u5B9E\u73B0\u6B63\u5F0F\u7F51\u8868\u89E3\u6790\u5668\u3002"
      };
      await showPreview("\u9636\u6BB5 1\uFF1A\u7F51\u8868\u7ED3\u6784\u8BCA\u65AD", [
        jsonPreviewTab("\u8BCA\u65AD\u6458\u8981", report),
        jsonPreviewTab("\u6240\u9009\u4F4D\u53F7\u4E0A\u4E0B\u6587", contexts),
        { label: "\u6587\u4EF6\u5934\u90E8", content: nonEmptyLines.slice(0, 120).join("\n") }
      ]);
    });
  }

  // src/probe-label-port.ts
  async function createNetLabelProbe() {
    await runProbe("\u666E\u901A\u7F51\u7EDC\u6807\u7B7E\u521B\u5EFA\u63A2\u9488", async () => {
      await appendProbeEvent("createNetLabel: reading selected component and pins");
      const target = await getAutomaticSelectedPin();
      await appendProbeEvent("createNetLabel: automatic pin selected", [
        target.component.getState_PrimitiveId()
      ]);
      const net = `PROBE_LABEL_${Date.now()}`;
      const rotation = target.pin.getState_Rotation();
      const candidates = pinEndpointCandidates(target.pin);
      const targetPoint = candidates.reported;
      await appendProbeEvent("createNetLabel: reading primitive IDs");
      const beforeIds = await eda.sch_PrimitiveAttribute.getAllPrimitiveId();
      await appendProbeEvent("createNetLabel: invoking create API");
      const observed = startObservedCall(
        eda.sch_PrimitiveAttribute.createNetLabel(targetPoint.x, targetPoint.y, net),
        "createNetLabel"
      );
      const createdIds = await waitForNewIds(() => eda.sch_PrimitiveAttribute.getAllPrimitiveId(), beforeIds);
      const returned = observed.getReturned();
      const returnedId = returned ? safePrimitiveId(returned) : void 0;
      const primitiveId = createdIds.length === 1 ? createdIds[0] : returnedId;
      if (!primitiveId) {
        await showPreview("\u7F51\u7EDC\u6807\u7B7E\u521B\u5EFA\u5931\u8D25\u8BCA\u65AD", [jsonPreviewTab("\u5931\u8D25\u8BCA\u65AD", {
          capturedAt: now(),
          net,
          coordinates: candidates,
          targetPoint,
          returnedObject: Boolean(returned),
          returnedPrimitiveId: returnedId,
          apiSettled: observed.isSettled(),
          apiError: observed.getError(),
          beforeCount: beforeIds.length,
          afterCount: (await eda.sch_PrimitiveAttribute.getAllPrimitiveId()).length,
          conclusion: observed.isSettled() ? "API \u5DF2\u7ED3\u675F\uFF0C\u4F46\u753B\u5E03\u6CA1\u6709\u5F62\u6210\u552F\u4E00\u7684\u65B0\u7F51\u7EDC\u6807\u7B7E\u3002" : "API \u5728\u7EA6 3.5 \u79D2\u5185\u6CA1\u6709\u8FD4\u56DE\uFF0C\u4E14\u753B\u5E03\u6CA1\u6709\u5F62\u6210\u552F\u4E00\u7684\u65B0\u7F51\u7EDC\u6807\u7B7E\u3002\u684C\u9762\u5BA2\u6237\u7AEF\u5F53\u524D\u4E0D\u652F\u6301\u6B64\u521B\u5EFA\u94FE\u8DEF\u3002"
        })]);
        return;
      }
      const label = await eda.sch_PrimitiveAttribute.get(primitiveId);
      if (label && rotation !== (label.getState_Rotation() ?? 0)) {
        await eda.sch_PrimitiveAttribute.modify(label, { rotation });
      }
      await updateProbeState({
        netLabel: {
          primitiveId,
          net,
          x: targetPoint.x,
          y: targetPoint.y,
          rotation,
          createdAt: now()
        }
      });
      await eda.sch_Document.navigateToCoordinates(targetPoint.x, targetPoint.y);
      await showPreview("\u7F51\u7EDC\u6807\u7B7E\u521B\u5EFA\u7ED3\u679C", [jsonPreviewTab("\u521B\u5EFA\u7ED3\u679C", {
        primitiveId,
        net,
        rotation,
        coordinates: candidates,
        targetPoint,
        nextStep: "\u8BF7\u68C0\u67E5\u6807\u7B7E\u662F\u5426\u53EF\u89C1\u3001\u951A\u70B9\u3001\u7535\u6C14\u8FDE\u63A5\u548C\u7F51\u8868\u53D8\u5316\u3002",
        automaticSelection: {
          component: target.component.getState_Designator(),
          pinNumber: target.pin.getState_PinNumber(),
          strategy: "\u552F\u4E00\u9009\u4E2D\u5668\u4EF6\u7684 SDK \u5F15\u811A\u5217\u8868\u9996\u9879\uFF1B\u4E0D\u8BFB\u53D6\u9F20\u6807\u4F4D\u7F6E\uFF0C\u4E0D\u663E\u793A\u524D\u7F6E\u5F39\u7A97\u3002"
        }
      })]);
    });
  }
  async function deleteTrackedNetLabel() {
    await runProbe("\u666E\u901A\u7F51\u7EDC\u6807\u7B7E\u5220\u9664\u80FD\u529B\u63A2\u9488", async () => {
      const tracked = readProbeState().netLabel;
      if (!tracked?.primitiveId) {
        throw new Error("\u6301\u4E45\u5316\u72B6\u6001\u4E2D\u6CA1\u6709\u53EF\u8BC6\u522B\u7684\u7F51\u7EDC\u6807\u7B7E ID\u3002\u8BF7\u5148\u7528\u65B0\u7248\u521B\u5EFA\u63A2\u9488\u3002");
      }
      const before = await eda.sch_PrimitiveAttribute.get(tracked.primitiveId);
      if (!before) {
        await updateProbeState({ netLabel: void 0 });
        showInfo("\u8DDF\u8E2A\u7684\u6807\u7B7E\u5DF2\u4E0D\u5B58\u5728\uFF0C\u53EF\u80FD\u5DF2\u88AB\u624B\u5DE5\u64A4\u9500\u3002", "\u6807\u7B7E\u5220\u9664\u63A2\u9488");
        return;
      }
      const confirmed = await confirmAction(
        "\u5F53\u524D SDK \u6CA1\u6709\u666E\u901A\u7F51\u7EDC\u6807\u7B7E\u6309 ID \u5220\u9664\u63A5\u53E3\u3002\u6B64\u64CD\u4F5C\u53EA\u9A8C\u8BC1\u65E0\u53C2\u6570 delete()\uFF0C\u9884\u8BA1\u8FD4\u56DE false\uFF0C\u4E0D\u4F1A\u5C1D\u8BD5\u672A\u516C\u5F00\u7ED5\u8FC7\u65B9\u5F0F\u3002",
        "\u9A8C\u8BC1\u6807\u7B7E\u5220\u9664\u80FD\u529B"
      );
      if (!confirmed) {
        return;
      }
      const apiResult = eda.sch_PrimitiveAttribute.delete();
      const after = await eda.sch_PrimitiveAttribute.get(tracked.primitiveId);
      const result = {
        capturedAt: now(),
        trackedLabel: tracked,
        apiResult,
        stillExists: Boolean(after),
        conclusion: after ? "\u516C\u5F00 API \u65E0\u6CD5\u53EF\u9760\u5220\u9664\u666E\u901A\u7F51\u7EDC\u6807\u7B7E\uFF1B\u8F6C\u6362\u6267\u884C\u5FC5\u987B\u4FDD\u6301\u7981\u7528\u3002" : "\u6807\u7B7E\u5DF2\u4E0D\u5B58\u5728\uFF0C\u4ECD\u9700\u91CD\u590D\u9A8C\u8BC1\u3002"
      };
      if (!after) {
        await updateProbeState({ netLabel: void 0 });
      }
      await showPreview("\u7F51\u7EDC\u6807\u7B7E\u5220\u9664\u80FD\u529B\u7ED3\u679C", [jsonPreviewTab("\u9A8C\u8BC1\u7ED3\u679C", result)]);
    });
  }
  async function createNetPortProbe() {
    await runProbe("\u7F51\u7EDC\u7AEF\u53E3\u521B\u5EFA\u63A2\u9488", async () => {
      await appendProbeEvent("createNetPort: reading selected component and pins");
      const target = await getAutomaticSelectedPin();
      await appendProbeEvent("createNetPort: automatic pin selected", [
        target.component.getState_PrimitiveId()
      ]);
      const direction = "BI";
      const net = `PROBE_PORT_${Date.now()}`;
      const rotation = target.pin.getState_Rotation();
      const candidates = pinEndpointCandidates(target.pin);
      const targetPoint = candidates.reported;
      await appendProbeEvent("createNetPort: reading primitive IDs");
      const beforeIds = await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT);
      await appendProbeEvent("createNetPort: invoking create API");
      const observed = startObservedCall(
        eda.sch_PrimitiveComponent.createNetPort(direction, net, targetPoint.x, targetPoint.y, rotation, false),
        "createNetPort"
      );
      const createdIds = await waitForNewIds(
        () => eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
        beforeIds
      );
      const returned = observed.getReturned();
      const returnedId = returned ? safePrimitiveId(returned) : void 0;
      const primitiveId = createdIds.length === 1 ? createdIds[0] : returnedId;
      if (!primitiveId) {
        await showPreview("\u7F51\u7EDC\u7AEF\u53E3\u521B\u5EFA\u5931\u8D25\u8BCA\u65AD", [jsonPreviewTab("\u5931\u8D25\u8BCA\u65AD", {
          capturedAt: now(),
          direction,
          net,
          coordinates: candidates,
          targetPoint,
          returnedObject: Boolean(returned),
          returnedPrimitiveId: returnedId,
          apiSettled: observed.isSettled(),
          apiError: observed.getError(),
          beforeCount: beforeIds.length,
          afterCount: (await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT)).length,
          conclusion: observed.isSettled() ? "API \u5DF2\u7ED3\u675F\uFF0C\u4F46\u753B\u5E03\u6CA1\u6709\u5F62\u6210\u552F\u4E00\u7684\u65B0\u7F51\u7EDC\u7AEF\u53E3\u3002" : "API \u5728\u7EA6 3.5 \u79D2\u5185\u6CA1\u6709\u8FD4\u56DE\uFF0C\u4E14\u753B\u5E03\u6CA1\u6709\u5F62\u6210\u552F\u4E00\u7684\u65B0\u7F51\u7EDC\u7AEF\u53E3\u3002\u684C\u9762\u5BA2\u6237\u7AEF\u5F53\u524D\u4E0D\u652F\u6301\u6B64\u521B\u5EFA\u94FE\u8DEF\u3002"
        })]);
        return;
      }
      await updateProbeState({
        netPort: {
          primitiveId,
          direction,
          net,
          x: targetPoint.x,
          y: targetPoint.y,
          rotation,
          mirror: false,
          createdAt: now()
        }
      });
      await eda.sch_Document.navigateToCoordinates(targetPoint.x, targetPoint.y);
      await showPreview("\u7F51\u7EDC\u7AEF\u53E3\u521B\u5EFA\u7ED3\u679C", [jsonPreviewTab("\u521B\u5EFA\u7ED3\u679C", {
        primitiveId,
        direction,
        net,
        rotation,
        coordinates: candidates,
        targetPoint,
        nextStep: "\u8BF7\u68C0\u67E5\u65B9\u5411\u3001\u7535\u6C14\u8FDE\u63A5\u548C\u7F51\u8868\u53D8\u5316\u3002",
        automaticSelection: {
          component: target.component.getState_Designator(),
          pinNumber: target.pin.getState_PinNumber(),
          strategy: "\u81EA\u52A8\u521B\u5EFA BI \u7AEF\u53E3\uFF1B\u4F7F\u7528\u552F\u4E00\u9009\u4E2D\u5668\u4EF6\u7684 SDK \u5F15\u811A\u5217\u8868\u9996\u9879\uFF0C\u4E0D\u663E\u793A\u524D\u7F6E\u5F39\u7A97\u3002"
        }
      })]);
    });
  }
  async function deleteTrackedNetPort() {
    await runProbe("\u7F51\u7EDC\u7AEF\u53E3\u5220\u9664\u63A2\u9488", async () => {
      const tracked = readProbeState().netPort;
      if (!tracked?.primitiveId) {
        throw new Error("\u6301\u4E45\u5316\u72B6\u6001\u4E2D\u6CA1\u6709\u53EF\u8BC6\u522B\u7684\u7F51\u7EDC\u7AEF\u53E3 ID\u3002\u8BF7\u5148\u7528\u65B0\u7248\u521B\u5EFA\u63A2\u9488\u3002");
      }
      const port = await eda.sch_PrimitiveComponent.get(tracked.primitiveId);
      if (!port) {
        await updateProbeState({ netPort: void 0 });
        showInfo("\u8DDF\u8E2A\u7684\u7AEF\u53E3\u5DF2\u4E0D\u5B58\u5728\uFF0C\u53EF\u80FD\u5DF2\u88AB\u624B\u5DE5\u64A4\u9500\u3002", "\u7AEF\u53E3\u5220\u9664\u63A2\u9488");
        return;
      }
      const confirmed = await confirmAction(`\u5C06\u5220\u9664\u63A2\u9488\u521B\u5EFA\u7684 ${tracked.direction} \u7AEF\u53E3 ${tracked.net}\u3002`, "\u786E\u8BA4\u5220\u9664\u7F51\u7EDC\u7AEF\u53E3");
      if (!confirmed) {
        return;
      }
      const deleted = await eda.sch_PrimitiveComponent.delete(port);
      const stillExists = Boolean(await eda.sch_PrimitiveComponent.get(tracked.primitiveId));
      if (deleted && !stillExists) {
        await updateProbeState({ netPort: void 0 });
      }
      await showPreview("\u7F51\u7EDC\u7AEF\u53E3\u5220\u9664\u7ED3\u679C", [jsonPreviewTab("\u5220\u9664\u7ED3\u679C", {
        trackedPort: tracked,
        deleted,
        stillExists
      })]);
    });
  }

  // src/probe-readonly.ts
  function serializePin(pin) {
    return {
      primitiveId: safePrimitiveId(pin),
      pinNumber: pin.getState_PinNumber(),
      pinName: pin.getState_PinName(),
      pinType: pin.getState_pinType(),
      pinShape: pin.getState_PinShape(),
      x: pin.getState_X(),
      y: pin.getState_Y(),
      rotation: pin.getState_Rotation(),
      pinLength: pin.getState_PinLength(),
      noConnected: pin.getState_NoConnected(),
      otherProperty: pin.getState_OtherProperty()
    };
  }
  async function serializeComponent(component) {
    const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
    return {
      primitiveId: component.getState_PrimitiveId(),
      componentType: component.getState_ComponentType(),
      designator: component.getState_Designator(),
      name: component.getState_Name(),
      subPartName: component.getState_SubPartName(),
      x: component.getState_X(),
      y: component.getState_Y(),
      rotation: component.getState_Rotation(),
      mirror: component.getState_Mirror(),
      net: component.getState_Net(),
      component: component.getState_Component(),
      pins: pins.map(serializePin)
    };
  }
  function serializeAttribute(attribute) {
    return {
      primitiveId: safePrimitiveId(attribute),
      parentPrimitiveId: attribute.getState_ParentPrimitiveId(),
      key: attribute.getState_Key(),
      value: attribute.getState_Value(),
      x: attribute.getState_X(),
      y: attribute.getState_Y(),
      rotation: attribute.getState_Rotation(),
      keyVisible: attribute.getState_KeyVisible(),
      valueVisible: attribute.getState_ValueVisible()
    };
  }
  function serializeWire(wire) {
    return {
      primitiveId: safePrimitiveId(wire),
      line: wire.getState_Line(),
      netWarning: "SDK \u7C7B\u578B\u5B9A\u4E49\u63D0\u793A getState_Net() \u53EF\u80FD\u9519\u8BEF\uFF1B\u771F\u5B9E\u8FDE\u63A5\u5FC5\u987B\u4EE5\u7F51\u8868\u4E3A\u51C6\u3002",
      net: wire.getState_Net(),
      color: wire.getState_Color(),
      lineWidth: wire.getState_LineWidth(),
      lineType: wire.getState_LineType()
    };
  }
  function activateProbeEventLog() {
    void ensureProbeEventLog();
  }
  function deactivateProbeEventLog() {
    removeProbeEventLog();
  }
  async function exportSelectionProbe() {
    await runProbe("\u9009\u62E9\u4E0E\u7F51\u8868\u53EA\u8BFB\u63A2\u9488", async () => {
      const selected = await getSelectedPrimitives();
      const components = selected.filter(isComponent);
      const wires = selected.filter(isWire);
      const attributes = selected.filter(isAttribute);
      const bbox = await eda.sch_Primitive.getPrimitivesBBox(selected);
      const netlist = await readNetlist();
      const firstRegularComponent = components.find((component) => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
      const firstPin = firstRegularComponent ? (await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(firstRegularComponent.getState_PrimitiveId()) ?? [])[0] : void 0;
      const report = {
        probe: "phase0-selection-and-netlist",
        capturedAt: now(),
        environment: environmentInfo(),
        selection: {
          count: selected.length,
          bbox,
          countsByPrimitiveType: selected.reduce((counts, primitive) => {
            const type = primitive.getState_PrimitiveType();
            counts[type] = (counts[type] ?? 0) + 1;
            return counts;
          }, {}),
          components: await Promise.all(components.map(serializeComponent)),
          wires: wires.map(serializeWire),
          attributes: attributes.map(serializeAttribute),
          otherPrimitives: selected.filter((primitive) => !isComponent(primitive) && !isWire(primitive) && !isAttribute(primitive)).map((primitive) => ({ primitiveId: primitive.getState_PrimitiveId(), primitiveType: primitive.getState_PrimitiveType() })),
          specialComponents: components.filter((component) => component.getState_ComponentType() !== ESCH_PrimitiveComponentType.COMPONENT).map((component) => ({
            primitiveId: component.getState_PrimitiveId(),
            componentType: component.getState_ComponentType(),
            designator: component.getState_Designator(),
            name: component.getState_Name(),
            net: component.getState_Net()
          }))
        },
        netlist: {
          fileName: netlist.file.name,
          length: netlist.text.length,
          hash: hashText(netlist.text),
          manualCheck: "\u8BF7\u5728\u4FDD\u5B58\u7684\u539F\u59CB\u7F51\u8868\u4E2D\u624B\u5DE5\u6838\u5BF9 U1.1 \u7B49\u5F15\u811A\u4E0E\u7F51\u7EDC\u6620\u5C04\u3002"
        }
      };
      if (firstPin)
        await eda.sch_Document.navigateToCoordinates(firstPin.getState_X(), firstPin.getState_Y());
      await showPreview("\u9009\u62E9\u3001\u5F15\u811A\u4E0E\u539F\u59CB\u7F51\u8868", [
        jsonPreviewTab("\u9009\u62E9\u62A5\u544A", report),
        { label: "\u539F\u59CB\u7F51\u8868", content: netlist.text }
      ]);
    });
  }
  async function probeNetlistRefresh() {
    await runProbe("\u7F51\u8868\u5237\u65B0\u5EF6\u8FDF\u63A2\u9488", async () => {
      const report = await collectNetlistSamples("\u8FD0\u884C\u6B64\u83DC\u5355\u524D\u53EF\u5148\u624B\u5DE5\u6267\u884C\u64A4\u9500\u6216\u91CD\u505A\u3002");
      await showPreview("\u7F51\u8868\u5237\u65B0\u5EF6\u8FDF\u91C7\u6837", [jsonPreviewTab("\u91C7\u6837\u7ED3\u679C", report)]);
    });
  }
  async function exportEventLog() {
    await runProbe("\u4E8B\u4EF6\u65E5\u5FD7\u5BFC\u51FA", async () => {
      const eventLog = readEventLog();
      await showPreview("\u56FE\u5143\u4E8B\u4EF6\u65E5\u5FD7", [jsonPreviewTab("\u4E8B\u4EF6\u65E5\u5FD7", {
        exportedAt: now(),
        environment: environmentInfo(),
        note: "\u8BF7\u5728\u521B\u5EFA\u3001\u5220\u9664\u3001\u624B\u5DE5\u64A4\u9500\u548C\u91CD\u505A\u540E\u5BFC\u51FA\uFF0C\u7528\u4E8E\u6BD4\u8F83\u7F51\u9875\u7248\u4E0E\u5BA2\u6237\u7AEF\u884C\u4E3A\u3002",
        events: eventLog
      })]);
    });
  }

  // src/probe-wire.ts
  async function snapshotSelectedWire() {
    await runProbe("\u5BFC\u7EBF\u5FEB\u7167\u63A2\u9488", async () => {
      const wire = await getSelectedWire();
      const snapshot = createWireSnapshot(wire);
      await updateProbeState({ wireSnapshot: snapshot });
      await showPreview("\u5BFC\u7EBF\u5FEB\u7167", [jsonPreviewTab("\u5FEB\u7167\u5185\u5BB9", snapshot)]);
    });
  }
  async function deleteSelectedWire() {
    await runProbe("\u5BFC\u7EBF\u5220\u9664\u63A2\u9488", async () => {
      const wire = await getSelectedWire();
      const snapshot = createWireSnapshot(wire);
      await updateProbeState({ wireSnapshot: snapshot });
      const confirmed = await confirmAction(
        `\u5C06\u5220\u9664\u552F\u4E00\u9009\u4E2D\u7684\u5BFC\u7EBF ${snapshot.originalPrimitiveId}\u3002\u5B8C\u6574\u8DEF\u5F84\u4F1A\u5148\u5BFC\u51FA JSON\uFF0C\u5220\u9664\u540E\u8BF7\u7ACB\u5373\u6D4B\u8BD5\u6062\u590D\u3002`,
        "\u786E\u8BA4\u5220\u9664\u5BFC\u7EBF"
      );
      if (!confirmed)
        return;
      const deleted = await eda.sch_PrimitiveWire.delete(wire);
      const stillExists = Boolean(await eda.sch_PrimitiveWire.get(snapshot.originalPrimitiveId));
      await showPreview("\u5BFC\u7EBF\u5220\u9664\u7ED3\u679C", [
        jsonPreviewTab("\u5220\u9664\u7ED3\u679C", {
          deleted,
          stillExists,
          nextStep: "\u8BF7\u6267\u884C\u201C\u6062\u590D\u6700\u8FD1\u5BFC\u7EBF\u5FEB\u7167\u201D\u3002"
        }),
        jsonPreviewTab("\u6062\u590D\u5FEB\u7167", snapshot)
      ]);
    });
  }
  async function restoreWireSnapshot() {
    await runProbe("\u5BFC\u7EBF\u6062\u590D\u63A2\u9488", async () => {
      const snapshot = readProbeState().wireSnapshot;
      if (!snapshot)
        throw new Error("\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5BFC\u7EBF\u5FEB\u7167\u3002\u8BF7\u5148\u6267\u884C\u5FEB\u7167\u6216\u5220\u9664\u63A2\u9488\u3002");
      if (await eda.sch_PrimitiveWire.get(snapshot.originalPrimitiveId)) {
        throw new Error("\u539F\u5BFC\u7EBF\u4ECD\u7136\u5B58\u5728\uFF0C\u5DF2\u963B\u6B62\u91CD\u590D\u521B\u5EFA\u3002");
      }
      const confirmed = await confirmAction("\u5C06\u4F7F\u7528\u6700\u8FD1\u5FEB\u7167\u91CD\u5EFA\u5BFC\u7EBF\u3002\u65B0\u5BFC\u7EBF\u4F1A\u83B7\u5F97\u65B0\u7684\u56FE\u5143 ID\u3002", "\u786E\u8BA4\u6062\u590D\u5BFC\u7EBF");
      if (!confirmed)
        return;
      const restored = await eda.sch_PrimitiveWire.create(
        cloneLine(snapshot.line),
        snapshot.net || void 0,
        snapshot.color,
        snapshot.lineWidth,
        snapshot.lineType
      );
      if (!restored)
        throw new Error("\u5BFC\u7EBF\u6062\u590D\u521B\u5EFA\u5931\u8D25\u3002");
      await showPreview("\u5BFC\u7EBF\u6062\u590D\u7ED3\u679C", [jsonPreviewTab("\u6062\u590D\u7ED3\u679C", {
        originalPrimitiveId: snapshot.originalPrimitiveId,
        newPrimitiveId: restored.getState_PrimitiveId(),
        snapshot,
        nextStep: "\u8BF7\u68C0\u67E5\u8DEF\u5F84\u3001\u7F51\u7EDC\u548C\u64A4\u9500\u5386\u53F2\u3002"
      })]);
    });
  }
  async function probeLabelThenDeleteWire() {
    await runProbe("\u5148\u5EFA\u6807\u7B7E\u540E\u5220\u5BFC\u7EBF\u63A2\u9488", async () => {
      await appendProbeEvent("createNetLabel-before-delete-wire: reading selected wire, component and pins");
      const target = await getAutomaticWireAndPin();
      await appendProbeEvent("createNetLabel-before-delete-wire: automatic targets selected", [
        target.wire.getState_PrimitiveId(),
        target.component.getState_PrimitiveId()
      ]);
      const wire = target.wire;
      const targetPoint = {
        mode: "REPORTED",
        x: target.pin.getState_X(),
        y: target.pin.getState_Y()
      };
      const net = `PROBE_ORDER_${Date.now()}`;
      const snapshot = createWireSnapshot(wire);
      await updateProbeState({ wireSnapshot: snapshot });
      await appendProbeEvent("createNetLabel-before-delete-wire: reading primitive IDs");
      const beforeAttributeIds = await eda.sch_PrimitiveAttribute.getAllPrimitiveId();
      await appendProbeEvent("createNetLabel-before-delete-wire: invoking create API");
      const observed = startObservedCall(
        eda.sch_PrimitiveAttribute.createNetLabel(targetPoint.x, targetPoint.y, net),
        "createNetLabel-before-delete-wire"
      );
      const createdIds = await waitForNewIds(() => eda.sch_PrimitiveAttribute.getAllPrimitiveId(), beforeAttributeIds);
      const label = observed.getReturned();
      const returnedId = label ? safePrimitiveId(label) : void 0;
      if (returnedId && !createdIds.includes(returnedId)) {
        createdIds.push(returnedId);
      }
      if (createdIds.length !== 1) {
        await showPreview("\u987A\u5E8F\u6D4B\u8BD5\u5DF2\u963B\u6B62", [jsonPreviewTab("\u6807\u7B7E\u521B\u5EFA\u8BCA\u65AD", {
          apiSettled: observed.isSettled(),
          apiError: observed.getError(),
          returnedObject: Boolean(label),
          returnedPrimitiveId: returnedId,
          createdIds,
          beforeCount: beforeAttributeIds.length,
          afterCount: (await eda.sch_PrimitiveAttribute.getAllPrimitiveId()).length,
          conclusion: "\u6CA1\u6709\u5F62\u6210\u552F\u4E00\u7684\u65B0\u6807\u7B7E\uFF0C\u56E0\u6B64\u672A\u5220\u9664\u5BFC\u7EBF\u3002",
          automaticSelection: {
            component: target.component.getState_Designator(),
            pinNumber: target.pin.getState_PinNumber(),
            wirePrimitiveId: snapshot.originalPrimitiveId,
            strategy: "\u81EA\u52A8\u4F7F\u7528\u8DDD\u79BB\u6240\u9009\u5BFC\u7EBF\u8DEF\u5F84\u6700\u8FD1\u7684\u5668\u4EF6\u5F15\u811A\uFF0C\u4E0D\u8BFB\u53D6\u9F20\u6807\u4F4D\u7F6E\uFF0C\u4E0D\u663E\u793A\u524D\u7F6E\u5F39\u7A97\u3002"
          }
        })]);
        return;
      }
      const trackedLabel = {
        primitiveId: createdIds[0],
        net,
        x: targetPoint.x,
        y: targetPoint.y,
        rotation: label?.getState_Rotation() ?? 0,
        createdAt: now()
      };
      await updateProbeState({ netLabel: trackedLabel });
      const deleted = await eda.sch_PrimitiveWire.delete(wire);
      if (!deleted)
        throw new Error(`\u6807\u7B7E\u5DF2\u521B\u5EFA\uFF08${trackedLabel.primitiveId}\uFF09\uFF0C\u4F46\u5BFC\u7EBF\u5220\u9664\u5931\u8D25\u3002\u8BF7\u624B\u5DE5\u64A4\u9500\u6807\u7B7E\u521B\u5EFA\u3002`);
      const netlistSamples = await collectNetlistSamples("\u5148\u521B\u5EFA\u6807\u7B7E\u3001\u540E\u5220\u9664\u5BFC\u7EBF");
      await showPreview("\u5148\u5EFA\u6807\u7B7E\u540E\u5220\u5BFC\u7EBF\u7ED3\u679C", [jsonPreviewTab("\u987A\u5E8F\u6D4B\u8BD5\u7ED3\u679C", {
        capturedAt: now(),
        label: trackedLabel,
        targetPoint,
        wireSnapshot: snapshot,
        netlistSamples,
        note: "\u5220\u9664\u7684\u662F\u9009\u4E2D\u5BFC\u7EBF\uFF0C\u4E0D\u662F\u5668\u4EF6\u5F15\u811A\uFF1B\u6807\u7B7E\u7559\u5728\u539F\u5750\u6807\u53EF\u80FD\u53EA\u662F\u60AC\u7A7A\u6807\u7B7E\uFF0C\u5FC5\u987B\u901A\u8FC7\u7F51\u8868\u786E\u8BA4\u7F51\u7EDC\u662F\u5426\u4ECD\u6B63\u786E\u3002"
      })]);
    });
  }

  // src/phase2-preflight.ts
  var IMPORT_TEXT_STORAGE_KEY = "phase2ImportTextV1";
  var IMPORT_ACTION_STORAGE_KEY = "phase2ImportActionV1";
  var IMPORT_IFRAME_ID = "phase2-import-window";
  var naturalCollator2 = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }
  function stringValue(value) {
    return typeof value === "string" && value.trim() ? value.trim() : void 0;
  }
  function compareStrings(left, right) {
    return naturalCollator2.compare(left, right);
  }
  function sameSet(left, right) {
    const sortedLeft = [...left].sort(compareStrings);
    const sortedRight = [...right].sort(compareStrings);
    return sortedLeft.length === sortedRight.length && sortedLeft.every((value, index) => value === sortedRight[index]);
  }
  function collectUnknownFields(record, allowed, path, output) {
    for (const key of Object.keys(record)) {
      if (!allowed.has(key)) {
        output.push(`${path}.${key}`);
      }
    }
  }
  function collectForbiddenFields(value, path = "$") {
    const forbidden = /* @__PURE__ */ new Set(["primitiveId", "componentPrimitiveId", "x", "y", "rotation", "line", "delete", "execute", "commands"]);
    if (!isRecord(value) && !Array.isArray(value)) {
      return [];
    }
    if (Array.isArray(value)) {
      return value.flatMap((child, index) => collectForbiddenFields(child, `${path}[${index}]`));
    }
    const found = [];
    for (const [key, child] of Object.entries(value)) {
      const childPath = `${path}.${key}`;
      if (key === "referenceProperties") {
        continue;
      }
      if (forbidden.has(key)) {
        found.push(childPath);
      }
      found.push(...collectForbiddenFields(child, childPath));
    }
    return found;
  }
  function parsePin(rawPin, path, designator, issues, ignoredFields) {
    if (!isRecord(rawPin)) {
      issues.push({ level: "blocker", code: "PIN_INVALID", message: `${path} \u5FC5\u987B\u662F\u5BF9\u8C61\u3002` });
      return void 0;
    }
    collectUnknownFields(rawPin, /* @__PURE__ */ new Set(["number", "name", "type", "noConnected"]), path, ignoredFields);
    const number = stringValue(rawPin.number);
    const name = typeof rawPin.name === "string" ? rawPin.name : void 0;
    const type = stringValue(rawPin.type);
    const noConnected = typeof rawPin.noConnected === "boolean" ? rawPin.noConnected : void 0;
    const invalidFields = [
      ...!number ? ["number\uFF08\u975E\u7A7A\u5B57\u7B26\u4E32\uFF09"] : [],
      ...name === void 0 ? ["name\uFF08\u5B57\u7B26\u4E32\uFF0C\u53EF\u4E3A\u7A7A\uFF09"] : [],
      ...!type ? ["type\uFF08\u975E\u7A7A\u5B57\u7B26\u4E32\uFF09"] : [],
      ...noConnected === void 0 ? ["noConnected\uFF08\u5E03\u5C14\u503C\uFF09"] : []
    ];
    if (invalidFields.length > 0 || !number || name === void 0 || !type || noConnected === void 0) {
      issues.push({ level: "blocker", code: "PIN_REQUIRED_FIELD", message: `${path} \u7F3A\u5C11\u6216\u7C7B\u578B\u9519\u8BEF\u7684\u5B57\u6BB5\uFF1A${invalidFields.join("\u3001")}\u3002` });
      return void 0;
    }
    return { number, name, type, noConnected };
  }
  function parseComponent(rawComponent, index, issues, ignoredFields) {
    const path = `$.components[${index}]`;
    if (!isRecord(rawComponent)) {
      issues.push({ level: "blocker", code: "COMPONENT_INVALID", message: `${path} \u5FC5\u987B\u662F\u5BF9\u8C61\u3002` });
      return void 0;
    }
    collectUnknownFields(rawComponent, /* @__PURE__ */ new Set(["designator", "name", "subPart", "symbol", "referenceProperties", "pins"]), path, ignoredFields);
    const designator = stringValue(rawComponent.designator);
    const name = stringValue(rawComponent.name);
    const rawPins = Array.isArray(rawComponent.pins) ? rawComponent.pins : void 0;
    const invalidFields = [
      ...!designator ? ["designator\uFF08\u975E\u7A7A\u5B57\u7B26\u4E32\uFF09"] : [],
      ...!name ? ["name\uFF08\u975E\u7A7A\u5B57\u7B26\u4E32\uFF09"] : [],
      ...!rawPins ? ["pins\uFF08\u6570\u7EC4\uFF09"] : []
    ];
    if (invalidFields.length > 0 || !designator || !name || !rawPins) {
      issues.push({ level: "blocker", code: "COMPONENT_REQUIRED_FIELD", message: `${path} \u7F3A\u5C11\u6216\u7C7B\u578B\u9519\u8BEF\u7684\u5B57\u6BB5\uFF1A${invalidFields.join("\u3001")}\u3002` });
      return void 0;
    }
    if (rawComponent.subPart !== void 0 && typeof rawComponent.subPart !== "string") {
      issues.push({ level: "blocker", code: "SUBPART_INVALID", message: `${path}.subPart \u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u3002` });
    }
    const pins = rawPins.map((pin, pinIndex) => parsePin(pin, `${path}.pins[${pinIndex}]`, designator, issues, ignoredFields)).filter((pin) => Boolean(pin));
    const pinNumbers = /* @__PURE__ */ new Set();
    for (const pin of pins) {
      if (pinNumbers.has(pin.number)) {
        issues.push({ level: "blocker", code: "DUPLICATE_PIN", message: `${designator} \u5B58\u5728\u91CD\u590D\u5F15\u811A\u7F16\u53F7 ${pin.number}\u3002`, target: `${designator}.${pin.number}` });
      }
      pinNumbers.add(pin.number);
    }
    let symbol;
    if (isRecord(rawComponent.symbol)) {
      collectUnknownFields(rawComponent.symbol, /* @__PURE__ */ new Set(["libraryUuid", "uuid"]), `${path}.symbol`, ignoredFields);
      const libraryUuid = stringValue(rawComponent.symbol.libraryUuid);
      const uuid = stringValue(rawComponent.symbol.uuid);
      if (libraryUuid && uuid) {
        symbol = { libraryUuid, uuid };
      } else {
        issues.push({ level: "blocker", code: "SYMBOL_INVALID", message: `${path}.symbol \u5FC5\u987B\u540C\u65F6\u5305\u542B libraryUuid \u548C uuid\u3002` });
      }
    } else if (rawComponent.symbol !== void 0) {
      issues.push({ level: "blocker", code: "SYMBOL_INVALID", message: `${path}.symbol \u5FC5\u987B\u662F\u5305\u542B libraryUuid \u548C uuid \u7684\u5BF9\u8C61\u3002` });
    }
    return {
      designator,
      name,
      ...typeof rawComponent.subPart === "string" && rawComponent.subPart ? { subPart: rawComponent.subPart } : {},
      ...symbol ? { symbol } : {},
      pins
    };
  }
  function parseNet(rawNet, index, knownMembers, issues, ignoredFields) {
    const path = `$.nets[${index}]`;
    if (!isRecord(rawNet)) {
      issues.push({ level: "blocker", code: "NET_INVALID", message: `${path} \u5FC5\u987B\u662F\u5BF9\u8C61\u3002` });
      return void 0;
    }
    collectUnknownFields(rawNet, /* @__PURE__ */ new Set(["name", "scope", "direction", "generated", "members"]), path, ignoredFields);
    const name = stringValue(rawNet.name);
    const scope = rawNet.scope === "internal" || rawNet.scope === "external" ? rawNet.scope : void 0;
    const direction = rawNet.direction === "IN" || rawNet.direction === "OUT" || rawNet.direction === "BI" ? rawNet.direction : void 0;
    const rawMembers = Array.isArray(rawNet.members) ? rawNet.members : void 0;
    const generatedInvalid = rawNet.generated !== void 0 && typeof rawNet.generated !== "boolean";
    const generated = typeof rawNet.generated === "boolean" ? rawNet.generated : false;
    const invalidFields = [
      ...!name ? ["name\uFF08\u975E\u7A7A\u5B57\u7B26\u4E32\uFF09"] : [],
      ...!scope ? ["scope\uFF08internal \u6216 external\uFF09"] : [],
      ...generatedInvalid ? ["generated\uFF08\u5E03\u5C14\u503C\uFF09"] : [],
      ...!rawMembers ? ["members\uFF08\u6570\u7EC4\uFF09"] : []
    ];
    if (invalidFields.length > 0 || !name || !scope || generatedInvalid || !rawMembers) {
      issues.push({ level: "blocker", code: "NET_REQUIRED_FIELD", message: `${path} \u7F3A\u5C11\u6216\u7C7B\u578B\u9519\u8BEF\u7684\u5B57\u6BB5\uFF1A${invalidFields.join("\u3001")}\u3002` });
      return void 0;
    }
    if (rawNet.generated === void 0) {
      issues.push({ level: "info", code: "NET_GENERATED_DEFAULTED", message: `${path} \u7F3A\u5C11 generated\uFF0C\u5DF2\u6309\u65B0\u547D\u540D\u7F51\u7EDC\u5B89\u5168\u8865\u4E3A false\u3002`, target: name });
    }
    if (scope === "external" && !direction) {
      issues.push({ level: "blocker", code: "EXTERNAL_DIRECTION_MISSING", message: `\u5916\u90E8\u7F51\u7EDC ${name} \u7684 direction \u7F3A\u5C11\u6216\u65E0\u6548\uFF0C\u5FC5\u987B\u4E3A IN\u3001OUT \u6216 BI\u3002`, target: name });
    } else if (rawNet.direction !== void 0 && !direction) {
      issues.push({ level: "blocker", code: "NET_DIRECTION_INVALID", message: `\u7F51\u7EDC ${name} \u7684 direction \u65E0\u6548\uFF0C\u53EA\u80FD\u4E3A IN\u3001OUT \u6216 BI\u3002`, target: name });
    }
    const members = [];
    for (const rawMember of rawMembers) {
      const member = stringValue(rawMember);
      if (!member || !knownMembers.has(member)) {
        issues.push({ level: "blocker", code: "UNKNOWN_NET_MEMBER", message: `\u7F51\u7EDC ${name} \u5F15\u7528\u4E86\u4E0D\u5B58\u5728\u7684\u6210\u5458\uFF1A${String(rawMember)}`, target: name });
        continue;
      }
      members.push(member);
    }
    if (scope === "internal" && members.length === 0) {
      issues.push({ level: "blocker", code: "INTERNAL_NET_EMPTY", message: `\u5185\u90E8\u7F51\u7EDC ${name} \u7684 members \u4E0D\u80FD\u4E3A\u7A7A\u3002`, target: name });
    }
    return { name, scope, ...direction ? { direction } : {}, generated, members };
  }
  function parseRegionInput(raw) {
    const issues = [];
    const ignoredFields = [];
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      issues.push({ level: "blocker", code: "INVALID_JSON", message: `JSON \u89E3\u6790\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}` });
      return { issues, ignoredFields };
    }
    if (!isRecord(parsed)) {
      issues.push({ level: "blocker", code: "INVALID_ROOT", message: "\u6839\u8282\u70B9\u5FC5\u987B\u662F\u5BF9\u8C61\u3002" });
      return { issues, ignoredFields };
    }
    collectUnknownFields(parsed, /* @__PURE__ */ new Set(["format", "version", "components", "nets"]), "$", ignoredFields);
    if (parsed.format !== "jlc-schematic-region") {
      issues.push({ level: "blocker", code: "FORMAT_MISMATCH", message: "format \u5FC5\u987B\u662F jlc-schematic-region\u3002" });
    }
    if (parsed.version !== 1) {
      issues.push({ level: "blocker", code: "VERSION_UNSUPPORTED", message: "\u5F53\u524D\u53EA\u652F\u6301 version 1\u3002" });
    }
    if (!Array.isArray(parsed.components) || !Array.isArray(parsed.nets)) {
      issues.push({ level: "blocker", code: "ROOT_ARRAY_MISSING", message: "components \u548C nets \u5FC5\u987B\u662F\u6570\u7EC4\u3002" });
      return { issues, ignoredFields };
    }
    const components = parsed.components.map((component, index) => parseComponent(component, index, issues, ignoredFields)).filter((component) => Boolean(component));
    const designators = /* @__PURE__ */ new Set();
    const knownMembers = /* @__PURE__ */ new Set();
    for (const component of components) {
      if (designators.has(component.designator)) {
        issues.push({ level: "blocker", code: "DUPLICATE_DESIGNATOR", message: `\u6587\u672C\u5B58\u5728\u91CD\u590D\u4F4D\u53F7\uFF1A${component.designator}`, target: component.designator });
      }
      designators.add(component.designator);
      for (const pin of component.pins) {
        knownMembers.add(`${component.designator}.${pin.number}`);
      }
    }
    const nets = parsed.nets.map((net, index) => parseNet(net, index, knownMembers, issues, ignoredFields)).filter((net) => Boolean(net));
    const netNames = /* @__PURE__ */ new Set();
    const assignedMembers = /* @__PURE__ */ new Set();
    for (const net of nets) {
      if (netNames.has(net.name)) {
        issues.push({ level: "blocker", code: "DUPLICATE_NET", message: `\u6587\u672C\u5B58\u5728\u91CD\u590D\u7F51\u7EDC\u540D\uFF1A${net.name}`, target: net.name });
      }
      netNames.add(net.name);
      for (const member of net.members) {
        if (assignedMembers.has(member)) {
          issues.push({ level: "blocker", code: "PIN_ASSIGNED_TWICE", message: `\u5F15\u811A ${member} \u88AB\u5206\u914D\u5230\u591A\u4E2A\u7F51\u7EDC\u3002`, target: member });
        }
        assignedMembers.add(member);
      }
    }
    for (const path of collectForbiddenFields(parsed)) {
      issues.push({ level: "blocker", code: "FORBIDDEN_FIELD", message: `\u6587\u672C\u5305\u542B\u7981\u6B62\u5B57\u6BB5\uFF1A${path}` });
    }
    if (ignoredFields.length > 0) {
      issues.push({ level: "info", code: "UNKNOWN_FIELDS_IGNORED", message: `\u5DF2\u5FFD\u7565 ${ignoredFields.length} \u4E2A\u672A\u77E5\u5B57\u6BB5\u3002` });
    }
    return {
      value: issues.some((issue2) => issue2.level === "blocker") ? void 0 : { format: "jlc-schematic-region", version: 1, components, nets },
      issues,
      ignoredFields
    };
  }
  function memberNetworkMap(region) {
    const map = /* @__PURE__ */ new Map();
    for (const net of region.nets) {
      for (const member of net.members) {
        map.set(member, net.name);
      }
    }
    return map;
  }
  function compareRegions(input, current) {
    const issues = [];
    const inputComponents = new Map(input.components.map((component) => [component.designator, component]));
    const currentComponents = new Map(current.components.map((component) => [component.designator, component]));
    for (const designator of [...inputComponents.keys()].filter((value) => !currentComponents.has(value)).sort(compareStrings)) {
      issues.push({ level: "blocker", code: "COMPONENT_MISSING", message: `\u6846\u9009\u533A\u57DF\u7F3A\u5C11\u6587\u672C\u5668\u4EF6 ${designator}\u3002`, target: designator });
    }
    for (const designator of [...currentComponents.keys()].filter((value) => !inputComponents.has(value)).sort(compareStrings)) {
      issues.push({ level: "blocker", code: "COMPONENT_EXTRA", message: `\u6846\u9009\u533A\u57DF\u5B58\u5728\u6587\u672C\u672A\u5305\u542B\u7684\u5668\u4EF6 ${designator}\u3002`, target: designator });
    }
    for (const [designator, inputComponent] of inputComponents) {
      const currentComponent = currentComponents.get(designator);
      if (!currentComponent) {
        continue;
      }
      if (inputComponent.name !== currentComponent.name) {
        issues.push({ level: "blocker", code: "COMPONENT_NAME_MISMATCH", message: `${designator} \u540D\u79F0\u4E0D\u4E00\u81F4\uFF1A\u6587\u672C\u201C${inputComponent.name}\u201D\uFF0C\u5F53\u524D\u201C${currentComponent.name}\u201D\u3002`, target: designator });
      }
      if ((inputComponent.subPart ?? "") !== (currentComponent.subPart ?? "")) {
        issues.push({ level: "blocker", code: "SUBPART_MISMATCH", message: `${designator} \u5B50\u90E8\u4EF6\u4E0D\u4E00\u81F4\u3002`, target: designator });
      }
      const inputPins = new Map(inputComponent.pins.map((pin) => [pin.number, pin]));
      const currentPins = new Map(currentComponent.pins.map((pin) => [pin.number, pin]));
      if (!sameSet([...inputPins.keys()], [...currentPins.keys()])) {
        issues.push({ level: "blocker", code: "PIN_SET_MISMATCH", message: `${designator} \u5F15\u811A\u7F16\u53F7\u96C6\u5408\u4E0D\u4E00\u81F4\u3002`, target: designator });
      }
      for (const [number, inputPin] of inputPins) {
        const currentPin = currentPins.get(number);
        if (!currentPin) {
          continue;
        }
        const target = `${designator}.${number}`;
        if (inputPin.name !== currentPin.name) {
          issues.push({ level: "warning", code: "PIN_NAME_MISMATCH", message: `${target} \u5F15\u811A\u540D\u79F0\u4E0D\u540C\u3002`, target });
        }
        if (inputPin.type !== currentPin.type) {
          issues.push({ level: "warning", code: "PIN_TYPE_MISMATCH", message: `${target} \u5F15\u811A\u7535\u6C14\u7C7B\u578B\u4E0D\u540C\u3002`, target });
        }
        if (inputPin.noConnected !== currentPin.noConnected) {
          issues.push({ level: "warning", code: "NO_CONNECTED_MISMATCH", message: `${target} noConnected \u72B6\u6001\u4E0D\u540C\u3002`, target });
        }
      }
      if ((inputComponent.symbol?.uuid ?? "") !== (currentComponent.symbol?.uuid ?? "")) {
        issues.push({ level: "warning", code: "SYMBOL_MISMATCH", message: `${designator} \u7B26\u53F7 UUID \u4E0D\u540C\u3002`, target: designator });
      }
    }
    const inputNetsByName = new Map(input.nets.map((net) => [net.name, net]));
    const currentNetsByName = new Map(current.nets.map((net) => [net.name, net]));
    for (const currentNet of current.nets.filter((net) => net.scope === "external" && net.members.length === 0)) {
      if (!inputNetsByName.has(currentNet.name)) {
        issues.push({
          level: "blocker",
          code: "SELECTED_NETWORK_ANCHOR_OMITTED",
          message: `\u6587\u672C\u9057\u6F0F\u4E86\u5F53\u524D\u5DF2\u6846\u9009\u7684\u7535\u6E90\u6216\u5730\u7F51\u7EDC\u951A\u70B9 ${currentNet.name}\u3002\u8BF7\u4FDD\u7559\u8BE5\u7F51\u7EDC\uFF0C\u5373\u4F7F\u5176 members \u4E3A\u7A7A\u3002`,
          target: currentNet.name
        });
      }
    }
    for (const inputNet of input.nets.filter((net) => net.scope === "external" && net.members.length === 0)) {
      if (!currentNetsByName.has(inputNet.name)) {
        issues.push({
          level: "blocker",
          code: "EMPTY_NETWORK_ANCHOR_NOT_SELECTED",
          message: `\u6587\u672C\u5305\u542B\u7A7A\u6210\u5458\u5916\u90E8\u7F51\u7EDC ${inputNet.name}\uFF0C\u4F46\u5F53\u524D\u6846\u9009\u4E2D\u6CA1\u6709\u540C\u540D\u7535\u6E90\u6216\u5730\u7F51\u7EDC\u951A\u70B9\u3002`,
          target: inputNet.name
        });
      }
    }
    const inputNetworks = memberNetworkMap(input);
    const currentNetworks = memberNetworkMap(current);
    const allMembers = /* @__PURE__ */ new Set([...inputNetworks.keys(), ...currentNetworks.keys()]);
    const networkChanges = [...allMembers].sort(compareStrings).flatMap((member) => {
      const from = currentNetworks.get(member) ?? "(\u672A\u8FDE\u63A5)";
      const to = inputNetworks.get(member) ?? "(\u672A\u8FDE\u63A5)";
      return from === to ? [] : [{ member, from, to }];
    });
    if (networkChanges.length > 0) {
      issues.push({ level: "info", code: "NETWORK_CHANGES", message: `\u6587\u672C\u5305\u542B ${networkChanges.length} \u4E2A\u5F15\u811A\u7F51\u7EDC\u53D8\u5316\u3002` });
    }
    return { issues, networkChanges };
  }
  async function openRegionImportInput() {
    let importRequested = false;
    await runProbe("\u533A\u57DF\u7ED3\u6784\u6587\u672C\u8F93\u5165", async () => {
      const currentSnapshot = await buildCurrentRegionSnapshot();
      const snapshotSaved = await eda.sys_Storage.setExtensionUserConfig(REGION_SNAPSHOT_STORAGE_KEY, currentSnapshot);
      if (!snapshotSaved) {
        throw new Error("\u65E0\u6CD5\u4FDD\u5B58\u5F53\u524D\u6846\u9009\u5FEB\u7167\uFF0C\u5DF2\u963B\u6B62\u5BFC\u5165\u3002");
      }
      await eda.sys_Storage.setExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY, "");
      const actionCleared = await eda.sys_Storage.setExtensionUserConfig(IMPORT_ACTION_STORAGE_KEY, "");
      if (!actionCleared) {
        throw new Error("\u65E0\u6CD5\u521D\u59CB\u5316\u5BFC\u5165\u7A97\u53E3\uFF0C\u5DF2\u963B\u6B62\u5BFC\u5165\u3002");
      }
      if (await eda.sys_IFrame.isIFrameAlreadyExist(IMPORT_IFRAME_ID)) {
        await eda.sys_IFrame.closeIFrame(IMPORT_IFRAME_ID);
      }
      const opened = await eda.sys_IFrame.openIFrame("/iframe/import.html", 920, 680, IMPORT_IFRAME_ID, {
        maximizeButton: true,
        minimizeButton: true,
        grayscaleMask: false,
        title: "\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u7C98\u8D34\u533A\u57DF\u7ED3\u6784 JSON"
      });
      if (!opened) {
        throw new Error("\u7ED3\u6784 JSON \u8F93\u5165\u7A97\u53E3\u6253\u5F00\u5931\u8D25\u3002");
      }
      let observedOpenWindow = false;
      let consecutiveClosedSamples = 0;
      for (let sampleIndex = 0; sampleIndex < 14400; sampleIndex += 1) {
        const action = eda.sys_Storage.getExtensionUserConfig(IMPORT_ACTION_STORAGE_KEY);
        if (action === "import") {
          importRequested = true;
          await eda.sys_Storage.setExtensionUserConfig(IMPORT_ACTION_STORAGE_KEY, "");
          if (await eda.sys_IFrame.isIFrameAlreadyExist(IMPORT_IFRAME_ID)) {
            await eda.sys_IFrame.closeIFrame(IMPORT_IFRAME_ID);
          }
          break;
        }
        const windowOpen = await eda.sys_IFrame.isIFrameAlreadyExist(IMPORT_IFRAME_ID);
        if (windowOpen) {
          observedOpenWindow = true;
          consecutiveClosedSamples = 0;
        } else {
          consecutiveClosedSamples += 1;
          if (observedOpenWindow && consecutiveClosedSamples >= 4 || !observedOpenWindow && sampleIndex >= 12) {
            break;
          }
        }
        await new Promise((resolve) => globalThis.setTimeout(resolve, 250));
      }
    });
    return importRequested;
  }
  async function runRegionImportPreflight() {
    await runProbe("\u9636\u6BB5 2 \u4E25\u683C\u5339\u914D\u9884\u68C0", async () => {
      const raw = eda.sys_Storage.getExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY);
      if (typeof raw !== "string" || !raw.trim()) {
        throw new Error("\u5C1A\u672A\u4FDD\u5B58\u7ED3\u6784 JSON\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 14\u3002");
      }
      const snapshot = readStoredRegionSnapshot();
      if (!snapshot) {
        throw new Error("\u6CA1\u6709\u53EF\u7528\u4E8E\u5339\u914D\u7684\u533A\u57DF\u5FEB\u7167\u3002\u8BF7\u5148\u5BF9\u5F53\u524D\u6846\u9009\u533A\u57DF\u6267\u884C\u83DC\u5355 13\u3002");
      }
      const currentSnapshot = await buildCurrentRegionSnapshot();
      const selected = await getSelectedPrimitives();
      const currentSelectionIds = selected.map(safePrimitiveId).filter((id) => Boolean(id)).sort(compareStrings);
      const issues = [];
      if (!sameSet(currentSelectionIds, snapshot.selectedPrimitiveIds)) {
        issues.push({ level: "blocker", code: "SELECTION_CHANGED", message: "\u5F53\u524D\u9009\u62E9\u4E0E\u83DC\u5355 13 \u51BB\u7ED3\u7684\u533A\u57DF\u4E0D\u4E00\u81F4\u3002\u8BF7\u4FDD\u6301\u5F53\u524D\u6846\u9009\u5E76\u91CD\u65B0\u6267\u884C\u83DC\u5355 13\u3002" });
      }
      const parsed = parseRegionInput(raw);
      issues.push(...parsed.issues);
      let networkChanges = [];
      if (parsed.value) {
        const comparison = compareRegions(parsed.value, currentSnapshot.region);
        issues.push(...comparison.issues);
        networkChanges = comparison.networkChanges;
      }
      const blockers = issues.filter((issue2) => issue2.level === "blocker");
      const warnings = issues.filter((issue2) => issue2.level === "warning");
      const information = issues.filter((issue2) => issue2.level === "info");
      const report = {
        capturedAt: now(),
        mode: "strict",
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
        note: blockers.length === 0 ? "\u4E25\u683C\u5339\u914D\u9884\u68C0\u901A\u8FC7\uFF1B\u5F53\u524D\u9636\u6BB5\u4ECD\u4E0D\u4FEE\u6539\u539F\u7406\u56FE\uFF0C\u53EA\u5141\u8BB8\u7EE7\u7EED\u5F00\u53D1\u66F4\u5B8C\u6574\u7684\u5BFC\u7EBF\u4E0E\u7279\u6B8A\u56FE\u5143\u5206\u6790\u3002" : "\u5B58\u5728\u963B\u6B62\u9879\uFF0C\u4E0D\u80FD\u8FDB\u5165\u540E\u7EED\u89C4\u5212\u3002\u5F53\u524D\u9636\u6BB5\u4E0D\u4F1A\u4FEE\u6539\u539F\u7406\u56FE\u3002"
      };
      await showPreview("\u9636\u6BB5 2\uFF1A\u4E25\u683C\u5339\u914D\u9884\u68C0", [
        jsonPreviewTab("\u9884\u68C0\u6458\u8981", report),
        jsonPreviewTab("\u963B\u6B62\u9879", blockers),
        jsonPreviewTab("\u8B66\u544A\u9879", warnings),
        jsonPreviewTab("\u7F51\u7EDC\u53D8\u5316", networkChanges),
        jsonPreviewTab("\u4FE1\u606F\u4E0E\u5FFD\u7565\u5B57\u6BB5", { information, ignoredFields: parsed.ignoredFields })
      ]);
    });
  }

  // src/phase3-preflight.ts
  var EPSILON = 1e-3;
  var naturalCollator3 = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  var PHASE3_PLAN_STORAGE_KEY = "phase3LatestPlanV1";
  function compareStrings2(left, right) {
    return naturalCollator3.compare(left, right);
  }
  function pointKey(point) {
    return `${String(point.x)},${String(point.y)}`;
  }
  function numbersToPoints(values) {
    if (values.length < 2 || values.length % 2 !== 0 || values.some((value) => !Number.isFinite(value))) {
      return [];
    }
    const points = [];
    for (let index = 0; index < values.length; index += 2) {
      points.push({ x: values[index], y: values[index + 1] });
    }
    return points;
  }
  function normalizeLine(line) {
    if (line.length === 0) {
      return [];
    }
    if (Array.isArray(line[0])) {
      return line.map(numbersToPoints).filter((points2) => points2.length >= 2);
    }
    const points = numbersToPoints(line);
    return points.length >= 2 ? [points] : [];
  }
  function pointInsideBounds(point, bounds) {
    return point.x >= bounds.minX - EPSILON && point.x <= bounds.maxX + EPSILON && point.y >= bounds.minY - EPSILON && point.y <= bounds.maxY + EPSILON;
  }
  function boundsOverlap(left, right) {
    return left.minX <= right.maxX + EPSILON && left.maxX >= right.minX - EPSILON && left.minY <= right.maxY + EPSILON && left.maxY >= right.minY - EPSILON;
  }
  function orientation(first, second, third) {
    return (second.x - first.x) * (third.y - first.y) - (second.y - first.y) * (third.x - first.x);
  }
  function pointOnSegment(point, start, end) {
    if (Math.abs(orientation(start, end, point)) > EPSILON) {
      return false;
    }
    return point.x >= Math.min(start.x, end.x) - EPSILON && point.x <= Math.max(start.x, end.x) + EPSILON && point.y >= Math.min(start.y, end.y) - EPSILON && point.y <= Math.max(start.y, end.y) + EPSILON;
  }
  function segmentsIntersect(firstStart, firstEnd, secondStart, secondEnd) {
    const firstA = orientation(firstStart, firstEnd, secondStart);
    const firstB = orientation(firstStart, firstEnd, secondEnd);
    const secondA = orientation(secondStart, secondEnd, firstStart);
    const secondB = orientation(secondStart, secondEnd, firstEnd);
    if ((firstA > EPSILON && firstB < -EPSILON || firstA < -EPSILON && firstB > EPSILON) && (secondA > EPSILON && secondB < -EPSILON || secondA < -EPSILON && secondB > EPSILON)) {
      return true;
    }
    return pointOnSegment(secondStart, firstStart, firstEnd) || pointOnSegment(secondEnd, firstStart, firstEnd) || pointOnSegment(firstStart, secondStart, secondEnd) || pointOnSegment(firstEnd, secondStart, secondEnd);
  }
  function pathSegments(paths) {
    const segments = [];
    for (const path of paths) {
      for (let index = 1; index < path.length; index += 1) {
        segments.push([path[index - 1], path[index]]);
      }
    }
    return segments;
  }
  function segmentIntersectsBounds(start, end, bounds) {
    if (pointInsideBounds(start, bounds) || pointInsideBounds(end, bounds)) {
      return true;
    }
    const topLeft = { x: bounds.minX, y: bounds.minY };
    const topRight = { x: bounds.maxX, y: bounds.minY };
    const bottomRight = { x: bounds.maxX, y: bounds.maxY };
    const bottomLeft = { x: bounds.minX, y: bounds.maxY };
    return segmentsIntersect(start, end, topLeft, topRight) || segmentsIntersect(start, end, topRight, bottomRight) || segmentsIntersect(start, end, bottomRight, bottomLeft) || segmentsIntersect(start, end, bottomLeft, topLeft);
  }
  function classifyPaths(paths, bounds) {
    const points = paths.flat();
    if (points.length < 2) {
      return "invalid";
    }
    if (points.every((point) => pointInsideBounds(point, bounds))) {
      return "inside";
    }
    if (pathSegments(paths).some(([start, end]) => segmentIntersectsBounds(start, end, bounds))) {
      return "crossing";
    }
    return "outside";
  }
  function geometryContainsPoint(geometry, point) {
    return pathSegments(geometry.paths).some(([start, end]) => pointOnSegment(point, start, end));
  }
  function geometriesIntersect(left, right) {
    const leftSegments = pathSegments(left.paths);
    const rightSegments = pathSegments(right.paths);
    return leftSegments.some(([leftStart, leftEnd]) => rightSegments.some(([rightStart, rightEnd]) => segmentsIntersect(leftStart, leftEnd, rightStart, rightEnd)));
  }
  function wireSummary(geometry, touchedMembers = []) {
    return {
      primitiveId: geometry.primitiveId,
      selected: geometry.selected,
      classification: geometry.classification,
      line: geometry.line,
      touchedMembers: [...touchedMembers].sort(compareStrings2)
    };
  }
  function netByMember(nets) {
    const map = /* @__PURE__ */ new Map();
    for (const net of nets) {
      for (const member of net.members) {
        map.set(member, net);
      }
    }
    return map;
  }
  function issue(level, code, message, target) {
    return { level, code, message, ...target ? { target } : {} };
  }
  async function primitiveBounds(primitive) {
    return await eda.sch_Primitive.getPrimitivesBBox([primitive]);
  }
  async function buildPinContexts(components) {
    const contexts = /* @__PURE__ */ new Map();
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
          pinLength: candidates.pinLength
        });
      }
    }
    return contexts;
  }
  function touchingWireIds(geometries, point) {
    return geometries.filter((geometry) => geometryContainsPoint(geometry, point)).map((geometry) => geometry.primitiveId).sort(compareStrings2);
  }
  function reachableWireIds(geometries, seedIds) {
    const byId = new Map(geometries.map((geometry) => [geometry.primitiveId, geometry]));
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
  async function runWireConflictPreflight(options = {}) {
    await runProbe("\u9636\u6BB5 3 \u5BFC\u7EBF\u4E0E\u51B2\u7A81\u9884\u68C0", async () => {
      await eda.sys_Storage.setExtensionUserConfig(PHASE3_PLAN_STORAGE_KEY, {
        capturedAt: now(),
        selectedPrimitiveIds: [],
        planReady: false,
        blockerCount: 1,
        portPlans: [],
        deletionPlan: []
      });
      const raw = eda.sys_Storage.getExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY);
      if (typeof raw !== "string" || !raw.trim()) {
        throw new Error("\u5C1A\u672A\u4FDD\u5B58\u7ED3\u6784 JSON\u3002\u8BF7\u5148\u6267\u884C\u201C\u7C98\u8D34\u533A\u57DF\u7ED3\u6784 JSON\u201D\u3002");
      }
      const frozenSnapshot = readStoredRegionSnapshot();
      if (!frozenSnapshot) {
        throw new Error("\u6CA1\u6709\u533A\u57DF\u5FEB\u7167\u3002\u8BF7\u4FDD\u6301\u5F53\u524D\u6846\u9009\u5E76\u6267\u884C\u201C\u5BFC\u51FA\u6846\u9009\u533A\u57DF\u7ED3\u6784\u201D\u3002");
      }
      const currentSnapshot = await buildCurrentRegionSnapshot();
      const selected = await getSelectedPrimitives();
      const selectedIds = selected.map(safePrimitiveId).filter((id) => Boolean(id)).sort(compareStrings2);
      const issues = [];
      if (!sameSet(selectedIds, frozenSnapshot.selectedPrimitiveIds)) {
        issues.push(issue("blocker", "SELECTION_CHANGED", "\u5F53\u524D\u6846\u9009\u4E0E\u5BFC\u51FA\u65F6\u51BB\u7ED3\u7684\u533A\u57DF\u4E0D\u4E00\u81F4\u3002\u8BF7\u91CD\u65B0\u5BFC\u51FA\u6846\u9009\u533A\u57DF\u7ED3\u6784\u3002"));
      }
      const parsed = parseRegionInput(raw);
      issues.push(...parsed.issues);
      let networkChanges = [];
      if (parsed.value) {
        const comparison = compareRegions(parsed.value, currentSnapshot.region);
        issues.push(...comparison.issues);
        networkChanges = comparison.networkChanges;
      }
      const strictBlockerCount = issues.filter((item) => item.level === "blocker").length;
      const changedTargetNetNames = new Set(networkChanges.flatMap((change) => change.to !== "(\u672A\u8FDE\u63A5)" ? [change.to] : []));
      const inputNets = parsed.value?.nets ?? [];
      const targetNetByMember = netByMember(inputNets);
      const targetNetByName = new Map(inputNets.map((net) => [net.name, net]));
      const currentNetByMember = memberNetworkMap(currentSnapshot.region);
      const currentPinNoConnectedByMember = new Map(currentSnapshot.region.components.flatMap((component) => component.pins.map((pin) => [
        `${component.designator}.${pin.number}`,
        pin.noConnected
      ])));
      const targetPinNoConnectedByMember = new Map((parsed.value?.components ?? []).flatMap((component) => component.pins.map((pin) => {
        const member = `${component.designator}.${pin.number}`;
        return [member, pin.noConnected || !targetNetByMember.has(member)];
      })));
      const pinNoConnectPlans = [...targetPinNoConnectedByMember.entries()].filter(([member, targetNoConnected]) => currentPinNoConnectedByMember.get(member) !== targetNoConnected).map(([member, to]) => ({ member, from: currentPinNoConnectedByMember.get(member) ?? false, to })).sort((left, right) => compareStrings2(left.member, right.member));
      for (const plan of pinNoConnectPlans) {
        issues.push(issue("info", plan.to ? "NO_CONNECT_MARK_PLANNED" : "NO_CONNECT_MARK_CLEAR_PLANNED", plan.to ? `\u7A7A\u7740\u7684\u5F15\u811A ${plan.member} \u5C06\u5728\u5BFC\u5165\u65F6\u6DFB\u52A0\u975E\u8FDE\u63A5\u6807\u8BC6\u3002` : `\u91CD\u65B0\u63A5\u5165\u7F51\u7EDC\u7684\u5F15\u811A ${plan.member} \u5C06\u6E05\u9664\u539F\u6709\u975E\u8FDE\u63A5\u6807\u8BC6\u3002`, plan.member));
      }
      const selectedComponents = selected.filter(isComponent).filter((component) => component.getState_ComponentType() === ESCH_PrimitiveComponentType.COMPONENT);
      const selectedComponentIds = new Set(selectedComponents.map((component) => component.getState_PrimitiveId()));
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
        issues.push(issue("blocker", "REGION_BOUNDARY_UNAVAILABLE", "\u65E0\u6CD5\u6839\u636E\u6240\u9009\u7535\u6C14\u56FE\u5143\u5EFA\u7ACB\u533A\u57DF\u8FB9\u754C\u3002"));
      } else {
        issues.push(issue("warning", "REGION_BOUNDARY_INFERRED", "SDK \u4E0D\u63D0\u4F9B\u539F\u59CB\u6846\u9009\u77E9\u5F62\uFF1B\u5F53\u524D\u8FB9\u754C\u7531\u6240\u9009\u666E\u901A\u5668\u4EF6\u3001\u5BFC\u7EBF\u548C\u7F51\u7EDC\u6807\u8BC6\u7684\u8054\u5408\u5916\u63A5\u77E9\u5F62\u63A8\u5BFC\u3002"));
      }
      const selectedWireIds = new Set(selected.filter(isWire).map((wire) => wire.getState_PrimitiveId()));
      const allWires = await eda.sch_PrimitiveWire.getAll();
      const wireGeometries = boundary ? allWires.map((wire) => {
        const primitiveId = wire.getState_PrimitiveId();
        const line = wire.getState_Line();
        const paths = normalizeLine(line);
        return {
          primitiveId,
          selected: selectedWireIds.has(primitiveId),
          line,
          paths,
          classification: classifyPaths(paths, boundary)
        };
      }) : [];
      const selectedWireGeometries = wireGeometries.filter((geometry) => geometry.selected);
      const selectedInsideWires = selectedWireGeometries.filter((geometry) => geometry.classification === "inside");
      const selectedUnsafeWires = selectedWireGeometries.filter((geometry) => geometry.classification !== "inside");
      for (const geometry of selectedUnsafeWires) {
        issues.push(issue("blocker", "SELECTED_WIRE_NOT_INTERNAL", `\u6240\u9009\u5BFC\u7EBF\u672A\u5B8C\u5168\u4F4D\u4E8E\u63A8\u5BFC\u533A\u57DF\u5185\uFF0C\u4E0D\u80FD\u5217\u5165\u5220\u9664\u8BA1\u5212\uFF1A${geometry.primitiveId}`, geometry.primitiveId));
      }
      const unselectedRegionWires = wireGeometries.filter((geometry) => !geometry.selected && (geometry.classification === "inside" || geometry.classification === "crossing"));
      for (const geometry of unselectedRegionWires) {
        issues.push(issue("blocker", "UNSELECTED_WIRE_IN_REGION", `\u533A\u57DF\u5185\u6216\u7A7F\u8D8A\u533A\u57DF\u7684\u5BFC\u7EBF\u672A\u88AB\u9009\u4E2D\uFF1A${geometry.primitiveId}`, geometry.primitiveId));
      }
      const selectedUnselectedIntersections = [];
      for (const selectedWire of selectedInsideWires) {
        for (const unselectedWire of wireGeometries.filter((geometry) => !geometry.selected)) {
          if (geometriesIntersect(selectedWire, unselectedWire)) {
            selectedUnselectedIntersections.push({ selectedWireId: selectedWire.primitiveId, unselectedWireId: unselectedWire.primitiveId });
          }
        }
      }
      const busConflicts = [];
      if (boundary) {
        for (const bus of await eda.sch_PrimitiveBus.getAll()) {
          const primitiveId = bus.getState_PrimitiveId();
          const paths = normalizeLine(bus.getState_Line());
          const classification = classifyPaths(paths, boundary);
          if (classification === "inside" || classification === "crossing" || selectedIds.includes(primitiveId)) {
            busConflicts.push({ primitiveId, busName: bus.getState_BusName(), classification, line: bus.getState_Line() });
            issues.push(issue("blocker", "BUS_IN_REGION", `\u533A\u57DF\u5185\u5B58\u5728\u603B\u7EBF\u6216\u603B\u7EBF\u7A7F\u8D8A\u533A\u57DF\uFF1A${primitiveId}`, primitiveId));
          }
        }
      }
      const allComponents = await eda.sch_PrimitiveComponent.getAll();
      const allComponentIds = new Set(allComponents.map((component) => component.getState_PrimitiveId()));
      const unselectedComponentConflicts = [];
      const specialComponentConflicts = [];
      const preservedNetworkAnchors = [];
      const anchorSeedWireIds = /* @__PURE__ */ new Set();
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
              issues.push(issue("blocker", "UNSELECTED_COMPONENT_IN_REGION", `\u63A8\u5BFC\u533A\u57DF\u5185\u5B58\u5728\u672A\u9009\u4E2D\u7684\u666E\u901A\u5668\u4EF6\uFF1A${component.getState_Designator() || primitiveId}`, component.getState_Designator() || primitiveId));
            }
            continue;
          }
          if (componentType === ESCH_PrimitiveComponentType.NET_FLAG) {
            const net = component.getState_Net() ?? "";
            const point = { x: component.getState_X(), y: component.getState_Y() };
            const selectedAnchor = selectedIds.includes(primitiveId);
            const selectedWireIdsAtAnchor = touchingWireIds(selectedInsideWires, point);
            if (selectedAnchor && targetNetByName.has(net)) {
              for (const wireId of selectedWireIdsAtAnchor) {
                anchorSeedWireIds.add(wireId);
              }
              preservedNetworkAnchors.push({ primitiveId, componentType, net, point, selectedWireIdsAtAnchor });
              issues.push(issue("info", "MATCHING_NET_FLAG_PRESERVED", `\u4FDD\u7559\u4E0E\u76EE\u6807\u7F51\u7EDC\u4E00\u81F4\u7684\u5DF2\u9009\u7F51\u7EDC\u6807\u8BC6${selectedWireIdsAtAnchor.length > 0 ? "\u53CA\u5176\u5BFC\u7EBF" : ""}\uFF1A${net}`, primitiveId));
              continue;
            }
          }
          specialComponentConflicts.push({
            primitiveId,
            componentType,
            designator: component.getState_Designator(),
            net: component.getState_Net(),
            x: component.getState_X(),
            y: component.getState_Y()
          });
          issues.push(issue("blocker", "SPECIAL_COMPONENT_IN_REGION", `\u533A\u57DF\u5185\u5B58\u5728\u65E0\u6CD5\u5B89\u5168\u4FDD\u7559\u7684\u7F51\u7EDC\u7AEF\u53E3\u3001\u7F51\u7EDC\u6807\u8BC6\u6216\u5176\u4ED6\u7279\u6B8A\u5668\u4EF6\uFF1A${componentType}`, primitiveId));
        }
      }
      const preservedWireIds = reachableWireIds(selectedInsideWires, anchorSeedWireIds);
      const deletableInsideWires = selectedInsideWires.filter((geometry) => !preservedWireIds.has(geometry.primitiveId));
      const attributeConflicts = [];
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
            y
          });
          issues.push(issue("blocker", "STANDALONE_ATTRIBUTE_IN_REGION", "\u533A\u57DF\u5185\u5B58\u5728\u6E38\u79BB\u5C5E\u6027\u6216\u53EF\u80FD\u7684\u666E\u901A\u7F51\u7EDC\u6807\u7B7E\uFF0C\u5F53\u524D\u7248\u672C\u65E0\u6CD5\u5B89\u5168\u533A\u5206\u3002", attribute.getState_PrimitiveId()));
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
        issues.push(issue("warning", "NON_ELECTRICAL_PRIMITIVES_SELECTED", `\u9009\u62E9\u4E2D\u5305\u542B ${selectedUnsupportedPrimitives.length} \u4E2A\u975E\u7535\u6C14\u56FE\u5143\uFF1B\u5B83\u4EEC\u4E0D\u4F1A\u8FDB\u5165\u4EFB\u4F55\u4FEE\u6539\u8BA1\u5212\u3002`));
      }
      const pinContexts = await buildPinContexts(selectedComponents);
      const selectedWireNetById = new Map(selected.filter(isWire).map((wire) => [wire.getState_PrimitiveId(), wire.getState_Net()]));
      const localAliasByCanonicalNet = /* @__PURE__ */ new Map();
      for (const [member, canonicalNet] of currentNetByMember) {
        const context = pinContexts.get(member);
        if (!context) {
          continue;
        }
        const aliases = [...new Set(touchingWireIds(selectedInsideWires, context.reported).map((wireId) => selectedWireNetById.get(wireId) ?? "").filter(Boolean))];
        if (aliases.length === 1) {
          localAliasByCanonicalNet.set(canonicalNet, aliases[0]);
        }
      }
      const preservedNetNames = new Set(preservedNetworkAnchors.map((anchor) => String(anchor.net)));
      const existingNamedExternalNetNames = new Set(currentSnapshot.region.nets.filter((net) => net.scope === "external" && !net.generated).map((net) => net.name));
      const availableNetworkAnchorNames = /* @__PURE__ */ new Set([...preservedNetNames, ...existingNamedExternalNetNames]);
      const targetNetNamesToProcess = options.includeUnchangedNetworks ? new Set(inputNets.map((net) => net.name)) : changedTargetNetNames;
      const noConnectedMembers = new Set([...targetPinNoConnectedByMember.entries()].filter(([, noConnected]) => noConnected).map(([member]) => member));
      const preservedMembers = [...targetNetByMember.entries()].filter(([member, targetNet]) => preservedNetNames.has(targetNet.name) && currentNetByMember.get(member) === targetNet.name).map(([member, targetNet]) => ({ member, net: targetNet.name })).sort((left, right) => compareStrings2(left.member, right.member));
      const portPlans = [];
      const seedWireIds = /* @__PURE__ */ new Set();
      const touchedMembersByWire = /* @__PURE__ */ new Map();
      for (const [member, targetNet] of [...targetNetByMember.entries()].sort(([left], [right]) => compareStrings2(left, right))) {
        if (!targetNetNamesToProcess.has(targetNet.name)) {
          continue;
        }
        if (preservedNetNames.has(targetNet.name) && currentNetByMember.get(member) === targetNet.name) {
          continue;
        }
        if (options.includeUnchangedNetworks !== true && availableNetworkAnchorNames.has(targetNet.name) && currentNetByMember.get(member) === targetNet.name) {
          continue;
        }
        if (noConnectedMembers.has(member)) {
          issues.push(issue("blocker", "TARGET_MEMBER_MARKED_NO_CONNECT", `\u76EE\u6807\u6210\u5458 ${member} \u5E26\u6709\u4E0D\u8FDE\u63A5\u6807\u8BB0\uFF0C\u4E0D\u80FD\u81EA\u52A8\u63A5\u5165\u7F51\u7EDC ${targetNet.name}\u3002\u8BF7\u5148\u6E05\u9664\u4E0D\u8FDE\u63A5\u6807\u8BB0\u5E76\u91CD\u65B0\u5BFC\u51FA\u3002`, member));
          continue;
        }
        const context = pinContexts.get(member);
        if (!context) {
          issues.push(issue("blocker", "PIN_CONTEXT_MISSING", `\u65E0\u6CD5\u8BFB\u53D6\u76EE\u6807\u5F15\u811A\u7684 SDK \u5750\u6807\uFF1A${member}`, member));
          continue;
        }
        const selectedAtReported = touchingWireIds(deletableInsideWires, context.reported);
        const unselectedAtReported = touchingWireIds(wireGeometries.filter((geometry) => !geometry.selected), context.reported);
        for (const wireId of selectedAtReported) {
          seedWireIds.add(wireId);
          const touched = touchedMembersByWire.get(wireId) ?? /* @__PURE__ */ new Set();
          touched.add(member);
          touchedMembersByWire.set(wireId, touched);
        }
        const alternatives = [
          { mode: "PLUS_LENGTH", point: context.plusLength },
          { mode: "MINUS_LENGTH", point: context.minusLength }
        ].filter((candidate) => pointKey(candidate.point) !== pointKey(context.reported)).map((candidate) => ({
          mode: candidate.mode,
          point: candidate.point,
          selectedWireIds: touchingWireIds(deletableInsideWires, candidate.point),
          unselectedWireIds: touchingWireIds(wireGeometries.filter((geometry) => !geometry.selected), candidate.point)
        }));
        if (selectedAtReported.length === 0 && currentNetByMember.has(member)) {
          const alternativeHits = alternatives.filter((candidate) => candidate.selectedWireIds.length > 0 || candidate.unselectedWireIds.length > 0);
          issues.push(issue("blocker", "PIN_ENDPOINT_NOT_CONFIRMED", alternativeHits.length > 0 ? `\u5F15\u811A ${member} \u7684 SDK \u539F\u59CB\u5750\u6807\u672A\u63A5\u89E6\u6240\u9009\u5BFC\u7EBF\uFF0C\u4F46\u5176\u4ED6\u5019\u9009\u5750\u6807\u5B58\u5728\u5BFC\u7EBF\uFF1B\u8FDE\u63A5\u7AEF\u6620\u5C04\u5C1A\u672A\u9A8C\u8BC1\u3002` : `\u5F15\u811A ${member} \u5F53\u524D\u6709\u7F51\u7EDC\uFF0C\u4F46 SDK \u539F\u59CB\u5750\u6807\u672A\u63A5\u89E6\u4EFB\u4F55\u6240\u9009\u5BFC\u7EBF\u3002`, member));
        }
        if (unselectedAtReported.length > 0) {
          issues.push(issue("blocker", "PIN_TOUCHES_UNSELECTED_WIRE", `\u5F15\u811A ${member} \u7684\u76EE\u6807\u70B9\u63A5\u89E6\u672A\u9009\u5BFC\u7EBF\uFF0C\u53EF\u80FD\u8DE8\u8D8A\u533A\u57DF\u8FB9\u754C\u3002`, member));
        }
        portPlans.push({
          member,
          net: targetNet.name,
          ...existingNamedExternalNetNames.has(targetNet.name) && localAliasByCanonicalNet.has(targetNet.name) ? { connectionNet: localAliasByCanonicalNet.get(targetNet.name) } : {},
          direction: targetNet.scope === "external" ? targetNet.direction ?? "BI" : "BI",
          scope: targetNet.scope,
          targetPoint: context.reported,
          rotation: context.rotation,
          currentNet: currentNetByMember.get(member) ?? "(\u672A\u8FDE\u63A5)",
          selectedWireIdsAtReportedPoint: selectedAtReported,
          unselectedWireIdsAtReportedPoint: unselectedAtReported,
          alternativeCoordinateEvidence: alternatives
        });
      }
      const reachableIds = reachableWireIds(deletableInsideWires, seedWireIds);
      const untouchedSelectedWires = deletableInsideWires.filter((geometry) => !reachableIds.has(geometry.primitiveId));
      if (untouchedSelectedWires.length > 0) {
        issues.push(issue("info", "UNCHANGED_SELECTED_WIRES_PRESERVED", `\u6709 ${String(untouchedSelectedWires.length)} \u6761\u5DF2\u9009\u5BFC\u7EBF\u4E0D\u5C5E\u4E8E\u5B9E\u9645\u7F51\u7EDC\u53D8\u5316\uFF0C\u5C06\u4FDD\u6301\u539F\u6837\u3002`));
      }
      const internalPortNets = [...new Set(portPlans.filter((plan) => plan.scope === "internal").map((plan) => plan.net))].sort(compareStrings2);
      if (internalPortNets.length > 0) {
        issues.push(issue("warning", "INTERNAL_NET_PORT_FALLBACK", `\u666E\u901A\u7F51\u7EDC\u6807\u7B7E\u521B\u5EFA\u5DF2\u5B9E\u6D4B\u4E0D\u53EF\u7528\uFF1B\u5185\u90E8\u7F51\u7EDC\u5C06\u53EA\u80FD\u89C4\u5212\u4E3A BI \u7F51\u7EDC\u7AEF\u53E3\uFF1A${internalPortNets.join("\u3001")}`));
      }
      issues.push(issue("info", "PORT_ONLY_PLAN", "\u9636\u6BB5 3 \u4EC5\u751F\u6210\u7F51\u7EDC\u7AEF\u53E3\u5019\u9009\u8BA1\u5212\uFF1B\u666E\u901A\u7F51\u7EDC\u6807\u7B7E\u521B\u5EFA\u548C\u6240\u6709\u5B9E\u9645\u6267\u884C\u4ECD\u4FDD\u6301\u7981\u7528\u3002"));
      const deletionPlan = deletableInsideWires.filter((geometry) => reachableIds.has(geometry.primitiveId)).map((geometry) => wireSummary(geometry, [...touchedMembersByWire.get(geometry.primitiveId) ?? []]));
      const deletionWireIntersections = selectedUnselectedIntersections.filter((connection) => deletionPlan.some((plan) => plan.primitiveId === connection.selectedWireId));
      for (const connection of deletionWireIntersections) {
        issues.push(issue("blocker", "WIRE_TOUCHES_UNSELECTED_WIRE", "\u5019\u9009\u5220\u9664\u5BFC\u7EBF\u4E0E\u672A\u9009\u5BFC\u7EBF\u5B58\u5728\u51E0\u4F55\u63A5\u89E6\u6216\u76F8\u4EA4\uFF0C\u65E0\u6CD5\u5B89\u5168\u786E\u8BA4\u662F\u5426\u4E3A\u8DE8\u8FB9\u754C\u8FDE\u63A5\u3002", connection.selectedWireId));
      }
      const preservedWirePlan = selectedInsideWires.filter((geometry) => preservedWireIds.has(geometry.primitiveId) || !reachableIds.has(geometry.primitiveId)).map((geometry) => wireSummary(geometry));
      const plansByNet = /* @__PURE__ */ new Map();
      for (const plan of portPlans) {
        const plans = plansByNet.get(plan.net) ?? [];
        plans.push(plan);
        plansByNet.set(plan.net, plans);
      }
      const bootstrapNetworkNames = [];
      for (const [net, plans] of plansByNet) {
        const sourceWireIds = [...new Set(plans.flatMap((plan) => plan.selectedWireIdsAtReportedPoint).filter((wireId) => deletionPlan.some((wire) => wire.primitiveId === wireId)))];
        if (sourceWireIds.length === 0 && !availableNetworkAnchorNames.has(net)) {
          bootstrapNetworkNames.push(net);
          continue;
        }
        if (sourceWireIds.length > 1) {
          issues.push(issue("blocker", "TARGET_NET_MULTIPLE_SOURCE_WIRES", `\u76EE\u6807\u7F51\u7EDC ${net} \u540C\u65F6\u6D89\u53CA\u591A\u6761\u72EC\u7ACB\u6E90\u5BFC\u7EBF\uFF0C\u5F53\u524D\u7248\u672C\u65E0\u6CD5\u5728\u4E00\u6B21\u5BFC\u5165\u4E2D\u5B89\u5168\u5408\u5E76\u3002`, net));
          continue;
        }
        const sourceWireId = sourceWireIds[0];
        if (!sourceWireId) {
          continue;
        }
        const unsupportedMembers = plans.filter((plan) => plan.selectedWireIdsAtReportedPoint.length > 0 && !sameSet(plan.selectedWireIdsAtReportedPoint, [sourceWireId]) || plan.unselectedWireIdsAtReportedPoint.length > 0).map((plan) => plan.member);
        if (unsupportedMembers.length > 0) {
          issues.push(issue(
            "blocker",
            "TARGET_MEMBER_NOT_ON_SOURCE_WIRE",
            `\u76EE\u6807\u7F51\u7EDC ${net} \u5305\u542B\u63A5\u89E6\u5176\u4ED6\u5BFC\u7EBF\u7684\u6210\u5458\uFF1A${unsupportedMembers.join("\u3001")}\u3002\u5F53\u524D\u7248\u672C\u4E0D\u80FD\u81EA\u52A8\u8DE8\u5BFC\u7EBF\u5408\u5E76\u3002`,
            net
          ));
        }
      }
      if (bootstrapNetworkNames.length > 0) {
        issues.push(issue(
          "info",
          "NEW_NAMED_NETWORK_BOOTSTRAP",
          `\u4EE5\u4E0B\u7F51\u7EDC\u6CA1\u6709\u73B0\u6709\u5BFC\u7EBF\u6216\u7F51\u7EDC\u6807\u8BC6\uFF0C\u5C06\u7531\u5404\u7F51\u7EDC\u7684\u7B2C\u4E00\u4E2A\u771F\u5B9E\u60AC\u7A7A\u5F15\u811A\u5EFA\u7ACB\u547D\u540D\u7F51\u7EDC\uFF0C\u518D\u4F9D\u6B21\u63A5\u5165\u5176\u4F59\u6210\u5458\uFF1A${bootstrapNetworkNames.join("\u3001")}`
        ));
      }
      const blockers = issues.filter((item) => item.level === "blocker");
      const warnings = issues.filter((item) => item.level === "warning");
      const information = issues.filter((item) => item.level === "info");
      const report = {
        capturedAt: now(),
        mode: "wire-conflict-readonly",
        frozenSnapshotCapturedAt: frozenSnapshot.capturedAt,
        currentRegionCapturedAt: currentSnapshot.capturedAt,
        inputParsed: Boolean(parsed.value),
        strictMatchPassed: strictBlockerCount === 0,
        boundaryModel: boundary ? "selected-electrical-bbox" : "unavailable",
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
        note: blockers.length === 0 ? "\u5BFC\u7EBF\u4E0E\u51B2\u7A81\u53EA\u8BFB\u9884\u68C0\u672A\u53D1\u73B0\u963B\u6B62\u9879\uFF1B\u4ECD\u9700\u771F\u5B9E\u6D4B\u8BD5\u62A5\u544A\u9A8C\u8BC1\u8FB9\u754C\u548C\u5F15\u811A\u8FDE\u63A5\u7AEF\u63A8\u65AD\uFF0C\u5F53\u524D\u4E0D\u4F1A\u4FEE\u6539\u539F\u7406\u56FE\u3002" : "\u5B58\u5728\u963B\u6B62\u9879\uFF0C\u4E0D\u80FD\u8FDB\u5165\u4EFB\u4F55\u6267\u884C\u9636\u6BB5\u3002\u5F53\u524D\u4E0D\u4F1A\u4FEE\u6539\u539F\u7406\u56FE\u3002"
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
        networkAnchorNames: [...availableNetworkAnchorNames].sort(compareStrings2),
        ...report.planReady && portPlans[0] ? { target: portPlans[0] } : {}
      });
      if (options.showPreview !== false) {
        await showPreview("\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u5B89\u5168\u9884\u68C0", [
          jsonPreviewTab("\u9884\u68C0\u6458\u8981", report),
          jsonPreviewTab("\u963B\u6B62\u9879", blockers),
          jsonPreviewTab("\u8B66\u544A\u9879", warnings),
          jsonPreviewTab("\u533A\u57DF\u8FB9\u754C\u4E0E\u56FE\u5143", {
            boundary,
            componentEnvelope,
            selectionEnvelope,
            boundarySource: "\u6240\u9009\u666E\u901A\u5668\u4EF6\u3001\u5BFC\u7EBF\u548C\u7F51\u7EDC\u6807\u8BC6\u7684\u8054\u5408\u5916\u63A5\u77E9\u5F62\uFF1BSDK \u672A\u63D0\u4F9B\u539F\u59CB\u6846\u9009\u77E9\u5F62\u3002",
            selectedUnsafeWires: selectedUnsafeWires.map((geometry) => wireSummary(geometry)),
            unselectedRegionWires: unselectedRegionWires.map((geometry) => wireSummary(geometry)),
            wireIntersections: deletionWireIntersections,
            busConflicts,
            specialComponentConflicts,
            preservedNetworkAnchors,
            preservedMembers,
            preservedWirePlan,
            unselectedComponentConflicts,
            attributeConflicts,
            selectedUnsupportedPrimitives
          }),
          jsonPreviewTab("\u4FDD\u7559\u8BA1\u5212", {
            preservedNetworkAnchors,
            preservedMembers,
            preservedWires: preservedWirePlan
          }),
          jsonPreviewTab("\u5BFC\u7EBF\u5220\u9664\u8BA1\u5212", deletionPlan),
          jsonPreviewTab("\u7AEF\u53E3\u521B\u5EFA\u8BA1\u5212", portPlans),
          jsonPreviewTab("\u7F51\u7EDC\u53D8\u5316", networkChanges),
          jsonPreviewTab("\u4FE1\u606F\u4E0E\u5FFD\u7565\u5B57\u6BB5", { information, ignoredFields: parsed.ignoredFields })
        ]);
      }
    });
  }

  // src/phase4-prerequisite.ts
  function delay(milliseconds) {
    return new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds));
  }
  async function captureNetlistHash(elapsedMs = 0) {
    const { text: text2 } = await readNetlist();
    return {
      elapsedMs,
      length: text2.length,
      hash: hashText(text2),
      capturedAt: now()
    };
  }
  async function captureNetlistHashSamples(delays) {
    const samples = [];
    let elapsed = 0;
    for (const milliseconds of delays) {
      await delay(milliseconds - elapsed);
      elapsed = milliseconds;
      samples.push(await captureNetlistHash(milliseconds));
    }
    return samples;
  }
  async function captureMemberNetworkEvidence(member, targetNet, delays) {
    const evidence = [];
    let elapsed = 0;
    for (const milliseconds of delays) {
      await delay(milliseconds - elapsed);
      elapsed = milliseconds;
      try {
        const networks = await readCurrentMemberNetworks([member]);
        const passed = networks[member] === targetNet;
        evidence.push({ elapsedMs: milliseconds, networks, passed, capturedAt: now() });
        if (passed) {
          break;
        }
      } catch (error) {
        evidence.push({
          elapsedMs: milliseconds,
          networks: {},
          passed: false,
          capturedAt: now(),
          error: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
        });
      }
    }
    return evidence;
  }
  function connectivityValue(snapshot) {
    return JSON.stringify({
      namedNetworks: snapshot.namedNetworks,
      generatedNetworks: snapshot.generatedNetworks
    });
  }
  function connectivitySummary(snapshot) {
    return {
      capturedAt: snapshot.capturedAt,
      sourceVersion: snapshot.sourceVersion,
      networkCount: snapshot.networkCount,
      connectedMemberCount: snapshot.connectedMemberCount,
      canonicalHash: snapshot.canonicalHash
    };
  }
  async function waitForRemovedPortIds(primitiveIds) {
    let remaining = [...primitiveIds];
    for (const milliseconds of [100, 250, 500, 1e3, 1500]) {
      await delay(milliseconds);
      const currentIds = new Set(await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT));
      remaining = primitiveIds.filter((id) => currentIds.has(id));
      if (remaining.length === 0) {
        return [];
      }
    }
    return remaining;
  }
  function readStoredPhase3Plan() {
    const stored = eda.sys_Storage.getExtensionUserConfig(PHASE3_PLAN_STORAGE_KEY);
    return stored && typeof stored === "object" ? stored : void 0;
  }
  async function runNetPortLifecycleProbe() {
    await runProbe("\u9636\u6BB5 4 \u524D\u7F6E\u7AEF\u53E3\u95ED\u73AF\u63A2\u9488", async () => {
      const storedPlan = readStoredPhase3Plan();
      if (!storedPlan?.planReady || storedPlan.blockerCount !== 0 || !storedPlan.target) {
        throw new Error("\u6CA1\u6709\u53EF\u7528\u7684\u9636\u6BB5 3 \u7AEF\u53E3\u5019\u9009\u3002\u8BF7\u4FDD\u6301\u5F53\u524D\u9009\u62E9\u5E76\u5148\u6267\u884C\u83DC\u5355 16\uFF0C\u786E\u8BA4 planReady \u4E3A true\u3002");
      }
      const selected = await getSelectedPrimitives();
      const selectedIds = selected.map(safePrimitiveId).filter((id) => Boolean(id));
      if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
        throw new Error("\u5F53\u524D\u9009\u62E9\u4E0E\u83DC\u5355 16 \u51BB\u7ED3\u7684\u9009\u62E9\u4E0D\u4E00\u81F4\u3002\u8BF7\u91CD\u65B0\u6267\u884C\u83DC\u5355 13 \u548C\u83DC\u5355 16\u3002");
      }
      const target = storedPlan.target;
      const confirmed = await confirmAction(
        `\u5C06\u5728 ${target.member} \u7684 SDK \u539F\u59CB\u5750\u6807\u4E34\u65F6\u521B\u5EFA ${target.direction} \u7AEF\u53E3 ${target.net}\uFF0C\u968F\u540E\u7ACB\u5373\u5220\u9664\u5E76\u6BD4\u8F83\u7F51\u8868\u3002\u671F\u95F4\u7F51\u7EDC\u53EF\u80FD\u77ED\u6682\u53D8\u5316\uFF0C\u8BF7\u53EA\u5728\u5DF2\u4FDD\u5B58\u7684\u6D4B\u8BD5\u526F\u672C\u4E2D\u6267\u884C\u3002`,
        "\u786E\u8BA4\u6267\u884C\u7AEF\u53E3\u521B\u5EFA/\u5220\u9664\u95ED\u73AF\u63A2\u9488"
      );
      if (!confirmed) {
        return;
      }
      const beforeNetlist = await captureNetlistHash();
      const beforeConnectivity = await buildEnetConnectivitySnapshot();
      const beforePortIds = await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT);
      const observed = startObservedCall(
        eda.sch_PrimitiveComponent.createNetPort(
          target.direction,
          target.net,
          target.targetPoint.x,
          target.targetPoint.y,
          target.rotation,
          false
        ),
        "phase4Prerequisite.createNetPort"
      );
      const detectedIds = await waitForNewIds(
        () => eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
        beforePortIds
      );
      const returned = observed.getReturned();
      const returnedId = returned ? safePrimitiveId(returned) : void 0;
      const beforeIdSet = new Set(beforePortIds);
      const createdIds = [.../* @__PURE__ */ new Set([
        ...detectedIds,
        ...returnedId && !beforeIdSet.has(returnedId) ? [returnedId] : []
      ])];
      if (createdIds.length === 1) {
        await updateProbeState({
          netPort: {
            primitiveId: createdIds[0],
            direction: target.direction,
            net: target.net,
            x: target.targetPoint.x,
            y: target.targetPoint.y,
            rotation: target.rotation,
            mirror: false,
            createdAt: now()
          }
        });
      }
      const attachmentEvidence = createdIds.length === 1 ? await captureMemberNetworkEvidence(target.member, target.net, [0, 250, 1e3, 3e3, 5e3]) : [];
      const attachmentVerified = attachmentEvidence.at(-1)?.passed === true;
      let afterCreateSamples = [];
      let afterCreateReadError;
      try {
        afterCreateSamples = await captureNetlistHashSamples([0, 250, 1e3]);
      } catch (error) {
        afterCreateReadError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      let deleteReturned = false;
      let deleteError;
      try {
        deleteReturned = createdIds.length > 0 ? await eda.sch_PrimitiveComponent.delete(createdIds) : false;
      } catch (error) {
        deleteError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      const remainingPortIds = createdIds.length > 0 ? await waitForRemovedPortIds(createdIds) : [];
      if (createdIds.length === 1 && remainingPortIds.length === 0) {
        await updateProbeState({ netPort: void 0 });
      }
      let afterDeleteSamples = [];
      let afterDeleteReadError;
      try {
        afterDeleteSamples = await captureNetlistHashSamples([0, 250, 1e3, 3e3]);
      } catch (error) {
        afterDeleteReadError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      const finalNetlist = afterDeleteSamples.at(-1);
      const createUnique = createdIds.length === 1;
      const deleteVerified = createUnique && deleteReturned && !deleteError && remainingPortIds.length === 0;
      const rawNetlistRestored = Boolean(finalNetlist) && finalNetlist?.length === beforeNetlist.length && finalNetlist?.hash === beforeNetlist.hash;
      let afterConnectivity;
      let connectivityReadError;
      try {
        afterConnectivity = await buildEnetConnectivitySnapshot();
      } catch (error) {
        connectivityReadError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      const connectivityRestored = Boolean(afterConnectivity) && connectivityValue(beforeConnectivity) === connectivityValue(afterConnectivity);
      const netlistRestored = rawNetlistRestored || connectivityRestored;
      const passed = createUnique && attachmentVerified && deleteVerified && netlistRestored;
      await showPreview("\u9636\u6BB5 4 \u524D\u7F6E\uFF1A\u7AEF\u53E3\u521B\u5EFA/\u5220\u9664\u95ED\u73AF\u7ED3\u679C", [
        jsonPreviewTab("\u95ED\u73AF\u6458\u8981", {
          capturedAt: now(),
          target,
          createUnique,
          attachmentVerified,
          deleteVerified,
          rawNetlistRestored,
          connectivityRestored,
          netlistRestored,
          passed,
          executionEnabled: false,
          conclusion: passed ? "\u5355\u4E2A\u7F51\u7EDC\u7AEF\u53E3\u5DF2\u786E\u8BA4\u9644\u7740\u76EE\u6807\u5F15\u811A\u3001\u6210\u529F\u5220\u9664\uFF0C\u4E14\u6574\u56FE\u8FDE\u63A5\u62D3\u6251\u6062\u590D\u3002" : "\u7AEF\u53E3\u9644\u7740\u6216\u6E05\u7406\u95ED\u73AF\u672A\u901A\u8FC7\uFF0C\u4E0D\u80FD\u5F00\u653E\u4EFB\u4F55\u5BFC\u7EBF\u8F6C\u6362\u3002"
        }),
        jsonPreviewTab("\u521B\u5EFA\u4E0E\u5220\u9664\u8BC1\u636E", {
          beforePortIds,
          detectedIds,
          returnedPrimitiveId: returnedId,
          createdIds,
          createApiSettled: observed.isSettled(),
          createApiError: observed.getError(),
          deleteReturned,
          deleteError,
          remainingPortIds
        }),
        jsonPreviewTab("\u7AEF\u53E3\u9644\u7740\u8BC1\u636E", attachmentEvidence),
        jsonPreviewTab("\u7F51\u8868\u54C8\u5E0C", {
          before: beforeNetlist,
          afterCreate: afterCreateSamples,
          afterCreateReadError,
          afterDelete: afterDeleteSamples,
          afterDeleteReadError
        }),
        jsonPreviewTab("\u8FDE\u63A5\u62D3\u6251\u8BC1\u636E", {
          before: connectivitySummary(beforeConnectivity),
          after: afterConnectivity ? connectivitySummary(afterConnectivity) : void 0,
          connectivityReadError,
          connectivityRestored
        })
      ]);
    });
  }

  // src/phase4-prototype.ts
  var PHASE4_RECOVERY_STORAGE_KEY = "phase4PrototypeRecoveryV1";
  var PHASE4_WIRE_CLONE_STORAGE_KEY = "phase4WireCloneProbeV1";
  var PHASE4_ORIGINAL_WIRE_RESTORE_STORAGE_KEY = "phase4OriginalWireRestoreProbeV1";
  var PHASE4_BATCH_RECOVERY_STORAGE_KEY = "phase4BatchRecoveryV1";
  var naturalCollator4 = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  function delay2(milliseconds) {
    return new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds));
  }
  function isSingleNetworkConversionPaused() {
    return true;
  }
  function probeWireNetNames(text2) {
    return [...new Set(text2.match(/PROBE_WIRE_CLONE_\d+/g) ?? [])].sort((left, right) => naturalCollator4.compare(left, right));
  }
  async function captureComponentPoses(selectedPrimitiveIds) {
    const selectedIds = new Set(selectedPrimitiveIds);
    return (await eda.sch_PrimitiveComponent.getAll(ESCH_PrimitiveComponentType.COMPONENT)).filter((component) => selectedIds.has(component.getState_PrimitiveId())).map((component) => ({
      primitiveId: component.getState_PrimitiveId(),
      designator: component.getState_Designator() ?? "",
      x: component.getState_X(),
      y: component.getState_Y(),
      rotation: component.getState_Rotation(),
      mirror: component.getState_Mirror()
    })).sort((left, right) => naturalCollator4.compare(left.designator, right.designator));
  }
  async function selectedPinsByMember(selectedPrimitiveIds) {
    const selectedIds = new Set(selectedPrimitiveIds);
    const pinsByMember = /* @__PURE__ */ new Map();
    const components = (await eda.sch_PrimitiveComponent.getAll(ESCH_PrimitiveComponentType.COMPONENT)).filter((component) => selectedIds.has(component.getState_PrimitiveId()));
    for (const component of components) {
      const designator = component.getState_Designator();
      if (!designator) {
        continue;
      }
      const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId()) ?? [];
      for (const pin of pins) {
        pinsByMember.set(`${designator}.${pin.getState_PinNumber()}`, pin);
      }
    }
    return pinsByMember;
  }
  async function applyPinNoConnectChanges(state) {
    const pinsByMember = await selectedPinsByMember(state.selectedPrimitiveIds);
    const evidence = [];
    for (const change of state.pinNoConnectChanges ?? []) {
      const pin = pinsByMember.get(change.member);
      if (!pin) {
        throw new Error(`\u65E0\u6CD5\u627E\u5230\u9700\u8981\u4FEE\u6539\u975E\u8FDE\u63A5\u6807\u8BC6\u7684\u5F15\u811A\uFF1A${change.member}`);
      }
      const current = Boolean(pin.getState_NoConnected());
      if (current !== change.from) {
        throw new Error(`\u5F15\u811A ${change.member} \u7684\u975E\u8FDE\u63A5\u6807\u8BC6\u72B6\u6001\u5DF2\u53D8\u5316\uFF0C\u5DF2\u505C\u6B62\u5BFC\u5165\u3002`);
      }
      const modified = await eda.sch_PrimitivePin.modify(pin, { noConnected: change.to });
      const verified = modified ? Boolean(modified.getState_NoConnected()) === change.to : false;
      change.pinPrimitiveId = pin.getState_PrimitiveId();
      change.applied = verified;
      await writeBatchRecoveryState(state);
      evidence.push({ ...change, verified });
      if (!verified) {
        throw new Error(`\u5F15\u811A ${change.member} \u7684\u975E\u8FDE\u63A5\u6807\u8BC6\u4FEE\u6539\u540E\u672A\u80FD\u901A\u8FC7\u6821\u9A8C\u3002`);
      }
    }
    return evidence;
  }
  async function restorePinNoConnectChanges(state) {
    const evidence = [];
    for (const change of [...state.pinNoConnectChanges ?? []].reverse()) {
      if (!change.applied) {
        continue;
      }
      if (!change.pinPrimitiveId) {
        throw new Error(`\u5F15\u811A ${change.member} \u7F3A\u5C11\u6062\u590D\u6240\u9700\u7684\u56FE\u5143 ID\u3002`);
      }
      const pin = await eda.sch_PrimitivePin.get(change.pinPrimitiveId);
      if (!pin) {
        throw new Error(`\u65E0\u6CD5\u8BFB\u53D6\u9700\u8981\u6062\u590D\u975E\u8FDE\u63A5\u6807\u8BC6\u7684\u5F15\u811A\uFF1A${change.member}`);
      }
      const modified = await eda.sch_PrimitivePin.modify(pin, { noConnected: change.from });
      const verified = modified ? Boolean(modified.getState_NoConnected()) === change.from : false;
      if (verified) {
        change.applied = false;
        await writeBatchRecoveryState(state);
      }
      evidence.push({ ...change, verified });
      if (!verified) {
        throw new Error(`\u5F15\u811A ${change.member} \u7684\u975E\u8FDE\u63A5\u6807\u8BC6\u672A\u80FD\u6062\u590D\u3002`);
      }
    }
    return evidence;
  }
  async function captureNetlistHash2(elapsedMs = 0) {
    const { text: text2 } = await readNetlist();
    return { elapsedMs, length: text2.length, hash: hashText(text2), capturedAt: now() };
  }
  async function captureNetlistHashSamples2(delays) {
    const samples = [];
    let elapsed = 0;
    for (const milliseconds of delays) {
      await delay2(milliseconds - elapsed);
      elapsed = milliseconds;
      samples.push(await captureNetlistHash2(milliseconds));
    }
    return samples;
  }
  async function captureMemberNetworkEvidence2(members, targetNet, delays) {
    const evidence = [];
    let elapsed = 0;
    for (const milliseconds of delays) {
      await delay2(milliseconds - elapsed);
      elapsed = milliseconds;
      try {
        const networks = await readCurrentMemberNetworks(members);
        const passed = members.every((member) => networks[member] === targetNet);
        evidence.push({ elapsedMs: milliseconds, networks, passed, capturedAt: now() });
        if (passed) {
          break;
        }
      } catch (error) {
        evidence.push({
          elapsedMs: milliseconds,
          networks: {},
          passed: false,
          capturedAt: now(),
          error: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
        });
      }
    }
    return evidence;
  }
  async function captureExpectedMemberNetworkEvidence(expectedNetworks, delays) {
    const members = Object.keys(expectedNetworks);
    const evidence = [];
    let elapsed = 0;
    for (const milliseconds of delays) {
      await delay2(milliseconds - elapsed);
      elapsed = milliseconds;
      try {
        const networks = await readCurrentMemberNetworks(members);
        const passed = members.every((member) => networks[member] === expectedNetworks[member]);
        evidence.push({ elapsedMs: milliseconds, networks, expectedNetworks, passed, capturedAt: now() });
        if (passed) {
          break;
        }
      } catch (error) {
        evidence.push({
          elapsedMs: milliseconds,
          networks: {},
          expectedNetworks,
          passed: false,
          capturedAt: now(),
          error: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
        });
      }
    }
    return evidence;
  }
  async function captureWirePresenceEvidence(primitiveIds, delays, stopWhen) {
    const uniqueIds = [...new Set(primitiveIds)];
    const evidence = [];
    let elapsed = 0;
    for (const milliseconds of delays) {
      await delay2(milliseconds - elapsed);
      elapsed = milliseconds;
      const allIds = new Set(await eda.sch_PrimitiveWire.getAllPrimitiveId());
      const objectReadableIds = [];
      for (const primitiveId of uniqueIds) {
        if (await eda.sch_PrimitiveWire.get(primitiveId)) {
          objectReadableIds.push(primitiveId);
        }
      }
      const listedIds = uniqueIds.filter((id) => allIds.has(id));
      const confirmedPresentIds = objectReadableIds.filter((id) => listedIds.includes(id));
      const status = confirmedPresentIds.length > 0 ? "present" : objectReadableIds.length === 0 && listedIds.length === 0 ? "absent" : "ambiguous";
      evidence.push({
        elapsedMs: milliseconds,
        primitiveIds: uniqueIds,
        objectReadableIds,
        listedIds,
        status,
        capturedAt: now()
      });
      if (status === stopWhen) {
        break;
      }
    }
    return evidence;
  }
  async function waitForRemovedPortIds2(primitiveIds) {
    let remaining = [...primitiveIds];
    for (const milliseconds of [100, 250, 500, 1e3, 1500]) {
      await delay2(milliseconds);
      const currentIds = new Set(await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT));
      remaining = primitiveIds.filter((id) => currentIds.has(id));
      if (remaining.length === 0) {
        return [];
      }
    }
    return remaining;
  }
  function readStoredPhase3Plan2() {
    const stored = eda.sys_Storage.getExtensionUserConfig(PHASE3_PLAN_STORAGE_KEY);
    return stored && typeof stored === "object" ? stored : void 0;
  }
  function readRecoveryState() {
    const stored = eda.sys_Storage.getExtensionUserConfig(PHASE4_RECOVERY_STORAGE_KEY);
    return stored?.active === true && stored.version === 1 ? stored : void 0;
  }
  async function writeRecoveryState(state) {
    const saved = await eda.sys_Storage.setExtensionUserConfig(PHASE4_RECOVERY_STORAGE_KEY, state);
    if (!saved) {
      throw new Error("\u65E0\u6CD5\u4FDD\u5B58\u8F6C\u6362\u6062\u590D\u72B6\u6001\uFF0C\u5DF2\u963B\u6B62\u6267\u884C\u3002");
    }
  }
  async function clearRecoveryState() {
    return await eda.sys_Storage.setExtensionUserConfig(PHASE4_RECOVERY_STORAGE_KEY, {
      active: false,
      clearedAt: now()
    });
  }
  function readBatchRecoveryState() {
    const stored = eda.sys_Storage.getExtensionUserConfig(PHASE4_BATCH_RECOVERY_STORAGE_KEY);
    return stored?.active === true && stored.version === 1 ? stored : void 0;
  }
  async function writeBatchRecoveryState(state) {
    const saved = await eda.sys_Storage.setExtensionUserConfig(PHASE4_BATCH_RECOVERY_STORAGE_KEY, state);
    if (!saved) {
      throw new Error("\u65E0\u6CD5\u4FDD\u5B58\u6279\u91CF\u8F6C\u6362\u6062\u590D\u72B6\u6001\uFF0C\u5DF2\u963B\u6B62\u540E\u7EED\u4FEE\u6539\u3002");
    }
  }
  async function clearBatchRecoveryState() {
    return await eda.sys_Storage.setExtensionUserConfig(PHASE4_BATCH_RECOVERY_STORAGE_KEY, {
      active: false,
      clearedAt: now()
    });
  }
  function readWireCloneState() {
    const stored = eda.sys_Storage.getExtensionUserConfig(PHASE4_WIRE_CLONE_STORAGE_KEY);
    return stored?.active === true && stored.version === 1 ? stored : void 0;
  }
  async function writeWireCloneState(state) {
    const saved = await eda.sys_Storage.setExtensionUserConfig(PHASE4_WIRE_CLONE_STORAGE_KEY, state);
    if (!saved) {
      throw new Error("\u65E0\u6CD5\u6301\u4E45\u5316\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u6062\u590D\u72B6\u6001\uFF0C\u5DF2\u963B\u6B62\u6267\u884C\u3002");
    }
  }
  async function clearWireCloneState() {
    return await eda.sys_Storage.setExtensionUserConfig(PHASE4_WIRE_CLONE_STORAGE_KEY, {
      active: false,
      clearedAt: now()
    });
  }
  function readOriginalWireRestoreState() {
    const stored = eda.sys_Storage.getExtensionUserConfig(PHASE4_ORIGINAL_WIRE_RESTORE_STORAGE_KEY);
    return stored?.active === true && stored.version === 1 ? stored : void 0;
  }
  async function writeOriginalWireRestoreState(state) {
    const saved = await eda.sys_Storage.setExtensionUserConfig(PHASE4_ORIGINAL_WIRE_RESTORE_STORAGE_KEY, state);
    if (!saved) {
      throw new Error("\u65E0\u6CD5\u6301\u4E45\u5316\u539F\u5BFC\u7EBF\u9010\u6BB5\u6062\u590D\u72B6\u6001\uFF0C\u5DF2\u963B\u6B62\u540E\u7EED\u4FEE\u6539\u3002");
    }
  }
  async function clearOriginalWireRestoreState() {
    return await eda.sys_Storage.setExtensionUserConfig(PHASE4_ORIGINAL_WIRE_RESTORE_STORAGE_KEY, {
      active: false,
      clearedAt: now()
    });
  }
  function collectPrototypeCandidates(storedPlan, scopes) {
    if (!Array.isArray(storedPlan.portPlans) || !Array.isArray(storedPlan.deletionPlan)) {
      throw new TypeError("\u5B89\u5168\u8F6C\u6362\u8BA1\u5212\u7248\u672C\u8FC7\u65E7\u3002\u8BF7\u91CD\u65B0\u5BFC\u51FA\u6846\u9009\u533A\u57DF\u5E76\u7C98\u8D34\u7ED3\u6784 JSON\u3002");
    }
    const plansByNet = /* @__PURE__ */ new Map();
    for (const plan of storedPlan.portPlans.filter((plan2) => scopes.includes(plan2.scope))) {
      const plans = plansByNet.get(plan.net) ?? [];
      plans.push(plan);
      plansByNet.set(plan.net, plans);
    }
    const candidates = [];
    const deletionPlanById = new Map(storedPlan.deletionPlan.map((plan) => [plan.primitiveId, plan]));
    for (const net of [...plansByNet.keys()].sort((left, right) => naturalCollator4.compare(left, right))) {
      const portPlans = plansByNet.get(net) ?? [];
      const sourceWireIds = [...new Set(portPlans.flatMap((plan) => plan.selectedWireIdsAtReportedPoint).filter((wireId) => deletionPlanById.has(wireId)))];
      if (sourceWireIds.length > 1) {
        continue;
      }
      const wirePlan = sourceWireIds[0] ? deletionPlanById.get(sourceWireIds[0]) : void 0;
      const endpointsAreUnique = portPlans.every((plan) => (plan.selectedWireIdsAtReportedPoint.length === 0 || Boolean(wirePlan && sameSet(plan.selectedWireIdsAtReportedPoint, [wirePlan.primitiveId]))) && plan.unselectedWireIdsAtReportedPoint.length === 0);
      if (endpointsAreUnique) {
        candidates.push({ net, portPlans, ...wirePlan ? { wirePlan } : {} });
      }
    }
    return candidates;
  }
  function candidateConnectionMode(storedPlan, candidate) {
    if (candidate.wirePlan) {
      return "replace-source-wire";
    }
    return (storedPlan.networkAnchorNames ?? []).includes(candidate.net) ? "add-to-existing-network-anchor" : "create-new-named-network";
  }
  function choosePrototypeCandidate(storedPlan) {
    const candidate = collectPrototypeCandidates(storedPlan, ["internal"]).find((candidate2) => candidate2.wirePlan);
    if (candidate) {
      return candidate;
    }
    throw new Error("\u6CA1\u6709\u6EE1\u8DB3\u201C\u4E00\u4E2A\u5185\u90E8\u7F51\u7EDC\u3001\u6070\u597D\u4E00\u6761\u5BFC\u7EBF\u3001\u5168\u90E8\u5F15\u811A\u7AEF\u70B9\u552F\u4E00\u786E\u8BA4\u201D\u7684\u9636\u6BB5 4 \u5019\u9009\u3002");
  }
  function chooseAllPrototypeCandidates(storedPlan) {
    const candidates = collectPrototypeCandidates(storedPlan, ["internal", "external"]);
    const candidateWireIds = candidates.flatMap((candidate) => candidate.wirePlan ? [candidate.wirePlan.primitiveId] : []);
    const candidateMembers = candidates.flatMap((candidate) => candidate.portPlans.map((plan) => plan.member));
    const plannedMembers = storedPlan.portPlans.map((plan) => plan.member);
    if (!sameSet(candidateWireIds, storedPlan.deletionPlan.map((plan) => plan.primitiveId)) || !sameSet(candidateMembers, plannedMembers)) {
      throw new Error("\u51BB\u7ED3\u8BA1\u5212\u4E2D\u5B58\u5728\u65E0\u6CD5\u5F52\u5165\u552F\u4E00\u7F51\u7EDC\u77ED\u6869\u95ED\u73AF\u7684\u5BFC\u7EBF\u6216\u7AEF\u53E3\uFF0C\u5DF2\u963B\u6B62\u5168\u5019\u9009\u7F51\u7EDC\u6D4B\u8BD5\u3002");
    }
    return candidates;
  }
  function resolveOriginalWireTargetNetwork(state) {
    if (state.targetNetwork) {
      return state.targetNetwork;
    }
    const storedPlan = readStoredPhase3Plan2();
    if (storedPlan) {
      try {
        return choosePrototypeCandidate(storedPlan).net;
      } catch {
        return state.wireSnapshot.net;
      }
    }
    return state.wireSnapshot.net;
  }
  async function ensureNetPortNameVisible(primitiveId, net) {
    let attributes = [];
    for (const milliseconds of [0, 100, 250, 500, 1e3]) {
      if (milliseconds > 0) {
        await delay2(milliseconds);
      }
      attributes = await eda.sch_PrimitiveAttribute.getAll(primitiveId);
      if (attributes.length > 0) {
        break;
      }
    }
    const isNetworkNameAttribute = (attribute) => {
      const normalizedKey = attribute.getState_Key().replaceAll(/\s+/g, "").toLowerCase();
      return attribute.getState_Value() === net || ["net", "network", "\u7F51\u7EDC", "\u7F51\u7EDC\u540D\u79F0"].includes(normalizedKey);
    };
    const matchingAttributes = attributes.filter(isNetworkNameAttribute);
    if (matchingAttributes.length === 0) {
      const available = attributes.map((attribute) => `${attribute.getState_Key()}=${attribute.getState_Value()}`).join("\u3001");
      throw new Error(`\u7F51\u7EDC\u7AEF\u53E3 ${net} \u672A\u627E\u5230\u53EF\u663E\u793A\u7684\u7F51\u7EDC\u540D\u5C5E\u6027\u3002\u5F53\u524D\u5C5E\u6027\uFF1A${available || "(\u65E0)"}`);
    }
    const modifiedAttributeIds = [];
    for (const attribute of matchingAttributes) {
      const modified = await eda.sch_PrimitiveAttribute.modify(attribute, { valueVisible: true });
      if (modified) {
        modifiedAttributeIds.push(modified.getState_PrimitiveId());
      }
    }
    await delay2(100);
    const refreshedAttributes = await eda.sch_PrimitiveAttribute.getAll(primitiveId);
    const refreshedMatchingAttributes = refreshedAttributes.filter(isNetworkNameAttribute);
    const visibleAttributeIds = refreshedMatchingAttributes.filter((attribute) => attribute.getState_ValueVisible() === true).map((attribute) => attribute.getState_PrimitiveId());
    const passed = refreshedMatchingAttributes.length > 0 && visibleAttributeIds.length === refreshedMatchingAttributes.length;
    const evidence = {
      attributeIds: refreshedAttributes.map((attribute) => attribute.getState_PrimitiveId()),
      matchedAttributeIds: refreshedMatchingAttributes.map((attribute) => attribute.getState_PrimitiveId()),
      modifiedAttributeIds,
      visibleAttributeIds,
      passed
    };
    if (!passed) {
      throw new Error(`\u7F51\u7EDC\u7AEF\u53E3 ${net} \u7684\u7F51\u7EDC\u540D\u5C5E\u6027\u672A\u80FD\u8BBE\u4E3A\u53EF\u89C1\u3002`);
    }
    return evidence;
  }
  async function createTrackedPort(plan, state) {
    const connectionNet = plan.connectionNet ?? plan.net;
    const beforeIds = await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT);
    const returned = await eda.sch_PrimitiveComponent.createNetPort(
      plan.direction,
      connectionNet,
      plan.targetPoint.x,
      plan.targetPoint.y,
      plan.rotation,
      false
    );
    const returnedId = returned ? safePrimitiveId(returned) : void 0;
    const beforeIdSet = new Set(beforeIds);
    const detectedIds = await waitForNewIds(
      () => eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
      beforeIds
    );
    const createdIds = [.../* @__PURE__ */ new Set([
      ...detectedIds,
      ...returnedId && !beforeIdSet.has(returnedId) ? [returnedId] : []
    ])];
    if (createdIds.length > 0) {
      state.createdPortIds.push(...createdIds.filter((id) => !state.createdPortIds.includes(id)));
      await writeRecoveryState(state);
    }
    if (createdIds.length !== 1) {
      throw new Error(`\u7AEF\u53E3 ${plan.member} \u521B\u5EFA\u540E\u68C0\u6D4B\u5230 ${createdIds.length} \u4E2A\u65B0\u56FE\u5143\uFF0C\u5DF2\u505C\u6B62\u540E\u7EED\u4FEE\u6539\u3002`);
    }
    const primitiveId = createdIds[0];
    const nameVisibility = await ensureNetPortNameVisible(primitiveId, connectionNet);
    return { primitiveId, nameVisibility };
  }
  async function findPrototypePortIds(state) {
    const currentIds = await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT);
    const baselineIds = new Set(state.baselinePortIds);
    const matchedIds = new Set(state.createdPortIds.filter((id) => currentIds.includes(id)));
    for (const primitiveId of currentIds.filter((id) => !baselineIds.has(id))) {
      const component = await eda.sch_PrimitiveComponent.get(primitiveId);
      if (!component || component.getState_Net() !== state.network) {
        continue;
      }
      const matchesPlannedPoint = state.plannedPorts.some((plan) => Math.abs(component.getState_X() - plan.targetPoint.x) <= 1e-3 && Math.abs(component.getState_Y() - plan.targetPoint.y) <= 1e-3);
      if (matchesPlannedPoint) {
        matchedIds.add(primitiveId);
      }
    }
    return [...matchedIds];
  }
  async function findPrototypeStubWireIds(state) {
    if (!state.stubLines || state.stubLines.length === 0) {
      return [];
    }
    const currentIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
    const baselineIds = new Set(state.baselineWireIds ?? []);
    const candidateIds = /* @__PURE__ */ new Set([
      ...state.createdStubWireIds ?? [],
      ...currentIds.filter((id) => !baselineIds.has(id))
    ]);
    const matchedIds = [];
    for (const primitiveId of candidateIds) {
      const wire = await eda.sch_PrimitiveWire.get(primitiveId);
      if (wire && lineMatchesCloneSegments(wire.getState_Line(), state.stubLines)) {
        matchedIds.push(primitiveId);
      }
    }
    return [...new Set(matchedIds)];
  }
  function splitFlatLineIntoSegments(line) {
    if (line.length === 0 || Array.isArray(line[0]) || line.length % 4 !== 0) {
      return void 0;
    }
    const values = line;
    const segments = [];
    for (let index = 0; index < values.length; index += 4) {
      const segment = values.slice(index, index + 4);
      const [startX, startY, endX, endY] = segment;
      if (![startX, startY, endX, endY].every(Number.isFinite) || startX === endX && startY === endY || startX !== endX && startY !== endY) {
        return void 0;
      }
      segments.push(segment);
    }
    return segments;
  }
  function deriveStubLine(target, plannedLine, sourceWirePrimitiveId, allTargetPoints) {
    const epsilon = 1e-3;
    const normalizeCoordinate = (value) => Math.round(value * 1e6) / 1e6;
    const pointOnSegment2 = (point, segment) => {
      const [startX, startY, endX, endY] = segment;
      if (Math.abs(startX - endX) <= epsilon) {
        return Math.abs(point.x - startX) <= epsilon && point.y >= Math.min(startY, endY) - epsilon && point.y <= Math.max(startY, endY) + epsilon;
      }
      return Math.abs(point.y - startY) <= epsilon && point.x >= Math.min(startX, endX) - epsilon && point.x <= Math.max(startX, endX) + epsilon;
    };
    const matchingSegments = plannedLine.map((segment, segmentIndex) => ({ segment, segmentIndex })).filter(({ segment }) => pointOnSegment2(target.targetPoint, segment));
    if (matchingSegments.length === 0) {
      throw new Error(`\u76EE\u6807\u70B9 (${String(target.targetPoint.x)}, ${String(target.targetPoint.y)}) \u4E0D\u5728\u5019\u9009\u5BFC\u7EBF\u8DEF\u5F84\u4E0A\u3002`);
    }
    const pinX = normalizeCoordinate(target.targetPoint.x);
    const pinY = normalizeCoordinate(target.targetPoint.y);
    const candidatesByDirection = /* @__PURE__ */ new Map();
    for (const { segment, segmentIndex } of matchingSegments) {
      const [startX, startY, endX, endY] = segment;
      for (const endpoint of [{ x: startX, y: startY }, { x: endX, y: endY }]) {
        const deltaX = endpoint.x - pinX;
        const deltaY = endpoint.y - pinY;
        const availableDistance = Math.abs(deltaX) + Math.abs(deltaY);
        if (availableDistance <= epsilon) {
          continue;
        }
        const direction = {
          x: Math.abs(deltaX) <= epsilon ? 0 : Math.sign(deltaX),
          y: Math.abs(deltaY) <= epsilon ? 0 : Math.sign(deltaY)
        };
        const directionKey = `${String(direction.x)},${String(direction.y)}`;
        const nearestMemberDistance = allTargetPoints.filter((point) => Math.abs(point.x - target.targetPoint.x) > epsilon || Math.abs(point.y - target.targetPoint.y) > epsilon).map((point) => {
          const memberDeltaX = normalizeCoordinate(point.x) - pinX;
          const memberDeltaY = normalizeCoordinate(point.y) - pinY;
          const sameRay = direction.x === 0 ? Math.abs(memberDeltaX) <= epsilon && Math.sign(memberDeltaY) === direction.y : Math.abs(memberDeltaY) <= epsilon && Math.sign(memberDeltaX) === direction.x;
          return sameRay ? Math.abs(memberDeltaX) + Math.abs(memberDeltaY) : Number.POSITIVE_INFINITY;
        }).reduce((nearest, distance) => Math.min(nearest, distance), Number.POSITIVE_INFINITY);
        const stubLength = Math.min(5, availableDistance / 2);
        const candidate = {
          segmentIndex,
          direction,
          availableDistance,
          ...Number.isFinite(nearestMemberDistance) ? { nearestMemberDistance } : {},
          stubLine: [
            pinX,
            pinY,
            normalizeCoordinate(pinX + direction.x * stubLength),
            normalizeCoordinate(pinY + direction.y * stubLength)
          ]
        };
        const existing = candidatesByDirection.get(directionKey);
        if (!existing || candidate.availableDistance > existing.availableDistance) {
          candidatesByDirection.set(directionKey, candidate);
        }
      }
    }
    const directionCandidates = [...candidatesByDirection.entries()];
    if (directionCandidates.length === 0) {
      throw new Error(`\u76EE\u6807\u70B9 ${target.member} \u5468\u56F4\u6CA1\u6709\u53EF\u7528\u7684\u77ED\u6869\u65B9\u5411\u3002`);
    }
    const preferredDirectionKeys = [...new Set(target.alternativeCoordinateEvidence.filter((evidence) => evidence.selectedWireIds.includes(sourceWirePrimitiveId)).map((evidence) => {
      const deltaX = evidence.point.x - target.targetPoint.x;
      const deltaY = evidence.point.y - target.targetPoint.y;
      return `${String(Math.abs(deltaX) <= epsilon ? 0 : Math.sign(deltaX))},${String(Math.abs(deltaY) <= epsilon ? 0 : Math.sign(deltaY))}`;
    }).filter((directionKey) => candidatesByDirection.has(directionKey)))];
    let mode;
    let selectedEntry;
    if (preferredDirectionKeys.length === 1) {
      mode = "alternative-coordinate";
      selectedEntry = [preferredDirectionKeys[0], candidatesByDirection.get(preferredDirectionKeys[0])];
    } else if (directionCandidates.length === 1) {
      mode = "unique-wire-direction";
      selectedEntry = directionCandidates[0];
    } else {
      mode = "maximum-clearance-fallback";
      selectedEntry = [...directionCandidates].sort(([leftKey, left], [rightKey, right]) => {
        const leftClearance = Math.min(left.availableDistance, left.nearestMemberDistance ?? Number.POSITIVE_INFINITY);
        const rightClearance = Math.min(right.availableDistance, right.nearestMemberDistance ?? Number.POSITIVE_INFINITY);
        return rightClearance - leftClearance || naturalCollator4.compare(leftKey, rightKey);
      })[0];
    }
    return {
      stubLine: selectedEntry[1].stubLine,
      derivation: {
        mode,
        matchingSegmentIndexes: matchingSegments.map((item) => item.segmentIndex),
        preferredDirectionKeys,
        directionCandidates: directionCandidates.map(([, candidate]) => candidate),
        selectedDirectionKey: selectedEntry[0]
      }
    };
  }
  function deriveFloatingStubLine(target) {
    const directionByRotation = {
      0: { x: 1, y: 0 },
      90: { x: 0, y: 1 },
      180: { x: -1, y: 0 },
      270: { x: 0, y: -1 }
    };
    const rotation = (target.rotation % 360 + 360) % 360;
    const direction = directionByRotation[rotation];
    if (!direction) {
      throw new Error(`\u60AC\u7A7A\u6210\u5458 ${target.member} \u7684\u5F15\u811A\u65CB\u8F6C\u89D2\u5EA6 ${String(target.rotation)} \u65E0\u6CD5\u7528\u4E8E\u77ED\u6869\u89C4\u5212\u3002`);
    }
    const normalizeCoordinate = (value) => Math.round(value * 1e6) / 1e6;
    const stubLine = [
      normalizeCoordinate(target.targetPoint.x),
      normalizeCoordinate(target.targetPoint.y),
      normalizeCoordinate(target.targetPoint.x + direction.x * 5),
      normalizeCoordinate(target.targetPoint.y + direction.y * 5)
    ];
    return {
      stubLine,
      derivation: {
        mode: "pin-rotation-fallback",
        matchingSegmentIndexes: [],
        preferredDirectionKeys: [`${String(direction.x)},${String(direction.y)}`],
        directionCandidates: [{
          segmentIndex: -1,
          direction,
          availableDistance: 5,
          stubLine
        }],
        selectedDirectionKey: `${String(direction.x)},${String(direction.y)}`
      }
    };
  }
  function deriveStubPortOrientation(stubLine) {
    if (stubLine.length < 4) {
      throw new Error("\u77ED\u5BFC\u7EBF\u51E0\u4F55\u6570\u636E\u4E0D\u5B8C\u6574\uFF0C\u65E0\u6CD5\u63A8\u5BFC\u7F51\u7EDC\u7AEF\u53E3\u65B9\u5411\u3002");
    }
    const epsilon = 1e-3;
    const [startX, startY, endX, endY] = stubLine;
    const direction = {
      x: Math.abs(endX - startX) <= epsilon ? 0 : Math.sign(endX - startX),
      y: Math.abs(endY - startY) <= epsilon ? 0 : Math.sign(endY - startY)
    };
    if (direction.x === 0 && direction.y === 0 || direction.x !== 0 && direction.y !== 0) {
      throw new Error("\u77ED\u5BFC\u7EBF\u5FC5\u987B\u662F\u975E\u96F6\u7684\u6C34\u5E73\u6216\u5782\u76F4\u7EBF\u6BB5\uFF0C\u65E0\u6CD5\u63A8\u5BFC\u7F51\u7EDC\u7AEF\u53E3\u65B9\u5411\u3002");
    }
    const rotationByDirection = /* @__PURE__ */ new Map([
      ["1,0", 0],
      ["0,1", 90],
      ["-1,0", 180],
      ["0,-1", 270]
    ]);
    const stubWireRotation = rotationByDirection.get(`${String(direction.x)},${String(direction.y)}`);
    if (stubWireRotation === void 0) {
      throw new Error("\u77ED\u5BFC\u7EBF\u65B9\u5411\u4E0D\u662F\u53D7\u652F\u6301\u7684\u6B63\u4EA4\u65B9\u5411\uFF0C\u65E0\u6CD5\u521B\u5EFA\u7F51\u7EDC\u7AEF\u53E3\u3002");
    }
    const isVertical = direction.x === 0;
    return {
      stubStartPoint: { x: startX, y: startY },
      stubEndPoint: { x: endX, y: endY },
      stubDirection: direction,
      stubWireRotation,
      portRotation: isVertical ? (stubWireRotation + 180) % 360 : stubWireRotation,
      mode: isVertical ? "vertical-reversed" : "horizontal-aligned"
    };
  }
  async function createTrackedStubWire(line, snapshot, state) {
    const beforeIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
    const beforeIdSet = new Set(beforeIds);
    const created = await eda.sch_PrimitiveWire.create(
      cloneLine(line),
      void 0,
      snapshot?.color,
      snapshot?.lineWidth,
      snapshot?.lineType
    );
    const returnedId = created ? safePrimitiveId(created) : void 0;
    let detectedIds = (await eda.sch_PrimitiveWire.getAllPrimitiveId()).filter((id) => !beforeIdSet.has(id));
    if (!returnedId && detectedIds.length === 0) {
      detectedIds = await waitForNewIds(() => eda.sch_PrimitiveWire.getAllPrimitiveId(), beforeIds);
    }
    const createdIds = [.../* @__PURE__ */ new Set([
      ...detectedIds,
      ...returnedId && !beforeIdSet.has(returnedId) ? [returnedId] : []
    ])];
    state.createdStubWireIds = [.../* @__PURE__ */ new Set([...state.createdStubWireIds ?? [], ...createdIds])];
    await writeRecoveryState(state);
    if (createdIds.length !== 1) {
      throw new Error(`\u77ED\u5BFC\u7EBF\u6869\u521B\u5EFA\u540E\u68C0\u6D4B\u5230 ${String(createdIds.length)} \u4E2A\u65B0\u56FE\u5143\u3002`);
    }
    return createdIds[0];
  }
  async function rollback(state) {
    const trackedPortIds = await findPrototypePortIds(state);
    const currentPortIds = new Set(await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT));
    const existingTrackedPortIds = trackedPortIds.filter((id) => currentPortIds.has(id));
    const deleteReturned = existingTrackedPortIds.length === 0 || await eda.sch_PrimitiveComponent.delete(existingTrackedPortIds);
    const remainingPortIds = await waitForRemovedPortIds2(existingTrackedPortIds);
    const trackedStubWireIds = await findPrototypeStubWireIds(state);
    const stubDeleteTargets = (await Promise.all(trackedStubWireIds.map((id) => eda.sch_PrimitiveWire.get(id)))).filter((wire) => Boolean(wire));
    const stubDeleteReturned = trackedStubWireIds.length === 0 || await eda.sch_PrimitiveWire.delete(stubDeleteTargets.length > 0 ? stubDeleteTargets : trackedStubWireIds);
    const stubDeleteEvidence = await captureWirePresenceEvidence(
      trackedStubWireIds,
      [0, 100, 250, 500, 1e3, 3e3],
      "absent"
    );
    const remainingStubWireIds = await findPrototypeStubWireIds(state);
    let originalWireRestore;
    if (state.wireSnapshot) {
      const plannedLine = splitFlatLineIntoSegments(state.wireSnapshot.line);
      if (!plannedLine) {
        throw new Error("\u6062\u590D\u72B6\u6001\u4E2D\u7684\u5BFC\u7EBF\u65E0\u6CD5\u62C6\u5206\u4E3A\u6709\u6548\u6B63\u4EA4\u7EBF\u6BB5\u3002");
      }
      let wireRestoreState = readOriginalWireRestoreState();
      if (!wireRestoreState || wireRestoreState.sourceWirePrimitiveId !== state.wireSnapshot.originalPrimitiveId) {
        wireRestoreState = {
          version: 1,
          active: true,
          capturedAt: now(),
          beforeNetlist: state.beforeNetlist,
          ...state.beforeConnectivity ? { beforeConnectivity: state.beforeConnectivity } : {},
          baselineWireIds: state.baselineWireIds ?? await eda.sch_PrimitiveWire.getAllPrimitiveId(),
          createdWireIds: state.currentWirePrimitiveId && state.currentWirePrimitiveId !== state.wireSnapshot.originalPrimitiveId ? [state.currentWirePrimitiveId] : [],
          wireSnapshot: state.wireSnapshot,
          sourceWirePrimitiveId: state.wireSnapshot.originalPrimitiveId,
          plannedLine,
          targetMembers: state.plannedPorts.map((plan) => plan.member),
          targetNetwork: state.network,
          wireDeleted: state.wireDeleted
        };
        await writeOriginalWireRestoreState(wireRestoreState);
      }
      originalWireRestore = await restoreOriginalWireIncrementally(wireRestoreState);
    }
    const rollbackPassed = deleteReturned && remainingPortIds.length === 0 && stubDeleteReturned && remainingStubWireIds.length === 0 && (originalWireRestore?.passed ?? true);
    const recoveryStateCleared = rollbackPassed ? await clearRecoveryState() : false;
    return {
      trackedPortIds,
      deleteReturned,
      remainingPortIds,
      trackedStubWireIds,
      stubDeleteReturned,
      stubDeleteEvidence,
      remainingStubWireIds,
      ...originalWireRestore ? { originalWireRestore } : {},
      additiveOnly: !state.wireSnapshot,
      recoveryStateCleared,
      passed: rollbackPassed && recoveryStateCleared
    };
  }
  async function rollbackBatch(state) {
    const entries = [];
    for (const entry of [...state.entries].reverse()) {
      if (entry.status === "restored") {
        continue;
      }
      try {
        await writeRecoveryState(entry.state);
        const result = await rollback(entry.state);
        entries.push({ networkIndex: entry.networkIndex, net: entry.state.network, result });
        if (!result.passed) {
          break;
        }
        entry.status = "restored";
        await writeBatchRecoveryState(state);
      } catch (error) {
        entries.push({
          networkIndex: entry.networkIndex,
          net: entry.state.network,
          error: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
        });
        break;
      }
    }
    let pinNoConnectChanges = [];
    let pinNoConnectError;
    try {
      pinNoConnectChanges = await restorePinNoConnectChanges(state);
    } catch (error) {
      pinNoConnectError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    }
    const pinNoConnectRestored = !pinNoConnectError && (state.pinNoConnectChanges ?? []).every((change) => !change.applied);
    let finalConnectivity;
    let connectivityError;
    try {
      finalConnectivity = await buildEnetConnectivitySnapshot();
    } catch (error) {
      connectivityError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    }
    const connectivityRestored = finalConnectivity?.canonicalHash === state.beforeConnectivity.canonicalHash && finalConnectivity.networkCount === state.beforeConnectivity.networkCount && finalConnectivity.connectedMemberCount === state.beforeConnectivity.connectedMemberCount;
    const entriesRestored = state.entries.every((entry) => entry.status === "restored");
    const entryRollbacksPassed = entries.every((entry) => entry.result?.passed === true && !entry.error);
    const canClear = entriesRestored && entryRollbacksPassed && pinNoConnectRestored && connectivityRestored && !connectivityError && !readRecoveryState() && !readOriginalWireRestoreState();
    const recoveryStateCleared = canClear ? await clearBatchRecoveryState() : false;
    return {
      entries,
      pinNoConnectChanges,
      pinNoConnectRestored,
      ...pinNoConnectError ? { pinNoConnectError } : {},
      ...finalConnectivity ? { finalConnectivity: summarizeConnectivity(finalConnectivity) } : {},
      expectedConnectivity: summarizeConnectivity(state.beforeConnectivity),
      connectivityRestored,
      ...connectivityError ? { connectivityError } : {},
      recoveryStateCleared,
      passed: canClear && recoveryStateCleared
    };
  }
  async function runSingleNetworkPrototype() {
    await runProbe("\u9636\u6BB5 4 \u5355\u7F51\u7EDC\u8F6C\u6362\u81EA\u52A8\u56DE\u6EDA\u539F\u578B", async () => {
      if (isSingleNetworkConversionPaused()) {
        throw new Error("0.4.16 \u5DF2\u6682\u505C\u83DC\u5355 18\uFF1A\u5B9E\u6D4B\u786E\u8BA4\u5220\u7EBF\u540E\u521B\u5EFA\u5355\u4E2A\u7F51\u7EDC\u7AEF\u53E3\u4F1A\u4F7F\u5F53\u524D\u56FE\u9875 ENET \u6301\u7EED\u4E0D\u53EF\u8BFB\u53D6\u3002");
      }
      if (readRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u6E05\u7406\u7684\u9636\u6BB5 4 \u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 19\u3002");
      }
      if (readOriginalWireRestoreState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u5B8C\u6210\u7684\u539F\u5BFC\u7EBF\u9010\u6BB5\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 25\u3002");
      }
      if (readWireCloneState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u6E05\u7406\u7684\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 22\u3002");
      }
      const { text: initialNetlistText } = await readNetlist();
      const existingProbeNets = probeWireNetNames(initialNetlistText);
      if (existingProbeNets.length > 0) {
        throw new Error(`\u5F53\u524D ENET \u4ECD\u5305\u542B\u65E7\u63A2\u9488\u7F51\u7EDC\uFF1A${existingProbeNets.join("\u3001")}\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 23\u3002`);
      }
      const storedPlan = readStoredPhase3Plan2();
      if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
        throw new Error("\u6CA1\u6709\u53EF\u7528\u7684\u9636\u6BB5 3 \u51BB\u7ED3\u8BA1\u5212\u3002\u8BF7\u4FDD\u6301\u5F53\u524D\u9009\u62E9\u5E76\u5148\u6267\u884C\u83DC\u5355 16\u3002");
      }
      const selectedIds = (await getSelectedPrimitives()).map(safePrimitiveId).filter((id) => Boolean(id));
      if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
        throw new Error("\u5F53\u524D\u9009\u62E9\u4E0E\u83DC\u5355 16 \u51BB\u7ED3\u7684\u9009\u62E9\u4E0D\u4E00\u81F4\u3002\u8BF7\u91CD\u65B0\u6267\u884C\u83DC\u5355 13 \u548C\u83DC\u5355 16\u3002");
      }
      const candidate = choosePrototypeCandidate(storedPlan);
      const wire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
      if (!wire) {
        throw new Error(`\u5019\u9009\u5BFC\u7EBF\u5DF2\u4E0D\u5B58\u5728\uFF1A${candidate.wirePlan.primitiveId}\u3002\u8BF7\u91CD\u65B0\u6267\u884C\u83DC\u5355 16\u3002`);
      }
      const confirmed = await confirmAction(
        `\u5C06\u5148\u5220\u9664\u5185\u90E8\u7F51\u7EDC ${candidate.net} \u7684\u5BFC\u7EBF ${candidate.wirePlan.primitiveId}\uFF0C\u786E\u8BA4\u5220\u9664\u540E\u518D\u4E34\u65F6\u521B\u5EFA ${candidate.portPlans.length} \u4E2A BI \u7AEF\u53E3\u5E76\u9A8C\u8BC1\u7F51\u7EDC\uFF0C\u968F\u540E\u65E0\u6761\u4EF6\u5220\u9664\u7AEF\u53E3\u5E76\u6062\u590D\u5BFC\u7EBF\u3002\u6700\u7EC8\u4E0D\u4F1A\u4FDD\u7559\u8F6C\u6362\u7ED3\u679C\u3002\u8BF7\u4EC5\u5728\u5DF2\u4FDD\u5B58\u7684\u6D4B\u8BD5\u526F\u672C\u4E2D\u6267\u884C\u3002`,
        "\u786E\u8BA4\u6267\u884C\u5220\u7EBF\u540E\u5EFA\u7AEF\u53E3/\u81EA\u52A8\u56DE\u6EDA\u95ED\u73AF"
      );
      if (!confirmed) {
        return;
      }
      const beforeNetlist = await captureNetlistHash2();
      const beforeConnectivity = await buildEnetConnectivitySnapshot();
      const baselineWireIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
      const componentPosesBefore = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
      const wireSnapshot = createWireSnapshot(wire);
      const plannedLine = splitFlatLineIntoSegments(wireSnapshot.line);
      if (!plannedLine) {
        throw new Error("\u5019\u9009\u5BFC\u7EBF\u65E0\u6CD5\u62C6\u5206\u4E3A\u6709\u6548\u6B63\u4EA4\u7EBF\u6BB5\uFF0C\u5DF2\u963B\u6B62\u6267\u884C\u3002");
      }
      const state = {
        version: 1,
        active: true,
        capturedAt: now(),
        network: candidate.net,
        selectedPrimitiveIds: [...storedPlan.selectedPrimitiveIds],
        beforeNetlist,
        beforeConnectivity,
        baselineWireIds,
        baselinePortIds: await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
        plannedPorts: candidate.portPlans,
        createdPortIds: [],
        wireSnapshot,
        wireDeleted: false,
        currentWirePrimitiveId: candidate.wirePlan.primitiveId
      };
      await writeRecoveryState(state);
      await writeOriginalWireRestoreState({
        version: 1,
        active: true,
        capturedAt: now(),
        beforeNetlist,
        beforeConnectivity,
        baselineWireIds,
        createdWireIds: [],
        wireSnapshot,
        sourceWirePrimitiveId: wireSnapshot.originalPrimitiveId,
        plannedLine,
        targetMembers: candidate.portPlans.map((plan) => plan.member),
        targetNetwork: candidate.net,
        wireDeleted: false
      });
      const createdPorts = [];
      const incrementalPortEvidence = [];
      let wireDeleteEvidence = [];
      let afterWireDeleteEvidence = [];
      let afterPortCreateEvidence = [];
      let wireDeleteReturned = false;
      let wireAbsentAfterDelete = false;
      let operationError;
      let rollbackResult;
      let rollbackError;
      try {
        const members = candidate.portPlans.map((plan) => plan.member);
        const freshWire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
        if (!freshWire) {
          throw new Error("\u65E0\u6CD5\u91CD\u65B0\u8BFB\u53D6\u5019\u9009\u5BFC\u7EBF\u5BF9\u8C61\uFF0C\u5DF2\u963B\u6B62\u5220\u9664\u3002");
        }
        wireDeleteReturned = await eda.sch_PrimitiveWire.delete(freshWire);
        wireDeleteEvidence = await captureWirePresenceEvidence(
          [candidate.wirePlan.primitiveId],
          [0, 100, 250, 500, 1e3, 3e3],
          "absent"
        );
        wireAbsentAfterDelete = wireDeleteEvidence.at(-1)?.status === "absent";
        if (!wireDeleteReturned || !wireAbsentAfterDelete) {
          throw new Error(`\u5019\u9009\u5BFC\u7EBF\u5220\u9664\u672A\u5F97\u5230\u5B8C\u6574\u786E\u8BA4\uFF1A\u8FD4\u56DE ${String(wireDeleteReturned)}\uFF0C\u6700\u7EC8\u72B6\u6001 ${wireDeleteEvidence.at(-1)?.status ?? "unknown"}\u3002`);
        }
        state.wireDeleted = true;
        await writeRecoveryState(state);
        const persistedWireRestoreState = readOriginalWireRestoreState();
        if (persistedWireRestoreState) {
          persistedWireRestoreState.wireDeleted = true;
          await writeOriginalWireRestoreState(persistedWireRestoreState);
        }
        afterWireDeleteEvidence = await captureMemberNetworkEvidence2(members, candidate.net, [0]);
        for (const plan of candidate.portPlans) {
          const { primitiveId, nameVisibility } = await createTrackedPort(plan, state);
          createdPorts.push({ member: plan.member, primitiveId, nameVisibility });
          const memberEvidence = await captureMemberNetworkEvidence2(
            [plan.member],
            candidate.net,
            [0, 250, 1e3, 3e3]
          );
          const memberVerified = memberEvidence.at(-1)?.passed === true;
          incrementalPortEvidence.push({
            portIndex: createdPorts.length - 1,
            member: plan.member,
            primitiveId,
            memberVerified,
            samples: memberEvidence
          });
          if (!memberVerified) {
            throw new Error(`\u521B\u5EFA\u7AEF\u53E3 ${plan.member} \u540E\uFF0CENET \u672A\u786E\u8BA4\u8BE5\u5F15\u811A\u8FDB\u5165\u7F51\u7EDC ${candidate.net}\u3002`);
          }
        }
        afterPortCreateEvidence = await captureMemberNetworkEvidence2(members, candidate.net, [0, 250, 1e3, 3e3, 5e3]);
        if (!afterPortCreateEvidence.at(-1)?.passed) {
          throw new Error("\u5220\u7EBF\u540E\u521B\u5EFA\u5168\u90E8\u7AEF\u53E3\uFF0C\u76EE\u6807\u6210\u5458\u4ECD\u672A\u7A33\u5B9A\u5207\u6362\u5230\u76EE\u6807\u7F51\u7EDC\u3002");
        }
      } catch (error) {
        operationError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      } finally {
        try {
          rollbackResult = await rollback(state);
        } catch (error) {
          rollbackError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        }
      }
      const conversionPassed = !operationError && wireDeleteReturned && wireAbsentAfterDelete && createdPorts.length === candidate.portPlans.length && Boolean(afterPortCreateEvidence.at(-1)?.passed);
      const componentPosesAfter = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
      const componentPosesPreserved = JSON.stringify(componentPosesBefore) === JSON.stringify(componentPosesAfter);
      const passed = conversionPassed && !rollbackError && rollbackResult?.passed === true && componentPosesPreserved;
      await showPreview("\u9636\u6BB5 4\uFF1A\u5355\u7F51\u7EDC\u8F6C\u6362/\u81EA\u52A8\u56DE\u6EDA\u7ED3\u679C", [
        jsonPreviewTab("\u95ED\u73AF\u6458\u8981", {
          capturedAt: now(),
          operationOrder: "delete-wire-then-create-ports",
          targetNetwork: candidate.net,
          targetMembers: candidate.portPlans.map((plan) => plan.member),
          targetWirePrimitiveId: candidate.wirePlan.primitiveId,
          plannedPortCount: candidate.portPlans.length,
          createdPortCount: createdPorts.length,
          wireDeleteReturned,
          wireAbsentAfterDelete,
          wireDeleteConfirmationStatus: wireDeleteEvidence.at(-1)?.status ?? "unknown",
          networkVerifiedAfterPortCreation: Boolean(afterPortCreateEvidence.at(-1)?.passed),
          conversionPassed,
          automaticRollbackPassed: rollbackResult?.passed ?? false,
          componentPosesPreserved,
          passed,
          persistentConversionEnabled: false,
          operationError,
          rollbackError,
          conclusion: passed ? "\u5355\u4E2A\u5185\u90E8\u7F51\u7EDC\u5DF2\u5B8C\u6210\u201C\u5220\u9664\u5BFC\u7EBF\u3001\u521B\u5EFA\u5168\u90E8\u7AEF\u53E3\u3001\u9A8C\u8BC1\u3001\u81EA\u52A8\u56DE\u6EDA\u201D\uFF0C\u6700\u7EC8\u7F51\u8868\u6062\u590D\u3002" : "\u95ED\u73AF\u672A\u5B8C\u5168\u901A\u8FC7\uFF0C\u6301\u4E45\u5316\u8F6C\u6362\u4ECD\u4FDD\u6301\u7981\u7528\u3002\u82E5\u81EA\u52A8\u6062\u590D\u672A\u901A\u8FC7\uFF0C\u8BF7\u7ACB\u5373\u6267\u884C\u83DC\u5355 19\u3002"
        }),
        jsonPreviewTab("\u5019\u9009\u4E0E\u521B\u5EFA\u8BC1\u636E", { candidate, createdPorts }),
        jsonPreviewTab("\u5BFC\u7EBF\u5220\u9664\u8BC1\u636E", wireDeleteEvidence),
        jsonPreviewTab("\u5220\u7EBF\u540E\u5EFA\u7AEF\u53E3\u524D\u7F51\u7EDC\u8BC1\u636E", afterWireDeleteEvidence),
        jsonPreviewTab("\u9010\u7AEF\u53E3\u7F51\u8868\u8BC1\u636E", incrementalPortEvidence),
        jsonPreviewTab("\u7AEF\u53E3\u521B\u5EFA\u540E\u7F51\u7EDC\u8BC1\u636E", afterPortCreateEvidence),
        jsonPreviewTab("\u81EA\u52A8\u56DE\u6EDA\u8BC1\u636E", rollbackResult ?? { rollbackError }),
        jsonPreviewTab("\u5668\u4EF6\u59FF\u6001\u8BC1\u636E", {
          before: componentPosesBefore,
          after: componentPosesAfter,
          preserved: componentPosesPreserved
        })
      ]);
    });
  }
  function assertNoActivePhase4RecoveryState() {
    if (readBatchRecoveryState()) {
      throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u64A4\u56DE\u7684\u5BFC\u5165\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u201C\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165\u201D\u3002");
    }
    if (readRecoveryState()) {
      throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u6E05\u7406\u7684\u5BFC\u5165\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u201C\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165\u201D\u3002");
    }
    if (readOriginalWireRestoreState()) {
      throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u5B8C\u6210\u7684\u539F\u5BFC\u7EBF\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u201C\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165\u201D\u3002");
    }
    if (readWireCloneState()) {
      throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u6E05\u7406\u7684\u5BFC\u7EBF\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u201C\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165\u201D\u3002");
    }
  }
  async function validateStubProbePrerequisites() {
    assertNoActivePhase4RecoveryState();
    const storedPlan = readStoredPhase3Plan2();
    if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
      throw new Error("\u6CA1\u6709\u53EF\u7528\u7684\u5B89\u5168\u8F6C\u6362\u8BA1\u5212\u3002\u8BF7\u91CD\u65B0\u5BFC\u51FA\u6846\u9009\u533A\u57DF\u5E76\u7C98\u8D34\u7ED3\u6784 JSON\u3002");
    }
    const selectedIds = (await getSelectedPrimitives()).map(safePrimitiveId).filter((id) => Boolean(id));
    if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
      throw new Error("\u5F53\u524D\u6846\u9009\u4E0E\u5B89\u5168\u8F6C\u6362\u8BA1\u5212\u4E0D\u4E00\u81F4\u3002\u8BF7\u91CD\u65B0\u5BFC\u51FA\u6846\u9009\u533A\u57DF\u5E76\u7C98\u8D34\u7ED3\u6784 JSON\u3002");
    }
    return storedPlan;
  }
  async function planCandidateStubGeometry(candidate) {
    let wireSnapshot;
    let plannedLine = [];
    if (candidate.wirePlan) {
      const sourceWire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
      if (!sourceWire) {
        throw new Error(`\u5019\u9009\u5BFC\u7EBF\u4E0D\u5B58\u5728\uFF1A${candidate.wirePlan.primitiveId}\u3002`);
      }
      wireSnapshot = createWireSnapshot(sourceWire);
      const sourceSegments = splitFlatLineIntoSegments(wireSnapshot.line);
      if (!sourceSegments) {
        throw new Error(`\u7F51\u7EDC ${candidate.net} \u7684\u5019\u9009\u5BFC\u7EBF\u65E0\u6CD5\u62C6\u5206\u4E3A\u6709\u6548\u6B63\u4EA4\u7EBF\u6BB5\u3002`);
      }
      plannedLine = sourceSegments;
    }
    const allTargetPoints = candidate.portPlans.map((plan) => plan.targetPoint);
    const stubPlans = candidate.portPlans.map((target) => {
      const { stubLine, derivation } = candidate.wirePlan && target.selectedWireIdsAtReportedPoint.includes(candidate.wirePlan.primitiveId) ? deriveStubLine(target, plannedLine, candidate.wirePlan.primitiveId, allTargetPoints) : deriveFloatingStubLine(target);
      const orientation2 = deriveStubPortOrientation(stubLine);
      return {
        target,
        stubLine,
        derivation,
        orientation: orientation2,
        stubPortPlan: {
          ...target,
          targetPoint: { x: stubLine[2], y: stubLine[3] },
          rotation: orientation2.portRotation
        }
      };
    });
    return { wireSnapshot, plannedLine, stubPlans };
  }
  async function executeNetworkStubPortCandidate(storedPlan, candidate) {
    const { wireSnapshot, plannedLine, stubPlans } = await planCandidateStubGeometry(candidate);
    const beforeNetlist = await captureNetlistHash2();
    const beforeConnectivity = await buildEnetConnectivitySnapshot();
    const baselineWireIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
    const componentPosesBefore = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
    const state = {
      version: 1,
      active: true,
      capturedAt: now(),
      network: candidate.net,
      selectedPrimitiveIds: [...storedPlan.selectedPrimitiveIds],
      beforeNetlist,
      beforeConnectivity,
      baselineWireIds,
      baselinePortIds: await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
      plannedPorts: stubPlans.map((plan) => plan.stubPortPlan),
      createdPortIds: [],
      createdStubWireIds: [],
      stubLines: stubPlans.map((plan) => plan.stubLine),
      wireDeleted: false
    };
    if (wireSnapshot) {
      state.wireSnapshot = wireSnapshot;
      state.currentWirePrimitiveId = wireSnapshot.originalPrimitiveId;
    }
    await writeRecoveryState(state);
    if (wireSnapshot) {
      await writeOriginalWireRestoreState({
        version: 1,
        active: true,
        capturedAt: now(),
        beforeNetlist,
        beforeConnectivity,
        baselineWireIds,
        createdWireIds: [],
        wireSnapshot,
        sourceWirePrimitiveId: wireSnapshot.originalPrimitiveId,
        plannedLine,
        targetMembers: candidate.portPlans.map((plan) => plan.member),
        targetNetwork: candidate.net,
        wireDeleted: false
      });
    }
    let wireDeleteReturned = !wireSnapshot;
    let wireDeleteEvidence = [];
    const createdStubs = [];
    const createdPorts = [];
    const incrementalPortEvidence = [];
    let allMemberEvidence = [];
    let operationError;
    let rollbackResult;
    let rollbackError;
    try {
      if (wireSnapshot) {
        const freshSourceWire = await eda.sch_PrimitiveWire.get(wireSnapshot.originalPrimitiveId);
        if (!freshSourceWire) {
          throw new Error("\u5220\u9664\u524D\u65E0\u6CD5\u91CD\u65B0\u8BFB\u53D6\u5019\u9009\u5BFC\u7EBF\u5BF9\u8C61\u3002");
        }
        wireDeleteReturned = await eda.sch_PrimitiveWire.delete(freshSourceWire);
        wireDeleteEvidence = await captureWirePresenceEvidence(
          [wireSnapshot.originalPrimitiveId],
          [0, 100, 250, 500, 1e3, 3e3],
          "absent"
        );
        if (!wireDeleteReturned || wireDeleteEvidence.at(-1)?.status !== "absent") {
          throw new Error("\u5019\u9009\u5BFC\u7EBF\u5220\u9664\u672A\u5F97\u5230\u5B8C\u6574\u786E\u8BA4\u3002");
        }
        state.wireDeleted = true;
        await writeRecoveryState(state);
        const wireRestoreState = readOriginalWireRestoreState();
        if (wireRestoreState) {
          wireRestoreState.wireDeleted = true;
          await writeOriginalWireRestoreState(wireRestoreState);
        }
      }
      for (const plan of stubPlans) {
        const primitiveId = await createTrackedStubWire(plan.stubLine, wireSnapshot, state);
        const readable = Boolean(await eda.sch_PrimitiveWire.get(primitiveId));
        createdStubs.push({ member: plan.target.member, stubLine: plan.stubLine, primitiveId, readable });
        if (!readable) {
          throw new Error(`\u6210\u5458 ${plan.target.member} \u7684\u77ED\u5BFC\u7EBF\u6869\u521B\u5EFA\u540E\u65E0\u6CD5\u6309\u8FD4\u56DE ID \u8BFB\u53D6\u3002`);
        }
      }
      for (const [portIndex, plan] of stubPlans.entries()) {
        const { primitiveId, nameVisibility } = await createTrackedPort(plan.stubPortPlan, state);
        createdPorts.push({ member: plan.target.member, primitiveId, nameVisibility });
        const verifiedMembers = stubPlans.slice(0, portIndex + 1).map((item) => item.target.member);
        const samples = await captureMemberNetworkEvidence2(verifiedMembers, candidate.net, [0]);
        const passed2 = samples.at(-1)?.passed === true;
        incrementalPortEvidence.push({
          portIndex,
          member: plan.target.member,
          primitiveId,
          verifiedMembers,
          passed: passed2,
          samples
        });
        if (!passed2) {
          throw new Error(`\u521B\u5EFA\u7AEF\u53E3 ${plan.target.member} \u540E\uFF0CENET \u672A\u786E\u8BA4\u5DF2\u521B\u5EFA\u7AEF\u53E3\u7684\u5168\u90E8\u6210\u5458\u8FDB\u5165\u7F51\u7EDC ${candidate.net}\u3002`);
        }
      }
      const allMembers = stubPlans.map((plan) => plan.target.member);
      allMemberEvidence = await captureMemberNetworkEvidence2(allMembers, candidate.net, [0]);
      if (!allMemberEvidence.at(-1)?.passed) {
        throw new Error(`\u5168\u90E8\u77ED\u6869\u7AEF\u53E3\u521B\u5EFA\u540E\uFF0CENET \u672A\u786E\u8BA4 ${allMembers.length} \u4E2A\u6210\u5458\u7EDF\u4E00\u8FDB\u5165\u7F51\u7EDC ${candidate.net}\u3002`);
      }
    } catch (error) {
      operationError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    } finally {
      try {
        rollbackResult = await rollback(state);
      } catch (error) {
        rollbackError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
    }
    const componentPosesAfter = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
    const componentPosesPreserved = JSON.stringify(componentPosesBefore) === JSON.stringify(componentPosesAfter);
    const allStubsReadable = createdStubs.length === stubPlans.length && createdStubs.every((stub) => stub.readable);
    const incrementalConnectivityVerified = incrementalPortEvidence.length === stubPlans.length && incrementalPortEvidence.every((evidence) => evidence.passed);
    const allMembersVerified = allMemberEvidence.at(-1)?.passed === true;
    const passed = !operationError && !rollbackError && wireDeleteReturned && allStubsReadable && createdPorts.length === stubPlans.length && incrementalConnectivityVerified && allMembersVerified && rollbackResult?.passed === true && componentPosesPreserved;
    return {
      candidate,
      wireSnapshot,
      plannedLine,
      stubPlans,
      createdStubs,
      createdPorts,
      wireDeleteReturned,
      wireDeleteEvidence,
      incrementalPortEvidence,
      allMemberEvidence,
      rollbackResult,
      componentPosesBefore,
      componentPosesAfter,
      allStubsReadable,
      incrementalConnectivityVerified,
      allMembersVerified,
      componentPosesPreserved,
      operationError,
      rollbackError,
      passed
    };
  }
  async function runNetworkStubPortProbe() {
    await runProbe("\u5355\u7F51\u7EDC\u5168\u6210\u5458\u77ED\u6869\u7AEF\u53E3\u81EA\u52A8\u56DE\u6EDA\u95ED\u73AF", async () => {
      const storedPlan = await validateStubProbePrerequisites();
      const candidate = choosePrototypeCandidate(storedPlan);
      const confirmed = await confirmAction(
        `\u5C06\u5220\u9664\u7F51\u7EDC ${candidate.net} \u7684\u5BFC\u7EBF ${candidate.wirePlan.primitiveId}\uFF0C\u4E3A ${candidate.portPlans.length} \u4E2A\u6210\u5458\u6CBF\u539F\u8DEF\u5F84\u5404\u521B\u5EFA 5 \u5355\u4F4D\u4EE5\u5185\u77ED\u6869\uFF0C\u5E76\u4F9D\u6B21\u5728\u6869\u7AEF\u4E34\u65F6\u521B\u5EFA\u7AEF\u53E3\u548C\u6838\u5BF9\u7F51\u7EDC\uFF1B\u968F\u540E\u81EA\u52A8\u6E05\u7406\u5168\u90E8\u7AEF\u53E3\u3001\u77ED\u6869\u5E76\u6062\u590D\u539F\u5BFC\u7EBF\u3002`,
        "\u786E\u8BA4\u6267\u884C\u5355\u7F51\u7EDC\u5168\u6210\u5458\u77ED\u6869\u7AEF\u53E3\u95ED\u73AF"
      );
      if (!confirmed) {
        return;
      }
      const result = await executeNetworkStubPortCandidate(storedPlan, candidate);
      await showPreview("\u9636\u6BB5 4\uFF1A\u5355\u7F51\u7EDC\u5168\u6210\u5458\u77ED\u6869\u7AEF\u53E3\u95ED\u73AF\u7ED3\u679C", [
        jsonPreviewTab("\u95ED\u73AF\u6458\u8981", {
          capturedAt: now(),
          targetMembers: result.stubPlans.map((plan) => plan.target.member),
          targetNetwork: candidate.net,
          sourceWirePrimitiveId: candidate.wirePlan.primitiveId,
          plannedStubCount: result.stubPlans.length,
          createdStubCount: result.createdStubs.length,
          plannedPortCount: result.stubPlans.length,
          createdPortCount: result.createdPorts.length,
          wireDeleteReturned: result.wireDeleteReturned,
          allStubsReadable: result.allStubsReadable,
          incrementalConnectivityVerified: result.incrementalConnectivityVerified,
          allMembersVerified: result.allMembersVerified,
          automaticRollbackPassed: result.rollbackResult?.passed ?? false,
          componentPosesPreserved: result.componentPosesPreserved,
          passed: result.passed,
          persistentConversionEnabled: false,
          operationError: result.operationError,
          rollbackError: result.rollbackError,
          conclusion: result.passed ? "\u5355\u4E2A\u5185\u90E8\u7F51\u7EDC\u7684\u5168\u90E8\u6210\u5458\u5747\u5DF2\u901A\u8FC7\u72EC\u7ACB\u77ED\u5BFC\u7EBF\u6869\u8FDE\u63A5\u540C\u540D\u7AEF\u53E3\uFF0C\u968F\u540E\u5168\u90E8\u7AEF\u53E3\u3001\u77ED\u6869\u5747\u6E05\u7406\u4E14\u539F\u5BFC\u7EBF\u5B8C\u6574\u6062\u590D\u3002" : "\u5355\u7F51\u7EDC\u5168\u6210\u5458\u77ED\u6869\u7AEF\u53E3\u95ED\u73AF\u672A\u5B8C\u5168\u901A\u8FC7\u3002\u82E5\u81EA\u52A8\u56DE\u6EDA\u672A\u901A\u8FC7\uFF0C\u8BF7\u7ACB\u5373\u6267\u884C\u83DC\u5355 19\u3002"
        }),
        jsonPreviewTab("\u77ED\u6869\u8DEF\u5F84\u4E0E\u521B\u5EFA\u8BC1\u636E", {
          stubPlans: result.stubPlans,
          createdStubs: result.createdStubs,
          plannedLine: result.plannedLine
        }),
        jsonPreviewTab("\u5BFC\u7EBF\u5220\u9664\u8BC1\u636E", result.wireDeleteEvidence),
        jsonPreviewTab("\u9010\u7AEF\u53E3\u8FDE\u63A5\u8BC1\u636E", result.incrementalPortEvidence),
        jsonPreviewTab("\u5168\u6210\u5458\u8FDE\u63A5\u8BC1\u636E", result.allMemberEvidence),
        jsonPreviewTab("\u81EA\u52A8\u56DE\u6EDA\u8BC1\u636E", result.rollbackResult ?? { rollbackError: result.rollbackError }),
        jsonPreviewTab("\u5668\u4EF6\u59FF\u6001\u8BC1\u636E", {
          before: result.componentPosesBefore,
          after: result.componentPosesAfter,
          preserved: result.componentPosesPreserved
        })
      ]);
    });
  }
  async function runAllNetworkSequentialStubPortProbe() {
    await runProbe("\u5168\u90E8\u5019\u9009\u7F51\u7EDC\u9010\u7F51\u77ED\u6869\u7AEF\u53E3\u81EA\u52A8\u56DE\u6EDA\u95ED\u73AF", async () => {
      const storedPlan = await validateStubProbePrerequisites();
      const candidates = chooseAllPrototypeCandidates(storedPlan);
      const preflightStubGeometry = [];
      for (const candidate of candidates) {
        const geometry = await planCandidateStubGeometry(candidate);
        preflightStubGeometry.push({
          net: candidate.net,
          scope: candidate.portPlans[0]?.scope,
          sourceWirePrimitiveId: geometry.wireSnapshot?.originalPrimitiveId,
          connectionMode: candidateConnectionMode(storedPlan, candidate),
          plannedLine: geometry.plannedLine,
          stubPlans: geometry.stubPlans
        });
      }
      const confirmed = await confirmAction(
        `\u5C06\u6309\u987A\u5E8F\u6D4B\u8BD5 ${candidates.length} \u4E2A\u5019\u9009\u7F51\u7EDC\u3001${storedPlan.deletionPlan.length} \u6761\u5BFC\u7EBF\u548C ${storedPlan.portPlans.length} \u4E2A\u7AEF\u53E3\u3002\u6709\u6E90\u7F51\u7EDC\u5148\u5220\u9664\u5E76\u6062\u590D\u539F\u5BFC\u7EBF\uFF0C\u65E0\u6E90\u7F51\u7EDC\u76F4\u63A5\u5EFA\u7ACB\u547D\u540D\u7F51\u7EDC\uFF1B\u5F53\u524D\u7F51\u7EDC\u672A\u5B8C\u6574\u56DE\u6EDA\u65F6\u4E0D\u4F1A\u7EE7\u7EED\u4E0B\u4E00\u4E2A\u7F51\u7EDC\u3002`,
        "\u786E\u8BA4\u6267\u884C\u5168\u90E8\u5019\u9009\u7F51\u7EDC\u9010\u7F51\u95ED\u73AF"
      );
      if (!confirmed) {
        return;
      }
      const beforeConnectivity = await buildEnetConnectivitySnapshot();
      const componentPosesBefore = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
      const networkResults = [];
      let sequenceError;
      for (const candidate of candidates) {
        try {
          const result = await executeNetworkStubPortCandidate(storedPlan, candidate);
          networkResults.push(result);
          if (!result.passed) {
            sequenceError = `\u7F51\u7EDC ${candidate.net} \u7684\u95ED\u73AF\u672A\u901A\u8FC7\uFF0C\u5DF2\u505C\u6B62\u540E\u7EED\u7F51\u7EDC\u3002`;
            break;
          }
        } catch (error) {
          sequenceError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
          break;
        }
      }
      let afterConnectivity;
      let connectivityError;
      try {
        afterConnectivity = await buildEnetConnectivitySnapshot();
      } catch (error) {
        connectivityError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      const componentPosesAfter = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
      const componentPosesPreserved = JSON.stringify(componentPosesBefore) === JSON.stringify(componentPosesAfter);
      const connectivityRestored = afterConnectivity?.canonicalHash === beforeConnectivity.canonicalHash && afterConnectivity.networkCount === beforeConnectivity.networkCount && afterConnectivity.connectedMemberCount === beforeConnectivity.connectedMemberCount;
      const allCandidatesProcessed = networkResults.length === candidates.length;
      const recoveryStateCleared = !readRecoveryState() && !readOriginalWireRestoreState();
      const passed = !sequenceError && !connectivityError && allCandidatesProcessed && networkResults.every((result) => result.passed) && connectivityRestored && componentPosesPreserved && recoveryStateCleared;
      await showPreview("\u9636\u6BB5 4\uFF1A\u5168\u90E8\u5019\u9009\u7F51\u7EDC\u9010\u7F51\u77ED\u6869\u7AEF\u53E3\u95ED\u73AF\u7ED3\u679C", [
        jsonPreviewTab("\u95ED\u73AF\u6458\u8981", {
          capturedAt: now(),
          plannedNetworkCount: candidates.length,
          processedNetworkCount: networkResults.length,
          plannedWireCount: storedPlan.deletionPlan.length,
          plannedPortCount: storedPlan.portPlans.length,
          allCandidatesProcessed,
          allNetworkLoopsPassed: networkResults.every((result) => result.passed),
          connectivityRestored,
          componentPosesPreserved,
          recoveryStateCleared,
          passed,
          persistentConversionEnabled: false,
          sequenceError,
          connectivityError,
          conclusion: passed ? "\u5168\u90E8\u5019\u9009\u7F51\u7EDC\u5747\u5DF2\u9010\u7F51\u5B8C\u6210\u77ED\u6869\u7AEF\u53E3\u8FDE\u63A5\u9A8C\u8BC1\u548C\u72EC\u7ACB\u81EA\u52A8\u56DE\u6EDA\uFF0C\u6574\u56FE\u8FDE\u63A5\u62D3\u6251\u6062\u590D\u3002" : "\u5168\u90E8\u5019\u9009\u7F51\u7EDC\u9010\u7F51\u95ED\u73AF\u672A\u5B8C\u5168\u901A\u8FC7\u3002\u82E5\u6062\u590D\u72B6\u6001\u672A\u6E05\u9664\uFF0C\u8BF7\u7ACB\u5373\u6267\u884C\u83DC\u5355 19\uFF0C\u518D\u6267\u884C\u83DC\u5355 25\u3002"
        }),
        jsonPreviewTab("\u5019\u9009\u7F51\u7EDC\u987A\u5E8F", candidates.map((candidate, networkIndex) => ({
          networkIndex,
          net: candidate.net,
          scope: candidate.portPlans[0]?.scope,
          direction: candidate.portPlans[0]?.direction,
          sourceWirePrimitiveId: candidate.wirePlan?.primitiveId,
          members: candidate.portPlans.map((plan) => plan.member)
        }))),
        jsonPreviewTab("\u9884\u6267\u884C\u77ED\u6869\u89C4\u5212", preflightStubGeometry),
        jsonPreviewTab("\u9010\u7F51\u7EDC\u6458\u8981", networkResults.map((result, networkIndex) => ({
          networkIndex,
          net: result.candidate.net,
          scope: result.candidate.portPlans[0]?.scope,
          memberCount: result.stubPlans.length,
          createdStubCount: result.createdStubs.length,
          createdPortCount: result.createdPorts.length,
          wireDeleteReturned: result.wireDeleteReturned,
          incrementalConnectivityVerified: result.incrementalConnectivityVerified,
          allMembersVerified: result.allMembersVerified,
          automaticRollbackPassed: result.rollbackResult?.passed ?? false,
          componentPosesPreserved: result.componentPosesPreserved,
          passed: result.passed,
          operationError: result.operationError,
          rollbackError: result.rollbackError
        }))),
        jsonPreviewTab("\u77ED\u6869\u4E0E\u7AEF\u53E3\u8BC1\u636E", networkResults.map((result, networkIndex) => ({
          networkIndex,
          net: result.candidate.net,
          plannedLine: result.plannedLine,
          stubPlans: result.stubPlans,
          createdStubs: result.createdStubs,
          createdPorts: result.createdPorts,
          wireDeleteEvidence: result.wireDeleteEvidence,
          incrementalPortEvidence: result.incrementalPortEvidence,
          allMemberEvidence: result.allMemberEvidence
        }))),
        jsonPreviewTab("\u9010\u7F51\u7EDC\u81EA\u52A8\u56DE\u6EDA\u8BC1\u636E", networkResults.map((result, networkIndex) => ({
          networkIndex,
          net: result.candidate.net,
          rollbackResult: result.rollbackResult,
          rollbackError: result.rollbackError
        }))),
        jsonPreviewTab("\u6700\u7EC8\u62D3\u6251\u8BC1\u636E", {
          before: summarizeConnectivity(beforeConnectivity),
          after: afterConnectivity ? summarizeConnectivity(afterConnectivity) : void 0,
          connectivityRestored,
          connectivityError
        }),
        jsonPreviewTab("\u5668\u4EF6\u59FF\u6001\u8BC1\u636E", {
          before: componentPosesBefore,
          after: componentPosesAfter,
          preserved: componentPosesPreserved
        })
      ]);
    });
  }
  async function runFullRegionStubPortRollbackProbe(options = {}) {
    const retainConversion = options.retainConversion === true;
    await runProbe(retainConversion ? "\u5B8C\u6574\u533A\u57DF\u77ED\u6869\u7AEF\u53E3\u6B63\u5F0F\u8F6C\u6362" : "\u5B8C\u6574\u533A\u57DF\u77ED\u6869\u7AEF\u53E3\u8F6C\u6362\u7EDF\u4E00\u56DE\u6EDA\u95ED\u73AF", async () => {
      const storedPlan = await validateStubProbePrerequisites();
      const candidates = chooseAllPrototypeCandidates(storedPlan);
      const plannedCandidates = [];
      for (const candidate of candidates) {
        plannedCandidates.push({ candidate, ...await planCandidateStubGeometry(candidate) });
      }
      const bootstrapNetworkCount = candidates.filter((candidate) => candidateConnectionMode(storedPlan, candidate) === "create-new-named-network").length;
      const pinNoConnectPlanCount = storedPlan.pinNoConnectPlans?.length ?? 0;
      const confirmed = await confirmAction(retainConversion ? `\u5C06\u6B63\u5F0F\u8F6C\u6362 ${candidates.length} \u4E2A\u7F51\u7EDC\uFF1A\u5220\u9664 ${storedPlan.deletionPlan.length} \u6761\u539F\u5BFC\u7EBF\uFF0C\u4E3A ${storedPlan.portPlans.length} \u4E2A\u76EE\u6807\u5F15\u811A\u521B\u5EFA\u77ED\u6869\u7AEF\u53E3\uFF0C\u5E76\u4FEE\u6539 ${pinNoConnectPlanCount} \u4E2A\u5F15\u811A\u7684\u975E\u8FDE\u63A5\u6807\u8BC6\uFF0C\u5176\u4E2D ${String(bootstrapNetworkCount)} \u4E2A\u7F51\u7EDC\u5C06\u7531\u9996\u4E2A\u771F\u5B9E\u60AC\u7A7A\u5F15\u811A\u5EFA\u7ACB\u3002\u9A8C\u8BC1\u6210\u529F\u540E\u4FDD\u7559\u8F6C\u6362\u7ED3\u679C\uFF0C\u5E76\u4FDD\u5B58\u53EF\u64A4\u9500\u72B6\u6001\u3002` : `\u5C06\u540C\u65F6\u8F6C\u6362 ${candidates.length} \u4E2A\u7F51\u7EDC\uFF1A\u4F9D\u6B21\u5904\u7406 ${storedPlan.deletionPlan.length} \u6761\u539F\u5BFC\u7EBF\u548C ${storedPlan.portPlans.length} \u4E2A\u76EE\u6807\u5F15\u811A\uFF0C\u5168\u90E8\u6210\u5458\u9A8C\u8BC1\u540E\u6309\u76F8\u53CD\u987A\u5E8F\u7EDF\u4E00\u81EA\u52A8\u6062\u590D\u3002\u6700\u7EC8\u4E0D\u4F1A\u4FDD\u7559\u8F6C\u6362\u7ED3\u679C\u3002`, retainConversion ? "\u786E\u8BA4\u6267\u884C\u6B63\u5F0F\u8F6C\u6362" : "\u786E\u8BA4\u6267\u884C\u5B8C\u6574\u533A\u57DF\u8F6C\u6362/\u7EDF\u4E00\u56DE\u6EDA\u95ED\u73AF");
      if (!confirmed) {
        return;
      }
      const beforeNetlist = await captureNetlistHash2();
      const beforeConnectivity = await buildEnetConnectivitySnapshot();
      const componentPosesBefore = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
      const batchState = {
        version: 1,
        active: true,
        capturedAt: now(),
        purpose: retainConversion ? "persistent-conversion" : "temporary-probe",
        selectedPrimitiveIds: [...storedPlan.selectedPrimitiveIds],
        beforeNetlist,
        beforeConnectivity,
        entries: [],
        pinNoConnectChanges: (storedPlan.pinNoConnectPlans ?? []).map((change) => ({
          ...change,
          applied: false
        }))
      };
      await writeBatchRecoveryState(batchState);
      const networkEvidence = [];
      let finalMemberEvidence = [];
      let convertedConnectivity;
      let sequenceError;
      let batchRollbackResult;
      let batchRollbackError;
      let recoveryStateRetained = false;
      try {
        await applyPinNoConnectChanges(batchState);
        for (const [networkIndex, planned] of plannedCandidates.entries()) {
          const { candidate, wireSnapshot, plannedLine, stubPlans } = planned;
          const state = {
            version: 1,
            active: true,
            capturedAt: now(),
            network: candidate.net,
            selectedPrimitiveIds: [...storedPlan.selectedPrimitiveIds],
            beforeNetlist: await captureNetlistHash2(),
            beforeConnectivity: await buildEnetConnectivitySnapshot(),
            baselineWireIds: await eda.sch_PrimitiveWire.getAllPrimitiveId(),
            baselinePortIds: await eda.sch_PrimitiveComponent.getAllPrimitiveId(ESCH_PrimitiveComponentType.NET_PORT),
            plannedPorts: stubPlans.map((plan) => plan.stubPortPlan),
            createdPortIds: [],
            createdStubWireIds: [],
            stubLines: stubPlans.map((plan) => plan.stubLine),
            wireDeleted: false
          };
          if (wireSnapshot) {
            state.wireSnapshot = wireSnapshot;
            state.currentWirePrimitiveId = wireSnapshot.originalPrimitiveId;
          }
          const batchEntry = { networkIndex, status: "prepared", state };
          batchState.entries.push(batchEntry);
          await writeBatchRecoveryState(batchState);
          await writeRecoveryState(state);
          if (wireSnapshot) {
            await writeOriginalWireRestoreState({
              version: 1,
              active: true,
              capturedAt: now(),
              beforeNetlist: state.beforeNetlist,
              beforeConnectivity: state.beforeConnectivity,
              baselineWireIds: state.baselineWireIds ?? [],
              createdWireIds: [],
              wireSnapshot,
              sourceWirePrimitiveId: wireSnapshot.originalPrimitiveId,
              plannedLine,
              targetMembers: candidate.portPlans.map((plan) => plan.member),
              targetNetwork: candidate.net,
              wireDeleted: false
            });
          }
          let wireDeleteReturned = !wireSnapshot;
          let wireDeleteEvidence = [];
          const createdStubs = [];
          const createdPorts = [];
          const incrementalPortEvidence = [];
          let allMemberEvidence = [];
          let operationError;
          try {
            if (wireSnapshot) {
              const freshSourceWire = await eda.sch_PrimitiveWire.get(wireSnapshot.originalPrimitiveId);
              if (!freshSourceWire) {
                throw new Error("\u5220\u9664\u524D\u65E0\u6CD5\u91CD\u65B0\u8BFB\u53D6\u5019\u9009\u5BFC\u7EBF\u5BF9\u8C61\u3002");
              }
              wireDeleteReturned = await eda.sch_PrimitiveWire.delete(freshSourceWire);
              wireDeleteEvidence = await captureWirePresenceEvidence(
                [wireSnapshot.originalPrimitiveId],
                [0, 100, 250, 500, 1e3, 3e3],
                "absent"
              );
              if (!wireDeleteReturned || wireDeleteEvidence.at(-1)?.status !== "absent") {
                throw new Error("\u5019\u9009\u5BFC\u7EBF\u5220\u9664\u672A\u5F97\u5230\u5B8C\u6574\u786E\u8BA4\u3002");
              }
              state.wireDeleted = true;
              await writeRecoveryState(state);
              const wireRestoreState = readOriginalWireRestoreState();
              if (wireRestoreState) {
                wireRestoreState.wireDeleted = true;
                await writeOriginalWireRestoreState(wireRestoreState);
              }
              await writeBatchRecoveryState(batchState);
            }
            for (const plan of stubPlans) {
              const primitiveId = await createTrackedStubWire(plan.stubLine, wireSnapshot, state);
              const readable = Boolean(await eda.sch_PrimitiveWire.get(primitiveId));
              createdStubs.push({ member: plan.target.member, stubLine: plan.stubLine, primitiveId, readable });
              await writeBatchRecoveryState(batchState);
              if (!readable) {
                throw new Error(`\u6210\u5458 ${plan.target.member} \u7684\u77ED\u5BFC\u7EBF\u6869\u521B\u5EFA\u540E\u65E0\u6CD5\u6309\u8FD4\u56DE ID \u8BFB\u53D6\u3002`);
              }
            }
            for (const [portIndex, plan] of stubPlans.entries()) {
              const { primitiveId, nameVisibility } = await createTrackedPort(plan.stubPortPlan, state);
              createdPorts.push({ member: plan.target.member, primitiveId, nameVisibility });
              await writeBatchRecoveryState(batchState);
              const verifiedMembers = stubPlans.slice(0, portIndex + 1).map((item) => item.target.member);
              const samples = await captureMemberNetworkEvidence2(verifiedMembers, candidate.net, [0]);
              const passed2 = samples.at(-1)?.passed === true;
              incrementalPortEvidence.push({
                portIndex,
                member: plan.target.member,
                primitiveId,
                verifiedMembers,
                passed: passed2,
                samples
              });
              if (!passed2) {
                throw new Error(`\u521B\u5EFA\u7AEF\u53E3 ${plan.target.member} \u540E\uFF0CENET \u672A\u786E\u8BA4\u5DF2\u521B\u5EFA\u7AEF\u53E3\u7684\u5168\u90E8\u6210\u5458\u8FDB\u5165\u7F51\u7EDC ${candidate.net}\u3002`);
              }
            }
            allMemberEvidence = await captureMemberNetworkEvidence2(
              stubPlans.map((plan) => plan.target.member),
              candidate.net,
              [0]
            );
            if (!allMemberEvidence.at(-1)?.passed) {
              throw new Error(`\u7F51\u7EDC ${candidate.net} \u7684\u5168\u90E8\u6210\u5458\u8FDE\u63A5\u9A8C\u8BC1\u5931\u8D25\u3002`);
            }
            batchEntry.status = "applied";
            await writeBatchRecoveryState(batchState);
          } catch (error) {
            operationError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
          }
          networkEvidence.push({
            networkIndex,
            net: candidate.net,
            scope: candidate.portPlans[0]?.scope,
            plannedLine,
            stubPlans,
            createdStubs,
            createdPorts,
            wireDeleteReturned,
            wireDeleteEvidence,
            additiveOnly: !wireSnapshot,
            connectionMode: candidateConnectionMode(storedPlan, candidate),
            incrementalPortEvidence,
            allMemberEvidence,
            operationError,
            passed: !operationError && batchEntry.status === "applied"
          });
          if (operationError) {
            sequenceError = `\u7F51\u7EDC ${candidate.net} \u8F6C\u6362\u5931\u8D25\uFF1A${operationError}`;
            break;
          }
        }
        if (!sequenceError && batchState.entries.length === candidates.length && batchState.entries.every((entry) => entry.status === "applied")) {
          const expectedNetworks = Object.fromEntries(storedPlan.portPlans.map((plan) => [plan.member, plan.net]));
          finalMemberEvidence = Object.keys(expectedNetworks).length > 0 ? await captureExpectedMemberNetworkEvidence(expectedNetworks, [0]) : [{ elapsedMs: 0, networks: {}, expectedNetworks: {}, passed: true, capturedAt: now() }];
          const pinNoConnectApplied = (batchState.pinNoConnectChanges ?? []).every((change) => change.applied);
          if (!finalMemberEvidence.at(-1)?.passed || !pinNoConnectApplied) {
            sequenceError = "\u5B8C\u6574\u533A\u57DF\u7AEF\u53E3\u521B\u5EFA\u540E\uFF0C\u5168\u90E8\u8BA1\u5212\u6210\u5458\u672A\u540C\u65F6\u8FDB\u5165\u76EE\u6807\u7F51\u7EDC\u3002";
          } else {
            convertedConnectivity = await buildEnetConnectivitySnapshot();
            const convertedComponentPoses = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
            if (JSON.stringify(componentPosesBefore) !== JSON.stringify(convertedComponentPoses)) {
              sequenceError = "\u6B63\u5F0F\u8F6C\u6362\u9A8C\u8BC1\u671F\u95F4\u68C0\u6D4B\u5230\u5668\u4EF6\u4F4D\u7F6E\u3001\u65CB\u8F6C\u6216\u955C\u50CF\u53D1\u751F\u53D8\u5316\u3002";
            } else if (retainConversion) {
              batchState.completedAt = now();
              batchState.convertedConnectivity = convertedConnectivity;
              await writeBatchRecoveryState(batchState);
            }
          }
        }
      } catch (error) {
        sequenceError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      } finally {
        if (retainConversion && !sequenceError) {
          const persistedBatchState = readBatchRecoveryState();
          recoveryStateRetained = persistedBatchState?.capturedAt === batchState.capturedAt && persistedBatchState.purpose === "persistent-conversion" && persistedBatchState.convertedConnectivity?.canonicalHash === convertedConnectivity?.canonicalHash && persistedBatchState.entries.length === candidates.length && persistedBatchState.entries.every((entry) => entry.status === "applied") && (persistedBatchState.pinNoConnectChanges ?? []).every((change) => change.applied) && (candidates.length === 0 || Boolean(readRecoveryState())) && (storedPlan.deletionPlan.length === 0 || Boolean(readOriginalWireRestoreState()));
          if (!recoveryStateRetained) {
            sequenceError = "\u6B63\u5F0F\u8F6C\u6362\u5B8C\u6210\u540E\u672A\u80FD\u786E\u8BA4\u5B8C\u6574\u6062\u590D\u72B6\u6001\u5DF2\u6301\u4E45\u5316\uFF0C\u5DF2\u8F6C\u5165\u81EA\u52A8\u56DE\u6EDA\u3002";
          }
        }
        if (!retainConversion || sequenceError) {
          try {
            batchRollbackResult = await rollbackBatch(batchState);
          } catch (error) {
            batchRollbackError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
          }
        }
      }
      const componentPosesAfter = await captureComponentPoses(storedPlan.selectedPrimitiveIds);
      const componentPosesPreserved = JSON.stringify(componentPosesBefore) === JSON.stringify(componentPosesAfter);
      const conversionPassed = !sequenceError && batchState.entries.length === candidates.length && networkEvidence.length === candidates.length && networkEvidence.every((evidence) => evidence.passed === true) && (batchState.pinNoConnectChanges ?? []).every((change) => change.applied) && finalMemberEvidence.at(-1)?.passed === true;
      const passed = conversionPassed && componentPosesPreserved && (retainConversion ? recoveryStateRetained : !batchRollbackError && batchRollbackResult?.passed === true);
      const previewTitle = options.previewTitle ?? (retainConversion ? options.oneClickContext ? "\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u4E00\u952E\u8F6C\u6362\u7ED3\u679C" : "\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u6B63\u5F0F\u8F6C\u6362\u7ED3\u679C" : options.oneClickContext ? "\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u5B8C\u6574\u81EA\u68C0\u7ED3\u679C" : "\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u8F6C\u6362\u56DE\u6EDA\u81EA\u68C0\u7ED3\u679C");
      await showPreview(previewTitle, [
        ...options.oneClickContext ? [jsonPreviewTab("\u4E00\u952E\u9884\u68C0\u6458\u8981", options.oneClickContext)] : [],
        jsonPreviewTab("\u95ED\u73AF\u6458\u8981", {
          capturedAt: now(),
          plannedNetworkCount: candidates.length,
          appliedNetworkCount: networkEvidence.filter((evidence) => evidence.passed === true).length,
          plannedWireCount: storedPlan.deletionPlan.length,
          plannedPortCount: storedPlan.portPlans.length,
          plannedNoConnectChangeCount: pinNoConnectPlanCount,
          conversionPassed,
          conversionRetained: retainConversion && passed,
          automaticRollbackPerformed: Boolean(batchRollbackResult),
          automaticRollbackPassed: batchRollbackResult?.passed,
          componentPosesPreserved,
          recoveryStateRetained,
          recoveryStateCleared: batchRollbackResult?.recoveryStateCleared,
          passed,
          persistentConversionEnabled: retainConversion,
          sequenceError,
          batchRollbackError,
          conclusion: passed ? retainConversion ? "\u6B63\u5F0F\u8F6C\u6362\u5DF2\u5B8C\u6210\u5E76\u4FDD\u7559\uFF1B\u6062\u590D\u5FEB\u7167\u5DF2\u4FDD\u5B58\uFF0C\u53EF\u901A\u8FC7\u6B63\u5F0F\u64A4\u9500\u83DC\u5355\u6062\u590D\u539F\u5BFC\u7EBF\u3002" : "\u5B8C\u6574\u533A\u57DF\u7684\u5168\u90E8\u5019\u9009\u7F51\u7EDC\u5DF2\u540C\u65F6\u5B8C\u6210\u77ED\u6869\u7AEF\u53E3\u8F6C\u6362\u9A8C\u8BC1\uFF0C\u968F\u540E\u6309\u9006\u5E8F\u7EDF\u4E00\u6062\u590D\u539F\u5BFC\u7EBF\u548C\u6574\u56FE\u8FDE\u63A5\u62D3\u6251\u3002" : batchRollbackResult?.passed ? "\u8F6C\u6362\u672A\u901A\u8FC7\uFF0C\u5DF2\u81EA\u52A8\u6062\u590D\u539F\u5BFC\u7EBF\u548C\u6574\u56FE\u8FDE\u63A5\u62D3\u6251\u3002" : "\u8F6C\u6362\u53CA\u81EA\u52A8\u6062\u590D\u672A\u5B8C\u5168\u901A\u8FC7\u3002\u8BF7\u4FDD\u7559\u7ED3\u679C\u5E76\u7ACB\u5373\u6267\u884C\u201C\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165\u201D\u3002"
        }),
        jsonPreviewTab("\u9884\u6267\u884C\u5B8C\u6574\u89C4\u5212", plannedCandidates.map((planned, networkIndex) => ({
          networkIndex,
          net: planned.candidate.net,
          scope: planned.candidate.portPlans[0]?.scope,
          sourceWirePrimitiveId: planned.wireSnapshot?.originalPrimitiveId,
          connectionMode: candidateConnectionMode(storedPlan, planned.candidate),
          plannedLine: planned.plannedLine,
          stubPlans: planned.stubPlans
        }))),
        jsonPreviewTab("\u9010\u7F51\u7EDC\u8F6C\u6362\u8BC1\u636E", networkEvidence),
        jsonPreviewTab("\u5B8C\u6574\u533A\u57DF\u6210\u5458\u8BC1\u636E", finalMemberEvidence),
        jsonPreviewTab("\u975E\u8FDE\u63A5\u6807\u8BC6\u53D8\u5316", batchState.pinNoConnectChanges ?? []),
        jsonPreviewTab("\u8F6C\u6362\u6001\u62D3\u6251\u8BC1\u636E", convertedConnectivity ? summarizeConnectivity(convertedConnectivity) : {}),
        jsonPreviewTab(retainConversion && passed ? "\u6B63\u5F0F\u6062\u590D\u72B6\u6001" : "\u7EDF\u4E00\u81EA\u52A8\u56DE\u6EDA\u8BC1\u636E", retainConversion && passed ? {
          capturedAt: batchState.capturedAt,
          purpose: batchState.purpose,
          networkCount: batchState.entries.length,
          appliedNetworkCount: batchState.entries.filter((entry) => entry.status === "applied").length,
          recoveryStateRetained
        } : batchRollbackResult ?? { batchRollbackError }),
        jsonPreviewTab("\u5668\u4EF6\u59FF\u6001\u8BC1\u636E", {
          before: componentPosesBefore,
          after: componentPosesAfter,
          preserved: componentPosesPreserved
        })
      ]);
    });
  }
  async function runPersistentFullRegionConversion() {
    await runProbe("\u81EA\u52A8\u9884\u68C0\u5E76\u6B63\u5F0F\u8F6C\u6362\u5DF2\u7C98\u8D34\u6587\u672C", async () => {
      assertNoActivePhase4RecoveryState();
      await runWireConflictPreflight({ showPreview: false });
      const storedPlan = readStoredPhase3Plan2();
      if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
        await showPreview("\u8BA9AI\u770B\u770B\u4F60\u7684\u539F\u7406\u56FE\uFF1A\u5BFC\u5165\u8FDE\u63A5\u5173\u7CFB\u9884\u68C0\u7ED3\u679C", [
          jsonPreviewTab("\u9884\u68C0\u6458\u8981", storedPlan?.preflightReport ?? {
            capturedAt: now(),
            passed: false,
            conclusion: "\u81EA\u52A8\u9884\u68C0\u672A\u751F\u6210\u53EF\u6267\u884C\u8BA1\u5212\u3002\u8BF7\u91CD\u65B0\u5BFC\u51FA\u5F53\u524D\u6846\u9009\u533A\u57DF\u540E\u518D\u8BD5\u3002"
          }),
          jsonPreviewTab("\u963B\u6B62\u9879", storedPlan?.blockers ?? []),
          jsonPreviewTab("\u8B66\u544A\u9879", storedPlan?.warnings ?? []),
          jsonPreviewTab("\u7F51\u7EDC\u53D8\u5316", storedPlan?.networkChanges ?? [])
        ]);
        return;
      }
      if (storedPlan.portPlans.length === 0 && storedPlan.deletionPlan.length === 0 && (storedPlan.pinNoConnectPlans?.length ?? 0) === 0) {
        await showPreview("\u8BA9AI\u770B\u770B\u4F60\u7684\u539F\u7406\u56FE\uFF1A\u5BFC\u5165\u8FDE\u63A5\u5173\u7CFB\u7ED3\u679C", [
          jsonPreviewTab("\u5BFC\u5165\u6458\u8981", {
            capturedAt: now(),
            passed: true,
            changeApplied: false,
            componentPosesPreserved: true,
            recoveryStateRetained: false,
            conclusion: "\u8FDE\u63A5\u5173\u7CFB\u6587\u672C\u4E0E\u5F53\u524D\u6846\u9009\u533A\u57DF\u4E00\u81F4\uFF0C\u6CA1\u6709\u9700\u8981\u6267\u884C\u7684\u7F51\u7EDC\u53D8\u5316\uFF1B\u539F\u5BFC\u7EBF\u548C\u7F51\u7EDC\u6807\u7B7E\u4FDD\u6301\u539F\u6837\u3002"
          }),
          jsonPreviewTab("\u9884\u68C0\u6458\u8981", storedPlan.preflightReport ?? {}),
          jsonPreviewTab("\u7F51\u7EDC\u53D8\u5316", storedPlan.networkChanges ?? [])
        ]);
        return;
      }
      await runFullRegionStubPortRollbackProbe({
        previewTitle: "\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u5BFC\u5165\u8FDE\u63A5\u5173\u7CFB\u7ED3\u679C",
        retainConversion: true
      });
    });
  }
  async function prepareCurrentSelectionPlan(mode) {
    assertNoActivePhase4RecoveryState();
    const snapshot = await buildCurrentRegionSnapshot();
    await eda.sys_Storage.setExtensionUserConfig(REGION_SNAPSHOT_STORAGE_KEY, snapshot);
    await eda.sys_Storage.setExtensionUserConfig(IMPORT_TEXT_STORAGE_KEY, JSON.stringify(snapshot.region, null, 2));
    await runWireConflictPreflight({ showPreview: false, includeUnchangedNetworks: true });
    const storedPlan = readStoredPhase3Plan2();
    if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
      throw new Error("\u4E00\u952E\u9884\u68C0\u672A\u751F\u6210\u53EF\u6267\u884C\u8BA1\u5212\u3002\u8BF7\u68C0\u67E5\u5F53\u524D\u6846\u9009\u662F\u5426\u5B8C\u6574\u4E14\u4E0D\u5305\u542B\u51B2\u7A81\u56FE\u5143\u3002");
    }
    const persistent = mode === "one-click-persistent-conversion";
    return {
      storedPlan,
      context: {
        capturedAt: now(),
        mode,
        snapshotCapturedAt: snapshot.capturedAt,
        selectedPrimitiveCount: snapshot.selectedPrimitiveIds.length,
        componentCount: snapshot.region.components.length,
        netCount: snapshot.region.nets.length,
        strictMatchPassed: true,
        wireConflictPreflightPassed: true,
        plannedNetworkCount: new Set(storedPlan.portPlans.map((plan) => plan.net)).size,
        plannedWireCount: storedPlan.deletionPlan.length,
        plannedPortCount: storedPlan.portPlans.length,
        blockerCount: storedPlan.blockerCount,
        planReady: storedPlan.planReady,
        executionMode: persistent ? "persistent-conversion-with-saved-recovery" : "temporary-conversion-with-automatic-rollback",
        persistentConversionEnabled: persistent,
        note: persistent ? "\u5F53\u524D\u6846\u9009\u5DF2\u81EA\u52A8\u5B8C\u6210\u5FEB\u7167\u3001\u7ED3\u6784\u8F93\u5165\u548C\u5BFC\u7EBF\u51B2\u7A81\u9884\u68C0\uFF0C\u968F\u540E\u6267\u884C\u6B63\u5F0F\u8F6C\u6362\u5E76\u4FDD\u5B58\u53EF\u64A4\u9500\u72B6\u6001\u3002" : "\u5F53\u524D\u6846\u9009\u5DF2\u81EA\u52A8\u5B8C\u6210\u5FEB\u7167\u3001\u7ED3\u6784\u8F93\u5165\u548C\u5BFC\u7EBF\u51B2\u7A81\u9884\u68C0\uFF0C\u968F\u540E\u6267\u884C\u5B8C\u6574\u533A\u57DF\u4E34\u65F6\u8F6C\u6362\u4E0E\u7EDF\u4E00\u81EA\u52A8\u56DE\u6EDA\u3002"
      }
    };
  }
  async function runOneClickFullDebug() {
    await runProbe("\u4E00\u952E\u5B8C\u6574\u8C03\u8BD5", async () => {
      const preparation = await prepareCurrentSelectionPlan("one-click-full-debug");
      await runFullRegionStubPortRollbackProbe({
        oneClickContext: preparation.context,
        previewTitle: "\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u5168\u9762\u68C0\u67E5\u7ED3\u679C"
      });
    });
  }
  async function runOneClickPersistentConversion() {
    await runProbe("\u4E00\u952E\u6B63\u5F0F\u8F6C\u6362\u5F53\u524D\u6846\u9009", async () => {
      const preparation = await prepareCurrentSelectionPlan("one-click-persistent-conversion");
      await runFullRegionStubPortRollbackProbe({
        oneClickContext: preparation.context,
        retainConversion: true
      });
    });
  }
  async function recoverFullRegionStubPortProbe() {
    await runProbe("\u64A4\u9500\u6700\u8FD1\u4E00\u6B21\u8F6C\u6362", async () => {
      const state = readBatchRecoveryState();
      const persistentConversion = state?.purpose === "persistent-conversion";
      if (!state) {
        await showPreview("\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165\u7ED3\u679C", [jsonPreviewTab("\u6062\u590D\u6458\u8981", {
          capturedAt: now(),
          statePresent: false,
          passed: true,
          recoveryStateCleared: true,
          canvasModified: false,
          conclusion: "\u5F53\u524D\u6CA1\u6709\u5F85\u6062\u590D\u7684\u5B8C\u6574\u533A\u57DF\u77ED\u6869\u7AEF\u53E3\u72B6\u6001\u3002"
        })]);
        return;
      }
      if (persistentConversion && state.convertedConnectivity) {
        const currentConnectivity = await buildEnetConnectivitySnapshot();
        const convertedStateUnchanged = currentConnectivity.canonicalHash === state.convertedConnectivity.canonicalHash && currentConnectivity.networkCount === state.convertedConnectivity.networkCount && currentConnectivity.connectedMemberCount === state.convertedConnectivity.connectedMemberCount;
        if (!convertedStateUnchanged) {
          throw new Error("\u6B63\u5F0F\u8F6C\u6362\u540E\u6574\u56FE\u7535\u6C14\u62D3\u6251\u5DF2\u53D1\u751F\u53D8\u5316\u3002\u4E3A\u907F\u514D\u8986\u76D6\u540E\u7EED\u7F16\u8F91\uFF0C\u5DF2\u963B\u6B62\u81EA\u52A8\u64A4\u9500\u3002");
        }
      }
      const confirmed = await confirmAction(
        `\u5C06\u6309\u9006\u5E8F${persistentConversion ? "\u64A4\u9500\u6B63\u5F0F\u8F6C\u6362\u5E76" : "\u6062\u590D"}\u6279\u91CF\u72B6\u6001\u4E2D\u7684 ${state.entries.length} \u4E2A\u7F51\u7EDC\uFF0C\u5E76\u6838\u5BF9\u6574\u56FE\u8FDE\u63A5\u62D3\u6251\u3002`,
        persistentConversion ? "\u786E\u8BA4\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165" : "\u786E\u8BA4\u6062\u590D\u5B8C\u6574\u533A\u57DF\u77ED\u6869\u7AEF\u53E3\u95ED\u73AF"
      );
      if (!confirmed) {
        return;
      }
      const result = await rollbackBatch(state);
      await showPreview("\u539F\u7406\u56FE\u7ED3\u6784\u6587\u672C\u6865\uFF1A\u64A4\u56DE\u4E0A\u4E00\u6B21\u7684\u5BFC\u5165\u7ED3\u679C", [
        jsonPreviewTab("\u6062\u590D\u6458\u8981", {
          capturedAt: now(),
          statePresent: true,
          purpose: state.purpose,
          networkCount: state.entries.length,
          passed: result.passed,
          recoveryStateCleared: result.recoveryStateCleared,
          conclusion: result.passed ? persistentConversion ? "\u6700\u8FD1\u4E00\u6B21\u6B63\u5F0F\u8F6C\u6362\u5DF2\u64A4\u9500\uFF0C\u539F\u5BFC\u7EBF\u548C\u6574\u56FE\u8FDE\u63A5\u62D3\u6251\u5DF2\u6062\u590D\u3002" : "\u5B8C\u6574\u533A\u57DF\u6279\u91CF\u6062\u590D\u72B6\u6001\u5DF2\u5168\u90E8\u5904\u7406\u5E76\u6E05\u9664\u3002" : "\u5B8C\u6574\u533A\u57DF\u6279\u91CF\u6062\u590D\u672A\u5B8C\u5168\u901A\u8FC7\uFF0C\u8BF7\u4E0D\u8981\u7EE7\u7EED\u5176\u4ED6\u5199\u5165\u6D4B\u8BD5\u3002"
        }),
        jsonPreviewTab("\u6062\u590D\u8BC1\u636E", result),
        jsonPreviewTab("\u6279\u91CF\u6062\u590D\u5FEB\u7167", state)
      ]);
    });
  }
  async function recoverSingleNetworkPrototype() {
    await runProbe("\u6062\u590D\u6700\u8FD1\u5355\u7F51\u7EDC\u539F\u578B", async () => {
      if (readBatchRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5B8C\u6574\u533A\u57DF\u6279\u91CF\u6062\u590D\u72B6\u6001\u3002\u8BF7\u6267\u884C\u83DC\u5355 29\uFF0C\u4E0D\u8981\u5355\u72EC\u6062\u590D\u5F53\u524D\u7F51\u7EDC\u3002");
      }
      const state = readRecoveryState();
      if (!state) {
        await showPreview("\u9636\u6BB5 4\uFF1A\u6301\u4E45\u5316\u6062\u590D\u7ED3\u679C", [jsonPreviewTab("\u6062\u590D\u6458\u8981", {
          capturedAt: now(),
          statePresent: false,
          passed: true,
          recoveryStateCleared: true,
          canvasModified: false,
          conclusion: "\u5F53\u524D\u6CA1\u6709\u5F85\u6062\u590D\u7684\u9636\u6BB5 4 \u5355\u7F51\u7EDC\u8F6C\u6362\u72B6\u6001\u3002"
        })]);
        return;
      }
      const confirmed = await confirmAction(
        `\u5C06\u5220\u9664\u539F\u578B\u8DDF\u8E2A\u7684 ${state.createdPortIds.length} \u4E2A\u7F51\u7EDC\u7AEF\u53E3\uFF0C\u5E76\u5728\u5BFC\u7EBF\u4E0D\u5B58\u5728\u65F6\u6309\u5FEB\u7167\u6062\u590D\u7F51\u7EDC ${state.network}\u3002`,
        "\u786E\u8BA4\u6062\u590D\u6700\u8FD1\u5355\u7F51\u7EDC\u539F\u578B"
      );
      if (!confirmed) {
        return;
      }
      const result = await rollback(state);
      await showPreview("\u9636\u6BB5 4\uFF1A\u6301\u4E45\u5316\u6062\u590D\u7ED3\u679C", [
        jsonPreviewTab("\u6062\u590D\u6458\u8981", {
          capturedAt: now(),
          network: state.network,
          passed: result.passed,
          recoveryStateCleared: result.passed,
          conclusion: result.passed ? "\u8DDF\u8E2A\u7AEF\u53E3\u5DF2\u6E05\u7406\u3001\u5BFC\u7EBF\u51E0\u4F55\u548C\u6574\u56FE\u8FDE\u63A5\u62D3\u6251\u6062\u590D\u3002" : "\u81EA\u52A8\u6062\u590D\u672A\u5B8C\u5168\u901A\u8FC7\uFF0C\u8BF7\u4FDD\u7559\u672C\u7A97\u53E3\u5185\u5BB9\u5E76\u4E0D\u8981\u7EE7\u7EED\u6267\u884C\u5176\u4ED6\u8F6C\u6362\u3002"
        }),
        jsonPreviewTab("\u6062\u590D\u8BC1\u636E", result),
        jsonPreviewTab("\u6062\u590D\u5FEB\u7167", state)
      ]);
    });
  }
  async function verifyManualRecoveryAndClearState() {
    await runProbe("\u9A8C\u8BC1\u624B\u52A8\u6062\u590D\u5E76\u6E05\u9664\u72B6\u6001", async () => {
      if (readBatchRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5B8C\u6574\u533A\u57DF\u6279\u91CF\u6062\u590D\u72B6\u6001\u3002\u8BF7\u6267\u884C\u83DC\u5355 29\uFF0C\u4E0D\u8981\u6E05\u9664\u5355\u7F51\u7EDC\u72B6\u6001\u3002");
      }
      const state = readRecoveryState();
      if (!state) {
        await showPreview("\u9636\u6BB5 4\uFF1A\u624B\u52A8\u6062\u590D\u53EA\u8BFB\u6838\u9A8C", [jsonPreviewTab("\u6838\u9A8C\u6458\u8981", {
          capturedAt: now(),
          statePresent: false,
          passed: true,
          recoveryStateCleared: true,
          canvasModified: false,
          conclusion: "\u5F53\u524D\u6CA1\u6709\u5F85\u5904\u7406\u7684\u9636\u6BB5 4 \u6062\u590D\u72B6\u6001\uFF0C\u65E0\u9700\u6E05\u7406\u3002"
        })]);
        return;
      }
      const remainingPrototypePortIds = await findPrototypePortIds(state);
      const netlistSamples = await captureNetlistHashSamples2([0, 250, 1e3, 3e3]);
      const rawNetlistRestored = netlistSamples.length > 0 && netlistSamples.every((sample) => sample.length === state.beforeNetlist.length && sample.hash === state.beforeNetlist.hash);
      const currentConnectivity = state.beforeConnectivity ? await buildEnetConnectivitySnapshot() : void 0;
      const connectivityRestored = state.beforeConnectivity && currentConnectivity ? connectivityComparableValue(state.beforeConnectivity) === connectivityComparableValue(currentConnectivity) : false;
      const netlistStableAndRestored = rawNetlistRestored || connectivityRestored;
      const recoveryReady = remainingPrototypePortIds.length === 0 && netlistStableAndRestored;
      const originalWireRestoreState = readOriginalWireRestoreState();
      const originalWireStateCleared = recoveryReady && originalWireRestoreState ? await clearOriginalWireRestoreState() : !originalWireRestoreState;
      const recoveryStateCleared = recoveryReady && originalWireStateCleared ? await clearRecoveryState() : false;
      await showPreview("\u9636\u6BB5 4\uFF1A\u624B\u52A8\u6062\u590D\u53EA\u8BFB\u6838\u9A8C", [
        jsonPreviewTab("\u6838\u9A8C\u6458\u8981", {
          capturedAt: now(),
          network: state.network,
          remainingPrototypePortCount: remainingPrototypePortIds.length,
          rawNetlistRestored,
          connectivityRestored,
          netlistStableAndRestored,
          passed: recoveryReady && originalWireStateCleared && recoveryStateCleared,
          originalWireStateCleared,
          recoveryStateCleared,
          canvasModified: false,
          conclusion: recoveryReady && originalWireStateCleared && recoveryStateCleared ? "\u5DF2\u786E\u8BA4\u4E34\u65F6\u7AEF\u53E3\u6E05\u7A7A\u4E14\u6574\u56FE\u8FDE\u63A5\u62D3\u6251\u6062\u590D\uFF0C\u4EC5\u6E05\u9664\u4E86\u63D2\u4EF6\u6062\u590D\u72B6\u6001\u3002" : "\u624B\u52A8\u6062\u590D\u5C1A\u672A\u901A\u8FC7\u53EA\u8BFB\u6838\u9A8C\uFF0C\u672A\u6E05\u9664\u6062\u590D\u72B6\u6001\uFF0C\u4E5F\u672A\u4FEE\u6539\u753B\u5E03\u3002"
        }),
        jsonPreviewTab("\u7F51\u8868\u6838\u9A8C\u8BC1\u636E", {
          expected: state.beforeNetlist,
          samples: netlistSamples,
          expectedConnectivity: state.beforeConnectivity ? summarizeConnectivity(state.beforeConnectivity) : void 0,
          currentConnectivity: currentConnectivity ? summarizeConnectivity(currentConnectivity) : void 0
        }),
        jsonPreviewTab("\u7AEF\u53E3\u6838\u9A8C\u8BC1\u636E", {
          baselinePortIds: state.baselinePortIds,
          trackedPortIds: state.createdPortIds,
          remainingPrototypePortIds
        })
      ]);
    });
  }
  function segmentKey(startX, startY, endX, endY) {
    const start = `${String(startX)},${String(startY)}`;
    const end = `${String(endX)},${String(endY)}`;
    return start < end ? `${start}|${end}` : `${end}|${start}`;
  }
  function sequentialSegmentKeys(paths) {
    const keys = [];
    for (const path of paths) {
      for (let index = 2; index < path.length; index += 2) {
        keys.push(segmentKey(path[index - 2], path[index - 1], path[index], path[index + 1]));
      }
    }
    return keys.sort((left, right) => naturalCollator4.compare(left, right));
  }
  function lineSegmentKeyVariants(line) {
    const variants = [];
    const paths = Array.isArray(line[0]) ? line : [line];
    variants.push(sequentialSegmentKeys(paths));
    const segmentPairs = splitFlatLineIntoSegments(line);
    if (segmentPairs) {
      const keys = sequentialSegmentKeys(segmentPairs);
      if (!variants.some((variant) => sameSet(variant, keys))) {
        variants.push(keys);
      }
    }
    return variants;
  }
  function numericLineBounds(line) {
    const paths = Array.isArray(line[0]) ? line : [line];
    const values = paths.flat();
    if (values.length < 4 || values.some((value) => !Number.isFinite(value))) {
      return void 0;
    }
    const xValues = values.filter((_, index) => index % 2 === 0);
    const yValues = values.filter((_, index) => index % 2 === 1);
    return {
      minX: Math.min(...xValues),
      minY: Math.min(...yValues),
      maxX: Math.max(...xValues),
      maxY: Math.max(...yValues)
    };
  }
  function boundsOverlapWithClearance(left, right, clearance) {
    return left.minX < right.maxX + clearance && left.maxX > right.minX - clearance && left.minY < right.maxY + clearance && left.maxY > right.minY - clearance;
  }
  async function findEmptyCloneOffset(segmentedLine, wires, components) {
    const sourceBounds = numericLineBounds(segmentedLine);
    if (!sourceBounds) {
      throw new Error("\u65E0\u6CD5\u8BA1\u7B97\u5206\u6BB5\u5BFC\u7EBF\u8FB9\u754C\u3002");
    }
    const drawingComponents = components.filter((component) => component.getState_ComponentType() === ESCH_PrimitiveComponentType.DRAWING);
    const sheetBounds = await eda.sch_Primitive.getPrimitivesBBox(drawingComponents);
    if (!sheetBounds) {
      throw new Error("\u65E0\u6CD5\u8BFB\u53D6\u56FE\u7EB8\u8FB9\u754C\uFF0C\u4E0D\u80FD\u5B89\u5168\u9009\u62E9\u514B\u9686\u4F4D\u7F6E\u3002");
    }
    const wireBounds = wires.map((wire) => numericLineBounds(wire.getState_Line())).filter((bounds) => Boolean(bounds));
    const componentBounds = (await Promise.all(components.filter((component) => component.getState_ComponentType() !== ESCH_PrimitiveComponentType.DRAWING).map((component) => eda.sch_Primitive.getPrimitivesBBox([component])))).filter((bounds) => Boolean(bounds));
    const obstacles = [...wireBounds, ...componentBounds];
    const width = sourceBounds.maxX - sourceBounds.minX;
    const height = sourceBounds.maxY - sourceBounds.minY;
    const margin = 30;
    const clearance = 20;
    const step = 10;
    for (let y = sheetBounds.minY + margin; y <= sheetBounds.maxY - margin - height; y += step) {
      for (let x = sheetBounds.minX + margin; x <= sheetBounds.maxX - margin - width; x += step) {
        const targetBounds = { minX: x, minY: y, maxX: x + width, maxY: y + height };
        if (!obstacles.some((obstacle) => boundsOverlapWithClearance(targetBounds, obstacle, clearance))) {
          return {
            x: x - sourceBounds.minX,
            y: y - sourceBounds.minY,
            sheetBounds,
            targetBounds
          };
        }
      }
    }
    throw new Error("\u56FE\u7EB8\u5185\u90E8\u6CA1\u6709\u627E\u5230\u6EE1\u8DB3 20 \u5355\u4F4D\u95F4\u8DDD\u7684\u514B\u9686\u7A7A\u767D\u533A\u57DF\u3002");
  }
  function lineMatchesCloneSegments(line, plannedLine) {
    const plannedKeys = new Set(sequentialSegmentKeys(plannedLine));
    return lineSegmentKeyVariants(line).some((keys) => keys.length > 0 && keys.every((key) => plannedKeys.has(key)));
  }
  async function findWireCloneIds(state) {
    const currentIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
    const baselineIds = new Set(state.baselineWireIds);
    const matchedIds = /* @__PURE__ */ new Set();
    for (const primitiveId of state.createdWireIds) {
      const wire = await eda.sch_PrimitiveWire.get(primitiveId);
      if (wire) {
        matchedIds.add(primitiveId);
      }
    }
    for (const primitiveId of currentIds.filter((id) => !baselineIds.has(id))) {
      const wire = await eda.sch_PrimitiveWire.get(primitiveId);
      if (wire && lineMatchesCloneSegments(wire.getState_Line(), state.plannedLine)) {
        matchedIds.add(primitiveId);
      }
    }
    return [...matchedIds];
  }
  async function cloneGeometryComplete(primitiveIds, plannedLine) {
    const actualKeys = /* @__PURE__ */ new Set();
    for (const primitiveId of primitiveIds) {
      const wire = await eda.sch_PrimitiveWire.get(primitiveId);
      if (!wire) {
        continue;
      }
      const variants = lineSegmentKeyVariants(wire.getState_Line());
      const plannedKeys = new Set(sequentialSegmentKeys(plannedLine));
      const matchingVariant = variants.find((keys) => keys.every((key) => plannedKeys.has(key)));
      for (const key of matchingVariant ?? []) {
        actualKeys.add(key);
      }
    }
    return sameSet([...actualKeys], sequentialSegmentKeys(plannedLine));
  }
  function wireMatchesOriginalRestorePlan(wire, state) {
    return (!state.wireSnapshot.net || wire.getState_Net() === state.wireSnapshot.net) && lineMatchesCloneSegments(wire.getState_Line(), state.plannedLine);
  }
  async function findOriginalWireRestoreIds(state) {
    const currentIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
    const baselineIds = new Set(state.baselineWireIds);
    const candidateIds = /* @__PURE__ */ new Set([
      state.sourceWirePrimitiveId,
      ...state.createdWireIds,
      ...currentIds.filter((id) => id === state.sourceWirePrimitiveId || !baselineIds.has(id))
    ]);
    const matchedIds = [];
    for (const primitiveId of candidateIds) {
      const wire = await eda.sch_PrimitiveWire.get(primitiveId);
      if (wire && wireMatchesOriginalRestorePlan(wire, state)) {
        matchedIds.push(primitiveId);
      }
    }
    return [...new Set(matchedIds)];
  }
  async function collectCoveredOriginalWireSegmentKeys(primitiveIds, plannedLine) {
    const plannedKeys = new Set(sequentialSegmentKeys(plannedLine));
    const coveredKeys = /* @__PURE__ */ new Set();
    for (const primitiveId of primitiveIds) {
      const wire = await eda.sch_PrimitiveWire.get(primitiveId);
      if (!wire) {
        continue;
      }
      const matchingVariant = lineSegmentKeyVariants(wire.getState_Line()).find((keys) => keys.length > 0 && keys.every((key) => plannedKeys.has(key)));
      for (const key of matchingVariant ?? []) {
        coveredKeys.add(key);
      }
    }
    return [...coveredKeys].sort((left, right) => naturalCollator4.compare(left, right));
  }
  function missingOriginalWireSegmentKeys(plannedLine, coveredKeys) {
    const covered = new Set(coveredKeys);
    return sequentialSegmentKeys(plannedLine).filter((key) => !covered.has(key));
  }
  function connectivityComparableValue(snapshot) {
    return JSON.stringify({
      namedNetworks: snapshot.namedNetworks,
      generatedNetworks: snapshot.generatedNetworks
    });
  }
  function summarizeConnectivity(snapshot) {
    return {
      capturedAt: snapshot.capturedAt,
      sourceVersion: snapshot.sourceVersion,
      networkCount: snapshot.networkCount,
      connectedMemberCount: snapshot.connectedMemberCount,
      canonicalHash: snapshot.canonicalHash
    };
  }
  async function captureOriginalWireSemanticEvidence(state) {
    const currentConnectivity = await buildEnetConnectivitySnapshot();
    if (state.beforeConnectivity) {
      const connectivityHashMatched = state.beforeConnectivity.canonicalHash === currentConnectivity.canonicalHash;
      const passed = connectivityHashMatched && connectivityComparableValue(state.beforeConnectivity) === connectivityComparableValue(currentConnectivity);
      return {
        mode: "whole-enet-connectivity",
        currentConnectivity: summarizeConnectivity(currentConnectivity),
        expectedConnectivity: summarizeConnectivity(state.beforeConnectivity),
        connectivityHashMatched,
        passed
      };
    }
    let targetMembers = state.targetMembers;
    if (!targetMembers || targetMembers.length === 0) {
      const storedPlan = readStoredPhase3Plan2();
      if (storedPlan) {
        targetMembers = choosePrototypeCandidate(storedPlan).portPlans.map((plan) => plan.member);
      }
    }
    const frozenRegion = readStoredRegionSnapshot();
    if (!frozenRegion || !targetMembers || targetMembers.length === 0) {
      return {
        mode: "frozen-region-fallback",
        currentConnectivity: summarizeConnectivity(currentConnectivity),
        error: "\u65E7\u6062\u590D\u72B6\u6001\u7F3A\u5C11\u6574\u56FE\u8FDE\u63A5\u57FA\u7EBF\uFF0C\u4E14\u65E0\u6CD5\u8BFB\u53D6\u51BB\u7ED3\u533A\u57DF\u6216\u76EE\u6807\u6210\u5458\u3002",
        passed: false
      };
    }
    try {
      const currentRegion = await buildCurrentRegionSnapshot();
      const comparison = compareRegions(frozenRegion.region, currentRegion.region);
      const targetSourceNetworks = await readCurrentMemberNetworks(targetMembers);
      const sourceNetworkNames = [...new Set(Object.values(targetSourceNetworks).filter(Boolean))];
      const allCurrentGroups = [
        ...currentConnectivity.namedNetworks.map((network) => network.members),
        ...currentConnectivity.generatedNetworks
      ];
      const targetMemberGroup = allCurrentGroups.find((members) => sameSet(members, targetMembers));
      const blockers = comparison.issues.filter((issue2) => issue2.level === "blocker");
      const passed = blockers.length === 0 && comparison.networkChanges.length === 0 && sourceNetworkNames.length === 1 && Boolean(targetMemberGroup);
      return {
        mode: "frozen-region-fallback",
        currentConnectivity: summarizeConnectivity(currentConnectivity),
        frozenRegionCapturedAt: frozenRegion.capturedAt,
        currentRegionCapturedAt: currentRegion.capturedAt,
        regionIssues: comparison.issues,
        networkChanges: comparison.networkChanges,
        targetMembers,
        targetSourceNetworks,
        ...targetMemberGroup ? { targetMemberGroup } : {},
        passed
      };
    } catch (error) {
      return {
        mode: "frozen-region-fallback",
        currentConnectivity: summarizeConnectivity(currentConnectivity),
        frozenRegionCapturedAt: frozenRegion.capturedAt,
        targetMembers,
        error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
        passed: false
      };
    }
  }
  async function restoreOriginalWireIncrementally(state) {
    const matchedWireIdsBefore = await findOriginalWireRestoreIds(state);
    const coveredSegmentKeysBefore = await collectCoveredOriginalWireSegmentKeys(matchedWireIdsBefore, state.plannedLine);
    const missingSegmentKeysBefore = missingOriginalWireSegmentKeys(state.plannedLine, coveredSegmentKeysBefore);
    const creationAttempts = [];
    let statePersistenceError;
    for (let segmentIndex = 0; segmentIndex < state.plannedLine.length; segmentIndex += 1) {
      const segment = state.plannedLine[segmentIndex];
      const targetKey = sequentialSegmentKeys([segment])[0];
      const currentMatchedIds = await findOriginalWireRestoreIds(state);
      const currentCoveredKeys = await collectCoveredOriginalWireSegmentKeys(currentMatchedIds, state.plannedLine);
      if (currentCoveredKeys.includes(targetKey)) {
        continue;
      }
      const netModes = state.wireSnapshot.net ? [{ mode: "snapshot", net: state.wireSnapshot.net }, { mode: "automatic" }] : [{ mode: "automatic" }];
      let segmentCovered = false;
      for (const netMode of netModes) {
        const beforeIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
        const beforeIdSet = new Set(beforeIds);
        let returnedPrimitiveId;
        let attemptError;
        try {
          const created = await eda.sch_PrimitiveWire.create(
            cloneLine(segment),
            netMode.net,
            state.wireSnapshot.color,
            state.wireSnapshot.lineWidth,
            state.wireSnapshot.lineType
          );
          returnedPrimitiveId = created ? safePrimitiveId(created) : void 0;
        } catch (error) {
          attemptError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        }
        let detectedPrimitiveIds = (await eda.sch_PrimitiveWire.getAllPrimitiveId()).filter((id) => !beforeIdSet.has(id));
        if (!returnedPrimitiveId && detectedPrimitiveIds.length === 0 && !attemptError) {
          detectedPrimitiveIds = await waitForNewIds(() => eda.sch_PrimitiveWire.getAllPrimitiveId(), beforeIds);
        }
        const trackedIds = [.../* @__PURE__ */ new Set([
          ...detectedPrimitiveIds,
          ...returnedPrimitiveId && !beforeIdSet.has(returnedPrimitiveId) ? [returnedPrimitiveId] : []
        ])];
        state.createdWireIds.push(...trackedIds.filter((id) => !state.createdWireIds.includes(id)));
        try {
          await writeOriginalWireRestoreState(state);
        } catch (error) {
          statePersistenceError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        }
        const matchedIdsAfterAttempt = await findOriginalWireRestoreIds(state);
        const coveredKeysAfterAttempt = await collectCoveredOriginalWireSegmentKeys(matchedIdsAfterAttempt, state.plannedLine);
        segmentCovered = coveredKeysAfterAttempt.includes(targetKey);
        creationAttempts.push({
          segmentIndex,
          segment,
          netMode: netMode.mode,
          ...returnedPrimitiveId ? { returnedPrimitiveId } : {},
          detectedPrimitiveIds,
          coveredAfterAttempt: segmentCovered,
          ...attemptError ? { error: attemptError } : {}
        });
        if (segmentCovered || !attemptError || statePersistenceError) {
          break;
        }
      }
      if (!segmentCovered || statePersistenceError) {
        break;
      }
    }
    const matchedWireIdsAfter = await findOriginalWireRestoreIds(state);
    const coveredSegmentKeysAfter = await collectCoveredOriginalWireSegmentKeys(matchedWireIdsAfter, state.plannedLine);
    const missingSegmentKeysAfter = missingOriginalWireSegmentKeys(state.plannedLine, coveredSegmentKeysAfter);
    const geometryRestored = missingSegmentKeysAfter.length === 0;
    const finalNetlistSamples = await captureNetlistHashSamples2([0, 250, 1e3, 3e3]);
    const expectedNetlist = {
      length: state.beforeNetlist.length,
      hash: state.beforeNetlist.hash
    };
    const rawNetlistRestored = finalNetlistSamples.length > 0 && finalNetlistSamples.every((sample) => sample.length === expectedNetlist.length && sample.hash === expectedNetlist.hash);
    const semanticEvidence = await captureOriginalWireSemanticEvidence(state);
    const connectivityRestored = semanticEvidence.passed;
    const netlistRestored = rawNetlistRestored || connectivityRestored;
    const restorationPassed = geometryRestored && netlistRestored && !statePersistenceError;
    const recoveryStateCleared = restorationPassed ? await clearOriginalWireRestoreState() : false;
    return {
      matchedWireIdsBefore,
      coveredSegmentKeysBefore,
      missingSegmentKeysBefore,
      creationAttempts,
      ...statePersistenceError ? { statePersistenceError } : {},
      matchedWireIdsAfter,
      coveredSegmentKeysAfter,
      missingSegmentKeysAfter,
      geometryRestored,
      finalNetlistSamples,
      expectedNetlist,
      rawNetlistRestored,
      semanticEvidence,
      connectivityRestored,
      netlistRestored,
      recoveryStateCleared,
      passed: restorationPassed && recoveryStateCleared
    };
  }
  async function cleanupWireClone(state) {
    const matchedWireIds = await findWireCloneIds(state);
    const deleteTargets = (await Promise.all(matchedWireIds.map((id) => eda.sch_PrimitiveWire.get(id)))).filter((wire) => Boolean(wire));
    const deleteTargetIds = deleteTargets.map((wire) => wire.getState_PrimitiveId());
    let deleteReturned = matchedWireIds.length === 0;
    let deleteError;
    if (matchedWireIds.length > 0) {
      try {
        deleteReturned = await eda.sch_PrimitiveWire.delete(deleteTargets.length > 0 ? deleteTargets : matchedWireIds);
      } catch (error) {
        deleteError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
    }
    const deleteEvidence = await captureWirePresenceEvidence(matchedWireIds, [0, 100, 250, 500, 1e3, 3e3], "absent");
    const remainingIdSet = new Set(await eda.sch_PrimitiveWire.getAllPrimitiveId());
    const remainingWireIds = [];
    for (const primitiveId of matchedWireIds) {
      if (remainingIdSet.has(primitiveId) || await eda.sch_PrimitiveWire.get(primitiveId)) {
        remainingWireIds.push(primitiveId);
      }
    }
    const finalNetlistSamples = await captureNetlistHashSamples2([0, 250, 1e3, 3e3]);
    const expectedNetlist = {
      length: state.beforeNetlistLength ?? state.beforeNetlist.length,
      hash: state.beforeNetlistHash ?? state.beforeNetlist.hash
    };
    const { text: finalNetlistText } = await readNetlist();
    const probeNetAbsent = !finalNetlistText.includes(state.probeNet);
    const netlistRestored = finalNetlistSamples.length > 0 && finalNetlistSamples.every((sample) => sample.length === expectedNetlist.length && sample.hash === expectedNetlist.hash) && probeNetAbsent;
    const cleanupPassed = deleteReturned && !deleteError && remainingWireIds.length === 0 && netlistRestored;
    const recoveryStateCleared = cleanupPassed ? await clearWireCloneState() : false;
    return {
      matchedWireIds,
      deleteTargetIds,
      deleteReturned,
      ...deleteError ? { deleteError } : {},
      deleteEvidence,
      remainingWireIds,
      finalNetlistSamples,
      expectedNetlist,
      probeNetAbsent,
      netlistRestored,
      recoveryStateCleared,
      passed: cleanupPassed && recoveryStateCleared
    };
  }
  async function runComplexWireCloneProbe() {
    await runProbe("\u590D\u6742\u5BFC\u7EBF\u5206\u6BB5\u514B\u9686\u5220\u9664\u95ED\u73AF", async () => {
      if (readBatchRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5B8C\u6574\u533A\u57DF\u6279\u91CF\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 29\u3002");
      }
      if (readOriginalWireRestoreState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u5B8C\u6210\u7684\u539F\u5BFC\u7EBF\u9010\u6BB5\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 25\u3002");
      }
      if (readWireCloneState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u6E05\u7406\u7684\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 22\u3002");
      }
      if (readRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u9636\u6BB5 4 \u8F6C\u6362\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 20\uFF0C\u4E0D\u8981\u8FD0\u884C\u514B\u9686\u63A2\u9488\u3002");
      }
      const { text: initialNetlistText } = await readNetlist();
      const existingProbeNets = probeWireNetNames(initialNetlistText);
      if (existingProbeNets.length > 0) {
        throw new Error(`\u5F53\u524D ENET \u4ECD\u5305\u542B\u65E7\u63A2\u9488\u7F51\u7EDC\uFF1A${existingProbeNets.join("\u3001")}\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 23 \u5E76\u6062\u590D\u5230\u5E72\u51C0\u72B6\u6001\u3002`);
      }
      const storedPlan = readStoredPhase3Plan2();
      if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
        throw new Error("\u6CA1\u6709\u53EF\u7528\u7684\u9636\u6BB5 3 \u51BB\u7ED3\u8BA1\u5212\u3002\u8BF7\u5148\u6309\u672C\u7248\u6D4B\u8BD5\u6D41\u7A0B\u6267\u884C\u83DC\u5355 13 \u81F3 16\u3002");
      }
      const selectedIds = (await getSelectedPrimitives()).map(safePrimitiveId).filter((id) => Boolean(id));
      if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
        throw new Error("\u5F53\u524D\u9009\u62E9\u4E0E\u83DC\u5355 16 \u51BB\u7ED3\u7684\u9009\u62E9\u4E0D\u4E00\u81F4\u3002\u8BF7\u91CD\u65B0\u6267\u884C\u83DC\u5355 13 \u81F3 16\u3002");
      }
      const candidate = choosePrototypeCandidate(storedPlan);
      const sourceWire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
      if (!sourceWire) {
        throw new Error(`\u6E90\u5BFC\u7EBF\u4E0D\u5B58\u5728\uFF1A${candidate.wirePlan.primitiveId}\u3002`);
      }
      const snapshot = createWireSnapshot(sourceWire);
      const segmentedLine = splitFlatLineIntoSegments(snapshot.line);
      if (!segmentedLine) {
        throw new Error("\u6E90\u5BFC\u7EBF\u65E0\u6CD5\u6309\u6BCF 4 \u4E2A\u6570\u5B57\u62C6\u5206\u4E3A\u6709\u6548\u6B63\u4EA4\u7EBF\u6BB5\uFF0C\u5DF2\u963B\u6B62\u514B\u9686\u3002");
      }
      const allWires = await eda.sch_PrimitiveWire.getAll();
      const allComponents = await eda.sch_PrimitiveComponent.getAll();
      const placement = await findEmptyCloneOffset(segmentedLine, allWires, allComponents);
      const offsetX = placement.x;
      const offsetY = placement.y;
      const translatedLine = segmentedLine.map((segment) => segment.map((value, index) => value + (index % 2 === 0 ? offsetX : offsetY)));
      const probeNet = `PROBE_WIRE_CLONE_${String(Date.now())}`;
      const confirmed = await confirmAction(
        `\u5C06\u5728\u56FE\u7EB8\u5185\u90E8\u7A7A\u767D\u4F4D\u7F6E\u9010\u6BB5\u521B\u5EFA ${translatedLine.length} \u6761\u76F8\u8FDE\u5BFC\u7EBF\uFF0C\u968F\u540E\u7ACB\u5373\u5220\u9664\u5E76\u6BD4\u8F83\u7F51\u8868\u3002\u539F\u5BFC\u7EBF ${snapshot.originalPrimitiveId} \u4E0D\u4F1A\u88AB\u4FEE\u6539\u3002`,
        "\u786E\u8BA4\u6267\u884C\u590D\u6742\u5BFC\u7EBF\u5206\u6BB5\u514B\u9686/\u5220\u9664\u95ED\u73AF"
      );
      if (!confirmed) {
        return;
      }
      const beforeNetlist = await captureNetlistHash2();
      const state = {
        version: 1,
        active: true,
        capturedAt: now(),
        beforeNetlist,
        beforeNetlistLength: beforeNetlist.length,
        beforeNetlistHash: beforeNetlist.hash,
        baselineWireIds: await eda.sch_PrimitiveWire.getAllPrimitiveId(),
        createdWireIds: [],
        plannedLine: translatedLine,
        probeNet,
        sourceWirePrimitiveId: snapshot.originalPrimitiveId
      };
      await writeWireCloneState(state);
      const creationAttempts = [];
      const detectedPrimitiveIds = [];
      let createError;
      for (let index = 0; index < translatedLine.length; index += 1) {
        const segment = translatedLine[index];
        const beforeIds = await eda.sch_PrimitiveWire.getAllPrimitiveId();
        const beforeIdSet = new Set(beforeIds);
        let returnedPrimitiveId;
        let attemptError;
        try {
          const created = await eda.sch_PrimitiveWire.create(
            cloneLine(segment),
            probeNet,
            snapshot.color,
            snapshot.lineWidth,
            snapshot.lineType
          );
          returnedPrimitiveId = created ? safePrimitiveId(created) : void 0;
        } catch (error) {
          attemptError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        }
        let newIds2 = (await eda.sch_PrimitiveWire.getAllPrimitiveId()).filter((id) => !beforeIdSet.has(id));
        if (!returnedPrimitiveId && newIds2.length === 0) {
          newIds2 = await waitForNewIds(() => eda.sch_PrimitiveWire.getAllPrimitiveId(), beforeIds);
        }
        detectedPrimitiveIds.push(...newIds2.filter((id) => !detectedPrimitiveIds.includes(id)));
        state.createdWireIds.push(...newIds2.filter((id) => !state.createdWireIds.includes(id)));
        if (returnedPrimitiveId && !beforeIdSet.has(returnedPrimitiveId) && !state.createdWireIds.includes(returnedPrimitiveId)) {
          state.createdWireIds.push(returnedPrimitiveId);
        }
        await writeWireCloneState(state);
        const mergedIntoTrackedClone = Boolean(returnedPrimitiveId && state.createdWireIds.includes(returnedPrimitiveId));
        const attemptPassed = !attemptError && (newIds2.length > 0 || mergedIntoTrackedClone);
        creationAttempts.push({
          segmentIndex: index,
          segment,
          returnedPrimitiveId,
          detectedPrimitiveIds: newIds2,
          mergedIntoTrackedClone,
          passed: attemptPassed,
          attemptError
        });
        if (!attemptPassed) {
          createError = attemptError ?? `\u7B2C ${String(index + 1)} \u6761\u7EBF\u6BB5\u521B\u5EFA\u540E\u6CA1\u6709\u8FD4\u56DE\u6216\u68C0\u6D4B\u5230\u56FE\u5143\u3002`;
          break;
        }
      }
      const matchedCreatedWireIds = await findWireCloneIds(state);
      const createAllSegmentsMatched = await cloneGeometryComplete(matchedCreatedWireIds, translatedLine);
      const cleanup = await cleanupWireClone(state);
      const passed = !createError && createAllSegmentsMatched && cleanup.passed;
      await showPreview("\u9636\u6BB5 4\uFF1A\u590D\u6742\u5BFC\u7EBF\u5206\u6BB5\u514B\u9686/\u5220\u9664\u7ED3\u679C", [
        jsonPreviewTab("\u95ED\u73AF\u6458\u8981", {
          capturedAt: now(),
          sourceWirePrimitiveId: snapshot.originalPrimitiveId,
          segmentCount: translatedLine.length,
          offset: { x: offsetX, y: offsetY },
          sheetBounds: placement.sheetBounds,
          targetBounds: placement.targetBounds,
          createdPrimitiveCount: state.createdWireIds.length,
          createAllSegmentsMatched,
          automaticCleanupPassed: cleanup.passed,
          originalWireUntouched: Boolean(await eda.sch_PrimitiveWire.get(snapshot.originalPrimitiveId)),
          passed,
          createError,
          conclusion: passed ? "\u590D\u6742\u5206\u652F\u5BFC\u7EBF\u5DF2\u5728\u504F\u79FB\u4F4D\u7F6E\u552F\u4E00\u521B\u5EFA\u3001\u5220\u9664\uFF0C\u539F\u5BFC\u7EBF\u672A\u4FEE\u6539\u4E14\u6700\u7EC8\u7F51\u8868\u6062\u590D\u3002" : "\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u95ED\u73AF\u672A\u901A\u8FC7\u3002\u82E5\u5B58\u5728\u6B8B\u7559\uFF0C\u8BF7\u6267\u884C\u83DC\u5355 22\uFF1B\u4E0D\u8981\u6267\u884C\u83DC\u5355 18\u3002"
        }),
        jsonPreviewTab("\u8DEF\u5F84\u8F6C\u6362\u8BC1\u636E", {
          originalLine: snapshot.line,
          segmentedLine,
          translatedLine,
          sheetBounds: placement.sheetBounds,
          targetBounds: placement.targetBounds,
          probeNet
        }),
        jsonPreviewTab("\u521B\u5EFA\u8BC1\u636E", {
          creationAttempts,
          detectedPrimitiveIds,
          createdWireIds: state.createdWireIds,
          matchedCreatedWireIds,
          createAllSegmentsMatched,
          createError
        }),
        jsonPreviewTab("\u5220\u9664\u4E0E\u7F51\u8868\u8BC1\u636E", cleanup)
      ]);
    });
  }
  async function runOriginalWireDeleteRestoreProbe() {
    await runProbe("\u539F\u5BFC\u7EBF\u5220\u9664\u9010\u6BB5\u6062\u590D\u95ED\u73AF", async () => {
      if (readBatchRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5B8C\u6574\u533A\u57DF\u6279\u91CF\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 29\u3002");
      }
      if (readOriginalWireRestoreState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u5B8C\u6210\u7684\u539F\u5BFC\u7EBF\u9010\u6BB5\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 25\u3002");
      }
      if (readWireCloneState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5C1A\u672A\u6E05\u7406\u7684\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 22\u3002");
      }
      if (readRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u9636\u6BB5 4 \u8F6C\u6362\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 20\u3002");
      }
      const { text: initialNetlistText } = await readNetlist();
      const existingProbeNets = probeWireNetNames(initialNetlistText);
      if (existingProbeNets.length > 0) {
        throw new Error(`\u5F53\u524D ENET \u4ECD\u5305\u542B\u65E7\u63A2\u9488\u7F51\u7EDC\uFF1A${existingProbeNets.join("\u3001")}\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 23 \u5E76\u6062\u590D\u5230\u5E72\u51C0\u72B6\u6001\u3002`);
      }
      const storedPlan = readStoredPhase3Plan2();
      if (!storedPlan?.planReady || storedPlan.blockerCount !== 0) {
        throw new Error("\u6CA1\u6709\u53EF\u7528\u7684\u9636\u6BB5 3 \u51BB\u7ED3\u8BA1\u5212\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 13 \u81F3 16\u3002");
      }
      const selectedIds = (await getSelectedPrimitives()).map(safePrimitiveId).filter((id) => Boolean(id));
      if (!sameSet(selectedIds, storedPlan.selectedPrimitiveIds)) {
        throw new Error("\u5F53\u524D\u9009\u62E9\u4E0E\u83DC\u5355 16 \u51BB\u7ED3\u7684\u9009\u62E9\u4E0D\u4E00\u81F4\u3002\u8BF7\u91CD\u65B0\u6267\u884C\u83DC\u5355 13 \u81F3 16\u3002");
      }
      const candidate = choosePrototypeCandidate(storedPlan);
      const sourceWire = await eda.sch_PrimitiveWire.get(candidate.wirePlan.primitiveId);
      if (!sourceWire) {
        throw new Error(`\u6E90\u5BFC\u7EBF\u4E0D\u5B58\u5728\uFF1A${candidate.wirePlan.primitiveId}\u3002`);
      }
      const wireSnapshot = createWireSnapshot(sourceWire);
      const plannedLine = splitFlatLineIntoSegments(wireSnapshot.line);
      if (!plannedLine) {
        throw new Error("\u6E90\u5BFC\u7EBF\u65E0\u6CD5\u6309\u6BCF 4 \u4E2A\u6570\u5B57\u62C6\u5206\u4E3A\u6709\u6548\u6B63\u4EA4\u7EBF\u6BB5\uFF0C\u5DF2\u963B\u6B62\u5220\u9664\u3002");
      }
      const confirmed = await confirmAction(
        `\u5C06\u5220\u9664\u539F\u5BFC\u7EBF ${wireSnapshot.originalPrimitiveId}\uFF0C\u786E\u8BA4\u6D88\u5931\u540E\u6309 ${String(plannedLine.length)} \u4E2A\u7EBF\u6BB5\u9010\u6BB5\u6062\u590D\u3002\u4E0D\u4F1A\u521B\u5EFA\u7F51\u7EDC\u7AEF\u53E3\uFF1B\u6062\u590D\u72B6\u6001\u4F1A\u5728\u5220\u9664\u524D\u6301\u4E45\u5316\u3002`,
        "\u786E\u8BA4\u6267\u884C\u539F\u5BFC\u7EBF\u5220\u9664/\u9010\u6BB5\u6062\u590D\u95ED\u73AF"
      );
      if (!confirmed) {
        return;
      }
      const state = {
        version: 1,
        active: true,
        capturedAt: now(),
        beforeNetlist: await captureNetlistHash2(),
        beforeConnectivity: await buildEnetConnectivitySnapshot(),
        baselineWireIds: await eda.sch_PrimitiveWire.getAllPrimitiveId(),
        createdWireIds: [],
        wireSnapshot,
        sourceWirePrimitiveId: wireSnapshot.originalPrimitiveId,
        plannedLine,
        targetMembers: candidate.portPlans.map((plan) => plan.member),
        targetNetwork: candidate.net,
        wireDeleted: false
      };
      await writeOriginalWireRestoreState(state);
      let deleteReturned = false;
      let deleteEvidence = [];
      let wireAbsentAfterDelete = false;
      let deleteError;
      let deletionStateUpdateError;
      try {
        const freshSourceWire = await eda.sch_PrimitiveWire.get(state.sourceWirePrimitiveId);
        if (!freshSourceWire) {
          throw new Error("\u5220\u9664\u524D\u65E0\u6CD5\u91CD\u65B0\u8BFB\u53D6\u6E90\u5BFC\u7EBF\u5BF9\u8C61\u3002");
        }
        deleteReturned = await eda.sch_PrimitiveWire.delete(freshSourceWire);
        deleteEvidence = await captureWirePresenceEvidence(
          [state.sourceWirePrimitiveId],
          [0, 100, 250, 500, 1e3, 3e3],
          "absent"
        );
        wireAbsentAfterDelete = deleteEvidence.at(-1)?.status === "absent";
        if (wireAbsentAfterDelete) {
          state.wireDeleted = true;
          try {
            await writeOriginalWireRestoreState(state);
          } catch (error) {
            deletionStateUpdateError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
          }
        }
        if (!deleteReturned || !wireAbsentAfterDelete) {
          throw new Error(`\u539F\u5BFC\u7EBF\u5220\u9664\u672A\u5F97\u5230\u5B8C\u6574\u786E\u8BA4\uFF1A\u8FD4\u56DE ${String(deleteReturned)}\uFF0C\u6700\u7EC8\u72B6\u6001 ${deleteEvidence.at(-1)?.status ?? "unknown"}\u3002`);
        }
      } catch (error) {
        deleteError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        if (deleteEvidence.length === 0) {
          deleteEvidence = await captureWirePresenceEvidence(
            [state.sourceWirePrimitiveId],
            [0, 100, 250, 500, 1e3]
          );
          wireAbsentAfterDelete = deleteEvidence.at(-1)?.status === "absent";
        }
      }
      let restoreResult;
      let restoreError;
      try {
        restoreResult = await restoreOriginalWireIncrementally(state);
      } catch (error) {
        restoreError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      const passed = deleteReturned && wireAbsentAfterDelete && !deleteError && !deletionStateUpdateError && !restoreError && restoreResult?.passed === true;
      await showPreview("\u9636\u6BB5 4\uFF1A\u539F\u5BFC\u7EBF\u5220\u9664/\u9010\u6BB5\u6062\u590D\u7ED3\u679C", [
        jsonPreviewTab("\u95ED\u73AF\u6458\u8981", {
          capturedAt: now(),
          sourceWirePrimitiveId: state.sourceWirePrimitiveId,
          targetNetwork: candidate.net,
          sourceWireNetField: wireSnapshot.net,
          segmentCount: plannedLine.length,
          deleteReturned,
          wireAbsentAfterDelete,
          deleteConfirmationStatus: deleteEvidence.at(-1)?.status ?? "unknown",
          geometryRestored: restoreResult?.geometryRestored ?? false,
          rawNetlistRestored: restoreResult?.rawNetlistRestored ?? false,
          connectivityRestored: restoreResult?.connectivityRestored ?? false,
          netlistRestored: restoreResult?.netlistRestored ?? false,
          recoveryStateCleared: restoreResult?.recoveryStateCleared ?? false,
          passed,
          persistentConversionEnabled: false,
          ...deleteError ? { deleteError } : {},
          ...deletionStateUpdateError ? { deletionStateUpdateError } : {},
          ...restoreError ? { restoreError } : {},
          conclusion: passed ? "\u539F\u5BFC\u7EBF\u5DF2\u786E\u8BA4\u5220\u9664\u5E76\u6309\u7F3A\u5931\u7EBF\u6BB5\u5B8C\u6574\u6062\u590D\uFF0C\u6700\u7EC8\u7F51\u8868\u6062\u590D\u3002" : "\u539F\u5BFC\u7EBF\u5220\u9664/\u6062\u590D\u95ED\u73AF\u672A\u5B8C\u5168\u901A\u8FC7\u3002\u8BF7\u4FDD\u7559\u7ED3\u679C\u5E76\u6267\u884C\u83DC\u5355 25\u3002"
        }),
        jsonPreviewTab("\u5BFC\u7EBF\u5220\u9664\u8BC1\u636E", deleteEvidence),
        jsonPreviewTab("\u9010\u6BB5\u6062\u590D\u8BC1\u636E", restoreResult ?? { restoreError }),
        jsonPreviewTab("\u6062\u590D\u72B6\u6001\u5FEB\u7167", state)
      ]);
    });
  }
  async function recoverOriginalWireDeleteRestoreProbe() {
    await runProbe("\u6062\u590D\u6700\u8FD1\u539F\u5BFC\u7EBF\u9010\u6BB5\u63A2\u9488", async () => {
      if (readBatchRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5B8C\u6574\u533A\u57DF\u6279\u91CF\u6062\u590D\u72B6\u6001\u3002\u8BF7\u6267\u884C\u83DC\u5355 29\uFF0C\u4E0D\u8981\u5355\u72EC\u6062\u590D\u5F53\u524D\u5BFC\u7EBF\u3002");
      }
      if (readRecoveryState()) {
        throw new Error("\u68C0\u6D4B\u5230\u5355\u7F51\u7EDC\u8F6C\u6362\u6062\u590D\u72B6\u6001\u3002\u8BF7\u5148\u6267\u884C\u83DC\u5355 19 \u6E05\u7406\u4E34\u65F6\u7AEF\u53E3\u5E76\u6062\u590D\u5BFC\u7EBF\u3002");
      }
      const state = readOriginalWireRestoreState();
      if (!state) {
        await showPreview("\u9636\u6BB5 4\uFF1A\u539F\u5BFC\u7EBF\u9010\u6BB5\u6062\u590D", [jsonPreviewTab("\u6062\u590D\u6458\u8981", {
          capturedAt: now(),
          statePresent: false,
          passed: true,
          recoveryStateCleared: true,
          canvasModified: false,
          conclusion: "\u5F53\u524D\u6CA1\u6709\u5F85\u5904\u7406\u7684\u539F\u5BFC\u7EBF\u9010\u6BB5\u6062\u590D\u72B6\u6001\u3002"
        })]);
        return;
      }
      const confirmed = await confirmAction(
        `\u5C06\u68C0\u67E5\u539F\u5BFC\u7EBF ${state.sourceWirePrimitiveId} \u7684 ${String(state.plannedLine.length)} \u4E2A\u76EE\u6807\u7EBF\u6BB5\uFF0C\u5E76\u53EA\u521B\u5EFA\u7F3A\u5931\u7EBF\u6BB5\u3002`,
        "\u786E\u8BA4\u6062\u590D\u6700\u8FD1\u539F\u5BFC\u7EBF\u9010\u6BB5\u63A2\u9488"
      );
      if (!confirmed) {
        return;
      }
      let result;
      let restoreError;
      try {
        result = await restoreOriginalWireIncrementally(state);
      } catch (error) {
        restoreError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      await showPreview("\u9636\u6BB5 4\uFF1A\u539F\u5BFC\u7EBF\u9010\u6BB5\u6062\u590D", [
        jsonPreviewTab("\u6062\u590D\u6458\u8981", {
          capturedAt: now(),
          statePresent: true,
          sourceWirePrimitiveId: state.sourceWirePrimitiveId,
          targetNetwork: resolveOriginalWireTargetNetwork(state),
          sourceWireNetField: state.wireSnapshot.net,
          segmentCount: state.plannedLine.length,
          geometryRestored: result?.geometryRestored ?? false,
          rawNetlistRestored: result?.rawNetlistRestored ?? false,
          connectivityRestored: result?.connectivityRestored ?? false,
          netlistRestored: result?.netlistRestored ?? false,
          recoveryStateCleared: result?.recoveryStateCleared ?? false,
          passed: !restoreError && result?.passed === true,
          ...restoreError ? { restoreError } : {},
          conclusion: !restoreError && result?.passed ? "\u7F3A\u5931\u7EBF\u6BB5\u5DF2\u8865\u9F50\uFF0C\u6700\u7EC8\u7F51\u8868\u6062\u590D\uFF0C\u6062\u590D\u72B6\u6001\u5DF2\u6E05\u9664\u3002" : "\u9010\u6BB5\u6062\u590D\u672A\u5B8C\u5168\u901A\u8FC7\uFF0C\u6062\u590D\u72B6\u6001\u5DF2\u4FDD\u7559\u3002\u8BF7\u4E0D\u8981\u7EE7\u7EED\u5176\u4ED6\u5199\u5165\u6D4B\u8BD5\u3002"
        }),
        jsonPreviewTab("\u9010\u6BB5\u6062\u590D\u8BC1\u636E", result ?? { restoreError }),
        jsonPreviewTab("\u6062\u590D\u72B6\u6001\u5FEB\u7167", state)
      ]);
    });
  }
  async function cleanupComplexWireCloneProbe() {
    await runProbe("\u6E05\u7406\u6700\u8FD1\u590D\u6742\u5BFC\u7EBF\u514B\u9686", async () => {
      const state = readWireCloneState();
      if (!state) {
        await showPreview("\u9636\u6BB5 4\uFF1A\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u6E05\u7406", [jsonPreviewTab("\u6E05\u7406\u6458\u8981", {
          capturedAt: now(),
          statePresent: false,
          passed: true,
          canvasModified: false,
          conclusion: "\u5F53\u524D\u6CA1\u6709\u5F85\u6E05\u7406\u7684\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u72B6\u6001\u3002"
        })]);
        return;
      }
      const confirmed = await confirmAction("\u5C06\u53EA\u5220\u9664\u672C\u8F6E\u57FA\u7EBF\u4E4B\u5916\u4E14\u8DEF\u5F84\u4E0E\u8BA1\u5212\u5B8C\u5168\u5339\u914D\u7684\u514B\u9686\u5BFC\u7EBF\u3002", "\u786E\u8BA4\u6E05\u7406\u590D\u6742\u5BFC\u7EBF\u514B\u9686");
      if (!confirmed) {
        return;
      }
      const cleanup = await cleanupWireClone(state);
      await showPreview("\u9636\u6BB5 4\uFF1A\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u6E05\u7406", [
        jsonPreviewTab("\u6E05\u7406\u6458\u8981", {
          capturedAt: now(),
          passed: cleanup.passed,
          conclusion: cleanup.passed ? "\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u5DF2\u6E05\u7406\uFF0C\u6700\u7EC8\u7F51\u8868\u6062\u590D\u3002" : "\u514B\u9686\u6E05\u7406\u672A\u5B8C\u5168\u901A\u8FC7\uFF0C\u8BF7\u4FDD\u7559\u8BC1\u636E\u4E14\u4E0D\u8981\u7EE7\u7EED\u5176\u4ED6\u5199\u5165\u6D4B\u8BD5\u3002"
        }),
        jsonPreviewTab("\u6E05\u7406\u8BC1\u636E", cleanup),
        jsonPreviewTab("\u514B\u9686\u72B6\u6001", state)
      ]);
    });
  }
  async function diagnoseWireCloneResidue() {
    await runProbe("\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u6B8B\u7559\u8BCA\u65AD", async () => {
      const { text: text2 } = await readNetlist();
      const probeNets = probeWireNetNames(text2);
      const matchingWires = (await eda.sch_PrimitiveWire.getAll()).filter((wire) => probeNets.includes(wire.getState_Net())).map((wire) => ({
        primitiveId: wire.getState_PrimitiveId(),
        net: wire.getState_Net(),
        line: wire.getState_Line()
      }));
      await showPreview("\u9636\u6BB5 4\uFF1A\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u6B8B\u7559\u8BCA\u65AD", [
        jsonPreviewTab("\u8BCA\u65AD\u6458\u8981", {
          capturedAt: now(),
          netlistLength: text2.length,
          netlistHash: hashText(text2),
          probeNetCount: probeNets.length,
          matchingWireCount: matchingWires.length,
          clean: probeNets.length === 0 && matchingWires.length === 0,
          canvasModified: false,
          conclusion: probeNets.length === 0 && matchingWires.length === 0 ? "\u5F53\u524D ENET \u548C\u5BFC\u7EBF\u5217\u8868\u4E2D\u5747\u672A\u53D1\u73B0\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u6B8B\u7559\u3002" : "\u68C0\u6D4B\u5230\u590D\u6742\u5BFC\u7EBF\u514B\u9686\u6B8B\u7559\u3002\u8BF7\u5148\u624B\u5DE5\u6062\u590D\u5230\u6D4B\u8BD5\u524D\u72B6\u6001\uFF0C\u518D\u91CD\u65B0\u6267\u884C\u672C\u8BCA\u65AD\u3002"
        }),
        jsonPreviewTab("\u6B8B\u7559\u660E\u7EC6", { probeNets, matchingWires })
      ]);
    });
  }

  // src/index.ts
  function activate(status, arg) {
    activateProbeEventLog();
  }
  function deactivate() {
    deactivateProbeEventLog();
  }
  function about() {
    eda.sys_Dialog.showInformationMessage(
      `\u8BA9AI\u770B\u770B\u4F60\u7684\u539F\u7406\u56FE
\u7248\u672C\uFF1A${extension_default.version}
\u652F\u6301\u8FDE\u63A5\u5173\u7CFB\u5BFC\u51FA\u3001AI \u6587\u672C\u4FEE\u6539\u3001\u5B89\u5168\u5BFC\u5165\u3001\u4E0A\u4E00\u6B21\u5BFC\u5165\u64A4\u56DE\u548C\u5168\u9762\u68C0\u67E5\u3002`,
      "\u5173\u4E8E"
    );
  }
  function phase0ExportSelection() {
    void exportSelectionProbe();
  }
  function phase0ProbeNetlistRefresh() {
    void probeNetlistRefresh();
  }
  function phase0CreateNetLabel() {
    void createNetLabelProbe();
  }
  function phase0DeleteNetLabel() {
    void deleteTrackedNetLabel();
  }
  function phase0CreateNetPort() {
    void createNetPortProbe();
  }
  function phase0DeleteNetPort() {
    void deleteTrackedNetPort();
  }
  function phase0SnapshotWire() {
    void snapshotSelectedWire();
  }
  function phase0DeleteWire() {
    void deleteSelectedWire();
  }
  function phase0RestoreWire() {
    void restoreWireSnapshot();
  }
  function phase0LabelThenDeleteWire() {
    void probeLabelThenDeleteWire();
  }
  function phase0ExportEventLog() {
    void exportEventLog();
  }
  function phase1DiagnoseNetlistStructure() {
    void diagnoseNetlistStructure();
  }
  function phase1ExportRegionStructure() {
    void exportRegionStructure();
  }
  function phase2OpenRegionImportInput() {
    void (async () => {
      const importRequested = await openRegionImportInput();
      if (importRequested) {
        await runPersistentFullRegionConversion();
      }
    })();
  }
  function showAiCollaborationGuide() {
    void showAiGuide();
  }
  function phase2RunRegionImportPreflight() {
    void runRegionImportPreflight();
  }
  function phase3RunWireConflictPreflight() {
    void runWireConflictPreflight();
  }
  function phase4RunNetPortLifecycleProbe() {
    void runNetPortLifecycleProbe();
  }
  function phase4RunSingleNetworkPrototype() {
    void runSingleNetworkPrototype();
  }
  function phase4RecoverSingleNetworkPrototype() {
    void recoverSingleNetworkPrototype();
  }
  function phase4VerifyManualRecoveryAndClearState() {
    void verifyManualRecoveryAndClearState();
  }
  function phase4RunComplexWireCloneProbe() {
    void runComplexWireCloneProbe();
  }
  function phase4CleanupComplexWireCloneProbe() {
    void cleanupComplexWireCloneProbe();
  }
  function phase4DiagnoseWireCloneResidue() {
    void diagnoseWireCloneResidue();
  }
  function phase4RunOriginalWireDeleteRestoreProbe() {
    void runOriginalWireDeleteRestoreProbe();
  }
  function phase4RecoverOriginalWireDeleteRestoreProbe() {
    void recoverOriginalWireDeleteRestoreProbe();
  }
  function phase4RunNetworkStubPortProbe() {
    void runNetworkStubPortProbe();
  }
  function phase4RunAllNetworkSequentialStubPortProbe() {
    void runAllNetworkSequentialStubPortProbe();
  }
  function phase4RunFullRegionStubPortRollbackProbe() {
    void runFullRegionStubPortRollbackProbe();
  }
  function phase4RecoverFullRegionStubPortProbe() {
    void recoverFullRegionStubPortProbe();
  }
  function phase4RunOneClickFullDebug() {
    void runOneClickFullDebug();
  }
  function phase4RunPersistentFullRegionConversion() {
    void runPersistentFullRegionConversion();
  }
  function phase4RunOneClickPersistentConversion() {
    void runOneClickPersistentConversion();
  }
  function phase4UndoPersistentFullRegionConversion() {
    void recoverFullRegionStubPortProbe();
  }
  return __toCommonJS(src_exports);
})();
