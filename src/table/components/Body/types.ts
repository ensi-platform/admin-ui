import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Body section props. */
export interface ITableBodyOwnProps extends IDataTestIdProps {
    children: ReactNode;
}

export interface ITableBodyProps
    extends Omit<ComponentPropsWithRef<'tbody'>, keyof ITableBodyOwnProps | 'children'>, ITableBodyOwnProps {}
