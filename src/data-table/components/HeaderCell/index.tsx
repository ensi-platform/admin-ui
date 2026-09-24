import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

import { Table } from '@/table';

import { useDataTableSort } from '../../context';
import { type IDataTableFilterProps, type IDataTableHeaderCellProps } from '../../types';
import { DataTableFilter } from '../Filter';

const isFilterElement = (node: ReactNode): node is ReactElement<IDataTableFilterProps> =>
    isValidElement(node) && node.type === DataTableFilter;

export const DataTableHeaderCell = ({ children, column, sortable = false, ...props }: IDataTableHeaderCellProps) => {
    const { sort, onSortChange } = useDataTableSort();
    const nodes = Children.toArray(children);
    const filterNode = nodes.find(isFilterElement);
    const label = nodes.filter(node => !isFilterElement(node));
    const sortDirection = sortable && sort?.column === column ? sort?.direction : undefined;

    return (
        <Table.HeaderCell
            {...props}
            sortable={sortable}
            sortDirection={sortDirection}
            onSort={
                sortable && column != null
                    ? direction => onSortChange?.(direction == null ? undefined : { column, direction })
                    : undefined
            }
            filter={filterNode ? (filterNode.props.children ?? '') : undefined}
            filterActive={filterNode?.props.active ?? false}
        >
            {label}
        </Table.HeaderCell>
    );
};

DataTableHeaderCell.displayName = 'DataTable.HeaderCell';
