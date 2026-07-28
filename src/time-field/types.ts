import { type Ref } from 'react';

import { type TimeValue, type TimeFieldProps as RacTimeFieldProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

/** TimeField size. */
export type TTimeFieldSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TTimeFieldVariant = 'primary';

/** Theme inputs. */
export interface ITimeFieldThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TTimeFieldSize;
    /** Visual variant. */
    variant?: TTimeFieldVariant;
    /**
     * Stretch to container width.
     * @default true
     */
    block?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface ITimeFieldOwnProps extends IDataTestIdProps {
    /** Clear button for the current value. */
    clear?: boolean;
    /** Class name on the TimeField root. */
    className?: string;
    /** Ref to the group element (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface ITimeFieldBaseProps extends ITimeFieldThemeProps, IFieldStateProps, ITimeFieldOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TTimeFieldRacOmit = 'isDisabled' | 'isInvalid' | 'value' | 'defaultValue' | 'onChange';

export interface ITimeFieldProps
    extends ITimeFieldBaseProps, Omit<RacTimeFieldProps<TimeValue>, keyof ITimeFieldBaseProps | TTimeFieldRacOmit> {
    value?: TimeValue | null;
    defaultValue?: TimeValue | null;
    onChange?: (value: TimeValue | null) => void;
}

/** Content slice for FormTimeField. */
export type TTimeFieldFormRacOmit =
    | TTimeFieldRacOmit
    | keyof ITimeFieldBaseProps
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'className';

export interface ITimeFieldContentProps extends Omit<RacTimeFieldProps<TimeValue>, TTimeFieldFormRacOmit> {
    clear?: boolean;
}

export interface IFormTimeFieldProps
    extends IFormFieldLayoutProps, Pick<ITimeFieldThemeProps, 'variant'>, ITimeFieldContentProps {}
