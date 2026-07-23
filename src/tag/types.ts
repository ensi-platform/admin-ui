import { type ComponentPropsWithRef, type ReactNode } from 'react';

export type TTagSize = 'sm' | 'md';

export interface ITagProps extends Omit<ComponentPropsWithRef<'span'>, 'children' | 'disabled'> {
    /** Текст / содержимое. */
    children: ReactNode;
    /** Размер. */
    size?: TTagSize;
    /** Показать крестик и вызвать при remove. */
    onRemove?: () => void;
    /** Disabled (включая кнопку remove). */
    disabled?: boolean;
    /** `data-test-id` корня. */
    dataTestId?: string;
}
