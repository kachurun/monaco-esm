import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

// eslint-disable-next-line antfu/no-import-dist
import css from './dist/editor.main.css';

globalThis.MonacoEnvironment = {
    getWorkerUrl(moduleId, label) {
        if (label === 'json') {
            return './vs/language/json/json.worker.js';
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return './vs/language/css/css.worker.js';
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return './vs/language/html/html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return './vs/language/typescript/ts.worker.js';
        }
        return './vs/editor/editor.worker.js';
    },
};

function injectCss(css) {
    const styleId = 'monaco-editor-styles';

    if (document.getElementById(styleId)) {
        return;
    }

    const style = document.createElement('style');

    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
}

export function getMonacoEditor() {
    injectCss(css);

    return monaco;
}
