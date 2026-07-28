import { type Ref } from 'react';

import { type DateValue } from '@internationalized/date';
import { type DatePickerProps as RacDatePickerProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

/** DatePicker size. */
export type TDatePickerSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TDatePickerVariant = 'primary';

/** Theme inputs. */
export interface IDatePickerThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TDatePickerSize;
    /** Visual variant. */
    variant?: TDatePickerVariant;
    /**
     * Stretch to container width.
     * @default true
     */
    block?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface IDatePickerOwnProps extends IDataTestIdProps {
    /** Clear button for the current value. */
    clear?: boolean;
    /** Class name on the DatePicker root. */
    className?: string;
    /** Ref to the group element (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IDatePickerBaseProps extends IDatePickerThemeProps, IFieldStateProps, IDatePickerOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TDatePickerRacOmit =
    'isDisabled' | 'isInvalid' | 'isOpen' | 'onOpenChange' | 'value' | 'defaultValue' | 'onChange';

export interface IDatePickerProps
    extends IDatePickerBaseProps, Omit<RacDatePickerProps<DateValue>, keyof IDatePickerBaseProps | TDatePickerRacOmit> {
    value?: DateValue | null;
    defaultValue?: DateValue | null;
    onChange?: (value: DateValue | null) => void;
}

/** Content slice for FormDatePicker. */
export type TDatePickerFormRacOmit =
    | TDatePickerRacOmit
    | keyof IDatePickerBaseProps
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'className';

export interface IDatePickerContentProps extends Omit<RacDatePickerProps<DateValue>, TDatePickerFormRacOmit> {
    clear?: boolean;
}

export interface IFormDatePickerProps
    extends IFormFieldLayoutProps, Pick<IDatePickerThemeProps, 'variant'>, IDatePickerContentProps {}
