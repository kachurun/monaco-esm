import { inlineWorker } from './_inlineWorker.ts';

// @ts-ignore
import CssWorker from '../../.build/css.worker.js?raw';

export default function CreateWorker(appendCode?: string) {
    return inlineWorker('css', CssWorker, appendCode);
}
