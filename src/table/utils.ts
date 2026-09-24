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
