import { useMemo } from 'react';

import cn from 'classnames';

import { TableActionBar } from './components/ActionBar';
import { TableBody } from './components/Body';
import { TableCell } from './components/Cell';
import { TableCheckboxCell } from './components/CheckboxCell';
import { TableFooter } from './components/Footer';
import { TableHeader } from './components/Header';
import { TableHeaderCell } from './components/HeaderCell';
import { TableHeaderCheckboxCell } from './components/HeaderCheckboxCell';
import { TablePageSize } from './components/PageSize';
import { TablePagination } from './components/Pagination';
import { TableRow } from './components/Row';
import { TableScroll } from './components/Scroll';
import { TableSortIndicator } from './components/SortIndicator';
import { TableElement } from './components/TableElement';
import { TableContext } from './context';
import { tableShellVariants } from './theme';
import { type ITableProps } from './types';

const TableRoot = ({
    ref,
    children,
    size = 'md',
    block = true,
    hasChecked = false,
    zebra = false,
    className,
    dataTestId,
    ...props
}: ITableProps) => {
    const value = useMemo(() => ({ size, hasChecked }), [size, hasChecked]);

    return (
        <TableContext.Provider value={value}>
            <div
                {...props}
                ref={ref}
                className={cn(tableShellVariants({ size, block, hasChecked, zebra }), className)}
                data-size={size}
                data-has-checked={hasChecked || undefined}
                data-zebra={zebra || undefined}
                data-test-id={dataTestId}
            >
                {children}
            </div>
        </TableContext.Provider>
    );
};

TableRoot.displayName = 'Table';

export const Table = Object.assign(TableRoot, {
    Scroll: TableScroll,
    Table: TableElement,
    Header: TableHeader,
    Body: TableBody,
    Footer: TableFooter,
    Row: TableRow,
    Cell: TableCell,
    HeaderCell: TableHeaderCell,
    CheckboxCell: TableCheckboxCell,
    HeaderCheckboxCell: TableHeaderCheckboxCell,
    ActionBar: TableActionBar,
    SortIndicator: TableSortIndicator,
    Pagination: TablePagination,
    PageSize: TablePageSize,
});
