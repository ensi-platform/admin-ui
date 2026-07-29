import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

export type TBadgeSize = 'sm' | 'md';

export type TBadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** Theme inputs. */
export interface IBadgeThemeProps {
    /** Badge size. */
    size?: TBadgeSize;
    /** Semantic status variant. */
    variant?: TBadgeVariant;
}

/** Own / chrome props (not from DOM). */
export interface IBadgeOwnProps extends IDataTestIdProps {
    /** Content. */
    children: ReactNode;
}

export interface IBadgeBaseProps extends IBadgeThemeProps, IBadgeOwnProps {}

export interface IBadgeProps
    extends IBadgeBaseProps, Omit<ComponentPropsWithRef<'span'>, keyof IBadgeBaseProps | 'children'> {}
