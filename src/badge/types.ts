import { type ComponentPropsWithRef, type ReactNode } from 'react';

export type TBadgeSize = 'sm' | 'md';

export type TBadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface IBadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
    /** Текст / содержимое. */
    children: ReactNode;
    /** Размер. */
    size?: TBadgeSize;
    /** Семантический статусный вариант. */
    variant?: TBadgeVariant;
    /** `data-test-id` корня. */
    dataTestId?: string;
}
