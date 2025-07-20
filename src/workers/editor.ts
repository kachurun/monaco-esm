import { createWorkerFactory } from './_createWorkerFactory.ts';
// @ts-ignore
import editorWorkerCode from '../../.build/editor.worker.js?raw';

const editorWorker = createWorkerFactory(editorWorkerCode);

export {
    editorWorker,
    editorWorker as default,
};
