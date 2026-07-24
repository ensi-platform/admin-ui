import { useContext } from 'react';

import { AuiContext } from './context';
import { type IAuiContextValue, type IAuiLabels, type TTextDirection } from './types';

const useAuiContext = (): IAuiContextValue => {
    const context = useContext(AuiContext);

    if (!context) {
        throw new Error('AdminUiProvider is required. Wrap the app with <AdminUiProvider>.');
    }

    return context;
};

export const useAuiLabels = (): IAuiLabels => useAuiContext().labels;

export const useAuiLocale = (): string => useAuiContext().locale;

export const useAuiDirection = (): TTextDirection => useAuiContext().direction;
