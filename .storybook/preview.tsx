import { type ComponentPropsWithRef } from 'react';

import { withThemeByDataAttribute } from '@storybook/addon-themes';

import { ModalHub, ModalProvider } from '../src/modal-hub';
import { AdminUiProvider } from '../src/provider';

import { DocsContainer } from './DocsContainer';
import { DocsPage } from './DocsPage';

import type { Decorator, Preview } from '@storybook/react';

import '../src/ds/tokens/index.css';

/** Keeps story links inside the preview iframe (`<base target="_parent">`). */
const StorybookLink = ({ href, onClick, children, ...props }: ComponentPropsWithRef<'a'>) => (
    <a
        {...props}
        href={href}
        target="_self"
        onClick={event => {
            onClick?.(event);

            if (
                event.defaultPrevented ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
            ) {
                return;
            }

            event.preventDefault();
        }}
    >
        {children}
    </a>
);

const withProvider: Decorator = (Story, context) => {
    const locale = (context.globals.locale as string) || 'ru-RU';

    return (
        <AdminUiProvider locale={locale} linkComponent={StorybookLink}>
            <ModalProvider>
                <Story />
                <ModalHub />
            </ModalProvider>
        </AdminUiProvider>
    );
};

const preview: Preview = {
    tags: ['autodocs'],
    globalTypes: {
        locale: {
            description: 'UI locale',
            toolbar: {
                icon: 'globe',
                items: [
                    { value: 'ru-RU', title: 'RU', right: 'Русский' },
                    { value: 'en-US', title: 'EN', right: 'English' },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: {
        theme: 'light',
        locale: 'ru-RU',
    },
    decorators: [
        withThemeByDataAttribute({
            themes: {
                light: 'light',
                dark: 'dark',
            },
            defaultTheme: 'light',
            attributeName: 'data-theme',
        }),
        withProvider,
    ],
    parameters: {
        themes: {
            disable: true,
        },
        options: {
            storySort: {
                order: ['Main', 'Getting started', 'Design System', 'Base', 'Form', 'Overlays'],
            },
        },
        controls: {
            expanded: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'padded',
        backgrounds: {
            disable: true,
        },
        docs: {
            container: DocsContainer,
            page: DocsPage,
        },
    },
};

export default preview;
