import { type MouseEventHandler, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type TTableSortDirection } from '../../types';

/** Sort chevron button props. */
export interface ITableSortIndicatorOwnProps extends IDataTestIdProps {
    /** Current direction. */
    sortDirection?: TTableSortDirection;
    /** Click handler (parent usually cycles direction). */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children?: ReactNode;
}

export interface ITableSortIndicatorProps extends ITableSortIndicatorOwnProps {
    className?: string;
}
