import { createContext, useContext } from 'react';

export interface ISearchContextValue {
    open: boolean;
    searchMenu: string;
    dataTestId?: string;
    openSearch: () => void;
}

export const SearchContext = createContext<ISearchContextValue | null>(null);

/** Trigger state for the header search button. */
export const useSearchTrigger = (): ISearchContextValue => {
    const value = useContext(SearchContext);

    if (!value) {
        throw new Error('CascadeMenu search trigger requires CascadeMenu.');
    }

    return value;
};
