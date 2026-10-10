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

// src/web/components/Menu.tsx
function Menu({ portal, x, y }) {
  const existing = document.getElementById("meta-menu");
  if (existing) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { id: "meta-menu", style: { left: `${x}px`, top: `${y}px` }, class: "surface", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onclick: (event) => {
          console.log("Make New Entity");
          const menu = document.getElementById("meta-menu");
          if (menu) {
            portal.removeChild(menu);
          }
        },
        children: "+"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onclick: (event) => {
          console.log("Open Search Screen");
          const menu = document.getElementById("meta-menu");
          if (menu) {
            portal.removeChild(menu);
          }
        },
        children: "*"
      }
    )
  ] });
}

// src/web/ui/ui.tsx
function updateMouseState(mouse, event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.buttons = event.buttons;
}
async function initInputController(portal) {
  console.log("Initializing input control");
  const inputState = {
    mouse: {
      x: 0,
      y: 0,
      buttons: 0
    },
    keys: /* @__PURE__ */ new Set()
  };
  portal.onmousemove = (event) => {
    updateMouseState(inputState.mouse, event);
  };
  portal.onmousedown = (event) => {
    updateMouseState(inputState.mouse, event);
    if (inputState.keys.has("Meta")) {
      const { x, y } = inputState.mouse;
      const menu = /* @__PURE__ */ jsx(Menu, { portal, x, y });
      if (menu) {
        portal.appendChild(menu);
      }
    }
  };
  portal.onmouseup = (event) => {
    updateMouseState(inputState.mouse, event);
  };
  portal.oncontextmenu = (event) => {
    updateMouseState(inputState.mouse, event);
    event.preventDefault();
    const { x, y } = inputState.mouse;
    const menu = /* @__PURE__ */ jsx(Menu, { portal, x, y });
    if (menu) {
      portal.appendChild(menu);
    }
  };
  portal.onkeydown = (event) => {
    inputState.keys.add(event.key);
    if (inputState.keys.has("Escape")) {
      const menu = document.getElementById("meta-menu");
      if (menu) {
        portal.removeChild(menu);
      }
    }
  };
  portal.onkeyup = (event) => {
    inputState.keys.delete(event.key);
  };
  return inputState;
}

// src/web/portal/portal.tsx
var portals = /* @__PURE__ */ new Map();
async function initializePortal(portal) {
  const { id } = portal;
  console.log("Initializing portal with ID:", id);
  const sharedWorkerPromise = initSharedWorker(portal);
  const inputControlPromise = initInputController(portal);
  try {
    await Promise.all([sharedWorkerPromise, inputControlPromise]);
    const sharedWorker = await sharedWorkerPromise;
    if (!sharedWorker) {
      console.error("Failed to initialize shared worker");
      return;
    }
    const inputControl = await inputControlPromise;
    if (sharedWorker && inputControl) {
      portals.set(id, {
        sharedWorker,
        element: portal,
        inputControl
      });
    }
  } catch (error) {
    console.error("Error initializing portal:", error);
  }
}
async function initSharedWorker(portal) {
  console.log("Initializing shared worker");
  const worker = new SharedWorker("dboe.shared.js", { type: "module", name: portal.id });
  return worker;
}
function removePortal(id) {
  const portal = portals.get(id);
  if (!portal) {
    throw new Error(`No portal found with ID: ${id}`);
  }
  portal.sharedWorker.port.close();
  portals.delete(id);
  console.log("Portal removed with ID:", id);
}
function startPortal(id) {
  const portal = portals.get(id);
  if (!portal) {
    throw new Error(`No portal found with ID: ${id}`);
  }
  const { port } = portal.sharedWorker;
  port.onmessage = (event) => {
    console.log(event.data);
  };
  port.start();
  const initRequest = { name: "start", data: null };
  const timeRequest = { name: "time", data: null };
  port.postMessage(initRequest);
  port.postMessage(timeRequest);
  console.log("Portal started with ID:", id);
}

// src/web/portal/DBOEPortalElement.ts
var DBOEPortalElement = class extends HTMLElement {
  id = v7_default();
  constructor() {
    super();
    this.setAttribute("tabindex", "0");
  }
  async connectedCallback() {
    try {
      await initializePortal(this);
      startPortal(this.id);
    } catch (error) {
      throw new Error("Error connecting portal element", { cause: error });
    }
  }
  disconnectedCallback() {
    removePortal(this.id);
  }
};

// src/web/app.tsx
customElements.define("dboe-portal", DBOEPortalElement);
