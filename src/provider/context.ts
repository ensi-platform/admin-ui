import { createContext } from 'react';

import { type IAuiContextValue, type IAuiLabels } from './types';

export const defaultLabels: IAuiLabels = {
    close: 'Close',
    clear: 'Clear',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    notDelete: "Don't delete",
};

export const AuiContext = createContext<IAuiContextValue | null>(null);
