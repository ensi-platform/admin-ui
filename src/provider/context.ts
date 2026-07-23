import { createContext } from 'react';

import { type IAuiContextValue, type IAuiLabels } from './types.js';

export const defaultLabels: IAuiLabels = {
    close: 'Close',
    clear: 'Clear',
};

export const AuiContext = createContext<IAuiContextValue | null>(null);
