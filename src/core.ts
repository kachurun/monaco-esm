// @ts-ignore
import { languages } from 'monaco-editor';

import type { CustomTSWebWorkerFactory } from './types.ts';
import type * as monaco from 'monaco-editor';

type WorkerFactory = ({ name, append }?: { name?: string; append?: string }) => Worker;

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
        editor?: WorkerFactory;
    };
};

export function initMonaco(options: InitMonacoOptions = {}) {
    let extendTSWorkerCode = '';

    const setTSWorkerOptions = (options: monaco.languages.typescript.WorkerOptions) => {
        const ts = languages.typescript;
        ts.javascriptDefaults.setWorkerOptions(options);
        ts.typescriptDefaults.setWorkerOptions(options);
    };

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
        async getWorker(_: any, label: string) {
            // Custom user defined workers, must return a Worker instance
            if (typeof options.getWorker === 'function') {
                const result = options.getWorker(label, 'monaco-editor');

                if (result) {
                    return result;
                }
            }

            // Use provided worker factories if available
            if (label === 'json' && options.workers?.json) {
                return options.workers.json({
                    name: 'json',
                });
            }

            if ((label === 'css' || label === 'scss' || label === 'less') && options.workers?.css) {
                return options.workers.css({
                    name: 'css',
                });
            }

            if ((label === 'html' || label === 'handlebars' || label === 'razor') && options.workers?.html) {
                return options.workers.html({
                    name: 'html',
                });
            }

            if ((label === 'typescript' || label === 'javascript') && options.workers?.typescript) {
                return options.workers.typescript({
                    name: 'typescript',
                    append: extendTSWorkerCode,
                });
            }

            if (options.workers?.editor) {
                return options.workers.editor({
                    name: 'editor',
                });
            }
        },
    };
}

initMonaco();
