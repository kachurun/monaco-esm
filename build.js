import esbuild from 'esbuild';
import inlineWorkerPlugin from 'esbuild-plugin-inline-worker';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

removeDir('dist');

const workerEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/language/css/css.worker.js',
    'vs/language/html/html.worker.js',
    'vs/language/typescript/ts.worker.js',
    'vs/editor/editor.worker.js',
];

const onlyInlineLocalCss = {
    name: 'only-inline-local-css',
    setup(build) {
        build.onLoad({ filter: /\.css$/ }, async(args) => {
            if (!args.path.includes('node_modules')) {
                return {
                    contents: await fs.promises.readFile(args.path, 'utf8'),
                    loader: 'text',
                };
            }

            // For node_modules CSS, treat as empty (ignored)
            return {
                contents: '',
                loader: 'text',
            };
        });
    },
};

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

    console.log('Pre-Build Monaco Editor Workers');
    await build({
        entryPoints: workerEntryPoints.map(entry => `node_modules/monaco-editor/esm/${ entry }`),
        bundle: true,
        format: 'iife',
        // outbase: 'node_modules/monaco-editor/esm/',
        outdir: path.join(__dirname, '.build'),
        entryNames: '[name]',
    });

    console.log('Bundle Monaco Editor');
    await build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        format: 'esm',
        outfile: path.join(__dirname, 'dist', 'index.js'),
        plugins: [onlyInlineLocalCss, inlineWorkerPlugin()],
        loader: {
            '.css': 'text',
        },
    });

    console.log('Prepare type declarations');

    // Copy type declarations
    await fs.promises.copyFile(path.join(__dirname, 'src', 'index.d.ts'), path.join(__dirname, 'dist', 'index.d.ts'));
    console.log('Build done');

    console.groupEnd();
}

runBuild();

/**
 * @param {import ('esbuild').BuildOptions} opts
 */
async function build(opts) {
    return esbuild.build(opts).then((result) => {
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
function removeDir(_dirPath, keep) {
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
    function rmDir(dirPath, relativeDirPath) {
        let keepsFiles = false;
        const entries = fs.readdirSync(dirPath);
        for (const entry of entries) {
            const filePath = path.join(dirPath, entry);
            const relativeFilePath = path.join(relativeDirPath, entry);
            if (keep(relativeFilePath)) {
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
