import { useState } from 'react';

import { useDebounceValue } from 'usehooks-ts';

import {
    type IAutocompleteSuggestInput,
    type IAutocompleteSuggestResult,
    type TUseAutocompleteSuggest,
} from '../suggest';

/**
 * Calls the injected AP suggest hook.
 * Keeps the dynamic hook call in one place for react-hooks lint.
 */
const useInjectedAutocompleteSuggest = (
    useSuggest: TUseAutocompleteSuggest,
    input: IAutocompleteSuggestInput
): IAutocompleteSuggestResult =>
    // Injected suggest hook module (stable prop); not a conditional call.
    useSuggest(input);

/** Local input state for async suggest wiring. */
export const useAutocompleteAsyncInput = (debounceMs: number) => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedQuery] = useDebounceValue(inputValue, debounceMs);

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
