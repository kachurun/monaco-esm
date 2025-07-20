export type WorkerFactory = ({ name, append }: { name: string; append?: string }) => Worker;

export function createWorkerFactory(workerCode: string): WorkerFactory {
    return ({ name, append }) => {
        if (typeof append === 'string') {
            workerCode += `\n${ append }`;
        }

        let objectUrl: string | undefined;

        try {
            // Try to create object URL first (more efficient)
            const blob = new Blob([workerCode], { type: 'text/javascript' });
            objectUrl = (globalThis.URL || (globalThis as any).webkitURL).createObjectURL(blob);

            if (!objectUrl) {
                throw new Error('Failed to create object URL');
            }

            const worker = new Worker(objectUrl, { name });

            worker.addEventListener('error', () => {
                if (objectUrl) {
                    (globalThis.URL || (globalThis as any).webkitURL).revokeObjectURL(objectUrl);
                }
            });

            return worker;
        }
        catch {
            // Fallback to data URL if blob URL creation fails
            return new Worker(
                `data:text/javascript;charset=utf-8,${ encodeURIComponent(workerCode) }`,
                { name }
            );
        }
        finally {
            // Clean up object URL after worker creation
            if (objectUrl) {
                (globalThis.URL || (globalThis as any).webkitURL).revokeObjectURL(objectUrl);
            }
        }
    };
}
