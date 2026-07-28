import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Body checkbox cell props. */
export interface ITableCheckboxCellOwnProps extends IDataTestIdProps {
    /** Checked state. */
    checked: boolean;
    /** Indeterminate state. */
    indeterminate?: boolean;
    /** Change handler. */
    onChange?: (checked: boolean) => void;
    /** Required accessible name. */
    'aria-label': string;
    children?: ReactNode;
}

export interface ITableCheckboxCellProps
    extends
        ITableCheckboxCellOwnProps,
        Omit<ComponentPropsWithoutRef<'td'>, keyof ITableCheckboxCellOwnProps | 'children' | 'align'> {}
