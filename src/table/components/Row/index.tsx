import { type MouseEvent } from 'react';

import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { type ITableRowProps } from './types';

import styles from './styles.module.css';

const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select, label, [role="button"]';

export const TableRow = supportRef(
    ({
        ref,
        children,
        checked = false,
        active = false,
        disabled = false,
        bottomBorder = true,
        pin,
        onClick,
        className,
        dataTestId,
        tabIndex,
        ...props
    }: ITableRowProps) => {
        const clickable = onClick != null && !disabled;

        const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
            onClick?.(event);
            if (event.defaultPrevented) return;
            if (event.currentTarget.closest('tbody') == null) return;

            const { target } = event;
            if (!(target instanceof Element) || target.closest(INTERACTIVE_SELECTOR)) return;

            event.currentTarget.querySelector<HTMLInputElement>('input[type="checkbox"]:not(:disabled)')?.click();
        };

        return (
            <tr
                {...props}
                ref={ref}
                onClick={disabled ? undefined : handleClick}
                tabIndex={clickable ? (tabIndex ?? 0) : tabIndex}
                className={cn(styles.root, className)}
                data-checked={checked || undefined}
                data-active={active || undefined}
                data-disabled={disabled || undefined}
                data-pin={pin}
                data-bottom-border={bottomBorder ? undefined : 'false'}
                data-clickable={clickable || undefined}
                aria-disabled={disabled || undefined}
                data-test-id={dataTestId}
            >
                {children}
            </tr>
        );
    }
);

TableRow.displayName = 'Table.Row';
