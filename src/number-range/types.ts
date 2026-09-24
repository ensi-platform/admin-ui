import { type ComponentPropsWithRef, type FocusEventHandler } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

export type TNumberRangeSize = 'sm' | 'md' | 'lg';

export type TNumberRangeVariant = 'primary';

/** Range value. `null` on a side means that side is empty. */
export interface INumberRangeValue {
    from: number | null;
    to: number | null;
}

/** Theme inputs. */
export interface INumberRangeThemeProps {
    /** NumberRange size. */
    size?: TNumberRangeSize;
    /** Visual variant. */
    variant?: TNumberRangeVariant;
}

/** Control state (our names, not RAC). */
export interface INumberRangeControlProps {
    /** Controlled range. */
    value?: INumberRangeValue;
    /** Uncontrolled initial range. */
    defaultValue?: INumberRangeValue;
    /** Range change handler. */
    onChange?: (value: INumberRangeValue) => void;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    /** Minimum view value for both sides. */
    min?: number;
    /** Maximum view value for both sides. */
    max?: number;
    /** Step for both sides. */
    step?: number;
    /** Intl.NumberFormat options for both sides. */
    formatOptions?: Intl.NumberFormatOptions;
}

/** Own / chrome props (not from RAC|DOM). */
export interface INumberRangeOwnProps extends IDataTestIdProps {
    /** Placeholder for the start field. */
    fromPlaceholder?: string;
    /** Placeholder for the end field. */
    toPlaceholder?: string;
    /** Accessible name for the start field. */
    fromLabel?: string;
    /** Accessible name for the end field. */
    toLabel?: string;
    /** Clear button on each side. */
    clear?: boolean;
}

export interface INumberRangeBaseProps
    extends INumberRangeThemeProps, IFieldStateProps, INumberRangeControlProps, INumberRangeOwnProps {}

export interface INumberRangeProps
    extends
        Omit<
            ComponentPropsWithRef<'div'>,
            keyof INumberRangeBaseProps | 'onChange' | 'onBlur' | 'defaultValue' | 'children'
        >,
        INumberRangeBaseProps {}

/** Content slice for FormNumberRange. */
export interface INumberRangeContentProps {
    clear?: boolean;
    fromPlaceholder?: string;
    toPlaceholder?: string;
    fromLabel?: string;
    toLabel?: string;
    min?: number;
    max?: number;
    step?: number;
    formatOptions?: Intl.NumberFormatOptions;
}

export interface IFormNumberRangeProps
    extends IFormFieldLayoutProps, Pick<INumberRangeThemeProps, 'variant'>, INumberRangeContentProps {}
