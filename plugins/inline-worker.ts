/* eslint-env node */
import esbuild, { OnLoadArgs, OnResolveArgs, Plugin, PluginBuild } from 'esbuild';
import findCacheDir from 'find-cache-dir';
import fs from 'fs';
import path from 'path';

// Helper to ensure cacheDir is always a string
function getCacheDir(): string {
    const dir = findCacheDir({ name: 'esbuild-plugin-inline-worker', create: true });
    if (!dir) {
        throw new Error('Unable to determine cache directory for inline worker plugin.');
    }
    return dir;
}

export interface InlineWorkerPluginOptions extends Record<string, unknown> {
    workerName?: string;
}

export function inlineWorkerPlugin(extraConfig: InlineWorkerPluginOptions = {}): Plugin {
    return {
        name: 'esbuild-plugin-inline-worker',

        setup(build: PluginBuild) {
            build.onLoad(
                { filter: /\.worker\.(js|jsx|ts|tsx)$/ },
                async({ path: workerPath }: OnLoadArgs): Promise<{ contents: string; loader: 'js' }> => {
                    const workerCode = await buildWorker(workerPath, extraConfig);
                    return {
                        contents: [
                            'import inlineWorker from \'__inline-worker\'',
                            'export default function Worker(appendCode) {',
                            `  return inlineWorker(${ JSON.stringify(workerCode) }, appendCode);`,
                            '}',
                        ].join('\n'),
                        loader: 'js',
                    };
                }
            );

            const name = extraConfig.workerName ? { name: extraConfig.workerName } : {};

            const inlineWorkerFunctionCode = [
                'export default function inlineWorker(scriptText, appendCode) {',
                '  if (typeof appendCode === \'string\') scriptText += \'\\n\' + appendCode;',
                '  let blob = new Blob([scriptText], {type: "text/javascript"});',
                '  let url = URL.createObjectURL(blob);',
                `  let worker = new Worker(url, ${ JSON.stringify(name) });`,
                '  URL.revokeObjectURL(url);',
                '  return worker;',
                '}',
            ].join('\n');

            build.onResolve({ filter: /^__inline-worker$/ }, ({ path }: OnResolveArgs) => {
                return { path, namespace: 'inline-worker' };
            });

            build.onLoad({ filter: /.*/, namespace: 'inline-worker' }, () => {
                return { contents: inlineWorkerFunctionCode, loader: 'js' };
            });
        },
    };
}

async function buildWorker(workerPath: string, extraConfig: InlineWorkerPluginOptions): Promise<string> {
    const cacheDir = getCacheDir();
    const scriptName = path.basename(workerPath).replace(/\.[^.]+$/, '.js');
    const bundlePath = path.resolve(cacheDir, scriptName);

    // Remove plugin-specific options before passing to esbuild
    const { workerName, entryPoints, outfile, outdir, ...esbuildConfig } = extraConfig || {};

    await esbuild.build({
        entryPoints: [workerPath],
        bundle: true,
        minify: true,
        outfile: bundlePath,
        target: 'es2017',
        format: 'esm',
        ...esbuildConfig,
    });

    return fs.promises.readFile(bundlePath, { encoding: 'utf-8' });
}
