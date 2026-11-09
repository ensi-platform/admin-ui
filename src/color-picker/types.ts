import { type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own / chrome props (not from RAC). */
export interface IColorPickerOwnProps extends IDataTestIdProps {
    /**
     * Preset swatches.
     * Values that are not colors are dropped. No row when empty.
     */
    presets?: string[];
    /**
     * Hue in degrees for a gray color.
     * The field keeps it so the slider survives a closed popover.
     */
    hue?: number;
    /** Class name on the palette root. */
    className?: string;
    /** Ref to the palette root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
    'aria-label'?: string;
}

/** Control state (our names, not RAC). */
export interface IColorPickerControlProps {
    /** `#rrggbb` or `''`. Empty shows a gray draft and is not emitted. */
    value?: string;
    /** `#rrggbb` or `''`. */
    defaultValue?: string;
    /** Canonical `#rrggbb`. Empty is never emitted. */
    onChange?: (value: string) => void;
    /** Live `#rrggbb` while the pointer is down. Not a commit. */
    onPreview?: (value: string) => void;
    /** Hue channel after a palette change. */
    onHueChange?: (hue: number) => void;
    disabled?: boolean;
}

export interface IColorPickerProps extends IColorPickerOwnProps, IColorPickerControlProps {}
