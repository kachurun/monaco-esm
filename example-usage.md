# Monaco ESM Worker Usage Examples

This library now supports optional worker loading to reduce bundle size. Only import and load the workers you actually need using clean, separate entry points.

## Basic Usage (Editor only)

```typescript
import { initMonaco } from 'monaco-esm';

// Initialize with just the basic editor worker (smallest bundle)
initMonaco();
```

## With TypeScript/JavaScript Support

```typescript
import { initMonaco } from 'monaco-esm';
import TSWorker from 'monaco-esm/workers/typescript';

initMonaco({
  workers: {
    typescript: TSWorker
  }
});
```

## With JSON Support

```typescript
import { initMonaco } from 'monaco-esm';
import JsonWorker from 'monaco-esm/workers/json';

initMonaco({
  workers: {
    json: JsonWorker
  }
});
```

## With CSS/SCSS/LESS Support

```typescript
import { initMonaco } from 'monaco-esm';
import CssWorker from 'monaco-esm/workers/css';

initMonaco({
  workers: {
    css: CssWorker
  }
});
```

## With HTML/Handlebars/Razor Support

```typescript
import { initMonaco } from 'monaco-esm';
import HtmlWorker from 'monaco-esm/workers/html';

initMonaco({
  workers: {
    html: HtmlWorker
  }
});
```

## With Multiple Workers

```typescript
import { initMonaco } from 'monaco-esm';
import TSWorker from 'monaco-esm/workers/typescript';
import JsonWorker from 'monaco-esm/workers/json';
import CssWorker from 'monaco-esm/workers/css';
import HtmlWorker from 'monaco-esm/workers/html';

initMonaco({
  workers: {
    typescript: TSWorker,
    json: JsonWorker,
    css: CssWorker,
    html: HtmlWorker
  }
});
```

## With Custom TypeScript Worker

```typescript
import { initMonaco } from 'monaco-esm';
import TSWorker from 'monaco-esm/workers/typescript';

initMonaco({
  customTSWorkerFactory: (TSWorkerClass, tsc, libs) => {
    // Your custom TypeScript worker logic
    return TSWorkerClass;
  },
  workers: {
    typescript: TSWorker
  }
});
```

## Bundle Size Impact

- **Editor only**: ~543KB (just editor.worker.js)
- **+ TypeScript**: ~12MB (adds ts.worker.js via separate import)
- **+ JSON**: ~836KB (adds json.worker.js via separate import)
- **+ CSS**: ~1.8MB (adds css.worker.js via separate import)
- **+ HTML**: ~1.2MB (adds html.worker.js via separate import)

## Tree Shaking Benefits

With clean separate entry points, bundlers can now:

- Only include workers you actually import
- Eliminate unused worker code completely
- Provide better code splitting opportunities
- Allow dynamic imports for on-demand worker loading

```typescript
// Dynamic import example
const loadTypeScriptSupport = async () => {
  const { default: TSWorker } = await import('monaco-esm/workers/typescript');

  initMonaco({
    workers: {
      typescript: TSWorker
    }
  });
};
```

## Clean Architecture

Each worker is now a direct entry point:

- `monaco-esm/workers/css` - CSS/SCSS/LESS support
- `monaco-esm/workers/html` - HTML/Handlebars/Razor support
- `monaco-esm/workers/json` - JSON support
- `monaco-esm/workers/typescript` - TypeScript/JavaScript support
- `monaco-esm/workers/editor` - Basic editor functionality

No more `.worker` suffixes or redundant re-exports - just clean, simple imports!

Choose only the workers you need to keep your bundle size optimal!
