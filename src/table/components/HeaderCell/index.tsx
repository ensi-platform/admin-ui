import { type ReactNode } from 'react';

import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { getNextSortDirection } from '../../utils';
import { useTableHeaderSticky } from '../Header/context';
import { HeaderFilter } from '../HeaderFilter';
import { TableSortIndicator } from '../SortIndicator';

import { tableHeaderCellVariants } from './theme';
import { type ITableHeaderCellProps } from './types';

import styles from './styles.module.css';

const getAriaSort = (
    sortable: boolean,
    sortDirection: ITableHeaderCellProps['sortDirection']
): 'ascending' | 'descending' | 'none' | undefined => {
    if (!sortable) return undefined;
    if (sortDirection === 'asc') return 'ascending';
    if (sortDirection === 'desc') return 'descending';
    return 'none';
};

export const TableHeaderCell = supportRef(
    ({
        ref,
        children,
        numeric = false,
        align,
        noWrap = false,
        utility = false,
        width,
        colSpan,
        sortable = false,
        sortDirection,
        onSort,
        filter,
        filterActive = false,
        sticky: stickyProp,
        className,
        dataTestId,
        style,
        scope = 'col',
        ...props
    }: ITableHeaderCellProps) => {
        const headerSticky = useTableHeaderSticky();
        const sticky = stickyProp ?? headerSticky;
        let content: ReactNode = children;

        if (sortable && filter == null) {
            content = (
                <span className={styles.content}>
                    <TableSortIndicator
                        sortDirection={sortDirection}
                        onClick={() => onSort?.(getNextSortDirection(sortDirection))}
                    >
                        {children}
                    </TableSortIndicator>
                </span>
            );
        }

        if (filter != null) {
            content = (
                <span className={styles.content}>
                    <HeaderFilter
                        sortable={sortable}
                        sortDirection={sortDirection}
                        onSort={onSort}
                        filter={filter}
                        filterActive={filterActive}
                    >
                        {children}
                    </HeaderFilter>
                </span>
            );
        }

        return (
            <th
                {...props}
                ref={ref}
                scope={scope}
                colSpan={colSpan}
                className={cn(tableHeaderCellVariants({ numeric, align, noWrap, utility, sticky }), className)}
                style={{ width, ...style }}
                aria-sort={getAriaSort(sortable, sortDirection)}
                data-numeric={numeric || undefined}
                data-utility={utility || undefined}
                data-sortable={sortable || undefined}
                data-filter={filter != null || undefined}
                data-test-id={dataTestId}
            >
                {content}
            </th>
        );
    }
);

TableHeaderCell.displayName = 'Table.HeaderCell';
