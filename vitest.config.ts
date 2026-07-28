import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const packageRoot = import.meta.dirname;

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@ds', replacement: resolve(packageRoot, 'src/ds') },
            { find: /^@\//, replacement: `${resolve(packageRoot, 'src')}/` },
        ],
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
            generateScopedName: 'aub_[name]_[local]_[hash:5]',
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                '**/node_modules/**',
                '**/docs/**',
                '**/__tests__/**',
                '**/types.ts',
                '**/*.module.css',
                '**/*.d.ts',
                'src/ds/typography/**',
                'src/index.ts',
                'src/*/index.ts',
                'src/ds/*/index.ts',
            ],
        },
    },
});
