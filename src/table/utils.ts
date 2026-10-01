import { type TTableSortDirection } from './types';

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
