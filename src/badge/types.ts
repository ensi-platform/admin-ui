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

export interface IBadgeProps
    extends Omit<ComponentPropsWithRef<'span'>, 'children'>, IDataTestIdProps, IBadgeThemeProps {
    /** Content. */
    children: ReactNode;
}
