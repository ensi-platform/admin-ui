import { type FocusEventHandler, type ReactNode, type Ref } from 'react';

import { type NumberFieldProps as RacNumberFieldProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

export type TNumberInputSize = 'sm' | 'md' | 'lg';

export type TNumberInputVariant = 'primary';

/** Maps store values ↔ view values (e.g. kopecks ↔ rubles). */
export interface INumberTransform<TStore = number> {
    format: (store: TStore | null | undefined) => number | null;
    parse: (view: number | null) => TStore | null;
}

/** Theme inputs. */
export interface INumberInputThemeProps {
    /** NumberInput size. */
    size?: TNumberInputSize;
    /** Visual variant. */
    variant?: TNumberInputVariant;
}

/** Control state (our names, not RAC). */
export interface INumberInputControlProps {
    /** Controlled view value. `null` means empty. */
    value?: number | null;
    /** Uncontrolled initial view value. */
    defaultValue?: number | null;
    /** View value change handler. */
    onChange?: (value: number | null) => void;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    /** Minimum view value. */
    min?: number;
    /** Maximum view value. */
    max?: number;
    /** Step for the view value. */
    step?: number;
}

/** Own / chrome props (not from RAC). */
export interface INumberInputOwnProps extends IDataTestIdProps {
    /** Content before the input. */
    prefix?: ReactNode;
    /** Content after the input (currency, unit, …). */
    suffix?: ReactNode;
    /** Clear button for the current value. */
    clear?: boolean;
    /** Placeholder text. */
    placeholder?: string;
    /** Native input `name`. */
    name?: string;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    /** Ref to the native input inside NumberField (React 19 prop). */
    ref?: Ref<HTMLInputElement>;
}

/** Content slice for FormNumberInput. */
export interface INumberInputContentProps {
    prefix?: ReactNode;
    suffix?: ReactNode;
    clear?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    transform?: INumberTransform;
}

export interface INumberInputBaseProps
    extends INumberInputThemeProps, IFieldStateProps, INumberInputControlProps, INumberInputOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TNumberInputRacOmit =
    | 'children'
    | 'isDisabled'
    | 'isInvalid'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'minValue'
    | 'maxValue'
    | 'placeholder'
    | 'name'
    | 'id'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby';

export interface INumberInputProps
    extends INumberInputBaseProps, Omit<RacNumberFieldProps, keyof INumberInputBaseProps | TNumberInputRacOmit> {}

export interface IFormNumberInputProps
    extends IFormFieldLayoutProps, Pick<INumberInputThemeProps, 'variant'>, INumberInputContentProps {}
