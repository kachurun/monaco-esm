import { initMonaco, monaco } from 'monaco-esm';
import htmlWorker from 'monaco-esm/workers/html';

// loadCss();
initMonaco({
    workers: {
        html: htmlWorker,
    },
});

monaco.editor.create(document.getElementById('container'), {
    value: ['<script>\nfunction x(a: string) {', '\tconsole.log("Hello world!", a);', '}\n</script>'].join('\n'),
    language: 'html',
});
