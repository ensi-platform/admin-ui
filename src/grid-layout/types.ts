import { type CSSProperties, type ComponentPropsWithRef, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Gap step. Matches the spacing scale. */
export type TGridLayoutGap = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64;

/** One track: a number is `Nfr`, a string is used as written. */
export type TGridLayoutTrack = number | string;

/** How many columns an item spans. */
export type TGridLayoutCol = number | 'full';

/** Cross-axis alignment of items. */
export type TGridLayoutAlign = 'start' | 'center' | 'end' | 'stretch';

/** Own props for GridLayout. */
export interface IGridLayoutOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Equal columns, or an explicit track list. */
    cols: number | TGridLayoutTrack[];
    /** Gap between items. */
    gap?: TGridLayoutGap;
    /** Span when this grid sits inside another grid. */
    col?: TGridLayoutCol;
    /** Cross-axis alignment. */
    align?: TGridLayoutAlign;
    /** Removes the grid from the layout. */
    hidden?: boolean;
    /** Ref to the grid (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IGridLayoutProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IGridLayoutOwnProps | 'children'>, IGridLayoutOwnProps {}

/** Own props for GridLayout.Item. */
export interface IGridLayoutItemOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Column span. `full` crosses the whole grid. */
    col?: TGridLayoutCol;
    /** Ref to the item (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IGridLayoutItemProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IGridLayoutItemOwnProps | 'children'>, IGridLayoutItemOwnProps {}

/** Inline template written by GridLayout. */
export interface IGridLayoutStyle extends CSSProperties {
    '--aui-grid-layout-template'?: string;
    '--aui-grid-layout-col'?: string;
}
