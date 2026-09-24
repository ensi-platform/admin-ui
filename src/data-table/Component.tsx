import { Children, isValidElement, useMemo, type ReactNode } from 'react';

import { Table } from '@/table';

import { DataTableActions } from './components/Actions';
import { DataTableFilter } from './components/Filter';
import { DataTableHeaderCell } from './components/HeaderCell';
import { DataTableRow } from './components/Row';
import { DataTableSortContext } from './context';
import { type IDataTableProps } from './types';

const isFooter = (node: ReactNode) => isValidElement(node) && node.type === Table.Footer;

const DataTableRoot = ({ ref, children, sort, onSortChange, size = 'md', ...props }: IDataTableProps) => {
    const value = useMemo(() => ({ sort, onSortChange }), [sort, onSortChange]);
    const tableChildren: ReactNode[] = [];
    const footerChildren: ReactNode[] = [];

    Children.forEach(children, child => {
        if (isFooter(child)) {
            footerChildren.push(child);
            return;
        }

        tableChildren.push(child);
    });

    return (
        <DataTableSortContext.Provider value={value}>
            <Table {...props} ref={ref} size={size}>
                <Table.Scroll>
                    <Table.Table>{tableChildren}</Table.Table>
                </Table.Scroll>
                {footerChildren}
            </Table>
        </DataTableSortContext.Provider>
    );
};

DataTableRoot.displayName = 'DataTable';

export const DataTable = Object.assign(DataTableRoot, {
    Header: Table.Header,
    Body: Table.Body,
    Footer: Table.Footer,
    Row: DataTableRow,
    Cell: Table.Cell,
    HeaderCell: DataTableHeaderCell,
    CheckboxCell: Table.CheckboxCell,
    HeaderCheckboxCell: Table.HeaderCheckboxCell,
    Filter: DataTableFilter,
    Actions: DataTableActions,
    Pagination: Table.Pagination,
    PageSize: Table.PageSize,
});
