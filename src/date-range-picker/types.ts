import { type Ref } from 'react';

import { type DateValue } from '@internationalized/date';
import { type DateRangePickerProps as RacDateRangePickerProps, type DateRange } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

/** DateRangePicker size. */
export type TDateRangePickerSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TDateRangePickerVariant = 'primary';

/** Theme inputs. */
export interface IDateRangePickerThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TDateRangePickerSize;
    /** Visual variant. */
    variant?: TDateRangePickerVariant;
    /**
     * Stretch to container width.
     * @default true
     */
    block?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface IDateRangePickerOwnProps extends IDataTestIdProps {
    /** Clear button for the current value. */
    clear?: boolean;
    /** Class name on the DateRangePicker root. */
    className?: string;
    /** Ref to the group element (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IDateRangePickerBaseProps
    extends IDateRangePickerThemeProps, IFieldStateProps, IDateRangePickerOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TDateRangePickerRacOmit =
    'isDisabled' | 'isInvalid' | 'isOpen' | 'onOpenChange' | 'value' | 'defaultValue' | 'onChange';

export interface IDateRangePickerProps
    extends
        IDateRangePickerBaseProps,
        Omit<RacDateRangePickerProps<DateValue>, keyof IDateRangePickerBaseProps | TDateRangePickerRacOmit> {
    value?: DateRange | null;
    defaultValue?: DateRange | null;
    onChange?: (value: DateRange | null) => void;
}

/** Content slice for FormDateRangePicker. */
export type TDateRangePickerFormRacOmit =
    | TDateRangePickerRacOmit
    | keyof IDateRangePickerBaseProps
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'className';

export interface IDateRangePickerContentProps extends Omit<
    RacDateRangePickerProps<DateValue>,
    TDateRangePickerFormRacOmit
> {
    clear?: boolean;
}

export interface IFormDateRangePickerProps
    extends IFormFieldLayoutProps, Pick<IDateRangePickerThemeProps, 'variant'>, IDateRangePickerContentProps {}
