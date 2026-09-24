import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Collection, ListBox, ListBoxItem, ListBoxLoadMoreItem, ListLayout, Virtualizer } from 'react-aria-components';

import { useAutocompleteAsyncInput, useAutocompleteAsyncSuggest } from '@/autocomplete-async/hooks/useAsyncSuggest';
import { isAsyncSuggestLoading } from '@/autocomplete-async/utils';
import { Checkbox } from '@/checkbox';
import { ComboboxListStatus, readCssPx, useComboboxListMetrics } from '@/combobox';
import { type IComboboxOption, type TComboboxValue } from '@/combobox/types';
import { Input } from '@/input';
import { useAuiLabels } from '@/provider';

import { type ISuggestChecklistProps } from './types';

import styles from './styles.module.css';

const pinSelected = (
    selected: TComboboxValue[],
    options: IComboboxOption[],
    cache: Map<TComboboxValue, IComboboxOption>
): IComboboxOption[] => {
    options.forEach(option => {
        cache.set(option.value, option);
    });

    const fetched = new Set(options.map(option => option.value));
    const pinned = selected.flatMap(item => {
        if (fetched.has(item)) {
            return [];
        }

        const cached = cache.get(item);

        return cached ? [cached] : [];
    });

    return [...pinned, ...options];
};

export const SuggestChecklist = ({
    useSuggest,
    minLength = 0,
    debounceMs = 300,
    value,
    defaultValue = [],
    onChange,
    placeholder,
    disabled = false,
    dataTestId,
    'aria-label': ariaLabel,
}: ISuggestChecklistProps) => {
    const { inputValue, setInputValue, debouncedQuery } = useAutocompleteAsyncInput(debounceMs);
    const enabled = !disabled && debouncedQuery.length >= minLength;
    const { loadingSuggestions } = useAuiLabels();
    const { options, isLoading, isLoadingMore, isError, hasMore, loadMore } = useAutocompleteAsyncSuggest({
        useSuggest,
        query: debouncedQuery,
        enabled,
    });
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const selected = value ?? uncontrolled;
    const cacheRef = useRef(new Map<TComboboxValue, IComboboxOption>());
    const loading = isAsyncSuggestLoading({
        disabled,
        inputValue,
        debouncedQuery,
        minLength,
        isLoading,
    });
    const { rowSize } = useComboboxListMetrics('md');
    const [gap, setGap] = useState(() => readCssPx('--aui-checkbox-group-gap-md', 8));

    useLayoutEffect(() => {
        setGap(readCssPx('--aui-checkbox-group-gap-md', 8));
    }, []);

    const rows = useMemo(() => pinSelected(selected, options, cacheRef.current), [options, selected]);

    const setSelected = (next: TComboboxValue[]) => {
        onChange?.(next);

        if (value === undefined) {
            setUncontrolled(next);
        }
    };

    const toggle = (optionValue: TComboboxValue, checked: boolean) => {
        const next = checked ? [...selected, optionValue] : selected.filter(item => item !== optionValue);

        setSelected(next);
    };

    const showStatus = rows.length === 0;

    return (
        <div className={styles.root} data-test-id={dataTestId}>
            <Input
                aria-label={ariaLabel}
                className={styles.field}
                placeholder={placeholder}
                value={inputValue}
                disabled={disabled}
                onChange={event => setInputValue(event.target.value)}
            />
            {showStatus ? (
                <ComboboxListStatus
                    isLoading={loading}
                    isError={Boolean(isError) && !loading}
                    isEmpty={!loading && !isError}
                />
            ) : (
                <Virtualizer layout={ListLayout} layoutOptions={{ rowSize, gap, loaderSize: rowSize }}>
                    <ListBox className={styles.list} aria-label={ariaLabel} selectionMode="none">
                        <Collection items={rows}>
                            {option => (
                                <ListBoxItem id={option.value} textValue={option.label} className={styles.item}>
                                    <Checkbox
                                        checked={selected.includes(option.value)}
                                        disabled={disabled}
                                        onChange={checked => toggle(option.value, checked)}
                                    >
                                        {option.label}
                                    </Checkbox>
                                </ListBoxItem>
                            )}
                        </Collection>
                        {hasMore || isLoadingMore ? (
                            <ListBoxLoadMoreItem isLoading={isLoadingMore} onLoadMore={loadMore}>
                                {isLoadingMore ? (
                                    <span className={styles.more} role="status">
                                        {loadingSuggestions}
                                    </span>
                                ) : null}
                            </ListBoxLoadMoreItem>
                        ) : null}
                    </ListBox>
                </Virtualizer>
            )}
        </div>
    );
};

SuggestChecklist.displayName = 'SuggestChecklist';
