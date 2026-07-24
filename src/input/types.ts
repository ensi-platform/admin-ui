import { type Ref } from 'react';

import { type InputProps as RacInputProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

export type TInputSize = 'sm' | 'md' | 'lg';

export type TInputVariant = 'primary';

/** Theme inputs. */
export interface IInputThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TInputSize;
    /** Visual variant. */
    variant?: TInputVariant;
}

/** Own / chrome props (not from RAC). */
export interface IInputOwnProps extends IDataTestIdProps {
    /** Clear button for the current value. */
    clear?: boolean;
    /** Ref to the native input (React 19 prop). */
    ref?: Ref<HTMLInputElement>;
}

export interface IInputBaseProps extends IInputThemeProps, IFieldStateProps, IInputOwnProps {}

/** RAC keys with different names / already in Base. */
export type TInputRacOmit = 'disabled' | 'size' | 'isDisabled' | 'isInvalid';

export interface IInputProps extends IInputBaseProps, Omit<RacInputProps, keyof IInputBaseProps | TInputRacOmit> {}

/** Passthrough into FormInput (RAC without RHF/shell/theme). className belongs on the Field shell. */
export type TInputFormRacOmit =
    TInputRacOmit | keyof IInputBaseProps | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'name' | 'className';

export interface IInputContentProps extends Omit<RacInputProps, TInputFormRacOmit> {
    clear?: boolean;
}

export interface IFormInputProps extends IFormFieldLayoutProps, Pick<IInputThemeProps, 'variant'>, IInputContentProps {}
