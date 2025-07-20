import esbuild from 'esbuild';
import { existsSync, rmSync, statSync } from 'fs';
import { basename, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = join(__dirname, '.build');

// Clean build directory
if (existsSync(buildDir)) {
    rmSync(buildDir, { recursive: true });
}

const workerEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/language/css/css.worker.js',
    'vs/language/html/html.worker.js',
    'vs/language/typescript/ts.worker.js',
    'vs/editor/editor.worker.js',
];

function formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${ size.toFixed(1) } ${ units[unitIndex] }`;
}

function reportBuiltFiles(description: string): void {
    console.log(`📦 ${ description }:`);

    for (const entry of workerEntryPoints) {
        const fileName = `${ basename(entry, '.js') }.js`;
        const filePath = join(buildDir, fileName);

        if (existsSync(filePath)) {
            const size = statSync(filePath).size;
            const relativePath = relative(__dirname, filePath);
            console.log(`   ${ relativePath }: ${ formatFileSize(size) }`);
        }
    }

    console.log();
}

async function buildWorkers(): Promise<void> {
    console.log('Building Monaco Editor Workers...');

    await esbuild.build({
        entryPoints: workerEntryPoints.map(entry =>
            `node_modules/monaco-editor/esm/${ entry }`
        ),
        format: 'iife',
        bundle: true,
        minify: true,
        outdir: buildDir,
        entryNames: '[name]',
    });

    reportBuiltFiles('Monaco Editor Workers');
}

buildWorkers().catch(console.error);

