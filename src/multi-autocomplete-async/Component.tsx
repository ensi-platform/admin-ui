import { useAutocompleteAsyncInput, useAutocompleteAsyncSuggest } from '@/autocomplete-shared/use-async-suggest';
import { MultiAutocomplete } from '@/multi-autocomplete';

import { type IMultiAutocompleteAsyncProps } from './types';

export const MultiAutocompleteAsync = ({
    useSuggest,
    minLength = 0,
    debounceMs = 300,
    disabled = false,
    ...props
}: IMultiAutocompleteAsyncProps) => {
    const { inputValue, setInputValue, debouncedQuery } = useAutocompleteAsyncInput(debounceMs);
    const enabled = !disabled && debouncedQuery.length >= minLength;
    const { options, isLoading, isError } = useAutocompleteAsyncSuggest({
        useSuggest,
        query: debouncedQuery,
        enabled,
    });

    return (
        <MultiAutocomplete
            {...props}
            disabled={disabled}
            options={options}
            clientFilter={false}
            isLoading={isLoading}
            isError={Boolean(isError)}
            inputValue={inputValue}
            onInputChange={setInputValue}
        />
    );
};

MultiAutocompleteAsync.displayName = 'MultiAutocompleteAsync';
