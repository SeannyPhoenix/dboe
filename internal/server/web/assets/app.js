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

// src/web/components/state.ts
var defaultState = {
  items: [],
  valuetypes: []
};
function initState() {
  const savedState = loadState();
  const state = createReactive({ ...defaultState, ...savedState });
  state.subscribe(() => {
    persistState(state.get());
  });
  return state;
}
function loadState() {
  const data = localStorage.getItem("appState");
  return data ? JSON.parse(data) : {};
}
function persistState(state) {
  localStorage.setItem("appState", JSON.stringify(state));
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
  currentState.items.push(newVal);
  state.notify();
  return newVal;
}
function deleteValue(state, index) {
  const currentState = state.get();
  currentState.items.splice(index, 1);
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
            newValue(state, { type: v7_default(), value: `item-${Date.now()}` });
          },
          children: "Add New Value"
        }
      ),
      /* @__PURE__ */ jsx("div", { children: state.get().items.map((item, index) => /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #ccc", padding: "10px", margin: "10px 0" }, children: [
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
              deleteValue(state, index);
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
  currentState.valuetypes.push(newVT);
  state.notify();
  return newVT;
}
function deleteValueType(state, id) {
  const currentState = state.get();
  const index = currentState.valuetypes.findIndex((vt) => vt.id === id);
  if (index !== -1) {
    currentState.valuetypes.splice(index, 1);
    state.notify();
  }
}
function setValueType(state, updatedValueType) {
  const currentState = state.get();
  const index = currentState.valuetypes.findIndex((vt) => vt.id === updatedValueType.id);
  if (index !== -1) {
    currentState.valuetypes[index] = updatedValueType;
    state.notify();
  }
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
      /* @__PURE__ */ jsx("div", { class: "vt-list", children: state.get().valuetypes.map((vt) => /* @__PURE__ */ jsx(ValueTypeDisplay, { state, valueType: vt })) })
    ] });
  });
}

// src/web/components/App.tsx
function App() {
  const state = initState();
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
