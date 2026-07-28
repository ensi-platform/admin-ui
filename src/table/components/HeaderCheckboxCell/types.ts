import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Header checkbox cell props. */
export interface ITableHeaderCheckboxCellOwnProps extends IDataTestIdProps {
    /** Checked state (all selected). */
    checked: boolean;
    /** Indeterminate when some rows selected. */
    indeterminate?: boolean;
    /** Change handler. */
    onChange?: (checked: boolean) => void;
    /** Required accessible name. */
    'aria-label': string;
    children?: ReactNode;
}

export interface ITableHeaderCheckboxCellProps
    extends
        ITableHeaderCheckboxCellOwnProps,
        Omit<ComponentPropsWithoutRef<'th'>, keyof ITableHeaderCheckboxCellOwnProps | 'children' | 'align'> {}
