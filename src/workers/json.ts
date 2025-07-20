import { inlineWorker } from './_inlineWorker.ts';

// @ts-ignore
import JsonWorker from '../../.build/json.worker.js?raw';

export default function CreateWorker(appendCode?: string) {
    return inlineWorker('json', JsonWorker, appendCode);
}
