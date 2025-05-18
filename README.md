# monaco-esm

Made with ❤️ by [flexbe.ai](https://flexbe.ai/) team

[![monthly downloads](https://img.shields.io/npm/dm/monaco-esm)](https://www.npmjs.com/package/monaco-esm)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/monaco-esm.svg?style=flat)](https://www.npmjs.com/package/monaco-esm)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/kachurun/monaco-esm/pulls)

> A native ES module build of Monaco Editor — no bundlers, no AMD, no RequireJS. Just import and start coding.

Current Monaco version: <!-- monaco-editor-version -->`monaco-editor@^0.52.2`<!-- /monaco-editor-version -->

---

## Why this exists

Monaco Editor powers VS Code — but using it outside of that context is a headache. By default, it's distributed as an AMD module and requires `require.js` to load. Even community tools like `@monaco-editor/loader` rely on dynamic CDN scripts and require additional setup for workers and styles.

This package provides a modern ESM-friendly build of Monaco Editor that can be used directly in the browser or in any bundler without dealing with `require.js`, manual worker registration, or separate CSS files.

---

## What it does

- ✅ Native ES module build of Monaco Editor
- ✅ Bundles all workers and CSS using `esbuild`
- ✅ No external loader or config required
- ✅ Works in modern browsers and with any bundler
- ✅ Exports full Monaco API and TypeScript types

---

## Install

```bash
npm install monaco-esm
```

---

## Usage

### With a bundler (Vite, Webpack, Rollup, etc.)

```ts
import { monaco, loadCss } from 'monaco-esm';

loadCss(); // Inject Monaco Editor styles into the page

monaco.editor.create(document.getElementById('container'), {
  value: 'console.log("Hello, world!");',
  language: 'javascript'
});
```

---

### In the browser (no bundler)

```html
<script type="module">
  import { monaco, loadCss } from 'https://esm.sh/monaco-esm';

  loadCss();

  monaco.editor.create(document.getElementById('container'), {
    value: 'function hello(name = "world") {\n  console.log(`Hello ${name}!`);\n}',
    language: 'javascript'
  });
</script>
```

👉 [Live Example on CodeSandbox](https://codesandbox.io/p/sandbox/clever-sunset-7xcp4q)

---

## Why not use `@monaco-editor/loader`?

`@monaco-editor/loader` solves part of the problem — but it still:

- Loads Monaco via CDN
- Requires `require.js` (AMD)
- Needs custom worker setup
- Doesn't inject styles

`monaco-esm` removes all that friction:

- Native ES module build
- No CDN or AMD loader
- Workers included and auto-registered
- One-liner for CSS injection
- Cleaner setup and better compatibility

---

## API Overview

This package exports:

- `monaco`: Full Monaco Editor API
- `loadCss(styleId?, doc?)`: Injects Monaco's built-in CSS into the document
- Re-exports all types and APIs from `monaco-editor`

---

## TypeScript Support

You don't need to install `monaco-editor` separately. All types and APIs are re-exported:

```ts
import type { monaco, editor } from 'monaco-esm';

export type MonacoEditor = typeof monaco;
export type MonacoModel = editor.ITextModel;
```

---

## Entry Points

This package provides two standard Node-compatible entrypoints:

- `dist/index.mjs` — ESM build (used by modern bundlers and `type: module` projects)
- `dist/index.cjs` — CommonJS build (for Node.js environments)

By default, most tools will resolve the correct one automatically. You can also import explicitly if needed:

```ts
// ESM
import { monaco } from 'monaco-esm';

// CommonJS
const { monaco } = require('monaco-esm');
```

---

## Notes

### Electron

This package works well in Electron. If you're loading workers in a sandboxed context, you may need to configure security policies accordingly.

### Next.js

You can use `monaco-esm` in Next.js projects, but make sure to call `loadCss()` only on the client side (e.g., inside a `useEffect`).

---

## License

MIT — see [LICENSE](./LICENSE)
