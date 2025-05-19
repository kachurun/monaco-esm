import { initMonaco, loadCss, monaco } from 'monaco-esm';

loadCss();
initMonaco({
    customTSWorkerFactory: (TSWorkerClass, tsc, libs) => {
        return TSWorkerClass;
    },
});

monaco.editor.create(document.getElementById('container'), {
    value: ['function x(a: string) {', '\tconsole.log("Hello world!", a);', '}'].join('\n'),
    language: 'typescript',
});
