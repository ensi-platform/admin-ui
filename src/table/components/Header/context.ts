import { createContext, useContext } from 'react';

interface ITableHeaderContextValue {
    sticky: boolean;
}

const TableHeaderContext = createContext<ITableHeaderContextValue>({ sticky: false });

export const TableHeaderProvider = TableHeaderContext.Provider;

export const useTableHeaderSticky = () => useContext(TableHeaderContext).sticky;
