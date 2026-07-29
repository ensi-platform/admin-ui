import { type ElementType, type ReactNode } from 'react';

import { type IDataTestIdProps, type TMergeElementProps, type TSVGRIcon } from '@ds/common';

/** Icon props for `Button.icon`. */
export interface IButtonIconProps {
    /** SVG icon component (SVGR). */
    Component: TSVGRIcon;
    /** Place the icon after the text. */
    after?: boolean;
    /** Gap between the icon and the text. */
    indent?: number | string;
    /** Icon size. */
    size?: number | string;
    /** Extra className for the icon. */
    className?: string;
    /** Icon fill color. */
    fill?: string;
}

export type TButtonSize = 'sm' | 'md' | 'lg';

export type TButtonVariant = 'primary' | 'secondary' | 'danger';

/** Theme inputs. */
export interface IButtonThemeProps {
    /** Button size. */
    size?: TButtonSize;
    /** Visual variant. */
    variant?: TButtonVariant;
}

/** Own / chrome props (not from DOM). */
export interface IButtonOwnProps extends IDataTestIdProps {
    /** Content. */
    children: ReactNode;
    /** Leading or trailing icon. See `IButtonIconProps`. */
    icon?: IButtonIconProps;
    /** Stretch to 100% of the parent width. */
    block?: boolean;
}

export interface IButtonBaseProps extends IButtonThemeProps, IButtonOwnProps {}

export type TButtonProps<P extends ElementType = 'button'> = {
    /** Polymorphic root element or component. Defaults to `button`. */
    as?: P;
} & TMergeElementProps<P, IButtonBaseProps>;
