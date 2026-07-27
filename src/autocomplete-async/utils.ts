/** True while debounce is pending or the suggest hook reports an in-flight fetch. */
export const isAsyncSuggestLoading = ({
    disabled,
    inputValue,
    debouncedQuery,
    minLength,
    isLoading,
}: {
    disabled: boolean;
    inputValue: string;
    debouncedQuery: string;
    minLength: number;
    isLoading: boolean;
}) => {
    const willFetch = !disabled && inputValue.length >= minLength;
    const isDebouncePending = willFetch && inputValue !== debouncedQuery;

    return isLoading || isDebouncePending;
};
