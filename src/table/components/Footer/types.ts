import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Footer bar props (below the table element). */
export interface ITableFooterOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Pin bar under the scroll area with a top edge (default true). */
    sticky?: boolean;
}

export interface ITableFooterProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof ITableFooterOwnProps | 'children'>, ITableFooterOwnProps {}
