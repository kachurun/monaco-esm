export function inlineWorker(name: string, scriptText: string, appendCode?: string) {
    if (typeof appendCode === 'string') {
        scriptText += `\n${ appendCode }`;
    }

    const blob = new Blob([scriptText], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new (Worker as any)(url, { name });

    URL.revokeObjectURL(url);
    return worker;
}
