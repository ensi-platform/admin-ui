import { type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type TUseAutocompleteSuggest } from '@/autocomplete-async/suggest';
import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';
import {
    type IMultiAutocompleteContentProps,
    type IMultiAutocompleteControlProps,
    type IMultiAutocompleteThemeProps,
    type TMultiAutocompleteSize,
    type TMultiAutocompleteVariant,
} from '@/multi-autocomplete/types';

export type { TMultiAutocompleteSize, TMultiAutocompleteVariant, TUseAutocompleteSuggest };

/** Theme inputs. */
export interface IMultiAutocompleteAsyncThemeProps extends IMultiAutocompleteThemeProps {}

/** Control state (our names, not RAC). */
export interface IMultiAutocompleteAsyncControlProps extends Omit<
    IMultiAutocompleteControlProps,
    'inputValue' | 'defaultInputValue' | 'onInputChange'
> {}

/** Own / chrome props (not from RAC). */
export interface IMultiAutocompleteAsyncOwnProps extends IDataTestIdProps {
    /** AP suggest module. Must be a stable hook reference. */
    useSuggest: TUseAutocompleteSuggest;
    /** Skip fetch below this length. */
    minLength?: number;
    /** Debounce query before calling useSuggest. */
    debounceMs?: number;
    /** Ref to the ComboBox root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
    placeholder?: string;
}

/** Content slice for FormMultiAutocompleteAsync. */
export interface IMultiAutocompleteAsyncContentProps extends Omit<
    IMultiAutocompleteContentProps,
    'options' | 'clientFilter' | 'isLoading' | 'isError'
> {
    useSuggest: TUseAutocompleteSuggest;
    minLength?: number;
    debounceMs?: number;
}

export interface IMultiAutocompleteAsyncBaseProps
    extends
        IMultiAutocompleteAsyncThemeProps,
        IFieldStateProps,
        IMultiAutocompleteAsyncControlProps,
        IMultiAutocompleteAsyncOwnProps {}

export interface IMultiAutocompleteAsyncProps extends IMultiAutocompleteAsyncBaseProps {
    className?: string;
    name?: string;
    onBlur?: () => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
    id?: string;
}

export interface IFormMultiAutocompleteAsyncProps
    extends
        IFormFieldLayoutProps,
        Pick<IMultiAutocompleteAsyncThemeProps, 'variant'>,
        IMultiAutocompleteAsyncContentProps {}
