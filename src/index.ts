/* eslint-disable import/order */
// @ts-ignore
import * as monaco from 'monaco-editor';

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

import type { CustomTSWebWorkerFactory } from './types.ts';

type InitMonacoOptions = {
    customTSWorkerPath?: string;
    customTSWorkerFactory?: CustomTSWebWorkerFactory;
    getWorker?: (workerId: string, label: string) => Promise<Worker> | Worker;
};

const setTSWorkerOptions = (options: monaco.languages.typescript.WorkerOptions) => {
    const ts = monaco.languages.typescript;
    ts.javascriptDefaults.setWorkerOptions(options);
    ts.typescriptDefaults.setWorkerOptions(options);
};

export function initMonaco(options: InitMonacoOptions = {}) {
    let extendTSWorkerCode = '';

    if (options.customTSWorkerFactory) {
        extendTSWorkerCode = [
            // We need this to prevent self.importScripts(createData.customWorkerPath)
            'self.importScripts = () => null;',
            `self.customTSWorkerFactory = ${ options.customTSWorkerFactory.toString() };`,
        ].join('\n');

        setTSWorkerOptions({ customWorkerPath: 'data:,' });
    }
    else if (options.customTSWorkerPath) {
        setTSWorkerOptions({ customWorkerPath: options.customTSWorkerPath });
    }

    (globalThis as any).MonacoEnvironment = {
        getWorker(_: any, label: string) {
            // Custom user defined workers, must return a Worker instance
            if (typeof options.getWorker === 'function') {
                const result = options.getWorker(label, 'monaco-editor');

                if (result) {
                    return result;
                }
            }

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
                return TSWorker(extendTSWorkerCode);
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

initMonaco();

export * from 'monaco-editor';
export * from './types.ts';

export {
    monaco
};
