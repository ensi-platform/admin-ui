import { dirname, relative, resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

import { getViteEntries } from './scripts/sync-package';

const packageRoot = import.meta.dirname;
const srcRoot = resolve(packageRoot, 'src');
const distRoot = resolve(packageRoot, 'dist');
const entries = getViteEntries(packageRoot);

const toDistRelative = (fromFile: string, targetAbs: string): string => {
    let rel = relative(dirname(fromFile), targetAbs).replaceAll('\\', '/');

    if (!rel.startsWith('.')) {
        rel = `./${rel}`;
    }

    return rel;
};

export default defineConfig({
    resolve: {
        alias: [
            { find: '@ds', replacement: resolve(srcRoot, 'ds') },
            // Only `@/…` — bare `@` would hijack `@react-aria/*` etc.
            { find: /^@\//, replacement: `${srcRoot}/` },
        ],
    },
    plugins: [
        react(),
        libInjectCss(),
        dts({
            include: ['src'],
            exclude: ['src/**/*.d.ts', 'src/**/*.{test,spec,stories}.{ts,tsx}', 'src/**/docs/**'],
            tsconfigPath: resolve(packageRoot, 'tsconfig.json'),
            pathsToAliases: false,
            beforeWriteFile: (filePath, content) => {
                // Public typography entry types sit next to JS (`dist/typography`), not under `ds/`.
                const outPath = filePath
                    .replace('/dist/src/', '/dist/')
                    .replace('/dist/ds/typography/', '/dist/typography/');

                const outContent = content
                    .replace(
                        /from ['"](?:@ds\/common\/utils|(?:\.\.\/)+ds\/common\/utils(?:\.js)?)['"]/g,
                        () => `from '${toDistRelative(outPath, resolve(distRoot, 'ds/common/utils.js'))}'`
                    )
                    .replace(
                        /from ['"](?:@ds\/common|(?:\.\.\/)+ds\/common(?:\/index)?(?:\.js)?)['"]/g,
                        () => `from '${toDistRelative(outPath, resolve(distRoot, 'ds/common/index.js'))}'`
                    )
                    .replace(
                        /from ['"]\.\/ds\/typography\/index\.js['"]/g,
                        () => `from '${toDistRelative(outPath, resolve(distRoot, 'typography/index.js'))}'`
                    );

                return { filePath: outPath, content: outContent };
            },
        }),
    ],
    build: {
        lib: {
            formats: ['es'],
            entry: resolve(srcRoot, 'index.ts'),
        },
        cssCodeSplit: true,
        sourcemap: true,
        emptyOutDir: true,
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'class-variance-authority',
                'classnames',
                'react-aria-components',
                /^@react-aria\//,
                /^@react-stately\//,
                /^@react-types\//,
                /^@internationalized\//,
            ],
            input: entries,
            output: {
                entryFileNames: '[name].js',
                assetFileNames: 'assets/[name][extname]',
            },
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
            generateScopedName: 'aub_[name]_[local]_[hash:5]',
        },
    },
});
