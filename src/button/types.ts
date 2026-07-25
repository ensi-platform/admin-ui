import { type ElementType, type ReactNode } from 'react';

import { type IDataTestIdProps, type TMergeElementProps } from '@ds/common';

import { type IIconButtonProps } from '@/icon';

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
    /** Leading or trailing icon. See `IIconButtonProps`. */
    icon?: IIconButtonProps;
    /** Stretch to 100% of the parent width. */
    block?: boolean;
}

export interface IButtonBaseProps extends IButtonThemeProps, IButtonOwnProps {}

export type TButtonProps<P extends ElementType = 'button'> = {
    /** Polymorphic root element or component. Defaults to `button`. */
    as?: P;
} & TMergeElementProps<P, IButtonBaseProps>;
