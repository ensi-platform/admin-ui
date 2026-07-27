import { type Ref } from 'react';

import { type SelectProps as RacSelectProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';
import {
    type IComboboxOption,
    type TComboboxSize,
    type TComboboxValue,
    type TComboboxVariant,
} from '@/combobox/types';

export type { IComboboxOption, TComboboxSize, TComboboxValue, TComboboxVariant };

/** Theme inputs. */
export interface ISelectThemeProps {
    /** Select size. */
    size?: TComboboxSize;
    /** Visual variant. */
    variant?: TComboboxVariant;
}

/** Control state (our names, not RAC). */
export interface ISelectControlProps {
    /** Controlled value. `null` means empty (after clear). */
    value?: TComboboxValue | null;
    /** Uncontrolled initial value. */
    defaultValue?: TComboboxValue | null;
    /** Selection change. Receives `null` on clear. */
    onChange?: (value: TComboboxValue | null) => void;
    /** Show a clear button for the selected value. */
    clear?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface ISelectOwnProps extends IDataTestIdProps {
    /** Options list. */
    options: IComboboxOption[];
    /** Ref to the Select root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

/** Content slice for FormSelect. */
export interface ISelectContentProps {
    options: IComboboxOption[];
    clear?: boolean;
    placeholder?: string;
}

export interface ISelectBaseProps extends ISelectThemeProps, IFieldStateProps, ISelectControlProps, ISelectOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TSelectRacOmit =
    | 'children'
    | 'isDisabled'
    | 'isInvalid'
    | 'selectedKey'
    | 'defaultSelectedKey'
    | 'onSelectionChange'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'selectionMode';

export interface ISelectProps
    extends ISelectBaseProps, Omit<RacSelectProps<object, 'single'>, keyof ISelectBaseProps | TSelectRacOmit> {}

export interface IFormSelectProps
    extends IFormFieldLayoutProps, Pick<ISelectThemeProps, 'variant'>, ISelectContentProps {}
