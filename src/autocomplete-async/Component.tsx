import { Autocomplete } from '@/autocomplete';
import { useAutocompleteAsyncInput, useAutocompleteAsyncSuggest } from '@/autocomplete-shared/use-async-suggest';

import { type IAutocompleteAsyncProps } from './types';

export const AutocompleteAsync = ({
    useSuggest,
    minLength = 0,
    debounceMs = 300,
    disabled = false,
    ...props
}: IAutocompleteAsyncProps) => {
    const { inputValue, setInputValue, debouncedQuery } = useAutocompleteAsyncInput(debounceMs);
    const enabled = !disabled && debouncedQuery.length >= minLength;
    const { options, isLoading, isError } = useAutocompleteAsyncSuggest({
        useSuggest,
        query: debouncedQuery,
        enabled,
    });

    return (
        <Autocomplete
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

AutocompleteAsync.displayName = 'AutocompleteAsync';
