import { type FocusEventHandler, type Ref } from 'react';

import { type SliderProps as RacSliderProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

export type TRatingSize = 'sm' | 'md' | 'lg';

export type TRatingVariant = 'primary';

/** Theme inputs. */
export interface IRatingThemeProps {
    /** Rating size. */
    size?: TRatingSize;
    /** Visual variant. */
    variant?: TRatingVariant;
}

/** Control state (our names, not RAC). */
export interface IRatingControlProps {
    /** Controlled value. */
    value?: number;
    /** Uncontrolled initial value. */
    defaultValue?: number;
    /** Value change handler. */
    onChange?: (value: number) => void;
    /** Blur handler for the range input. */
    onBlur?: FocusEventHandler<HTMLInputElement>;
    /** Minimum value. A click on the current half returns here. */
    minValue?: number;
    /** Maximum value. One star per unit above `minValue`. */
    maxValue?: number;
    /** Step between values. */
    step?: number;
    /** Show the value without a slider. */
    readOnly?: boolean;
}

/** Own / chrome props (not from RAC). */
export interface IRatingOwnProps extends IDataTestIdProps {
    /** Ref to the range input (React 19 prop). */
    ref?: Ref<HTMLInputElement>;
}

/** Content slice for FormRating. */
export interface IRatingContentProps {
    minValue?: number;
    maxValue?: number;
    step?: number;
    readOnly?: boolean;
    /** Accessible name when there is no visible `label`. */
    'aria-label'?: string;
}

export interface IRatingBaseProps
    extends IRatingThemeProps, Pick<IFieldStateProps, 'invalid' | 'disabled'>, IRatingControlProps, IRatingOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TRatingRacOmit =
    'isDisabled' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'minValue' | 'maxValue' | 'step';

export interface IRatingProps
    extends IRatingBaseProps, Omit<RacSliderProps<number>, keyof IRatingBaseProps | TRatingRacOmit> {}

export interface IFormRatingProps
    extends IFormFieldLayoutProps, Pick<IRatingThemeProps, 'variant'>, IRatingContentProps {}
