// 2,298.57 kB │ gzip: 596.66 kB
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// 3,331.27 kB  │ gzip: 857.16 kB + chunks
// import * as monaco from 'monaco-editor';
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// 3,888.90 kB │ gzip: 974.52 kB
import EditorWorkerVite from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import { editor, initMonaco } from 'monaco-esm';
import EditorWorker from 'monaco-esm/workers/editor';

const run = async() => {
    initMonaco({
        workers: {
            editor: EditorWorkerVite || EditorWorker,
        },
    });

    // const { default: HtmlWorker } = await import('monaco-esm/workers/html');
    // loadCss();

    editor.create(document.getElementById('container'), {
        value: ['<script>\nfunction x(a: string) {', '\tconsole.log("Hello world!", a);', '}\n</script>'].join('\n'),
        language: 'html',
    });
};

void run();
