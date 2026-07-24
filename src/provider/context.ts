import { createContext } from 'react';

import { type IAuiContextValue, type IAuiLabels } from './types';

export const defaultLabels: IAuiLabels = {
    close: 'Close',
    clear: 'Clear',
};

export const AuiContext = createContext<IAuiContextValue | null>(null);
