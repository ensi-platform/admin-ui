import { type ComponentPropsWithRef, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

/** ColorField size. */
export type TColorFieldSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TColorFieldVariant = 'primary';

/** Theme inputs. */
export interface IColorFieldThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TColorFieldSize;
    /** Visual variant. */
    variant?: TColorFieldVariant;
}

/** Own / chrome props (not from RAC). */
export interface IColorFieldOwnProps extends IDataTestIdProps {
    /** Clear button for the current value. */
    clear?: boolean;
    /**
     * Preset swatches inside the popover.
     * Values that are not colors are dropped. No row when empty.
     */
    presets?: string[];
    /** Ref to the field group (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
    /** Ref to the hex input (React 19 prop). */
    inputRef?: Ref<HTMLInputElement>;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
}

/** Control state (our names, not RAC). */
export interface IColorFieldControlProps {
    /** `#rrggbb` or `''`. */
    value?: string;
    /** `#rrggbb` or `''`. */
    defaultValue?: string;
    /** `''` or canonical `#rrggbb`. */
    onChange?: (value: string) => void;
    onBlur?: () => void;
}

export interface IColorFieldBaseProps
    extends IColorFieldThemeProps, IFieldStateProps, IColorFieldOwnProps, IColorFieldControlProps {}

export interface IColorFieldProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IColorFieldBaseProps | 'children'>, IColorFieldBaseProps {}

/** Content slice for FormColorField. */
export interface IColorFieldContentProps {
    clear?: boolean;
    presets?: string[];
}

export interface IFormColorFieldProps
    extends IFormFieldLayoutProps, Pick<IColorFieldThemeProps, 'variant'>, IColorFieldContentProps {}
