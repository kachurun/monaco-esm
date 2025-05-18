# monaco-esm &middot; [![monthly downloads](https://img.shields.io/npm/dm/monaco-esm)](https://www.npmjs.com/package/monaco-esm) [![gitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![npm version](https://img.shields.io/npm/v/monaco-esm.svg?style=flat)](https://www.npmjs.com/package/monaco-esm) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-username/monaco-esm/pulls)

Current Monaco Editor version: <!-- monaco-editor-version -->`monaco-editor@^0.52.2`<!-- /monaco-editor-version -->

The utility to easily set up `monaco-editor` as native ES modules in your browser, without bundlers, css files and workers.

## Synopsis

Configure and use Monaco Editor directly in the browser via native ES modules, without needing to use webpack or any other module bundler.

## Motivation

Monaco Editor is a powerful code editor, but its default distribution is AMD-based and requires bundler configuration for integration. Even with packages like `@monaco-editor/loader`, you still depend on a clunky CDN and it loads `requirejs`, which can lead to weird problems with your app. This project provides a way to use Monaco Editor as ES modules, making it easy to integrate into modern web projects, including those using native ESM, Vite, or no build step at all.

## How it works

This project provides a pre-built, ESM-compatible version of Monaco Editor. You can import and use Monaco directly in your browser or ESM-based project, with no extra configuration. The build process uses esbuild to bundle Monaco Editor, its workers, and CSS as ESM modules. The utilities `loadCss` and `initMonacoEditor` handle CSS injection and worker setup for you.

## Documentation

#### Contents

- [Installation](#installation)
- [Introduction](#introduction)
- [Usage](#usage)
  - [In the Browser (No Bundler)](#in-the-browser-no-bundler)
  - [In Your ESM Project](#in-your-esm-project)
- [How it Works](#how-it-works)
- [Notes](#notes)
  - [For `electron` users](#for-electron-users)
  - [For `Next.js` users](#for-nextjs-users)
- [Entrypoints](#entrypoints)

### Installation

```bash
npm install monaco-esm
```

### Introduction

This package provides ESM builds of Monaco Editor. You can import the editor and languages directly as ES modules. The main utilities are:

- `loadCss(styleId = 'monaco-editor-styles', doc = document)`: Injects Monaco Editor's CSS into the page.
- `initMonacoEditor()`: Sets up Monaco's web workers and returns the Monaco API.

### Usage

#### In the Browser (No Bundler)

You can use Monaco Editor directly in the browser with native ES modules.

Example:

```html
<script type="module">
  import { loadCss, initMonacoEditor } from 'https://esm.sh/monaco-esm';

  loadCss();
  const monaco = initMonacoEditor();

  monaco.editor.create(document.getElementById('container'), {
    value: [
      'function hello(name: string = "world") {',
      '\tconsole.log(`Hello ${name}!`);',
      '}'
    ].join('\n'),
    language: 'typescript'
  });
</script>
```

[Live Example on CodeSandbox](https://codesandbox.io/p/sandbox/clever-sunset-7xcp4q)

#### Or if you bundle your project with Vite/Webpack/Rollup/Esbuild/etc:

```js
import { loadCss, initMonacoEditor } from 'monaco-esm';

await loadCss();
const monaco = await initMonacoEditor();

monaco.editor.create(document.getElementById('container'), {
  value: [
    'function hello(name: string = "world") {',
    '\tconsole.log(`Hello ${name}!`);',
    '}'
  ].join('\n'),
  language: 'typescript'
});
```

## Entrypoints

This package provides two entrypoints, configured in `package.json`:

- **module**: Points to the ESM entry (`dist/esm.js`). Most modern bundlers and native ESM environments will resolve `import { ... } from 'monaco-esm'` to this file.
- **browser**: Points to the statically bundled ESM file (`dist/bundle.js`). Some tools/environments (like certain bundlers or browser-focused setups) may resolve `import { ... } from 'monaco-esm/browser'` to this file.

**You should import from `monaco-esm` directly:**

```js
import { loadCss, initMonacoEditor } from 'monaco-esm';
```

or, if your environment supports the `browser` field and you specifically want the bundle:

```js
import { loadCss, initMonacoEditor } from 'monaco-esm/browser';
```

## License

[MIT](./LICENSE)
