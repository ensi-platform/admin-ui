import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Native table element props (Header / Body only — not Footer). */
export interface ITableElementOwnProps extends IDataTestIdProps {
    children?: ReactNode;
}

export interface ITableElementProps
    extends Omit<ComponentPropsWithRef<'table'>, keyof ITableElementOwnProps | 'children'>, ITableElementOwnProps {}
