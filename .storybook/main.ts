import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx)'],
    framework: '@storybook/react-vite',
    addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
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
