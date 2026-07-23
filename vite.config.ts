import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

import { getViteEntries } from './scripts/sync-package.js';

const packageRoot = import.meta.dirname;
const srcRoot = resolve(packageRoot, 'src');
const entries = getViteEntries(packageRoot);

export default defineConfig({
    plugins: [
        react(),
        libInjectCss(),
        dts({
            include: ['src'],
            exclude: ['src/**/*.d.ts', 'src/**/*.{test,spec,stories}.{ts,tsx}', 'src/**/docs/**'],
            tsconfigPath: resolve(packageRoot, 'tsconfig.json'),
            beforeWriteFile: (filePath, content) => ({
                filePath: filePath.replace('/dist/src/', '/dist/'),
                content,
            }),
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
