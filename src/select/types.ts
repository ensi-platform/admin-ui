import { type Ref } from 'react';

import { type SelectProps as RacSelectProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

export type TSelectSize = 'sm' | 'md' | 'lg';

export type TSelectVariant = 'primary';

export type TSelectValue = string | number;

export interface ISelectOption {
    /** Option value (RAC Key). */
    value: TSelectValue;
    /** Label shown in the list and in the trigger. */
    label: string;
    /** Disabled option. */
    disabled?: boolean;
}

/** Theme inputs. */
export interface ISelectThemeProps {
    /** Select size. */
    size?: TSelectSize;
    /** Visual variant. */
    variant?: TSelectVariant;
}

/** Control state (our names, not RAC). */
export interface ISelectControlProps {
    /** Controlled value. `null` means empty (after clear). */
    value?: TSelectValue | null;
    /** Uncontrolled initial value. */
    defaultValue?: TSelectValue | null;
    /** Selection change. Receives `null` on clear. */
    onChange?: (value: TSelectValue | null) => void;
    /** Show a clear button for the selected value. */
    clear?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface ISelectOwnProps extends IDataTestIdProps {
    /** Options list. */
    options: ISelectOption[];
    /** Ref to the Select root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

/** Content slice for FormSelect. */
export interface ISelectContentProps {
    options: ISelectOption[];
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
