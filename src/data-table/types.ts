import { type MouseEvent, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type ITableHeaderCellProps, type ITableProps, type ITableRowProps, type TTableSortDirection } from '@/table';

/** Active column sort. */
export interface IDataTableSort {
    /** Column id from `HeaderCell` `column`. */
    column: string;
    /** Sort direction. */
    direction: TTableSortDirection;
}

/** Sort context value. */
export interface IDataTableSortContextValue {
    /** Current sort. */
    sort?: IDataTableSort;
    /** Replaces the active column or clears it. */
    onSortChange?: (sort: IDataTableSort | undefined) => void;
}

/** DataTable props. */
export interface IDataTableProps extends ITableProps {
    /** Controlled sort. One column at a time. */
    sort?: IDataTableSort;
    /** Called with the next sort, or `undefined` when cleared. */
    onSortChange?: (sort: IDataTableSort | undefined) => void;
}

/** Header cell props. Sort and filter wiring come from `DataTable`. */
export interface IDataTableHeaderCellProps extends Omit<
    ITableHeaderCellProps,
    'sortable' | 'sortDirection' | 'onSort' | 'filter' | 'filterActive'
> {
    /** Sort / filter id. Required when `sortable`. */
    column?: string;
    /** Header click or drop rows change `DataTable` sort. */
    sortable?: boolean;
}

/** Column filter body. Rendered only by `HeaderCell`. */
export interface IDataTableFilterProps {
    /** Filter control. */
    children?: ReactNode;
    /** Marks the filter icon when a value is applied. */
    active?: boolean;
}

/** Row props. `onContextMenu` is the table row prop. */
export interface IDataTableRowProps extends ITableRowProps {}

/** Quiet kebab button. The caller decides what the click does. */
export interface IDataTableActionsProps extends IDataTestIdProps {
    /** Click handler. */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /** Accessible name. */
    label?: string;
    /** Extra class on the root. */
    className?: string;
}
