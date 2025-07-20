// @ts-ignore
import css from 'monaco-editor/min/vs/editor/editor.main.css?raw';

export function loadCss(styleId = 'monaco-editor-styles', doc = document) {
    if (doc.getElementById(styleId)) {
        return;
    }

    const style = doc.createElement('style');

    style.id = styleId;
    style.textContent = css;

    doc.head.appendChild(style);
}
