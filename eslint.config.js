import base from '@ensi-platform/eslint-config-base';
import typescript from '@ensi-platform/eslint-config-typescript';
import react from '@ensi-platform/eslint-config-react';
import a11y from '@ensi-platform/eslint-config-a11y';

export default [
    ...base,
    ...typescript,
    ...react,
    ...a11y,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'import/prefer-default-export': 'off',
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'react',
                            importNames: ['forwardRef'],
                            message: 'Use ref as a prop (React 19). Do not use forwardRef.',
                        },
                    ],
                },
            ],
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    pathGroups: [
                        { pattern: 'react', group: 'external', position: 'before' },
                        { pattern: 'react-dom{,/**}', group: 'external', position: 'before' },
                        {
                            pattern: './**/*.css',
                            group: 'sibling',
                            position: 'after',
                        },
                        {
                            pattern: '../**/*.css',
                            group: 'parent',
                            position: 'after',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        },
    },
    {
        files: [
            'vitest.setup.ts',
            'vitest.config.ts',
            'src/**/*.test.{ts,tsx}',
            '.storybook/**/*.{ts,tsx}',
        ],
        rules: {
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        },
    },
    { ignores: ['dist/**', 'storybook-static/**'] },
];
