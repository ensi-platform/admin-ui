import { useEffect, useRef, useState } from 'react';

import { useDebounceValue } from 'usehooks-ts';

import { type IComboboxOption } from '@/select/types';

import {
    type IAutocompleteSuggestInput,
    type IAutocompleteSuggestResult,
    type IUseAutocompleteSuggest,
} from '../types';
import { appendSuggestPage, sameSuggestOptions } from '../utils';

/**
 * Calls the injected AP suggest hook.
 * Keeps the dynamic hook call in one place for react-hooks lint.
 */
const useInjectedAutocompleteSuggest = (
    useSuggest: IUseAutocompleteSuggest,
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

/** Shared async suggest call. The injected hook returns one page; this hook appends them. */
export const useAutocompleteAsyncSuggest = ({
    useSuggest,
    query,
    enabled,
}: {
    useSuggest: IUseAutocompleteSuggest;
    query: string;
    enabled: boolean;
}) => {
    const sessionRef = useRef({ query, page: 0 });
    const [, rerender] = useState(0);

    if (sessionRef.current.query !== query) {
        sessionRef.current = { query, page: 0 };
    }

    const { page } = sessionRef.current;
    const result = useInjectedAutocompleteSuggest(useSuggest, { query, enabled, page });
    const [stored, setStored] = useState<{ query: string; options: IComboboxOption[] }>({
        query,
        options: [],
    });

    useEffect(() => {
        if (!enabled || result.isLoading || result.isError) {
            return;
        }

        setStored(current => {
            const base = current.query === query ? current.options : [];
            const next = page === 0 ? result.options : appendSuggestPage(base, result.options);

            if (current.query === query && sameSuggestOptions(current.options, next)) {
                return current;
            }

            return { query, options: next };
        });
    }, [enabled, page, query, result.isError, result.isLoading, result.options]);

    const options = stored.query === query ? stored.options : [];
    const isLoadingMore = enabled && result.isLoading && page > 0;
    const isLoading = enabled && result.isLoading && page === 0;

    const loadMore = () => {
        if (!enabled || !result.hasMore || result.isLoading || result.isError) {
            return;
        }

        sessionRef.current.page += 1;
        rerender(value => value + 1);
    };

    return {
        options,
        isLoading,
        isLoadingMore,
        isError: result.isError,
        error: result.error,
        hasMore: enabled && result.hasMore,
        loadMore,
    };
};
