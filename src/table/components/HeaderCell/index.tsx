import cn from 'classnames';

import { getNextSortDirection } from '../../utils';
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
    className,
    dataTestId,
    style,
    scope = 'col',
    ...props
}: ITableHeaderCellProps) => {
    const handleSortClick = () => {
        onSort?.(getNextSortDirection(sortDirection));
    };

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
            data-test-id={dataTestId}
        >
            {sortable ? (
                <span className={styles.content}>
                    <TableSortIndicator sortDirection={sortDirection} onClick={handleSortClick}>
                        {children}
                    </TableSortIndicator>
                </span>
            ) : (
                children
            )}
        </th>
    );
};

TableHeaderCell.displayName = 'Table.HeaderCell';
