import { useEffect, useRef } from 'react';

import { Autocomplete } from '@/autocomplete';
import { type IComboboxOption, type TComboboxValue } from '@/select/types';

import { useAutocompleteAsyncInput, useAutocompleteAsyncSuggest } from './hooks/useAsyncSuggest';
import { type IAutocompleteAsyncProps } from './types';
import { isAsyncSuggestLoading } from './utils';

export const AutocompleteAsync = ({
    useSuggest,
    minLength = 0,
    debounceMs = 300,
    disabled = false,
    value,
    onChange,
    ...props
}: IAutocompleteAsyncProps) => {
    const { inputValue, setInputValue, debouncedQuery } = useAutocompleteAsyncInput(debounceMs);
    const selectedRef = useRef<IComboboxOption | null>(null);
    const enabled = !disabled && debouncedQuery.length >= minLength;
    const { options, isLoading, isError } = useAutocompleteAsyncSuggest({
        useSuggest,
        query: debouncedQuery,
        enabled,
    });

    const handleChange = (next: TComboboxValue | null) => {
        if (next == null || next === '') {
            selectedRef.current = null;
            setInputValue('');
            onChange?.(next);

            return;
        }

        const fromOptions = options.find(item => item.value === next);
        const cachedLabel = selectedRef.current?.value === next ? selectedRef.current.label : undefined;
        const label = fromOptions?.label ?? cachedLabel;

        if (fromOptions) {
            selectedRef.current = fromOptions;
        }

        if (!fromOptions && label != null) {
            selectedRef.current = { value: next, label };
        }

        if (label != null) {
            setInputValue(label);
        }

        onChange?.(next);
    };

    useEffect(() => {
        // Uncontrolled value — selection display is owned by handleChange only.
        if (value === undefined) {
            return;
        }

        if (value === null || value === '') {
            const previousLabel = selectedRef.current?.label;

            if (selectedRef.current != null) {
                selectedRef.current = null;
            }

            if (previousLabel != null && inputValue === previousLabel) {
                setInputValue('');
            }

            return;
        }

        const fromOptions = options.find(item => item.value === value);
        const cached = selectedRef.current?.value === value ? selectedRef.current : null;
        const option = fromOptions ?? cached;

        if (!option) {
            return;
        }

        if (fromOptions) {
            selectedRef.current = fromOptions;
        }

        const previousLabel = cached?.label;
        const shouldSyncEmpty = inputValue === '';
        const shouldSyncRenamedLabel =
            previousLabel != null && inputValue === previousLabel && inputValue !== option.label;

        // Sync empty display or label rename; do not overwrite in-progress typing.
        if (shouldSyncEmpty || shouldSyncRenamedLabel) {
            setInputValue(option.label);
        }
    }, [value, options, inputValue, setInputValue]);

    return (
        <Autocomplete
            {...props}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            options={options}
            clientFilter={false}
            isLoading={isAsyncSuggestLoading({
                disabled,
                inputValue,
                debouncedQuery,
                minLength,
                isLoading,
            })}
            isError={Boolean(isError)}
            inputValue={inputValue}
            onInputChange={setInputValue}
        />
    );
};

AutocompleteAsync.displayName = 'AutocompleteAsync';
