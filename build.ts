import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';


import { inlineCss } from './plugins/inline-css.ts';
import { rawPlugin } from './plugins/raw-plugin.ts';

import type { BuildOptions, BuildResult } from 'esbuild';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

removeDir('dist', undefined);

const workerEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/language/css/css.worker.js',
    'vs/language/html/html.worker.js',
    'vs/language/typescript/ts.worker.js',
    'vs/editor/editor.worker.js',
];

const individualWorkerEntries = [
    { entry: './src/workers/css.ts', name: 'css' },
    { entry: './src/workers/html.ts', name: 'html' },
    { entry: './src/workers/json.ts', name: 'json' },
    { entry: './src/workers/typescript.ts', name: 'typescript' },
    { entry: './src/workers/editor.ts', name: 'editor' },
];

/**
 * Format bytes as human-readable text.
 * @param {number} bytes Number of bytes.
 * @param {boolean} si True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
 * @param {number} dp Number of decimal places to display.
 * @return {string} Formatted string.
 */
function humanFileSize(bytes: number, si = false, dp = 1): string {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return `${ bytes } B`;
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return `${ bytes.toFixed(dp) } ${ units[u] }`;
}

/**
 * Report the size of built files
 * @param {string | string[]} filePaths - Path(s) to the built file(s)
 * @param {string} description - Description of what was built
 */
function reportFileSize(filePaths: string | string[], description: string): void {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

    console.log(`📦 ${ description }:`);

    for (const filePath of paths) {
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);

        if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            const size = stats.size;

            const relativePath = path.relative(__dirname, fullPath);
            console.log(`   ${ relativePath }: ${ humanFileSize(size) }`);
        }
    }

    console.log();
}

async function runBuild() {
    console.group('Building...');

    console.log('Build Monaco Editor CSS');
    await build({
        entryPoints: ['node_modules/monaco-editor/min/vs/editor/editor.main.css'],
        bundle: true,
        outfile: path.join(__dirname, '.build', 'index.css'),
        loader: {
            '.ttf': 'dataurl',
        },
    });
    reportFileSize('.build/index.css', 'Monaco Editor CSS');

    console.log('Pre-Build Monaco Editor Workers');
    await build({
        entryPoints: workerEntryPoints.map(entry => `node_modules/monaco-editor/esm/${ entry }`),
        format: 'iife',
        bundle: true,
        entryNames: '[name]',
        outdir: path.join(__dirname, '.build'),
    });

    const workerPaths = workerEntryPoints.map((entry) => {
        const basename = path.basename(entry, '.js');
        return `.build/${ basename }.js`;
    });
    reportFileSize(workerPaths, 'Monaco Editor Workers');

    console.log('Bundle Monaco Editor');
    await build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        format: 'esm',
        outfile: path.join(__dirname, 'dist', 'index.mjs'),
        external: ['monaco-editor'],
        plugins: [inlineCss({ exclude: /node_modules/ }), rawPlugin()],
        loader: {
            '.css': 'text',
        },
    });
    reportFileSize('dist/index.mjs', 'Monaco Editor ESM Bundle');

    await build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        format: 'cjs',
        outfile: path.join(__dirname, 'dist', 'index.cjs'),
        external: ['monaco-editor'],
        plugins: [inlineCss({ exclude: /node_modules/ }), rawPlugin()],
        loader: {
            '.css': 'text',
        },
    });
    reportFileSize('dist/index.cjs', 'Monaco Editor CJS Bundle');

    console.log('Bundle Individual Workers');
    // Build individual worker entry points
    for (const worker of individualWorkerEntries) {
        await build({
            entryPoints: [worker.entry],
            bundle: true,
            format: 'esm',
            outfile: path.join(__dirname, 'dist', 'workers', `${ worker.name }.mjs`),
            plugins: [rawPlugin()],
        });

        await build({
            entryPoints: [worker.entry],
            bundle: true,
            format: 'cjs',
            outfile: path.join(__dirname, 'dist', 'workers', `${ worker.name }.cjs`),
            plugins: [rawPlugin()],
        });
    }

    const workerDistPaths = individualWorkerEntries.flatMap(worker => [
        `dist/workers/${ worker.name }.mjs`,
        `dist/workers/${ worker.name }.cjs`,
    ]);
    reportFileSize(workerDistPaths, 'Individual Worker Bundles');

    console.log('Build done');

    console.groupEnd();
}

void runBuild();

/**
 * @param {import ('esbuild').BuildOptions} opts
 */
async function build(opts: BuildOptions): Promise<void> {
    return esbuild.build(opts).then((result: BuildResult) => {
        if (result.errors.length > 0) {
            console.error(result.errors);
        }
        if (result.warnings.length > 0) {
            console.error(result.warnings);
        }
    });
}

/**
 * Remove a directory and all its contents.
 * @param {string} _dirPath
 * @param {(filename: string) => boolean} [keep]
 */
function removeDir(_dirPath: string, keep?: (filename: string) => boolean): void {
    if (typeof keep === 'undefined') {
        keep = () => false;
    }

    const dirPath = path.join(__dirname, _dirPath);

    if (!fs.existsSync(dirPath)) {
        return;
    }

    rmDir(dirPath, _dirPath);

    /**
     * @param {string} dirPath
     * @param {string} relativeDirPath
     * @returns {boolean}
     */
    function rmDir(dirPath: string, relativeDirPath: string): boolean {
        let keepsFiles = false;
        const entries = fs.readdirSync(dirPath);
        for (const entry of entries) {
            const filePath = path.join(dirPath, entry);
            const relativeFilePath = path.join(relativeDirPath, entry);
            if (keep!(relativeFilePath)) {
                keepsFiles = true;
                continue;
            }
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
            else {
                keepsFiles = rmDir(filePath, relativeFilePath) || keepsFiles;
            }
        }
        if (!keepsFiles) {
            fs.rmdirSync(dirPath);
        }
        return keepsFiles;
    }
}

