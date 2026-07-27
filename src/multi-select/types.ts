import { type Ref } from 'react';

import { type SelectProps as RacSelectProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';
import { type IComboboxOption, type TComboboxSize, type TComboboxValue, type TComboboxVariant } from '@/select/types';

export type { IComboboxOption, TComboboxSize, TComboboxValue, TComboboxVariant };

/** Theme inputs. */
export interface IMultiSelectThemeProps {
    /** MultiSelect size. */
    size?: TComboboxSize;
    /** Visual variant. */
    variant?: TComboboxVariant;
}

/** Control state (our names, not RAC). */
export interface IMultiSelectControlProps {
    /** Controlled value. `[]` means empty (after clear). */
    value?: TComboboxValue[];
    /** Uncontrolled initial value. */
    defaultValue?: TComboboxValue[];
    /** Selection change. Receives `[]` on clear. */
    onChange?: (value: TComboboxValue[]) => void;
    /** Show a clear button for the entire selection. */
    clear?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface IMultiSelectOwnProps extends IDataTestIdProps {
    /** Options list. */
    options: IComboboxOption[];
    /** Ref to the Select root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

/** Content slice for FormMultiSelect. */
export interface IMultiSelectContentProps {
    options: IComboboxOption[];
    clear?: boolean;
    placeholder?: string;
}

export interface IMultiSelectBaseProps
    extends IMultiSelectThemeProps, IFieldStateProps, IMultiSelectControlProps, IMultiSelectOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TMultiSelectRacOmit =
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

export interface IMultiSelectProps
    extends
        IMultiSelectBaseProps,
        Omit<RacSelectProps<object, 'multiple'>, keyof IMultiSelectBaseProps | TMultiSelectRacOmit> {}

export interface IFormMultiSelectProps
    extends IFormFieldLayoutProps, Pick<IMultiSelectThemeProps, 'variant'>, IMultiSelectContentProps {}
