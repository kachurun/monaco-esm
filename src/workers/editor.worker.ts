import { inlineWorker } from './_inlineWorker.ts';

// @ts-ignore
import EditorWorker from '../../.build/editor.worker.js?raw';

export default function CreateWorker(appendCode?: string) {
    return inlineWorker('editor', EditorWorker, appendCode);
}
