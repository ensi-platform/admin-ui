import { createContext } from 'react';

import { type IAuiContextValue, type IAuiLabels } from './types';

export const defaultLabels: IAuiLabels = {
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
    paginationPage: 'Страница {page}',
    paginationRange: '{from}–{to} из {total}',
    collapseSidebar: 'Свернуть меню',
    expandSidebar: 'Развернуть меню',
    resizeSidebar: 'Изменить ширину меню',
    pinMenuItem: 'Закрепить',
    unpinMenuItem: 'Открепить',
    pinnedSection: 'Закреплённые',
    pinnedSectionHint: 'ПКМ по пункту меню, чтобы закрепить',
    searchMenu: 'Поиск по меню',
    searchMenuEmpty: 'Ничего не найдено',
    openInNewTab: 'Открыть в новой вкладке',
    sortAscending: 'По возрастанию',
    sortDescending: 'По убыванию',
    moreActions: 'Ещё действия',
    save: 'Сохранить',
    arrangementList: 'Элементы',
    clearFilters: 'Очистить',
    copy: 'Копировать',
    copied: 'Скопировано: {value}',
    copyFailed: 'Не удалось скопировать',
};

export const AuiContext = createContext<IAuiContextValue | null>(null);
