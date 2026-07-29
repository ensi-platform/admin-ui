import { withThemeByDataAttribute } from '@storybook/addon-themes';

import { ModalHub, ModalProvider } from '../src/modal-hub';
import { AdminUiProvider, type IAuiLabels } from '../src/provider';

import { DocsContainer } from './DocsContainer';
import { DocsPage } from './DocsPage';

import type { Decorator, Preview } from '@storybook/react';

import '../src/ds/tokens/index.css';

const RU_LABELS: IAuiLabels = {
    close: 'Закрыть',
    clear: 'Очистить',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    delete: 'Удалить',
    notDelete: 'Не удалять',
    loading: 'Загрузка',
    loadingSuggestions: 'Загрузка подсказок',
    noSuggestions: 'Ничего не найдено',
    suggestionsError: 'Не удалось загрузить подсказки',
    moreSelected: 'ещё выбрано',
    openCalendar: 'Открыть календарь',
    pageSize: 'Строк на странице',
    paginationPrev: 'Назад',
    paginationNext: 'Далее',
    paginationRange: '{from}–{to} из {total}',
};

const withProvider: Decorator = (Story, context) => {
    const locale = (context.globals.locale as string) || 'ru-RU';

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
            container: DocsContainer,
            page: DocsPage,
        },
    },
};

export default preview;
