import { createWorkerFactory } from './_createWorkerFactory.ts';
// @ts-ignore
import htmlWorkerCode from '../../.build/html.worker.js?raw';

const htmlWorker = createWorkerFactory(htmlWorkerCode);

export {
    htmlWorker,
    htmlWorker as default,
};
