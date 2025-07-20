import { inlineWorker } from './_inlineWorker.ts';

// @ts-ignore
import HtmlWorker from '../../.build/html.worker.js?raw';

export default function CreateWorker(appendCode?: string) {
    return inlineWorker('html', HtmlWorker, appendCode);
}
