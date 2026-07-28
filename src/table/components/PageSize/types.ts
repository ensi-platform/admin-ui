import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own / chrome props (not from DOM). */
export interface ITablePageSizeOwnProps extends IDataTestIdProps {
    /** Current page size. */
    value: number;
    /** Page size change handler. */
    onChange: (size: number) => void;
    /** Available page sizes. */
    options?: number[];
    /** Visible label before the select (overrides `labels.pageSize`). */
    label?: ReactNode;
    /** Disable the control. */
    disabled?: boolean;
    /** Ref to the root element (React 19 prop). */
    ref?: ComponentPropsWithRef<'div'>['ref'];
}

export interface ITablePageSizeProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof ITablePageSizeOwnProps | 'children'>, ITablePageSizeOwnProps {}
