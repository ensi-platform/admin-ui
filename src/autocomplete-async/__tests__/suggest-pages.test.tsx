import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { type IComboboxOption } from '@/select/types';

import { useAutocompleteAsyncSuggest } from '../hooks/useAsyncSuggest';
import { type IUseAutocompleteSuggest } from '../types';
import { appendSuggestPage } from '../utils';

const pageA: IComboboxOption[] = [{ value: 'a', label: 'A' }];
const pageB: IComboboxOption[] = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
];

describe('appendSuggestPage', () => {
    it('drops values that are already loaded', () => {
        expect(appendSuggestPage(pageA, pageB)).toEqual([
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
        ]);
    });

    it('keeps the current list when the page adds nothing', () => {
        expect(appendSuggestPage(pageA, [{ value: 'a', label: 'A' }])).toBe(pageA);
    });

    it('keeps the current list when the page is empty', () => {
        expect(appendSuggestPage(pageA, [])).toBe(pageA);
    });
});

describe('useAutocompleteAsyncSuggest', () => {
    it('resets to page 0 when the query changes and appends the next page', async () => {
        const seen: number[] = [];
        const useSuggest: IUseAutocompleteSuggest = ({ query, page }) => {
            seen.push(page);

            if (query === 'next') {
                return { options: [{ value: 'c', label: 'C' }], isLoading: false, hasMore: false };
            }

            if (page === 0) {
                return { options: pageA, isLoading: false, hasMore: true };
            }

            return { options: [{ value: 'b', label: 'B' }], isLoading: false, hasMore: false };
        };

        const { result, rerender } = renderHook(
            ({ query }) => useAutocompleteAsyncSuggest({ useSuggest, query, enabled: true }),
            { initialProps: { query: 'a' } }
        );

        await waitFor(() => {
            expect(result.current.options).toEqual(pageA);
        });

        result.current.loadMore();

        await waitFor(() => {
            expect(result.current.options).toEqual([
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B' },
            ]);
        });

        expect(result.current.hasMore).toBe(false);

        rerender({ query: 'next' });

        await waitFor(() => {
            expect(result.current.options).toEqual([{ value: 'c', label: 'C' }]);
        });

        expect(seen).toContain(0);
        expect(seen).toContain(1);

        const calls = seen.length;

        result.current.loadMore();

        expect(result.current.hasMore).toBe(false);
        expect(result.current.options).toEqual([{ value: 'c', label: 'C' }]);
        expect(seen).toHaveLength(calls);
    });
});
