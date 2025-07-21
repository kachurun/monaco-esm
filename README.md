# monaco-esm

Made with ❤️ by [flexbe.ai](https://flexbe.ai/) team

[![monthly downloads](https://img.shields.io/npm/dm/monaco-esm)](https://www.npmjs.com/package/monaco-esm)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/monaco-esm.svg?style=flat)](https://www.npmjs.com/package/monaco-esm)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/kachurun/monaco-esm/pulls)

> A native ES module build of Monaco Editor — no bundlers, no AMD, no RequireJS. Just import and start coding.

---

## Why this exists

Monaco Editor powers VS Code — but using it outside of that context is a headache. By default, it's distributed as an AMD module and requires `require.js` to load. Even community tools like `@monaco-editor/loader` rely on dynamic CDN scripts and require additional setup for workers and styles.

This package provides a modern ESM-friendly build of Monaco Editor that can be used directly in the browser or in any bundler without dealing with `require.js`, manual worker registration, or separate CSS files.

---

## What it does

- ✅ Native ES module build of Monaco Editor
- ✅ Bundles all workers and CSS
- ✅ No external loader or config required
- ✅ Works in modern browsers and with any bundler
- ✅ Exports full Monaco API and TypeScript types

---

## Install

```bash
npm install monaco-esm monaco-editor
```

---

## Usage

### Basic Setup with Bundler (Vite, Webpack, Rollup, etc.)

```ts
import { monaco, loadCss } from 'monaco-esm';
import { initMonaco } from 'monaco-esm';
import editorWorker from 'monaco-esm/workers/editor';
import htmlWorker from 'monaco-esm/workers/html';
import cssWorker from 'monaco-esm/workers/css';
import typescriptWorker from 'monaco-esm/workers/typescript';
import jsonWorker from 'monaco-esm/workers/json';

// Note: add only workers that you need (e.g js/ts worker is pretty heavy so if you going to use only html/css/json, you don't need to add it)
initMonaco({
    workers: {
        editor: editorWorker,
        html: htmlWorker,
        css: cssWorker,
        typescript: typescriptWorker,
        json: jsonWorker,
    },
});

// Use this to inject styles into the page if you're not using bundler that support css bundling (like Vite)
loadCss();

monaco.editor.create(document.getElementById('container'), {
  value: 'console.log("Hello, world!");',
  language: 'javascript'
});
```

**Note**: If you're using a bundler that supports CSS bundling (like Vite), you don't need to call `loadCss()`. Otherwise, call it to inject styles into the page.

### Using Custom Workers with Vite

#### You can import workers from monaco-editor directly:

```ts
import { initMonaco } from 'monaco-esm';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';

initMonaco({
    workers: {
        editor: EditorWorker,
    },
});
```

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

👉 [Live Example on CodeSandbox](https://codesandbox.io/p/sandbox/damp-hooks-7xcp4q)

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
- `initMonaco(options?)`: Initialize Monaco with custom configuration (called automatically on import)
- Re-exports all types and APIs from `monaco-editor`

---

## TypeScript Support

Both `monaco-esm` and `monaco-editor` provide full TypeScript support. All types and APIs are re-exported:

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

## Framework-Specific Notes

### Electron

This package works well in Electron. If you're loading workers in a sandboxed context, you may need to configure security policies accordingly.

### Next.js

You can use `monaco-esm` in Next.js projects, but make sure to call `loadCss()` only on the client side (e.g., inside a `useEffect`).

### Vite

When using Vite, you have two options for handling workers:

1. Import workers directly from `monaco-editor` (see example above)
2. Use the prebundled workers from `monaco-esm/workers`

---

## Advanced: `initMonaco` Customization

The `initMonaco` method is called automatically when you import this package, so you usually **do not need to call it yourself**. However, you can call it manually to customize Monaco's worker setup and TypeScript language service behavior.

### Why customize?

You might want to:

- Provide your own `getWorker` method to control how Monaco spawns web workers
- Specify a `customTSWorkerPath` to load a custom TypeScript worker script (must export a `customTSWorkerFactory`)
- Directly provide a `customTSWorkerFactory` function to extend or override the TypeScript language service worker

### Usage

```ts
import { initMonaco } from 'monaco-esm';

// 1. Provide your own getWorker method
initMonaco({
  getWorker: (workerId, label) => {
    // Return a custom Worker instance
    if (label === 'my-custom-language') {
      return new Worker(...);
    }
    // ...handle other labels
  },
});

// 2. Specify a custom TypeScript worker path
//    This must set a `self.customTSWorkerFactory` function
initMonaco({
  customTSWorkerPath: '/my-custom-ts-worker.js',
});

// 3. Extend the TypeScript language service with a custom factory
initMonaco({
  // NOTE: This function will be stringified and passed to the worker, so you can't use closures here
  customTSWorkerFactory: (TSWorkerClass, tsc, libs) => {
    class CustomTSWorker extends TSWorkerClass {
      constructor(ctx, createData) {
        super(ctx, createData);
        // Your custom logic here
      }
    }
    return CustomTSWorker;
  },
});
```

- If you use `customTSWorkerFactory`, you can extend Monaco's TypeScript language service worker. See the [original tsWorker implementation](https://raw.githubusercontent.com/microsoft/monaco-editor/refs/heads/main/src/language/typescript/tsWorker.ts) for what you can override or extend.
- If you use `customTSWorkerPath`, the file must assign a `customTSWorkerFactory` function to `self`.

**Note:** These options are advanced and only needed for deep customization. For most users, the default setup is sufficient.

---

## License

MIT — see [LICENSE](./LICENSE)
