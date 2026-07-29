import { createContext, useContext } from 'react';

import { type ITabsContextValue } from './types';

export const TabsContext = createContext<ITabsContextValue | undefined>(undefined);

export const useTabs = (): ITabsContextValue => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error('This component must be used within a <Tabs> component');
    }

    return context;
};
