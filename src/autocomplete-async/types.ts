import { type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import {
    type IAutocompleteContentProps,
    type IAutocompleteControlProps,
    type IAutocompleteThemeProps,
    type TAutocompleteSize,
    type TAutocompleteVariant,
} from '@/autocomplete/types';
import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

import { type TUseAutocompleteSuggest } from './suggest';

export type { TAutocompleteSize, TAutocompleteVariant, TUseAutocompleteSuggest };

/** Theme inputs. */
export interface IAutocompleteAsyncThemeProps extends IAutocompleteThemeProps {}

/** Control state (our names, not RAC). */
export interface IAutocompleteAsyncControlProps extends Omit<
    IAutocompleteControlProps,
    'inputValue' | 'defaultInputValue' | 'onInputChange'
> {}

/** Own / chrome props (not from RAC). */
export interface IAutocompleteAsyncOwnProps extends IDataTestIdProps {
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

/** Content slice for FormAutocompleteAsync. */
export interface IAutocompleteAsyncContentProps extends Omit<
    IAutocompleteContentProps,
    'options' | 'clientFilter' | 'isLoading' | 'isError'
> {
    useSuggest: TUseAutocompleteSuggest;
    minLength?: number;
    debounceMs?: number;
}

export interface IAutocompleteAsyncBaseProps
    extends
        IAutocompleteAsyncThemeProps,
        IFieldStateProps,
        IAutocompleteAsyncControlProps,
        IAutocompleteAsyncOwnProps {}

export interface IAutocompleteAsyncProps extends IAutocompleteAsyncBaseProps {
    className?: string;
    name?: string;
    onBlur?: () => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
    id?: string;
}

export interface IFormAutocompleteAsyncProps
    extends IFormFieldLayoutProps, Pick<IAutocompleteAsyncThemeProps, 'variant'>, IAutocompleteAsyncContentProps {}
