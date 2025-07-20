# Monaco ESM Worker Usage Examples

This library now supports optional worker loading to reduce bundle size. Only import and load the workers you actually need.

## Basic Usage (Editor only)

```typescript
import { initMonaco } from 'monaco-esm';

// Initialize with just the basic editor worker (smallest bundle)
initMonaco();
```

## With TypeScript/JavaScript Support

```typescript
import { initMonaco, TSWorker } from 'monaco-esm';

initMonaco({
  workers: {
    typescript: TSWorker
  }
});
```

## With JSON Support

```typescript
import { initMonaco, JsonWorker } from 'monaco-esm';

initMonaco({
  workers: {
    json: JsonWorker
  }
});
```

## With CSS/SCSS/LESS Support

```typescript
import { initMonaco, CssWorker } from 'monaco-esm';

initMonaco({
  workers: {
    css: CssWorker
  }
});
```

## With HTML/Handlebars/Razor Support

```typescript
import { initMonaco, HtmlWorker } from 'monaco-esm';

initMonaco({
  workers: {
    html: HtmlWorker
  }
});
```

## With Multiple Workers

```typescript
import {
  initMonaco,
  TSWorker,
  JsonWorker,
  CssWorker,
  HtmlWorker
} from 'monaco-esm';

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
import { initMonaco, TSWorker } from 'monaco-esm';

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
- **+ TypeScript**: ~12MB (adds ts.worker.js)
- **+ JSON**: ~836KB (adds json.worker.js)
- **+ CSS**: ~1.8MB (adds css.worker.js)
- **+ HTML**: ~1.2MB (adds html.worker.js)

Choose only the workers you need to keep your bundle size optimal!
