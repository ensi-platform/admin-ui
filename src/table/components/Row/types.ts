import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Body-row pin edge. */
export type TTableRowPin = 'top' | 'bottom';

/** Row props. */
export interface ITableRowOwnProps extends IDataTestIdProps {
    children?: ReactNode;
    /** Selected / checked visual state. */
    checked?: boolean;
    /** Hover fill while the caller keeps the row active. */
    active?: boolean;
    /** Non-interactive muted row. */
    disabled?: boolean;
    /** Draw bottom divider (skipped on last body row via CSS). */
    bottomBorder?: boolean;
    /** Stick a body row to the top or bottom of the scroll area. */
    pin?: TTableRowPin;
}

export interface ITableRowProps
    extends Omit<ComponentPropsWithRef<'tr'>, keyof ITableRowOwnProps | 'children'>, ITableRowOwnProps {}
