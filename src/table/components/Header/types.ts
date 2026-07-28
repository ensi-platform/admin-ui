import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Header section props. */
export interface ITableHeaderOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Stick header while scrolling the table shell. */
    sticky?: boolean;
}

export interface ITableHeaderProps
    extends Omit<ComponentPropsWithRef<'thead'>, keyof ITableHeaderOwnProps | 'children'>, ITableHeaderOwnProps {}
