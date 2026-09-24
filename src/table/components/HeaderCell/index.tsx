import { type ReactNode } from 'react';

import cn from 'classnames';

import { getNextSortDirection } from '../../utils';
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

export const TableHeaderCell = ({
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
    className,
    dataTestId,
    style,
    scope = 'col',
    ...props
}: ITableHeaderCellProps) => {
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
            className={cn(tableHeaderCellVariants({ numeric, align, noWrap, utility }), className)}
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
};

TableHeaderCell.displayName = 'Table.HeaderCell';
