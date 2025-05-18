/* eslint-disable import/order */

// @ts-ignore
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

// @ts-ignore
import CssWorker from '../.build/css.worker.js';
// @ts-ignore
import EditorWorker from '../.build/editor.worker.js';
// @ts-ignore
import HtmlWorker from '../.build/html.worker.js';
// @ts-ignore
import JsonWorker from '../.build/json.worker.js';
// @ts-ignore
import TSWorker from '../.build/ts.worker.js';

// @ts-ignore
import css from '../.build/index.css';

export * from 'monaco-editor';

if (!(globalThis as any).MonacoEnvironment) {
    (globalThis as any).MonacoEnvironment = {
        getWorker(_: any, label: string) {
            if (label === 'json') {
                return JsonWorker();
            }

            if (label === 'css' || label === 'scss' || label === 'less') {
                return CssWorker();
            }

            if (label === 'html' || label === 'handlebars' || label === 'razor') {
                return HtmlWorker();
            }

            if (label === 'typescript' || label === 'javascript') {
                return TSWorker();
            }

            return EditorWorker();
        },
    };
}

export function loadCss(styleId = 'monaco-editor-styles', doc = document) {
    if (doc.getElementById(styleId)) {
        return;
    }

    const style = doc.createElement('style');

    style.id = styleId;
    style.textContent = css;

    doc.head.appendChild(style);
}

export { monaco };
