import { type ComponentPropsWithRef, type CSSProperties, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Table density. */
export type TTableSize = 'sm' | 'md' | 'lg';

/** Controlled sort direction. */
export type TTableSortDirection = 'asc' | 'desc';

/** Cell horizontal alignment. */
export type TTableAlign = 'start' | 'end' | 'center';

/** Theme inputs. */
export interface ITableThemeProps {
    /** Row density. */
    size?: TTableSize;
}

/** Own / chrome props (not from DOM). */
export interface ITableOwnProps extends IDataTestIdProps {
    /** Table sections and rows. */
    children: ReactNode;
    /** Stretch to 100% of the parent width. */
    block?: boolean;
    /** Reserves layout for a leading checkbox column. */
    hasChecked?: boolean;
    /** When true, all row checkboxes stay visible (selection mode). */
    hasSelected?: boolean;
    /** Subtle even-row background (overridden by checked / active / hover). */
    zebra?: boolean;
    /** Ref to the scroll shell (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface ITableBaseProps extends ITableThemeProps, ITableOwnProps {}

export interface ITableProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof ITableBaseProps | 'children'>, ITableBaseProps {}

/** Table context value. */
export interface ITableContextValue {
    size: TTableSize;
    hasChecked: boolean;
    hasSelected: boolean;
}

/** Shared cell chrome. */
export interface ITableCellChromeProps {
    /** Right-align + tabular figures (amounts, quantities). */
    numeric?: boolean;
    /** Explicit text alignment (overrides numeric default). */
    align?: TTableAlign;
    /** Prevent wrapping. */
    noWrap?: boolean;
    /** Fixed / preferred width. */
    width?: CSSProperties['width'];
    /** Utility column (checkbox / actions / settings). */
    utility?: boolean;
}

export type { ITableHeaderProps } from './components/Header/types';
export type { ITableBodyProps } from './components/Body/types';
export type { ITableFooterProps } from './components/Footer/types';
export type { ITableRowProps } from './components/Row/types';
export type { ITableCellProps } from './components/Cell/types';
export type { ITableHeaderCellProps } from './components/HeaderCell/types';
export type { ITableCheckboxCellProps } from './components/CheckboxCell/types';
export type { ITableHeaderCheckboxCellProps } from './components/HeaderCheckboxCell/types';
export type { ITableActionBarProps, ITableActionItem } from './components/ActionBar/types';
export type { ITableSortIndicatorProps } from './components/SortIndicator/types';
export type { ITablePaginationProps } from './components/Pagination/types';
export type { ITablePageSizeProps } from './components/PageSize/types';
export type {
    IUseTableRowSelectionOptions,
    IUseTableRowSelectionResult,
    TTableRowId,
} from './hooks/useTableRowSelection';
export type { TTablePageItem } from './utils';
