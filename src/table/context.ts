import { createContext, useContext } from 'react';

import { type ITableContextValue } from './types';

export const TableContext = createContext<ITableContextValue | undefined>(undefined);

export const useTableContext = (): ITableContextValue => {
    const context = useContext(TableContext);

    if (!context) {
        throw new Error('This component must be used within a <Table> component');
    }

    return context;
};
