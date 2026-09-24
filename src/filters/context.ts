import { createContext, useContext } from 'react';

import { type IFiltersGridContextValue } from './types';

const FiltersGridContext = createContext<IFiltersGridContextValue>({
    columns: 4,
    span: {},
});

export const FiltersGridProvider = FiltersGridContext.Provider;

export const useFiltersGrid = () => useContext(FiltersGridContext);
