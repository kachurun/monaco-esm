// @ts-ignore
import { languages } from 'monaco-editor';
import * as monaco from 'monaco-editor';

// @ts-ignore
import EditorWorker from './workers/editor.ts';

import type { CustomTSWebWorkerFactory } from './types.ts';

type WorkerFactory = (appendCode?: string) => Worker;

type InitMonacoOptions = {
    customTSWorkerPath?: string;
    customTSWorkerFactory?: CustomTSWebWorkerFactory;
    getWorker?: (workerId: string, label: string) => Promise<Worker> | Worker;
    // Optional worker factories - only include the workers you need
    workers?: {
        css?: WorkerFactory;
        html?: WorkerFactory;
        json?: WorkerFactory;
        typescript?: WorkerFactory;
    };
};

const setTSWorkerOptions = (options: monaco.languages.typescript.WorkerOptions) => {
    const ts = languages.typescript;
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

            // Use provided worker factories if available
            if (label === 'json' && options.workers?.json) {
                return options.workers.json();
            }

            if ((label === 'css' || label === 'scss' || label === 'less') && options.workers?.css) {
                return options.workers.css();
            }

            if ((label === 'html' || label === 'handlebars' || label === 'razor') && options.workers?.html) {
                return options.workers.html();
            }

            if ((label === 'typescript' || label === 'javascript') && options.workers?.typescript) {
                return options.workers.typescript(extendTSWorkerCode);
            }

            // Fallback to editor worker for all cases
            return EditorWorker();
        },
    };
}

initMonaco();
