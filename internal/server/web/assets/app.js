// ../../../src/jsx/jsx-runtime/html.ts
var SVG_NS = "http://www.w3.org/2000/svg";
var SVG_ELEMENTS = {
  svg: "svg",
  path: "path",
  g: "g"
};

// ../../../src/jsx/jsx-runtime/index.ts
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

// ../../../src/web/components/App.tsx
function App() {
  return /* @__PURE__ */ jsx("div", { class: "portal", children: /* @__PURE__ */ jsx("div", { children: "The Database of Everything" }) });
}

// ../../../src/web/app.tsx
var appRoot = document.getElementById("app");
if (!appRoot) {
  throw new Error("Could not find #app root element");
}
appRoot.replaceChildren(/* @__PURE__ */ jsx(App, {}));
