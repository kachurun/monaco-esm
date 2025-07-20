import { initMonaco, loadCss, monaco } from 'monaco-esm';

loadCss();
initMonaco({
    workers: {
        // html: HtmlWorker,
    },
});

monaco.editor.create(document.getElementById('container'), {
    value: ['<script>\nfunction x(a: string) {', '\tconsole.log("Hello world!", a);', '}\n</script>'].join('\n'),
    language: 'html',
});
