import { type IDataTestIdProps } from '@ds/common';

import { type IUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { type TComboboxValue } from '@/combobox/types';

/** Flat suggest list: search field and checkboxes, no popover. */
export interface ISuggestChecklistProps extends IDataTestIdProps {
    /** AP suggest module. Must be a stable hook reference. */
    useSuggest: IUseAutocompleteSuggest;
    /** Skip fetch below this length. */
    minLength?: number;
    /** Debounce query before calling useSuggest. */
    debounceMs?: number;
    /** Controlled selection. */
    value?: TComboboxValue[];
    /** Uncontrolled initial selection. */
    defaultValue?: TComboboxValue[];
    /** Selection change. */
    onChange?: (value: TComboboxValue[]) => void;
    /** Search field placeholder. */
    placeholder?: string;
    /** Disables search and checkboxes. */
    disabled?: boolean;
    /** Accessible name of the search field. */
    'aria-label'?: string;
}
