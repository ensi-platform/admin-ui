import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own / chrome props (not from DOM). */
export interface ITablePaginationOwnProps extends IDataTestIdProps {
    /** Current page (1-based). */
    page: number;
    /** Total number of pages. */
    pageCount: number;
    /** Page change handler. */
    onPageChange: (page: number) => void;
    /** Label for the next-page control (overrides `labels.paginationNext`). */
    nextLabel?: ReactNode;
    /** Disable all controls. */
    disabled?: boolean;
    /** Accessible name for the navigation landmark. */
    'aria-label'?: string;
    /** Ref to the nav element (React 19 prop). */
    ref?: ComponentPropsWithRef<'nav'>['ref'];
}

export interface ITablePaginationProps
    extends Omit<ComponentPropsWithRef<'nav'>, keyof ITablePaginationOwnProps | 'children'>, ITablePaginationOwnProps {}
