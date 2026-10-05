import { type CSSProperties, type ComponentPropsWithRef, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Gap step. Matches the spacing scale. */
export type TGridGap = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64;

/** One track: a number is `Nfr`, a string is used as written. */
export type TGridTrack = number | string;

/** How many columns an item spans. */
export type TGridCol = number | 'full';

/** Cross-axis alignment of items. */
export type TGridAlign = 'start' | 'center' | 'end' | 'stretch';

/** Own props for Grid. */
export interface IGridOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Equal columns, or an explicit track list. */
    cols: number | TGridTrack[];
    /** Gap between items. */
    gap?: TGridGap;
    /** Span when this grid sits inside another grid. */
    col?: TGridCol;
    /** Cross-axis alignment. */
    align?: TGridAlign;
    /** Removes the grid from the layout. */
    hidden?: boolean;
    /** Ref to the grid (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IGridProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IGridOwnProps | 'children'>, IGridOwnProps {}

/** Own props for Grid.Item. */
export interface IGridItemOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Column span. `full` crosses the whole grid. */
    col?: TGridCol;
    /** Ref to the item (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IGridItemProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IGridItemOwnProps | 'children'>, IGridItemOwnProps {}

/** Inline template written by Grid. */
export interface IGridStyle extends CSSProperties {
    '--aui-grid-template'?: string;
    '--aui-grid-col'?: string;
}
