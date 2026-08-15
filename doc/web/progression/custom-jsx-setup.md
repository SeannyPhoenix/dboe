# Custom JSX Runtime Setup for a Different TypeScript Repo

This guide is intended for another AI agent to apply in a different TypeScript repository.

Assumption:

- The custom JSX runtime source code has already been copied into the target repo.

Goal:

- Make TSX compile using your custom runtime instead of React.

## 1. Choose a stable import source prefix

Pick one package import prefix (example used below):

- #client

Your JSX runtime entry should be addressable as:

- #client/jsx-runtime

## 2. Map the import source in package.json

Add an imports map in package.json so runtime resolution knows where #client/jsx-runtime points.

```json
{
  "type": "module",
  "imports": {
    "#client/jsx-runtime": "./web/jsx/jsx-runtime/index.js"
  }
}
```

Notes:

- Path must point to emitted JS, not TS source.
- If your runtime lives elsewhere, adjust the right-hand side.

## 3. Ensure TS module resolution supports package import maps

In the tsconfig used by your app package (or a shared base), set moduleResolution to bundler.

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ESNext"
  }
}
```

## 4. Enable automatic JSX runtime mode in the TSX project

In the tsconfig that compiles your TSX files:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "#client"
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

Why this works:

- jsx: react-jsx tells TypeScript to emit runtime calls.
- jsxImportSource: #client tells TypeScript to import runtime helpers from #client/jsx-runtime.

## 5. Verify runtime entry exports the required symbols

Your runtime module at #client/jsx-runtime must export:

- jsx
- jsxs
- Fragment

Minimal shape:

```ts
export function jsx(type: unknown, props: Record<string, unknown>): Node {
  // create element/component result
  throw new Error('implement');
}

export const jsxs = jsx;

export function Fragment(props: { children?: unknown }): Node {
  // build and return fragment
  throw new Error('implement');
}
```

## 6. Verify the JSX type namespace is exported

TypeScript type-checking expects a JSX namespace for intrinsic elements and element type.

If your runtime keeps JSX types in a separate file, re-export them from the runtime entry.

Example:

```ts
import { JSX } from './html';
export type { JSX };
```

At minimum, define:

- JSX.Element
- JSX.IntrinsicElements

Without this, TSX will usually fail with intrinsic element typing errors.

## 7. If using project references, wire the JSX package into the TSX package

If the target repo uses TS project references, add a reference from the TSX project to the JSX runtime project.

```json
{
  "references": [{ "path": "../jsx" }]
}
```

This keeps declaration generation and type-check order stable in composite builds.

## 8. Optional but recommended: direct type imports in components

In TSX files, importing the JSX type can make signatures explicit:

```ts
import { JSX } from "#client/jsx-runtime";

export function MyView(): JSX.Element {
  return <div>Hello</div>;
}
```

## 9. Smoke test

Create a quick TSX file and run the repository type check/build command.

Example component:

```tsx
import { JSX } from '#client/jsx-runtime';

export function Smoke(): JSX.Element {
  return (
    <>
      <h1>ok</h1>
      <button onClick={() => console.log('clicked')}>Run</button>
    </>
  );
}
```

Success criteria:

- No Cannot find module '#client/jsx-runtime' error.
- No JSX namespace / IntrinsicElements typing errors.
- Emitted JS imports helpers from #client/jsx-runtime.

## 10. Troubleshooting quick map

Error: Cannot find module #client/jsx-runtime

- Fix package.json imports mapping.
- Ensure moduleResolution is bundler.
- Ensure path points to emitted JS location.

Error: JSX element implicitly has type any because no interface JSX.IntrinsicElements exists

- Export a JSX namespace from runtime types.
- Ensure TSX project can see those types.

Error: Fragment is not defined in JSX runtime

- Export Fragment from #client/jsx-runtime.

Error: jsx/jsxs not found

- Export both jsx and jsxs.

Event handlers or style props behave unexpectedly at runtime

- Confirm your runtime implementation handles:
  - props.children
  - onXxx event props
  - style object assignment

## Copy checklist for another AI

Apply these changes in order:

1. Add package.json imports alias for #client/jsx-runtime.
2. Set moduleResolution to bundler in the active tsconfig chain.
3. Set jsx to react-jsx and jsxImportSource to #client in the TSX tsconfig.
4. Confirm runtime exports jsx, jsxs, Fragment, and JSX types.
5. Add project reference linkage if using composite references.
6. Run type-check and verify no JSX/runtime resolution errors.
