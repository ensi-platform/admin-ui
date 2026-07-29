import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Scroll area props (wraps table; sibling of Footer). */
export interface ITableScrollOwnProps extends IDataTestIdProps {
    children?: ReactNode;
}

export interface ITableScrollProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof ITableScrollOwnProps | 'children'>, ITableScrollOwnProps {}
