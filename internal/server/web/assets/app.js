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
    if (entry) {
      const tombstone = {
        id: entry.id,
        timestamp: /* @__PURE__ */ new Date()
      };
      this.data.history.push(tombstone);
    }
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
    if (entry) {
      const tombstone = {
        id: entry.id,
        timestamp: /* @__PURE__ */ new Date()
      };
      this.data.history.push(tombstone);
    }
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
      this.data = JSON.parse(data);
    }
  }
  save() {
    localStorage.setItem("database", JSON.stringify(this.data));
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

// src/web/components/appState.ts
function initAppState() {
  const stateData = {
    database: new Database()
  };
  const state = createReactive(stateData);
  state.subscribe(() => state.get().database.save());
  return state;
}

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

// src/web/components/value.ts
function newValue(state, { entity, type, value }) {
  if (!entity) {
    entity = v7_default();
  }
  const newVal = {
    id: v7_default(),
    timestamp: /* @__PURE__ */ new Date(),
    entity,
    type,
    value
  };
  const currentState = state.get();
  currentState.database.putValue(newVal);
  state.notify();
  return newVal;
}
function deleteValue(state, id) {
  const currentState = state.get();
  currentState.database.deleteValue(id);
  state.notify();
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
    if (name === "children") {
      appendChildren(element, value);
      continue;
    }
    if (name.startsWith("on") && typeof value === "function") {
      const eventName = name.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
      continue;
    }
    if (name === "style" && typeof value === "object" && (element instanceof HTMLElement || element instanceof SVGElement || element instanceof MathMLElement)) {
      Object.assign(element.style, value);
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

// src/web/components/value/Values.tsx
function Values({ state }) {
  return reactiveComponent([state], () => {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onclick: () => {
            newValue(state, { type: "01a072b6-0ffb-758b-a6d9-4c4f4336be8a", value: `item-${Date.now()}` });
          },
          children: "Add New Value"
        }
      ),
      /* @__PURE__ */ jsx("div", { children: state.get().database.getAllValues().map((item) => /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #ccc", padding: "10px", margin: "10px 0" }, children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Entity:" }),
          " ",
          item.entity
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Type:" }),
          " ",
          item.type
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Value:" }),
          " ",
          String(item.value)
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Timestamp:" }),
          " ",
          item.timestamp.toString()
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onclick: () => {
              deleteValue(state, item.id);
            },
            children: "Delete"
          }
        )
      ] })) })
    ] });
  });
}

// src/web/components/valuetype.ts
function newValueType(state) {
  const newVT = {
    id: v7_default(),
    description: "",
    serde: "string"
  };
  const currentState = state.get();
  currentState.database.putValueType(newVT);
  state.notify();
  return newVT;
}
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
function ValueTypeDisplay({ state, valueType }) {
  const shouldEdit = createReactive(false);
  const currentValueType = createReactive(valueType);
  const formState = createReactive({
    description: valueType.description,
    serde: valueType.serde
  });
  shouldEdit.subscribe(() => {
    if (shouldEdit.get()) {
      const current = currentValueType.get();
      formState.set({
        description: current.description,
        serde: current.serde
      });
    }
  });
  return reactiveComponent([state, shouldEdit], () => {
    const isEditing = shouldEdit.get();
    const { description, serde } = formState.get();
    return /* @__PURE__ */ jsxs("div", { class: "vt-row", children: [
      /* @__PURE__ */ jsx("div", { class: "vt-serde", children: isEditing ? (() => {
        const select = /* @__PURE__ */ jsxs(
          "select",
          {
            onchange: (e) => {
              formState.update((f) => ({
                ...f,
                serde: e.target.value
              }));
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: "string", children: "string" }),
              /* @__PURE__ */ jsx("option", { value: "number", children: "number" }),
              /* @__PURE__ */ jsx("option", { value: "boolean", children: "boolean" })
            ]
          }
        );
        select.value = serde;
        return select;
      })() : currentValueType.get().serde }),
      /* @__PURE__ */ jsx("div", { class: "vt-desc", children: isEditing ? /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: description,
          placeholder: "Description",
          oninput: (e) => {
            formState.update((f) => ({
              ...f,
              description: e.target.value
            }));
          }
        }
      ) : currentValueType.get().description }),
      isEditing ? /* @__PURE__ */ jsx(
        "button",
        {
          class: "vt-btn",
          onclick: () => {
            shouldEdit.set(false);
          },
          children: "Cancel"
        }
      ) : /* @__PURE__ */ jsx(
        "button",
        {
          class: "vt-btn",
          onclick: () => {
            shouldEdit.set(true);
          },
          children: "Edit"
        }
      ),
      isEditing ? /* @__PURE__ */ jsx(
        "button",
        {
          class: "vt-btn",
          onclick: () => {
            shouldEdit.set(false);
            const formValues = formState.get();
            currentValueType.set({
              ...currentValueType.get(),
              ...formValues
            });
            setValueType(state, currentValueType.get());
          },
          children: "Save"
        }
      ) : /* @__PURE__ */ jsx(
        "button",
        {
          class: "vt-btn",
          onclick: () => {
            deleteValueType(state, currentValueType.get().id);
          },
          children: "Delete"
        }
      )
    ] });
  });
}

// src/web/components/valueType/ValueTypes.tsx
function ValueTypes({ state }) {
  return reactiveComponent([state], () => {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onclick: () => {
            newValueType(state);
          },
          children: "New Value Type"
        }
      ),
      /* @__PURE__ */ jsx("div", { class: "vt-list", children: state.get().database.getAllValueTypes().map((vt) => /* @__PURE__ */ jsx(ValueTypeDisplay, { state, valueType: vt })) })
    ] });
  });
}

// src/web/components/App.tsx
function App() {
  const state = initAppState();
  return /* @__PURE__ */ jsxs("div", { class: "portal", children: [
    /* @__PURE__ */ jsx("div", { children: "The Database of Everything V3" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "20px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { flex: "1" }, children: [
        /* @__PURE__ */ jsx("h2", { children: "Value Types" }),
        /* @__PURE__ */ jsx(ValueTypes, { state })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { flex: "1" }, children: [
        /* @__PURE__ */ jsx("h2", { children: "Values" }),
        /* @__PURE__ */ jsx(Values, { state })
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
