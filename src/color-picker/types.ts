import { type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

/** ColorPicker size. */
export type TColorPickerSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TColorPickerVariant = 'primary';

/** Theme inputs. */
export interface IColorPickerThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TColorPickerSize;
    /** Visual variant. */
    variant?: TColorPickerVariant;
}

/** Own / chrome props (not from RAC). */
export interface IColorPickerOwnProps extends IDataTestIdProps {
    /** Clear button for the current value. */
    clear?: boolean;
    /**
     * Preset swatches inside the popover.
     * Values that are not colors are dropped. No row when empty.
     */
    presets?: string[];
    /** Class name on the root. */
    className?: string;
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
export interface IColorPickerControlProps {
    /** `#rrggbb` or `''`. */
    value?: string;
    /** `#rrggbb` or `''`. */
    defaultValue?: string;
    /** `''` or canonical `#rrggbb`. */
    onChange?: (value: string) => void;
    onBlur?: () => void;
}

export interface IColorPickerBaseProps
    extends IColorPickerThemeProps, IFieldStateProps, IColorPickerOwnProps, IColorPickerControlProps {}

export interface IColorPickerProps extends IColorPickerBaseProps {}

/** Content slice for FormColorPicker. */
export interface IColorPickerContentProps {
    clear?: boolean;
    presets?: string[];
}

export interface IFormColorPickerProps
    extends IFormFieldLayoutProps, Pick<IColorPickerThemeProps, 'variant'>, IColorPickerContentProps {}
