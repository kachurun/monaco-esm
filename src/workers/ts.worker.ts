import { inlineWorker } from './_inlineWorker.ts';

// @ts-ignore
import TSWorker from '../../.build/ts.worker.js?raw';

export default function CreateWorker(appendCode?: string) {
    return inlineWorker('ts', TSWorker, appendCode);
}
