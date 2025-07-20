import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: {
                // Main entries
                index: resolve(__dirname, 'src/index.ts'),
                core: resolve(__dirname, 'src/core.ts'),
                // Worker entries
                'workers/index': resolve(__dirname, 'src/workers/index.ts'),
                'workers/css': resolve(__dirname, 'src/workers/css.ts'),
                'workers/html': resolve(__dirname, 'src/workers/html.ts'),
                'workers/json': resolve(__dirname, 'src/workers/json.ts'),
                'workers/typescript': resolve(__dirname, 'src/workers/typescript.ts'),
                'workers/editor': resolve(__dirname, 'src/workers/editor.ts'),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) => {
                const ext = format === 'es' ? 'mjs' : 'cjs';
                return `${ entryName }.${ ext }`;
            },
        },
        rollupOptions: {
            external: ['monaco-editor'],
            output: {
                exports: 'named',
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
