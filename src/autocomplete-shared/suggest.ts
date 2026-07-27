import { type ISelectOption } from '@/select/types';

/** Args for an async suggest hook (AP implements). */
export interface IAutocompleteSuggestInput {
    /** Current search string (already debounced by caller if needed). */
    query: string;
    /** Skip fetch (closed popover, below minLength, disabled). */
    enabled?: boolean;
}

/** Result shape Autocomplete glue expects from AP. */
export interface IAutocompleteSuggestResult {
    options: ISelectOption[];
    isLoading: boolean;
    /** Optional; UI can show error empty-state. */
    isError?: boolean;
    error?: Error | null;
}

/** Hook module contract — AP services implement this signature. */
export type TUseAutocompleteSuggest = (input: IAutocompleteSuggestInput) => IAutocompleteSuggestResult;
