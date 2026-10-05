import { createContext, useContext } from 'react';

import { type IVerticalTabsContextValue } from './types';

export const VerticalTabsContext = createContext<IVerticalTabsContextValue | undefined>(undefined);

export const useVerticalTabs = (): IVerticalTabsContextValue => {
    const context = useContext(VerticalTabsContext);

    if (!context) {
        throw new Error('This component must be used within a <VerticalTabs> component');
    }

    return context;
};
