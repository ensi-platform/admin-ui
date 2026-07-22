import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
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
    },
});
