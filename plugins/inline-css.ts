import fs from 'fs';

import type { Plugin } from 'esbuild';

export interface InlineCssOptions {
    include?: RegExp | string[];
    exclude?: RegExp | string[];
}

function matchesPattern(file: string, pattern?: RegExp | string[]): boolean {
    if (!pattern) {
        return false;
    }

    if (pattern instanceof RegExp) {
        return pattern.test(file);
    }

    if (Array.isArray(pattern)) {
        return pattern.some(p => file.includes(p));
    }

    return false;
}

export function inlineCss(options: InlineCssOptions = {}): Plugin {
    return {
        name: 'inline-css',
        setup(build) {
            build.onLoad({ filter: /\.css$/ }, async(args) => {
                if (
                    (options.include && !matchesPattern(args.path, options.include))
                    || (options.exclude && matchesPattern(args.path, options.exclude))
                ) {
                    // Excluded or not included: treat as empty
                    return {
                        contents: '',
                        loader: 'text',
                    };
                }

                return {
                    contents: await fs.promises.readFile(args.path, 'utf8'),
                    loader: 'text',
                };
            });
        },
    };
}
