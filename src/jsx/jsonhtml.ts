import { JSX } from './jsx-runtime/html';

type IntrinsicElements = JSX.IntrinsicElements;

type JSONChildren = JSONElement | string;

type JSONAttributes<K extends keyof IntrinsicElements> = Omit<IntrinsicElements[K], 'children'> & {
  children?: JSONChildren | JSONChildren[] | string;
};

export type JSONElement<K extends keyof IntrinsicElements = keyof IntrinsicElements> = {
  [T in K]?: JSONAttributes<T> | JSONElement[] | string;
};

const shell: JSONElement = {
  html: {
    lang: 'en',
    children: [
      {
        head: [
          { title: 'GTFS Explorer' },
          { meta: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
          { link: { rel: 'stylesheet', href: '/app.css' } },
          { link: { rel: 'icon', type: 'image/svg+xml', href: '/gtfs.svg' } },
          { script: { type: 'module', src: '/app.js' } },
        ],
        body: [{ progress: { class: 'async-progress', value: 10, max: 100 } }],
      },
    ],
  },
};

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const RAW_ELEMENTS = new Set(['script', 'style', 'textarea', 'title']);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class JSONTag {
  name: keyof JSONElement;
  attributes: Map<string, string>;
  children: (JSONTag | string)[];

  constructor(element: JSONElement) {
    const keys = Object.keys(element);
    if (keys.length !== 1) {
      throw new Error(`Invalid JSONElement: ${JSON.stringify(element)}`);
    }
    this.name = keys[0] as keyof JSONElement;
    const attributes: Map<string, string> = new Map();
    const children: (JSONTag | string)[] = [];
    const value = element[this.name];
    if (typeof value === 'string') {
      children.push(value);
    } else if (Array.isArray(value)) {
      for (const child of value) {
        if (typeof child === 'string') {
          children.push(child);
        } else {
          children.push(new JSONTag(child));
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, val] of Object.entries(value)) {
        if (key === 'children') {
          if (typeof val === 'string') {
            children.push(val);
          } else if (Array.isArray(val)) {
            for (const child of val) {
              if (typeof child === 'string') {
                children.push(child);
              } else {
                children.push(new JSONTag(child));
              }
            }
          } else if (typeof val === 'object' && val !== null) {
            children.push(new JSONTag(val));
          }
        } else {
          attributes.set(key, String(val));
        }
      }
    }
    this.attributes = attributes;
    this.children = children;
  }

  render(): string {
    let html = `<${this.name}`;
    for (const [key, value] of this.attributes) {
      html += ` ${key}="${escapeHtml(value)}"`;
    }
    html += '>\n';

    if (RAW_ELEMENTS.has(this.name as string)) {
      for (const child of this.children) {
        html += child as string;
      }
      html += `</${this.name}>\n`;
    } else if (!VOID_ELEMENTS.has(this.name as string)) {
      for (const child of this.children) {
        if (typeof child === 'string') {
          html += escapeHtml(child);
        } else {
          html += child.render();
        }
      }
      html += `</${this.name}>\n`;
    }
    return html;
  }

  static getShell(): JSONTag {
    return new JSONTag(shell);
  }
}
