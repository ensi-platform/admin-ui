import cn from 'classnames';

import { ChevronDown } from '@/icons';

import { type ITableSortIndicatorProps } from './types';

import styles from './styles.module.css';

export const TableSortIndicator = ({
    sortDirection,
    onClick,
    dataTestId,
    className,
    children,
}: ITableSortIndicatorProps) => (
    <button
        type="button"
        className={cn(styles.root, className)}
        onClick={onClick}
        data-sorted={sortDirection != null || undefined}
        data-sort-direction={sortDirection}
        data-test-id={dataTestId}
    >
        <span className={styles.label}>{children}</span>
        <ChevronDown className={cn(styles.icon, sortDirection === 'asc' && styles.asc)} aria-hidden />
    </button>
);

TableSortIndicator.displayName = 'Table.SortIndicator';
