type InitMonacoOptions = {
    customTSWorkerPath?: string;
    customTSWorkerFactory?: monaco.languages.typescript.CustomTSWebWorkerFactory;
    getWorker?: (workerId: string, label: string) => Promise<Worker> | Worker;
};

export type { InitMonacoOptions };
