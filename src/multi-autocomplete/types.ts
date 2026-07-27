import { type Ref } from 'react';

import { type ComboBoxProps as RacComboBoxProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';
import { type IComboboxOption, type TComboboxSize, type TComboboxValue, type TComboboxVariant } from '@/select/types';

export type { IComboboxOption, TComboboxSize, TComboboxValue, TComboboxVariant };

export type TMultiAutocompleteSize = TComboboxSize;
export type TMultiAutocompleteVariant = TComboboxVariant;

/** Theme inputs. */
export interface IMultiAutocompleteThemeProps {
    /** MultiAutocomplete size. */
    size?: TMultiAutocompleteSize;
    /** Visual variant. */
    variant?: TMultiAutocompleteVariant;
}

/** Control state (our names, not RAC). */
export interface IMultiAutocompleteControlProps {
    /** Controlled value. `[]` means empty (after clear). */
    value?: TComboboxValue[];
    /** Uncontrolled initial value. */
    defaultValue?: TComboboxValue[];
    /** Selection change. Receives `[]` on clear. */
    onChange?: (value: TComboboxValue[]) => void;
    /** Controlled input text. */
    inputValue?: string;
    /** Uncontrolled initial input text. */
    defaultInputValue?: string;
    /** Input text change. */
    onInputChange?: (value: string) => void;
    /** Show a clear button for the entire selection. */
    clear?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface IMultiAutocompleteOwnProps extends IDataTestIdProps {
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

/** Content slice for FormMultiAutocomplete. */
export interface IMultiAutocompleteContentProps {
    options: IComboboxOption[];
    clear?: boolean;
    placeholder?: string;
    clientFilter?: boolean;
    isLoading?: boolean;
    isError?: boolean;
}

export interface IMultiAutocompleteBaseProps
    extends
        IMultiAutocompleteThemeProps,
        IFieldStateProps,
        IMultiAutocompleteControlProps,
        IMultiAutocompleteOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TMultiAutocompleteRacOmit =
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

export interface IMultiAutocompleteProps
    extends
        IMultiAutocompleteBaseProps,
        Omit<RacComboBoxProps<object, 'multiple'>, keyof IMultiAutocompleteBaseProps | TMultiAutocompleteRacOmit> {}

export interface IFormMultiAutocompleteProps
    extends IFormFieldLayoutProps, Pick<IMultiAutocompleteThemeProps, 'variant'>, IMultiAutocompleteContentProps {}
