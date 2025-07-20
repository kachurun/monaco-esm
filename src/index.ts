export * as monaco from 'monaco-editor';

// Main initialization function
export { initMonaco } from './core.ts';
export { loadCss } from './loadCss.ts';

// Worker factories - import only the ones you need to reduce bundle size
export { default as CssWorker } from './workers/css.worker.ts';
export { default as HtmlWorker } from './workers/html.worker.ts';
export { default as JsonWorker } from './workers/json.worker.ts';
export { default as TSWorker } from './workers/ts.worker.ts';
export { default as EditorWorker } from './workers/editor.worker.ts';

// Types
export * from './types.ts';
