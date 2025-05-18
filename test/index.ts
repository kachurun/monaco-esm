import { initMonacoEditor, loadCss } from 'monaco-esm';

loadCss();
const monaco = initMonacoEditor();

monaco.editor.create(document.getElementById('container'), {
    value: ['function x(a: string) {', '\tconsole.log("Hello world!", a);', '}'].join('\n'),
    language: 'typescript',
});
