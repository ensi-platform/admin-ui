import { type Ref } from 'react';

import { type ComboBoxProps as RacComboBoxProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';
import { type IComboboxOption, type TComboboxSize, type TComboboxValue, type TComboboxVariant } from '@/select/types';

export type { IComboboxOption, TComboboxSize, TComboboxValue, TComboboxVariant };

export type TAutocompleteSize = TComboboxSize;
export type TAutocompleteVariant = TComboboxVariant;

/** Theme inputs. */
export interface IAutocompleteThemeProps {
    /** Autocomplete size. */
    size?: TAutocompleteSize;
    /** Visual variant. */
    variant?: TAutocompleteVariant;
}

/** Control state (our names, not RAC). */
export interface IAutocompleteControlProps {
    /** Controlled value. `null` means empty (after clear). */
    value?: TComboboxValue | null;
    /** Uncontrolled initial value. */
    defaultValue?: TComboboxValue | null;
    /** Selection change. Receives `null` on clear. */
    onChange?: (value: TComboboxValue | null) => void;
    /** Controlled input text. */
    inputValue?: string;
    /** Uncontrolled initial input text. */
    defaultInputValue?: string;
    /** Input text change. */
    onInputChange?: (value: string) => void;
    /** Show a clear button for the selected value. */
    clear?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface IAutocompleteOwnProps extends IDataTestIdProps {
    /** Options list. */
    options: IComboboxOption[];
    /** Input placeholder. */
    placeholder?: string;
    /** When true, RAC filters `defaultItems` locally. When false, `items` are controlled (async). */
    clientFilter?: boolean;
    /** Show loading skeletons in the list. */
    isLoading?: boolean;
    /** Show error empty-state in the list. */
    isError?: boolean;
    /** Ref to the ComboBox root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

/** Content slice for FormAutocomplete. */
export interface IAutocompleteContentProps {
    options: IComboboxOption[];
    clear?: boolean;
    placeholder?: string;
    clientFilter?: boolean;
    isLoading?: boolean;
    isError?: boolean;
}

export interface IAutocompleteBaseProps
    extends IAutocompleteThemeProps, IFieldStateProps, IAutocompleteControlProps, IAutocompleteOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TAutocompleteRacOmit =
    | 'children'
    | 'isDisabled'
    | 'isInvalid'
    | 'selectedKey'
    | 'defaultSelectedKey'
    | 'onSelectionChange'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'inputValue'
    | 'defaultInputValue'
    | 'onInputChange'
    | 'selectionMode'
    | 'items'
    | 'defaultItems';

export interface IAutocompleteProps
    extends
        IAutocompleteBaseProps,
        Omit<RacComboBoxProps<object, 'single'>, keyof IAutocompleteBaseProps | TAutocompleteRacOmit> {}

export interface IFormAutocompleteProps
    extends IFormFieldLayoutProps, Pick<IAutocompleteThemeProps, 'variant'>, IAutocompleteContentProps {}
