import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Row props. */
export interface ITableRowOwnProps extends IDataTestIdProps {
    children?: ReactNode;
    /** Selected / checked visual state. */
    checked?: boolean;
    /** Non-interactive muted row. */
    disabled?: boolean;
    /** Draw bottom divider (skipped on last body row via CSS). */
    bottomBorder?: boolean;
}

export interface ITableRowProps
    extends Omit<ComponentPropsWithRef<'tr'>, keyof ITableRowOwnProps | 'children'>, ITableRowOwnProps {}
