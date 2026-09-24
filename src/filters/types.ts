import { type ComponentPropsWithRef, type CSSProperties, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own / chrome props (not from DOM). */
export interface IFiltersOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Ref to the section (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFiltersProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFiltersOwnProps | 'children'>, IFiltersOwnProps {}

/** Grid context value. */
export interface IFiltersGridContextValue {
    columns: number;
    span: Record<string, number>;
}

/** Own / chrome props (not from DOM). */
export interface IFiltersGridOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Equal tracks. The page sets this; there are no built-in breakpoints. */
    columns?: number;
    /** Field kind → column span. `default` is used when `kind` is missing. */
    span?: Record<string, number>;
    /** Ref to the grid (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFiltersGridProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFiltersGridOwnProps | 'children'>, IFiltersGridOwnProps {}

/** Own / chrome props (not from DOM). */
export interface IFiltersCellOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Key in `Filters.Grid` `span`. */
    kind?: string;
    /** Ref to the cell (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFiltersCellProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFiltersCellOwnProps | 'children'>, IFiltersCellOwnProps {}

/** Own / chrome props (not from DOM). */
export interface IFiltersFooterOwnProps extends IDataTestIdProps {
    children?: ReactNode;
    /** Ref to the footer (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFiltersFooterProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFiltersFooterOwnProps | 'children'>, IFiltersFooterOwnProps {}

/** Inline span / column overrides. */
export interface IFiltersGridStyle extends CSSProperties {
    '--aui-filters-columns'?: number | string;
}

export interface IFiltersCellStyle extends CSSProperties {
    '--aui-filters-span'?: number | string;
}
