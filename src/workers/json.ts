import { createWorkerFactory } from './_createWorkerFactory.ts';
// @ts-ignore
import jsonWorkerCode from '../../.build/json.worker.js?raw';

const jsonWorker = createWorkerFactory(jsonWorkerCode);

export {
    jsonWorker,
    jsonWorker as default,
};
