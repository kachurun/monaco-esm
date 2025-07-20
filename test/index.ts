import { EditorWorker, HtmlWorker, initMonaco, monaco } from 'monaco-esm';

const run = async() => {
    // loadCss();
    initMonaco({
        workers: {
            editor: EditorWorker,
            html: HtmlWorker,
        },
    });

    monaco.editor.create(document.getElementById('container'), {
        value: ['<script>\nfunction x(a: string) {', '\tconsole.log("Hello world!", a);', '}\n</script>'].join('\n'),
        language: 'html',
    });
};

void run();
