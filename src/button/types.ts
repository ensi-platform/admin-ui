import { type ElementType, type ReactNode } from 'react';

import { type TMergeElementProps, type TSVGRIcon } from '../common/index.js';

export type TSize = 'sm' | 'md' | 'lg';

export type TVariant = 'primary' | 'secondary' | 'tertiary';

export interface IIconButtonProps {
    Component: TSVGRIcon;
    after?: boolean;
    indent?: number | string;
    size?: number | string;
    className?: string;
    fill?: string;
}

export interface IButtonBaseProps {
    children: ReactNode;
    size?: TSize;
    variant?: TVariant;
    icon?: IIconButtonProps;
    className?: string;
    dataTestId?: string;
}

export type TButtonProps<P extends ElementType = 'button'> = {
    as?: P;
} & TMergeElementProps<P, IButtonBaseProps>;
