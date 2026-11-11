import { type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from 'react';

import cn from 'classnames';

import styles from './styles.module.css';

const isActivationTarget = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest('button, a, [role="button"]'));

/** Slot beside a text control. A click focuses the control unless it hits a button or link. */
export const ControlAddon = ({
    children,
    align = 'center',
    disabled = false,
    onFocusControl,
}: {
    children: ReactNode;
    /** `start` keeps the slot on the first line of a multiline control. */
    align?: 'center' | 'start';
    disabled?: boolean;
    onFocusControl: () => void;
}) => (
    <span
        className={cn(styles.addon, align === 'start' && styles.start)}
        data-disabled={disabled || undefined}
        onPointerDown={event => {
            if (disabled || isActivationTarget(event.target)) return;

            event.preventDefault();
            onFocusControl();
        }}
    >
        {children}
    </span>
);

/** Icon button for a control addon. Does not submit the surrounding form. */
export const AddonButton = ({
    children,
    className,
    onPointerDown,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label': string }) => (
    <button
        {...props}
        type="button"
        className={cn(styles.button, className)}
        onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
            event.preventDefault();
            event.stopPropagation();
            onPointerDown?.(event);
        }}
    >
        {children}
    </button>
);

AddonButton.displayName = 'AddonButton';
