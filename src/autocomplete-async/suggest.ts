import { type IComboboxOption } from '@/select/types';

/** Args for an async suggest hook (AP implements). */
export interface IAutocompleteSuggestInput {
    /** Current search string (already debounced by caller if needed). */
    query: string;
    /** Skip fetch (closed popover, below minLength, disabled). */
    enabled?: boolean;
}

/** Result shape Autocomplete glue expects from AP. */
export interface IAutocompleteSuggestResult {
    options: IComboboxOption[];
    /**
     * True while a suggest request is in flight.
     * For React Query prefer `isFetching` (not only initial `isLoading`).
     */
    isLoading: boolean;
    /** Optional; UI can show error empty-state. */
    isError?: boolean;
    error?: Error | null;
}

/** Hook module contract — AP services implement this signature. */
export type TUseAutocompleteSuggest = (input: IAutocompleteSuggestInput) => IAutocompleteSuggestResult;
