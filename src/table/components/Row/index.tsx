import cn from 'classnames';

import { type ITableRowProps } from './types';

import styles from './styles.module.css';

export const TableRow = ({
    ref,
    children,
    checked = false,
    disabled = false,
    bottomBorder = true,
    onClick,
    className,
    dataTestId,
    tabIndex,
    ...props
}: ITableRowProps) => {
    const clickable = onClick != null && !disabled;

    return (
        <tr
            {...props}
            ref={ref}
            onClick={disabled ? undefined : onClick}
            tabIndex={clickable ? (tabIndex ?? 0) : tabIndex}
            className={cn(styles.root, className)}
            data-checked={checked || undefined}
            data-disabled={disabled || undefined}
            data-bottom-border={bottomBorder ? undefined : 'false'}
            data-clickable={clickable || undefined}
            aria-disabled={disabled || undefined}
            data-test-id={dataTestId}
        >
            {children}
        </tr>
    );
};

TableRow.displayName = 'Table.Row';
