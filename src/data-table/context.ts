import { createContext, useContext } from 'react';

import { type IDataTableSortContextValue } from './types';

export const DataTableSortContext = createContext<IDataTableSortContextValue>({});

export const useDataTableSort = (): IDataTableSortContextValue => useContext(DataTableSortContext);
