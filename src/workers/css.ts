import { createWorkerFactory } from './_createWorkerFactory.ts';
// @ts-ignore
import cssWorkerCode from '../../.build/css.worker.js?raw';

const cssWorker = createWorkerFactory(cssWorkerCode);

export {
    cssWorker,
    cssWorker as default,
};
