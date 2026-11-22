import { type TTableRowPin } from './components/Row/types';
import { type TTablePin, type TTableSortDirection } from './types';

const NESTED_OVERLAY_SELECTOR = '[role="listbox"], [role="dialog"]';

/** True when an outside click landed in a nested overlay (select list, calendar). */
export const isNestedOverlayTarget = (element: Element): boolean => Boolean(element.closest(NESTED_OVERLAY_SELECTOR));

/** Next sort direction in none → asc → desc → none cycle. */
export const getNextSortDirection = (current: TTableSortDirection | undefined): TTableSortDirection | undefined => {
    if (current === undefined) return 'asc';
    if (current === 'asc') return 'desc';
    return undefined;
};

/** Page window item: page number or ellipsis placeholder. */
export type TTablePageItem = number | 'ellipsis';

/** Default visible page slot count. */
export const DEFAULT_TABLE_PAGE_WINDOW = 7;

type TPageWindowPosition = 'any' | 'start' | 'center' | 'end';

const getVisiblePageCount = (position: TPageWindowPosition, pageCount: number, baseNumberPages: number) => {
    if (position === 'any') return pageCount;
    if (position === 'center') return baseNumberPages;
    return baseNumberPages - 1;
};

/**
 * Build visible page items for numbered pagination.
 * Returns numbers and `'ellipsis'` placeholders; empty when `pageCount` is below 1.
 * First and last pages stay in the window when it is truncated.
 */
export const getPageItems = (
    page: number,
    pageCount: number,
    baseNumberPages = DEFAULT_TABLE_PAGE_WINDOW
): TTablePageItem[] => {
    if (pageCount < 1) return [];

    const centerIndex = Math.ceil(baseNumberPages / 2);

    const determinePosition = (): TPageWindowPosition => {
        if (pageCount > baseNumberPages) {
            if (page < centerIndex) return 'start';
            if (page > pageCount - centerIndex + 1) return 'end';
            return 'center';
        }
        return 'any';
    };

    const position = determinePosition();
    const visiblePages = getVisiblePageCount(position, pageCount, baseNumberPages);

    const getItem = (slot: number): number | null => {
        if (position === 'any') return slot;
        if (slot === 1) return 1;
        if (slot === visiblePages) return pageCount;
        if ((slot === 2 && position !== 'start') || (slot === visiblePages - 1 && position !== 'end')) {
            return null;
        }
        if (position === 'center') return page + slot - centerIndex;
        if (position === 'end') return pageCount + slot - visiblePages;
        return slot;
    };

    return Array.from({ length: visiblePages }, (_, index) => {
        const item = getItem(index + 1);
        return item === null ? 'ellipsis' : item;
    });
};

/** Column measured for a pin offset. */
export interface ITablePinColumn {
    cellIndex: number;
    pin?: TTablePin;
    width: number;
}

/** Row measured for a pin offset. */
export interface ITablePinRow {
    pin?: TTableRowPin;
    height: number;
}

/** Resolved pin offset. Index is a cell index or a body-row index. */
export interface ITablePinOffset {
    index: number;
    edge: TTablePin | TTableRowPin;
    offset: number;
    seam: boolean;
}

/** Pin offsets for one table. */
export interface ITablePinOffsets {
    columns: ITablePinOffset[];
    rows: ITablePinOffset[];
}

const markOuterSeam = (items: ITablePinOffset[], edge: TTablePin | TTableRowPin, side: 'first' | 'last') => {
    const group = items.filter(item => item.edge === edge);
    const target = side === 'last' ? group.at(-1) : group[0];
    if (target) target.seam = true;
};

/** Offsets and outer seams for pinned columns and body rows. */
export const getPinOffsets = ({
    columns,
    rows,
    stickyHeaderHeight,
}: {
    columns: readonly ITablePinColumn[];
    rows: readonly ITablePinRow[];
    stickyHeaderHeight: number;
}): ITablePinOffsets => {
    const sortedColumns = [...columns].sort((left, right) => left.cellIndex - right.cellIndex);
    const columnOffsets: ITablePinOffset[] = [];
    let startOffset = 0;

    sortedColumns.forEach(column => {
        if (column.pin !== 'start') return;
        columnOffsets.push({ index: column.cellIndex, edge: 'start', offset: startOffset, seam: false });
        startOffset += column.width;
    });

    let endOffset = 0;
    [...sortedColumns].reverse().forEach(column => {
        if (column.pin !== 'end') return;
        columnOffsets.push({ index: column.cellIndex, edge: 'end', offset: endOffset, seam: false });
        endOffset += column.width;
    });

    columnOffsets.sort((left, right) => left.index - right.index);
    markOuterSeam(columnOffsets, 'start', 'last');
    markOuterSeam(columnOffsets, 'end', 'first');

    const rowOffsets: ITablePinOffset[] = [];
    // 1px overlap hides the hairline above start pins at the sticky header and between top rows.
    const topOverlap = stickyHeaderHeight > 0 ? 1 : 0;
    let topOffset = stickyHeaderHeight - topOverlap;

    rows.forEach((row, index) => {
        if (row.pin !== 'top') return;
        rowOffsets.push({ index, edge: 'top', offset: topOffset, seam: false });
        topOffset += row.height - topOverlap;
    });

    let bottomOffset = 0;
    [...rows].reverse().forEach((row, reverseIndex) => {
        if (row.pin !== 'bottom') return;
        const index = rows.length - 1 - reverseIndex;
        rowOffsets.push({ index, edge: 'bottom', offset: bottomOffset, seam: false });
        bottomOffset += row.height;
    });

    rowOffsets.sort((left, right) => left.index - right.index);
    markOuterSeam(rowOffsets, 'top', 'last');
    markOuterSeam(rowOffsets, 'bottom', 'first');

    return { columns: columnOffsets, rows: rowOffsets };
};

/** How the browser stores RTL `scrollLeft`. `ltr` counts from the physical left. */
export type TTableRtlScroll = 'ltr' | 'negative' | 'positive-descending' | 'positive-ascending';

/** Scrollport metrics for pin seams. */
export interface ITablePinScroll {
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
    clientWidth: number;
    clientHeight: number;
    rtlScroll?: TTableRtlScroll;
}

const PIN_STUCK_EPSILON = 1;

const physicalScrollLeft = (scrollLeft: number, max: number, rtlScroll: TTableRtlScroll) => {
    if (rtlScroll === 'negative') return max + scrollLeft;
    if (rtlScroll === 'positive-descending') return max - scrollLeft;
    return scrollLeft;
};

/** Pin edges stuck to the scrollport. Order is start, end, top, bottom. */
export const getPinStuckEdges = ({
    scrollLeft,
    scrollTop,
    scrollWidth,
    scrollHeight,
    clientWidth,
    clientHeight,
    rtlScroll = 'ltr',
}: ITablePinScroll): (TTablePin | TTableRowPin)[] => {
    const maxX = Math.max(0, scrollWidth - clientWidth);
    const maxY = Math.max(0, scrollHeight - clientHeight);
    const left = physicalScrollLeft(scrollLeft, maxX, rtlScroll);
    const edges: (TTablePin | TTableRowPin)[] = [];

    if (left > PIN_STUCK_EPSILON) edges.push('start');
    if (maxX - left > PIN_STUCK_EPSILON) edges.push('end');
    if (scrollTop > PIN_STUCK_EPSILON) edges.push('top');
    if (maxY - scrollTop > PIN_STUCK_EPSILON) edges.push('bottom');

    return edges;
};
