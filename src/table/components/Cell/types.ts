import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type ITableCellChromeProps } from '../../types';

/** Data cell props. */
export interface ITableCellOwnProps extends IDataTestIdProps, ITableCellChromeProps {
    children?: ReactNode;
}

export interface ITableCellProps
    extends
        Omit<ComponentPropsWithRef<'td'>, keyof ITableCellOwnProps | 'children' | 'width' | 'align'>,
        ITableCellOwnProps {}
