import { Children, cloneElement, isValidElement, useMemo, type ReactElement } from 'react';

import cn from 'classnames';

import { Loader, type ILoaderProps } from '@/loader';

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
import { TableSortIndicator } from './components/SortIndicator';
import { TableContext } from './context';
import { tableElementClassName, tableScrollClassName, tableShellVariants } from './theme';
import { type ITableProps } from './types';

const isTableFooter = (child: unknown) => isValidElement(child) && child.type === TableFooter;
const isLoader = (child: unknown): child is ReactElement<ILoaderProps> =>
    isValidElement(child) && child.type === Loader;

const TableRoot = ({
    ref,
    children,
    size = 'md',
    block = true,
    hasChecked = false,
    hasSelected = false,
    zebra = false,
    className,
    dataTestId,
    ...props
}: ITableProps) => {
    const value = useMemo(() => ({ size, hasChecked, hasSelected }), [size, hasChecked, hasSelected]);

    const childArray = Children.toArray(children);
    const footer = childArray.find(isTableFooter);
    const loader = childArray.find(isLoader);
    const tableChildren = childArray.filter(child => !isTableFooter(child) && !isLoader(child));

    const table = <table className={tableElementClassName}>{tableChildren}</table>;

    return (
        <TableContext.Provider value={value}>
            <div
                {...props}
                ref={ref}
                className={cn(tableShellVariants({ size, block, hasChecked, zebra }), className)}
                data-size={size}
                data-has-checked={hasChecked || undefined}
                data-has-selected={hasSelected || undefined}
                data-zebra={zebra || undefined}
                data-test-id={dataTestId}
            >
                <div className={tableScrollClassName}>
                    {loader ? cloneElement(loader, undefined, table) : table}
                </div>
                {footer}
            </div>
        </TableContext.Provider>
    );
};

TableRoot.displayName = 'Table';

export const Table = Object.assign(TableRoot, {
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
