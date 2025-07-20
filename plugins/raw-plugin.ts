import { readFile } from 'fs/promises';

import type { Plugin } from 'esbuild';

export function rawPlugin(): Plugin {
    return {
        name: 'raw',
        setup(build) {
            build.onResolve({ filter: /\?raw$/ }, async(args) => {
                // First, try to resolve the path without the ?raw suffix using esbuild's built-in resolution
                const pathWithoutRaw = args.path.replace(/\?raw$/, '');

                try {
                    const resolved = await build.resolve(pathWithoutRaw, {
                        kind: args.kind,
                        importer: args.importer,
                        namespace: args.namespace,
                        resolveDir: args.resolveDir,
                    });

                    if (resolved.errors.length > 0) {
                        return { errors: resolved.errors };
                    }

                    return {
                        path: resolved.path,
                        namespace: 'raw-loader',
                        pluginData: {
                            originalPath: args.path,
                            resolvedPath: resolved.path,
                        },
                    };
                }
                catch (error) {
                    return {
                        errors: [{
                            text: `Failed to resolve raw import: ${ args.path }`,
                            location: null,
                        }],
                    };
                }
            });

            build.onLoad({ filter: /.*/, namespace: 'raw-loader' }, async(args) => {
                try {
                    const resolvedPath = args.pluginData?.resolvedPath || args.path;
                    const contents = await readFile(resolvedPath);
                    return {
                        contents,
                        loader: 'text',
                    };
                }
                catch (error) {
                    return {
                        errors: [{
                            text: `Failed to read file: ${ args.path } - ${ error.message }`,
                            location: null,
                        }],
                    };
                }
            });
        },
    };
}
