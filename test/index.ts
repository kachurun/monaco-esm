import { loadCss, monaco } from 'monaco-esm';

loadCss();

monaco.editor.create(document.getElementById('container'), {
    value: ['function x(a: string) {', '\tconsole.log("Hello world!", a);', '}'].join('\n'),
    language: 'typescript',
});
