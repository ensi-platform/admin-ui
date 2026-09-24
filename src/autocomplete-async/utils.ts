import { type IComboboxOption } from '@/select/types';

const sameOption = (left: IComboboxOption, right: IComboboxOption) =>
    left.value === right.value && left.label === right.label && left.disabled === right.disabled;

/** True when two option lists are the same page, in order. */
export const sameSuggestOptions = (left: IComboboxOption[], right: IComboboxOption[]) =>
    left.length === right.length && left.every((item, index) => right[index] != null && sameOption(item, right[index]));

/** Append a page, dropping values already present. */
export const appendSuggestPage = (current: IComboboxOption[], page: IComboboxOption[]): IComboboxOption[] => {
    if (page.length === 0) {
        return current;
    }

    const seen = new Set(current.map(item => item.value));
    const extra = page.filter(item => !seen.has(item.value));

    return extra.length === 0 ? current : [...current, ...extra];
};

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
