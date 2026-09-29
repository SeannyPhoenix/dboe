// src/db/localStorage/database.ts
var emptyDatabase = {
  values: {},
  valueTypes: {},
  history: []
};
var Database = class {
  data;
  constructor() {
    this.data = { ...emptyDatabase };
    this.load();
  }
  getValue(valueId) {
    return this.data.values[valueId];
  }
  putValue(value) {
    if (!this.data.valueTypes[value.type]) {
      throw new Error(`ValueType "${value.type}" not found`);
    }
    this.data.values[value.id] = value;
    this.data.history.push(value);
  }
  deleteValue(valueId) {
    const entry = this.data.values[valueId];
    if (!entry) {
      throw new Error(`Value "${valueId}" not found`);
    }
    delete this.data.values[valueId];
    const tombstone = {
      id: entry.id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.data.history.push(tombstone);
  }
  getValuesByType(typeId) {
    return Object.values(this.data.values).filter((v) => v.type === typeId);
  }
  getValueType(typeId) {
    return this.data.valueTypes[typeId];
  }
  putValueType(valueType) {
    this.data.valueTypes[valueType.id] = valueType;
    this.data.history.push(valueType);
  }
  deleteValueType(typeId) {
    const usedByValues = this.getValuesByType(typeId);
    if (usedByValues.length) {
      throw new Error(
        `Cannot delete ValueType "${typeId}": ${usedByValues.length} value(s) still reference it`
      );
    }
    const entry = this.data.valueTypes[typeId];
    if (!entry) {
      throw new Error(`ValueType "${typeId}" not found`);
    }
    delete this.data.valueTypes[typeId];
    const tombstone = {
      id: entry.id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.data.history.push(tombstone);
  }
  getAllValueTypes() {
    return Object.values(this.data.valueTypes);
  }
  getAllValues() {
    return Object.values(this.data.values);
  }
  getData() {
    return this.data;
  }
  isValid() {
    return Object.values(this.data.values).every((v) => this.data.valueTypes[v.type]);
  }
  load() {
    const data = localStorage.getItem("database");
    if (data) {
      try {
        this.data = JSON.parse(data);
      } catch (error) {
        console.error("Failed to load database from localStorage:", error);
      }
    }
  }
  save() {
    localStorage.setItem("database", JSON.stringify(this.data));
  }
};

// src/db/localStorage/dbindex.ts
function newEntity(id) {
  return {
    id,
    atob: /* @__PURE__ */ new Map(),
    btoa: /* @__PURE__ */ new Map(),
    values: /* @__PURE__ */ new Map()
  };
}
var DBIndex = class {
  tombstones = /* @__PURE__ */ new Map();
  valueTypes = /* @__PURE__ */ new Map();
  linkTypes = /* @__PURE__ */ new Map();
  entities = /* @__PURE__ */ new Map();
  addTombstone(t) {
    if (this.isTombstoned(t.id)) {
      return;
    }
    this.tombstones.set(t.id, {
      id: t.id,
      timestamp: t.timestamp
    });
  }
  addTombstones(ts) {
    for (const t of ts) {
      this.addTombstone(t);
    }
  }
  addValueType(vt) {
    if (this.isTombstoned(vt.id)) {
      return;
    }
    if (this.valueTypes.has(vt.id)) {
      const curr = this.valueTypes.get(vt.id);
      if (curr.timestamp >= vt.timestamp) {
        return;
      }
    }
    const valueType = {
      id: vt.id,
      timestamp: vt.timestamp,
      description: vt.description,
      serde: vt.serde,
      values: /* @__PURE__ */ new Map()
    };
    this.valueTypes.set(vt.id, valueType);
  }
  addValueTypes(vts) {
    for (const vt of vts) {
      this.addValueType(vt);
    }
  }
  addLinkType(lt) {
    if (this.isTombstoned(lt.id)) {
      return;
    }
    if (this.linkTypes.has(lt.id)) {
      const curr = this.linkTypes.get(lt.id);
      if (curr.timestamp >= lt.timestamp) {
        return;
      }
    }
    const linkType = {
      id: lt.id,
      timestamp: lt.timestamp,
      description: lt.description,
      links: /* @__PURE__ */ new Map()
    };
    this.linkTypes.set(lt.id, linkType);
  }
  addLinkTypes(lts) {
    for (const lt of lts) {
      this.addLinkType(lt);
    }
  }
  addValue(v) {
    if (this.isTombstoned(v.id)) {
      return;
    }
    const type = this.valueTypes.get(v.type);
    if (!type) {
      throw new Error(`Value has unknown valueType ${v.type}`);
    }
    if (!this.entities.has(v.entity)) {
      this.entities.set(v.entity, newEntity(v.entity));
    }
    const entity = this.entities.get(v.entity);
    if (type.values.has(v.id)) {
      const curr = type.values.get(v.id);
      if (curr.timestamp >= v.timestamp) {
        return;
      }
    }
    const value = {
      id: v.id,
      entity,
      timestamp: v.timestamp,
      type,
      value: v.value
    };
    entity.values.set(v.id, value);
    type.values.set(v.id, value);
  }
  addValues(vs) {
    for (const v of vs) {
      this.addValue(v);
    }
  }
  addLink(l) {
    if (this.isTombstoned(l.id)) {
      return;
    }
    const type = this.linkTypes.get(l.type);
    if (!type) {
      throw new Error(`Link has unknown linkType ${l.type}`);
    }
    if (!this.entities.has(l.a)) {
      this.entities.set(l.a, newEntity(l.a));
    }
    const a = this.entities.get(l.a);
    if (!this.entities.has(l.b)) {
      this.entities.set(l.b, newEntity(l.b));
    }
    const b = this.entities.get(l.b);
    if (type.links.has(l.id)) {
      const curr = type.links.get(l.id);
      if (curr.timestamp >= l.timestamp) {
        return;
      }
    }
    const link = {
      id: l.id,
      type,
      timestamp: l.timestamp,
      a,
      b
    };
    a.btoa.set(l.id, link);
    b.atob.set(l.id, link);
    type.links.set(l.id, link);
  }
  addLinks(ls) {
    for (const l of ls) {
      this.addLink(l);
    }
  }
  isTombstoned(id) {
    return this.tombstones.has(id);
  }
  deleteValue(value) {
    if (!this.entities.has(value.entity.id)) {
      return;
    }
    const tombstone = {
      id: value.id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.tombstones.set(value.id, tombstone);
    const { entity } = value;
    entity.values.delete(value.id);
    value.type.values.delete(value.id);
    this.pruneIfEmpty(entity);
  }
  deleteLink(link) {
    if (!this.entities.has(link.a.id) || !this.entities.has(link.b.id)) {
      return;
    }
    const tombstone = {
      id: link.id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.tombstones.set(link.id, tombstone);
    const { a, b } = link;
    a.btoa.delete(link.id);
    b.atob.delete(link.id);
    link.type.links.delete(link.id);
    this.pruneIfEmpty(a);
    this.pruneIfEmpty(b);
  }
  pruneIfEmpty(e) {
    if (!this.entities.has(e.id)) {
      return;
    }
    if (!e.values.size && !e.btoa.size && !e.atob.size) {
      this.entities.delete(e.id);
    }
  }
  reset() {
    this.tombstones.clear();
    this.valueTypes.clear();
    this.linkTypes.clear();
    this.entities.clear();
  }
  log() {
    console.log(this);
  }
};

// src/web/reactive/reactive.ts
function createReactive(initialState) {
  let state = initialState;
  const listeners = /* @__PURE__ */ new Set();
  return {
    get() {
      return state;
    },
    set(value) {
      state = value;
      this.notify();
    },
    update(fn) {
      state = fn(state);
      this.notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    notify() {
      listeners.forEach((fn) => fn());
    }
  };
}

// src/jsx/jsx-runtime/html.ts
var SVG_NS = "http://www.w3.org/2000/svg";
var SVG_ELEMENTS = {
  svg: "svg",
  path: "path",
  g: "g"
};

// src/jsx/jsx-runtime/index.ts
var elementFactory = null;
function setElementFactory(factory) {
  elementFactory = factory;
}
function getElementFactory() {
  if (!elementFactory) {
    throw new Error("Element factory not set");
  }
  return elementFactory;
}
if ("document" in globalThis) {
  setElementFactory({
    createElement(localName) {
      return document.createElement(localName);
    },
    createElementNS(namespaceURI, qualifiedName) {
      return document.createElementNS(namespaceURI, qualifiedName);
    },
    createTextNode(data) {
      return document.createTextNode(data);
    },
    createFragment() {
      return document.createDocumentFragment();
    }
  });
}
function Fragment(props) {
  const factory = getElementFactory();
  const fragment = factory.createFragment();
  appendChildren(fragment, props.children);
  return fragment;
}
function jsxElement(type, props) {
  const factory = getElementFactory();
  const element = type in SVG_ELEMENTS ? factory.createElementNS(SVG_NS, type) : factory.createElement(type);
  for (const name in props) {
    const value = props[name];
    switch (name) {
      case "children":
        appendChildren(element, value);
        continue;
      case "disabled":
        if (typeof value === "boolean") {
          if (value) {
            element.setAttribute("disabled", "");
          } else {
            element.removeAttribute("disabled");
          }
        }
        continue;
      case "style":
        if (typeof value === "object" && (element instanceof HTMLElement || element instanceof SVGElement || element instanceof MathMLElement)) {
          Object.assign(element.style, value);
        }
        continue;
      default:
    }
    if (name.startsWith("on") && typeof value === "function") {
      const eventName = name.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
      continue;
    }
    if (value !== void 0) {
      element.setAttribute(name, String(value));
    }
  }
  return element;
}
function jsx(type, props) {
  switch (typeof type) {
    case "function":
      const component = type(props);
      return component ?? Fragment({});
    case "string":
      return jsxElement(type, props);
    default:
      throw new Error(`Unsupported JSX type: ${String(type)}`);
  }
}
var jsxs = jsx;
function appendChildren(parent, children) {
  if (children === null || children === void 0 || children === false) {
    return;
  }
  if (Array.isArray(children)) {
    for (const child of children) {
      appendChildren(parent, child);
    }
    return;
  }
  if (children instanceof Node) {
    parent.appendChild(children);
    return;
  }
  const factory = getElementFactory();
  const textNode = factory.createTextNode(String(children));
  parent.appendChild(textNode);
}

// src/web/appState/appState.tsx
function initAppState() {
  const legacyDB = new Database();
  const index = new DBIndex();
  index.addTombstones([]);
  index.addValueTypes(legacyDB.getAllValueTypes());
  index.addValues(legacyDB.getAllValues());
  index.log();
  const stateData = {
    database: legacyDB,
    index
  };
  const state = createReactive(stateData);
  state.subscribe(() => state.get().database.save());
  return state;
}
var appState = initAppState();
function getAppState() {
  return appState;
}
function exportDatabase() {
  const state = getAppState();
  const data = JSON.stringify(state.get().database.getData());
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const name = `DBOE ${(/* @__PURE__ */ new Date()).toISOString()}.json`;
  const a = /* @__PURE__ */ jsx("a", { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

// src/web/components/options/Options.tsx
function Options() {
  return /* @__PURE__ */ jsx("div", { class: "options", children: /* @__PURE__ */ jsx("button", { onclick: exportDatabase, children: "Export" }) });
}

// node_modules/.pnpm/uuid@13.0.2/node_modules/uuid/dist/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/.pnpm/uuid@13.0.2/node_modules/uuid/dist/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}

// node_modules/.pnpm/uuid@13.0.2/node_modules/uuid/dist/v7.js
var _state = {};
function v7(options, buf, offset) {
  let bytes;
  if (options) {
    bytes = v7Bytes(options.random ?? options.rng?.() ?? rng(), options.msecs, options.seq, buf, offset);
  } else {
    const now = Date.now();
    const rnds = rng();
    updateV7State(_state, now, rnds);
    bytes = v7Bytes(rnds, _state.msecs, _state.seq, buf, offset);
  }
  return buf ?? unsafeStringify(bytes);
}
function updateV7State(state, now, rnds) {
  state.msecs ??= -Infinity;
  state.seq ??= 0;
  if (now > state.msecs) {
    state.seq = rnds[6] << 23 | rnds[7] << 16 | rnds[8] << 8 | rnds[9];
    state.msecs = now;
  } else {
    state.seq = state.seq + 1 | 0;
    if (state.seq === 0) {
      state.msecs++;
    }
  }
  return state;
}
function v7Bytes(rnds, msecs, seq, buf, offset = 0) {
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  if (!buf) {
    buf = new Uint8Array(16);
    offset = 0;
  } else {
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
  }
  msecs ??= Date.now();
  seq ??= rnds[6] * 127 << 24 | rnds[7] << 16 | rnds[8] << 8 | rnds[9];
  buf[offset++] = msecs / 1099511627776 & 255;
  buf[offset++] = msecs / 4294967296 & 255;
  buf[offset++] = msecs / 16777216 & 255;
  buf[offset++] = msecs / 65536 & 255;
  buf[offset++] = msecs / 256 & 255;
  buf[offset++] = msecs & 255;
  buf[offset++] = 112 | seq >>> 28 & 15;
  buf[offset++] = seq >>> 20 & 255;
  buf[offset++] = 128 | seq >>> 14 & 63;
  buf[offset++] = seq >>> 6 & 255;
  buf[offset++] = seq << 2 & 255 | rnds[10] & 3;
  buf[offset++] = rnds[11];
  buf[offset++] = rnds[12];
  buf[offset++] = rnds[13];
  buf[offset++] = rnds[14];
  buf[offset++] = rnds[15];
  return buf;
}
var v7_default = v7;

// src/web/reactive/component.ts
function reactiveComponent(subscriptions, render) {
  const container = document.createElement("div");
  function update() {
    container.innerHTML = "";
    const content = render();
    container.append(...Array.isArray(content) ? content : [content]);
  }
  subscriptions.forEach((sub) => sub.subscribe(update));
  update();
  return container;
}

// src/web/components/form/input/Input.tsx
function InputText(state) {
  const input = /* @__PURE__ */ jsx(
    "input",
    {
      type: "text",
      placeholder: "Enter text",
      value: state.get(),
      oninput: (e) => {
        state.set(e.target.value);
      }
    }
  );
  state.subscribe(() => {
    const currentValue = state.get();
    if (input.value !== currentValue) {
      input.value = currentValue;
    }
  });
  return input;
}
function InputCheckbox(state) {
  const input = /* @__PURE__ */ jsx(
    "input",
    {
      type: "checkbox",
      checked: state.get(),
      oninput: (e) => {
        state.set(e.target.checked);
      }
    }
  );
  state.subscribe(() => {
    const currentValue = state.get();
    if (input.checked !== currentValue) {
      input.checked = currentValue;
    }
  });
  return input;
}
function InputNumber(state) {
  const input = /* @__PURE__ */ jsx(
    "input",
    {
      type: "number",
      placeholder: "Enter number",
      value: state.get().toString(),
      oninput: (e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
          state.set(value);
        }
      }
    }
  );
  state.subscribe(() => {
    const currentValue = state.get();
    if (parseFloat(input.value) !== currentValue) {
      input.value = currentValue.toString();
    }
  });
  return input;
}

// src/web/components/form/select/Select.tsx
function Select(state, options) {
  const select = /* @__PURE__ */ jsx(
    "select",
    {
      onchange: (e) => {
        const value = e.target.value;
        const parsed = options.find((opt) => String(opt.value) === value)?.value;
        if (parsed !== void 0) {
          state.set(parsed);
        }
      },
      children: options.map((option) => /* @__PURE__ */ jsx("option", { value: String(option.value), children: option.label }))
    }
  );
  select.value = String(state.get());
  state.subscribe(() => {
    const currentValue = state.get();
    if (select.value !== String(currentValue)) {
      select.value = String(currentValue);
    }
  });
  return select;
}

// src/web/components/value.ts
function updateValue(state, updatedValue) {
  const currentState = state.get();
  currentState.database.putValue(updatedValue);
  state.notify();
}
function deleteValue(state, id) {
  const currentState = state.get();
  currentState.database.deleteValue(id);
  state.notify();
}
function getAllEntities(state) {
  const values = state.get().database.getAllValues();
  const entitySet = new Set(values.map((v) => v.entity));
  return Array.from(entitySet);
}
function getValueTypeSerDe(state, typeId) {
  const valueType = state.get().database.getValueType(typeId);
  return valueType?.serde;
}

// src/web/components/value/ValueDisplay.tsx
function ValueDisplay({
  state,
  value,
  isDraft = false,
  onSaveDraft,
  onDiscardDraft
}) {
  const shouldEdit = createReactive(isDraft);
  const currentValue = createReactive(value);
  const entityState = createReactive(value.entity);
  const typeState = createReactive(value.type);
  const valueState = createReactive(value.value);
  shouldEdit.subscribe(() => {
    if (shouldEdit.get()) {
      const current = currentValue.get();
      entityState.set(current.entity);
      typeState.set(current.type);
      valueState.set(current.value);
    }
  });
  const getValueTypeOptions = () => {
    return state.get().database.getAllValueTypes().map((vt) => ({
      label: vt.description,
      value: vt.id
    }));
  };
  const getEntityOptions = () => {
    const entities = getAllEntities(state);
    const currentEntity = entityState.get();
    const options = entities.filter((e) => e !== currentEntity || !isDraft).map((e) => ({
      label: e.substring(0, 8),
      // Show first 8 chars of UUID
      value: e
    }));
    options.unshift({
      label: "new",
      value: v7_default()
    });
    return options;
  };
  const renderValueInput = () => {
    const serde = getValueTypeSerDe(state, typeState.get());
    if (!serde) return /* @__PURE__ */ jsx("span", { children: "Select a type first" });
    switch (serde) {
      case "string":
        return InputText(valueState);
      case "number":
        return InputNumber(valueState);
      case "boolean":
        return InputCheckbox(valueState);
      default:
        return /* @__PURE__ */ jsxs("span", { children: [
          "Unknown type: ",
          serde
        ] });
    }
  };
  const saveDeleteButton = /* @__PURE__ */ jsx(
    "button",
    {
      class: "vt-btn",
      onclick: function() {
        switch (shouldEdit.get()) {
          case true:
            shouldEdit.set(false);
            const updated = {
              ...currentValue.get(),
              entity: entityState.get(),
              type: typeState.get(),
              value: valueState.get()
            };
            currentValue.set(updated);
            updateValue(state, updated);
            if (isDraft && onSaveDraft) {
              onSaveDraft();
            }
            break;
          case false:
            deleteValue(state, currentValue.get().id);
            break;
        }
      },
      children: shouldEdit.get() ? "Save" : "Delete"
    }
  );
  shouldEdit.subscribe(() => {
    const label = shouldEdit.get() ? "Save" : "Delete";
    if (saveDeleteButton.innerText !== label) {
      saveDeleteButton.innerText = label;
    }
  });
  return reactiveComponent([state, shouldEdit], () => {
    const isEditing = shouldEdit.get();
    const current = currentValue.get();
    return /* @__PURE__ */ jsxs("div", { class: "vt-row", children: [
      /* @__PURE__ */ jsx("div", { class: "vt-entity", children: isEditing && isDraft ? Select(entityState, getEntityOptions()) : current.entity.substring(0, 8) }),
      /* @__PURE__ */ jsx("div", { class: "vt-type", children: isEditing && isDraft ? Select(typeState, getValueTypeOptions()) : state.get().database.getValueType(current.type)?.description || current.type }),
      /* @__PURE__ */ jsx("div", { class: "vt-value", children: isEditing ? renderValueInput() : String(current.value) || /* @__PURE__ */ jsx("i", { children: "empty" }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          class: "vt-btn",
          onclick: () => {
            if (isEditing && isDraft && onDiscardDraft) {
              onDiscardDraft();
            }
            shouldEdit.set(!isEditing);
          },
          children: isEditing ? "Cancel" : "Edit"
        }
      ),
      saveDeleteButton
    ] });
  });
}

// src/web/components/value/Values.tsx
function Values() {
  const state = getAppState();
  const draftValue = createReactive(null);
  return reactiveComponent([state, draftValue], () => {
    const draft = draftValue.get();
    const valueTypes = state.get().database.getAllValueTypes();
    const firstValueType = valueTypes.length > 0 ? valueTypes[0].id : "";
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onclick: () => {
            const newDraftValue = {
              id: v7_default(),
              entity: v7_default(),
              type: firstValueType,
              value: "",
              timestamp: /* @__PURE__ */ new Date()
            };
            draftValue.set(newDraftValue);
          },
          children: "Add New Value"
        }
      ),
      /* @__PURE__ */ jsxs("div", { class: "vt-list", children: [
        draft && /* @__PURE__ */ jsx(
          ValueDisplay,
          {
            state,
            value: draft,
            isDraft: true,
            onSaveDraft: () => {
              draftValue.set(null);
            },
            onDiscardDraft: () => {
              draftValue.set(null);
            }
          }
        ),
        state.get().database.getAllValues().sort((a, b) => a.entity.localeCompare(b.entity)).map((val) => /* @__PURE__ */ jsx(ValueDisplay, { state, value: val }))
      ] })
    ] });
  });
}

// src/web/components/valuetype.ts
function deleteValueType(state, id) {
  const currentState = state.get();
  currentState.database.deleteValueType(id);
  state.notify();
}
function setValueType(state, updatedValueType) {
  const currentState = state.get();
  currentState.database.putValueType(updatedValueType);
  state.notify();
}

// src/web/components/valueType/ValueTypeDisplay.tsx
function ValueTypeDisplay({
  state,
  valueType,
  isDraft = false,
  onSaveDraft,
  onDiscardDraft
}) {
  const shouldEdit = createReactive(isDraft);
  const currentValueType = createReactive(valueType);
  const descriptionState = createReactive(valueType.description);
  const serdeState = createReactive(valueType.serde);
  shouldEdit.subscribe(() => {
    if (shouldEdit.get()) {
      const current = currentValueType.get();
      descriptionState.set(current.description);
      serdeState.set(current.serde);
    }
  });
  const serdeOptions = [
    { label: "string", value: "string" },
    { label: "number", value: "number" },
    { label: "boolean", value: "boolean" }
  ];
  const saveDeleteButton = /* @__PURE__ */ jsx(
    "button",
    {
      class: "vt-btn",
      disabled: shouldEdit.get() && descriptionState.get().trim().length === 0,
      onclick: () => {
        switch (shouldEdit.get()) {
          case true:
            shouldEdit.set(false);
            const updated = {
              ...currentValueType.get(),
              description: descriptionState.get(),
              serde: serdeState.get()
            };
            currentValueType.set(updated);
            setValueType(state, updated);
            if (isDraft && onSaveDraft) {
              onSaveDraft();
            }
            break;
          case false:
            deleteValueType(state, currentValueType.get().id);
            break;
        }
      },
      children: shouldEdit.get() ? "Save" : "Delete"
    }
  );
  descriptionState.subscribe(() => {
    const currentDesc = descriptionState.get();
    if (shouldEdit.get()) {
      const disabled = currentDesc.trim().length === 0;
      if (saveDeleteButton.disabled !== disabled) {
        saveDeleteButton.disabled = disabled;
      }
    }
  });
  shouldEdit.subscribe(() => {
    const label = shouldEdit.get() ? "Save" : "Delete";
    if (saveDeleteButton.innerText !== label) {
      saveDeleteButton.innerText = label;
    }
  });
  return reactiveComponent([state, shouldEdit], () => {
    const isEditing = shouldEdit.get();
    return /* @__PURE__ */ jsxs("div", { class: "vt-row", children: [
      /* @__PURE__ */ jsx("div", { class: "vt-serde", children: isEditing ? Select(serdeState, serdeOptions) : currentValueType.get().serde }),
      /* @__PURE__ */ jsx("div", { class: "vt-desc", children: isEditing ? InputText(descriptionState) : currentValueType.get().description }),
      /* @__PURE__ */ jsx(
        "button",
        {
          class: "vt-btn",
          onclick: () => {
            if (isEditing && isDraft && onDiscardDraft) {
              onDiscardDraft();
            }
            shouldEdit.set(!isEditing);
          },
          children: isEditing ? "Cancel" : "Edit"
        }
      ),
      saveDeleteButton
    ] });
  });
}

// src/web/components/valueType/ValueTypes.tsx
function ValueTypes() {
  const state = getAppState();
  const draftValueType = createReactive(null);
  return reactiveComponent([state, draftValueType], () => {
    const draft = draftValueType.get();
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onclick: () => {
            draftValueType.set({
              id: v7_default(),
              timestamp: /* @__PURE__ */ new Date(),
              description: "",
              serde: "string"
            });
          },
          children: "New Value Type"
        }
      ),
      /* @__PURE__ */ jsxs("div", { class: "vt-list", children: [
        draft && /* @__PURE__ */ jsx(
          ValueTypeDisplay,
          {
            state,
            valueType: draft,
            isDraft: true,
            onSaveDraft: () => {
              draftValueType.set(null);
            },
            onDiscardDraft: () => {
              draftValueType.set(null);
            }
          }
        ),
        state.get().database.getAllValueTypes().map((vt) => /* @__PURE__ */ jsx(ValueTypeDisplay, { state, valueType: vt }))
      ] })
    ] });
  });
}

// src/web/components/App.tsx
function App() {
  return /* @__PURE__ */ jsxs("div", { class: "portal", children: [
    /* @__PURE__ */ jsx("div", { children: "The Database of Everything" }),
    /* @__PURE__ */ jsx(Options, {}),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "20px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { flex: "1" }, children: [
        /* @__PURE__ */ jsx("h2", { children: "Value Types" }),
        /* @__PURE__ */ jsx(ValueTypes, {})
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { flex: "1" }, children: [
        /* @__PURE__ */ jsx("h2", { children: "Values" }),
        /* @__PURE__ */ jsx(Values, {})
      ] })
    ] })
  ] });
}

// src/web/app.tsx
var appRoot = document.getElementById("app");
if (!appRoot) {
  throw new Error("Could not find #app root element");
}
appRoot.replaceChildren(/* @__PURE__ */ jsx(App, {}));
