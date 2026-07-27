import { useState } from 'react';

import { useDebounce } from '@uidotdev/usehooks';

import { type TUseAutocompleteSuggest } from './suggest';
import { useInjectedAutocompleteSuggest } from './use-injected-suggest';

/** Local input state for async suggest wiring. */
export const useAutocompleteAsyncInput = (debounceMs: number) => {
    const [inputValue, setInputValue] = useState('');
    const debouncedQuery = useDebounce(inputValue, debounceMs);

    return { inputValue, setInputValue, debouncedQuery };
};

/** Shared async suggest call for AutocompleteAsync shells. */
export const useAutocompleteAsyncSuggest = ({
    useSuggest,
    query,
    enabled,
}: {
    useSuggest: TUseAutocompleteSuggest;
    query: string;
    enabled: boolean;
}) => useInjectedAutocompleteSuggest(useSuggest, { query, enabled });
