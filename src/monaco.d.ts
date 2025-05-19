/**
 * A few types used by webapp/src/tsworker.ts
 *
 * These types should be exported by monaco-typescript, but they aren't
 */
declare namespace monaco.languages.typescript {
    export interface CustomTSWebWorkerFactory {
        (
            TSWorkerClass: typeof TypeScriptWorker,
            tsc: any,
            libs: Record<string, string>
        ): typeof TypeScriptWorker;
    }

    export interface ICreateData {
        compilerOptions: ts.CompilerOptions;
        extraLibs: IExtraLibs;
        customWorkerPath?: string;
    }
}

export type LocalCustomTSWebWorkerFactory = monaco.languages.typescript.CustomTSWebWorkerFactory;
