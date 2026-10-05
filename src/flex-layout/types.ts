import { type ComponentPropsWithRef, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Gap step. Matches the spacing scale. */
export type TFlexLayoutGap = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64;

/** Main axis. */
export type TFlexLayoutDirection = 'row' | 'column';

/** Cross-axis alignment. */
export type TFlexLayoutAlign = 'start' | 'center' | 'end' | 'stretch';

/** Main-axis distribution. */
export type TFlexLayoutJustify = 'start' | 'center' | 'end' | 'between';

/** Own props for FlexLayout. */
export interface IFlexLayoutOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Row or column. */
    direction?: TFlexLayoutDirection;
    /** Gap between items. */
    gap?: TFlexLayoutGap;
    /** Cross-axis alignment. */
    align?: TFlexLayoutAlign;
    /** Main-axis distribution. */
    justify?: TFlexLayoutJustify;
    /** Wrap items onto the next line. */
    wrap?: boolean;
    /** Removes the layout from the page. */
    hidden?: boolean;
    /** Ref to the layout (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFlexLayoutProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFlexLayoutOwnProps | 'children'>, IFlexLayoutOwnProps {}

/** Own props for FlexLayout.Item. */
export interface IFlexLayoutItemOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Take the free space on the main axis. */
    grow?: boolean;
    /** Ref to the item (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFlexLayoutItemProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFlexLayoutItemOwnProps | 'children'>, IFlexLayoutItemOwnProps {}
