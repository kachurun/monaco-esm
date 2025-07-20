import { createWorkerFactory } from './_createWorkerFactory.ts';
// @ts-ignore
import typescriptWorkerCode from '../../.build/ts.worker.js?raw';

const typescriptWorker = createWorkerFactory(typescriptWorkerCode);

export {
    typescriptWorker,
    typescriptWorker as default,
};
