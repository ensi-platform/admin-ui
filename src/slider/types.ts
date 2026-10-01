import { type FocusEventHandler, type ReactNode, type Ref } from 'react';

import { type SliderProps as RacSliderProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

export type TSliderSize = 'sm' | 'md' | 'lg';

export type TSliderVariant = 'primary';

/** Theme inputs. */
export interface ISliderThemeProps {
    /** Slider size. */
    size?: TSliderSize;
    /** Visual variant. */
    variant?: TSliderVariant;
}

/** Control state (our names, not RAC). */
export interface ISliderControlProps {
    /** Controlled value. */
    value?: number;
    /** Uncontrolled initial value. */
    defaultValue?: number;
    /** Value change handler. */
    onChange?: (value: number) => void;
    /** Blur handler for the range input. */
    onBlur?: FocusEventHandler<HTMLInputElement>;
    /** Minimum value. */
    minValue?: number;
    /** Maximum value. */
    maxValue?: number;
    /** Step between values. */
    step?: number;
}

/** Own / chrome props (not from RAC). */
export interface ISliderOwnProps extends IDataTestIdProps {
    /** Marks at each step. */
    ticks?: boolean;
    /** Text for the current value. */
    formatValue?: (value: number) => ReactNode;
    /** Secondary text for the current value. */
    formatDetail?: (value: number) => ReactNode;
    /** Ref to the hidden range input (React 19 prop). */
    ref?: Ref<HTMLInputElement>;
}

/** Content slice for FormSlider. */
export interface ISliderContentProps {
    minValue?: number;
    maxValue?: number;
    step?: number;
    ticks?: boolean;
    formatValue?: (value: number) => ReactNode;
    formatDetail?: (value: number) => ReactNode;
    /** Accessible name when there is no visible `label`. */
    'aria-label'?: string;
}

export interface ISliderBaseProps extends ISliderThemeProps, IFieldStateProps, ISliderControlProps, ISliderOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TSliderRacOmit =
    'children' | 'isDisabled' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'minValue' | 'maxValue' | 'step';

export interface ISliderProps
    extends ISliderBaseProps, Omit<RacSliderProps<number>, keyof ISliderBaseProps | TSliderRacOmit> {}

export interface IFormSliderProps
    extends IFormFieldLayoutProps, Pick<ISliderThemeProps, 'variant'>, ISliderContentProps {}
