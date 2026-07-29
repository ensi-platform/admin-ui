import { resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';

const packageRoot = resolve(import.meta.dirname, '..');

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx)'],
    framework: '@storybook/react-vite',
    staticDirs: ['./static'],
    addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
    managerHead: head => `${head}
<link rel="icon" type="image/svg+xml" href="./favicon.svg" />
<style>
html[data-aui-manager-theme='dark'] [role='listbox'] [role='option'] {
  color: #888888 !important;
  font-weight: 400 !important;
  --listbox-item-active-color: #f0f2f4;
  --listbox-item-muted-color: #888888;
}
html[data-aui-manager-theme='dark'] [role='listbox'] [role='option'][aria-selected='true'] {
  color: #f0f2f4 !important;
  font-weight: 700 !important;
  --listbox-item-muted-color: #f0f2f4;
}
</style>`,
    typescript: {
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            savePropValueAsString: true,
            shouldRemoveUndefinedFromOptional: true,
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: prop => {
                if (prop.parent) {
                    return !/node_modules/.test(prop.parent.fileName);
                }
                return true;
            },
        },
    },
    async viteFinal(viteConfig) {
        viteConfig.resolve ??= {};
        const srcRoot = resolve(packageRoot, 'src');
        const prevAlias = viteConfig.resolve.alias;
        viteConfig.resolve.alias = [
            ...(Array.isArray(prevAlias)
                ? prevAlias
                : Object.entries(prevAlias ?? {}).map(([find, replacement]) => ({ find, replacement }))),
            { find: '@ds', replacement: resolve(srcRoot, 'ds') },
            { find: /^@\//, replacement: `${srcRoot}/` },
        ];

        viteConfig.plugins?.push({
            name: 'markdown-raw-import',
            transform(code, id) {
                if (id.endsWith('.md')) {
                    return `export default ${JSON.stringify(code)};`;
                }
            },
        });

        return viteConfig;
    },
};

export default config;
