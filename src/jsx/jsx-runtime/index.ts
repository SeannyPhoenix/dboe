import { JSX, SVG_ELEMENTS, SVG_NS } from './html';
export type { JSX };
export interface ElementFactory {
  createElement(localName: string): HTMLElement;
  createElementNS(namespaceURI: string, qualifiedName: string): Element;
  createTextNode(data: string): Text;
  createFragment(): DocumentFragment;
}

let elementFactory: ElementFactory | null = null;

export function setElementFactory(factory: ElementFactory): void {
  elementFactory = factory;
}

export function getElementFactory(): ElementFactory {
  if (!elementFactory) {
    throw new Error('Element factory not set');
  }
  return elementFactory;
}

if ('document' in globalThis) {
  setElementFactory({
    createElement(localName: string): HTMLElement {
      return document.createElement(localName);
    },
    createElementNS(namespaceURI: string, qualifiedName: string): Element {
      return document.createElementNS(namespaceURI, qualifiedName);
    },
    createTextNode(data: string): Text {
      return document.createTextNode(data);
    },
    createFragment(): DocumentFragment {
      return document.createDocumentFragment();
    },
  });
}

export function Fragment(props: { children?: JSX.Children }): Node {
  const factory = getElementFactory();
  const fragment = factory.createFragment();
  appendChildren(fragment, props.children);
  return fragment;
}

function jsxElement(type: string, props: JSX.ComponentProps): Node {
  const factory = getElementFactory();
  const element =
    type in SVG_ELEMENTS ? factory.createElementNS(SVG_NS, type) : factory.createElement(type);
  for (const name in props) {
    const value = props[name];

    if (name === 'children') {
      appendChildren(element, value);
      continue;
    }

    if (name.startsWith('on') && typeof value === 'function') {
      const eventName = name.slice(2).toLowerCase() as keyof HTMLElementEventMap;
      element.addEventListener(eventName, value as EventListener);
      continue;
    }

    if (
      name === 'style' &&
      typeof value === 'object' &&
      (element instanceof HTMLElement ||
        element instanceof SVGElement ||
        element instanceof MathMLElement)
    ) {
      Object.assign(element.style, value);
      continue;
    }

    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      element.setAttribute(name, String(value));
    }
  }
  return element;
}

export type Type = keyof JSX.IntrinsicElements | JSX.Component;

export function jsx(type: Type, props: JSX.ComponentProps): JSX.Element {
  switch (typeof type) {
    case 'function':
      const component = type(props);
      return component ?? Fragment({});
    case 'string':
      return jsxElement(type, props);
    default:
      throw new Error(`Unsupported JSX type: ${String(type)}`);
  }
}

export const jsxs = jsx;

function appendChildren(parent: Node, children: unknown): void {
  if (children === null || children === undefined || children === false) {
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
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const textNode = factory.createTextNode(String(children));
  parent.appendChild(textNode);
}
