import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const srcRoot = resolve(import.meta.dirname, 'src');

const entries = Object.fromEntries(
    glob
        .sync('src/**/*.{ts,tsx}', {
            ignore: ['src/**/*.{test,spec,stories}.{ts,tsx}', 'src/**/*.d.ts'],
        })
        .map(file => [
            relative('src', file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
        ])
);

export default defineConfig({
    plugins: [
        react(),
        libInjectCss(),
        dts({
            include: ['src'],
            exclude: ['src/**/*.d.ts', 'src/**/*.{test,spec}.{ts,tsx}'],
            tsconfigPath: resolve(import.meta.dirname, 'tsconfig.json'),
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
