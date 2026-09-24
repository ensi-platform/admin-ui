import { createContext } from 'react';

import { type IAuiContextValue, type IAuiLabels } from './types';

export const defaultLabels: IAuiLabels = {
    close: 'Close',
    clear: 'Clear',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    notDelete: "Don't delete",
    loading: 'Loading',
    loadingSuggestions: 'Loading suggestions',
    noSuggestions: 'No suggestions',
    suggestionsError: 'Failed to load suggestions',
    moreSelected: 'more selected',
    openCalendar: 'Open calendar',
    pageSize: 'Per page',
    paginationPrev: 'Previous',
    paginationNext: 'Next',
    paginationRange: '{from}–{to} of {total}',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    resizeSidebar: 'Resize sidebar',
    pinMenuItem: 'Pin',
    unpinMenuItem: 'Unpin',
    pinnedSection: 'Pinned',
    pinnedSectionHint: 'Right-click a menu item to pin it',
    searchMenu: 'Search menu',
    searchMenuEmpty: 'No sections found',
    openInNewTab: 'Open in new tab',
    sortAscending: 'Ascending',
    sortDescending: 'Descending',
    moreActions: 'More actions',
    save: 'Save',
    arrangementList: 'Items',
    clearFilters: 'Clear all',
};

export const AuiContext = createContext<IAuiContextValue | null>(null);
