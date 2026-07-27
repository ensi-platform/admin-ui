import { createContext } from 'react';

import { type IAuiContextValue, type IAuiLabels } from './types';

export const defaultLabels: IAuiLabels = {
    close: 'Close',
    clear: 'Clear',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    notDelete: "Don't delete",
    loadingSuggestions: 'Loading suggestions',
    noSuggestions: 'No suggestions',
    suggestionsError: 'Failed to load suggestions',
    moreSelected: 'more selected',
};

export const AuiContext = createContext<IAuiContextValue | null>(null);
