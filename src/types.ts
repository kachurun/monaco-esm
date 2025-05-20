import * as ts from 'typescript';

// export type TypeScriptWorker = monaco.languages.typescript.TypeScriptWorker;
export type TypeScriptWorker = ts.LanguageServiceHost;
export type TypeScriptWorkerClass = new (...args: any[]) => TypeScriptWorker;

export interface CustomTSWebWorkerFactory {
    (
        TSWorkerClass: TypeScriptWorkerClass,
        tsc: {
            typescript: typeof ts;
        },
        libs: Record<string, string>
    ): TypeScriptWorkerClass;
}
