import {
    type IAutocompleteSuggestInput,
    type IAutocompleteSuggestResult,
    type TUseAutocompleteSuggest,
} from './suggest';

/**
 * Calls the injected AP suggest hook.
 * Keeps the dynamic hook call in one place for react-hooks lint.
 */
export const useInjectedAutocompleteSuggest = (
    useSuggest: TUseAutocompleteSuggest,
    input: IAutocompleteSuggestInput
): IAutocompleteSuggestResult =>
    // Injected suggest hook module (stable prop); not a conditional call.

    useSuggest(input);
