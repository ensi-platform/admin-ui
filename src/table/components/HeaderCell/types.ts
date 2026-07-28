import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type ITableCellChromeProps, type TTableSortDirection } from '../../types';

/** Header cell props. */
export interface ITableHeaderCellOwnProps extends IDataTestIdProps, ITableCellChromeProps {
    children?: ReactNode;
    /** Enable sort button affordance. */
    sortable?: boolean;
    /** Current sort direction (controlled). */
    sortDirection?: TTableSortDirection;
    /** Called with the next sort direction. */
    onSort?: (direction: TTableSortDirection | undefined) => void;
}

export interface ITableHeaderCellProps
    extends
        Omit<ComponentPropsWithRef<'th'>, keyof ITableHeaderCellOwnProps | 'children' | 'width' | 'align'>,
        ITableHeaderCellOwnProps {}
