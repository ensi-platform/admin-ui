import { withThemeByDataAttribute } from '@storybook/addon-themes';

import { ModalHub, ModalProvider } from '../src/modal-hub';
import { AdminUiProvider, type IAuiLabels } from '../src/provider';

import { auiDark, auiLight } from './themes';

import type { Decorator, Preview } from '@storybook/react';

import '../src/ds/tokens/index.css';

const RU_LABELS: IAuiLabels = {
    close: 'Закрыть',
    clear: 'Очистить',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    delete: 'Удалить',
    notDelete: 'Не удалять',
    loadingSuggestions: 'Загрузка подсказок',
    noSuggestions: 'Ничего не найдено',
    suggestionsError: 'Не удалось загрузить подсказки',
    moreSelected: 'ещё выбрано',
    openCalendar: 'Открыть календарь',
};

const withProvider: Decorator = (Story, context) => {
    const theme = (context.globals.theme as string) || 'light';
    const locale = (context.globals.locale as string) || 'ru-RU';

    context.parameters.docs = {
        ...context.parameters.docs,
        theme: theme === 'dark' ? auiDark : auiLight,
    };

    return (
        <AdminUiProvider locale={locale} labels={locale.startsWith('ru') ? RU_LABELS : undefined}>
            <ModalProvider>
                <div
                    style={{
                        background: 'var(--aui-page-bg-primary)',
                        color: 'var(--aui-page-fg-primary)',
                        padding: 16,
                        minHeight: '100%',
                    }}
                >
                    <Story />
                </div>
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
                title: 'Locale',
                icon: 'globe',
                items: [
                    { value: 'ru-RU', title: 'ru-RU' },
                    { value: 'en-US', title: 'en-US' },
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
        controls: {
            expanded: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'fullscreen',
        backgrounds: {
            disable: true,
        },
        docs: {
            theme: auiLight,
        },
    },
};

export default preview;
