import { type ComponentPropsWithRef, type ReactNode } from 'react';

export type TTextDirection = 'ltr' | 'rtl';

/** Built-in a11y / UI label strings. */
export interface IAuiLabels {
    close: string;
    clear: string;
    confirm: string;
    cancel: string;
    delete: string;
    notDelete: string;
    /** Loader overlay accessible name. */
    loading: string;
    /** Autocomplete list: loading state. */
    loadingSuggestions: string;
    /** Autocomplete list: empty results. */
    noSuggestions: string;
    /** Autocomplete list: failed load. */
    suggestionsError: string;
    /** MultiAutocomplete overflow chip (+N) accessible name prefix. */
    moreSelected: string;
    /** DatePicker / DateRangePicker: open calendar button. */
    openCalendar: string;
    /** Table.PageSize: label before the select. */
    pageSize: string;
    /** Table.Pagination: previous-page control label. */
    paginationPrev: string;
    /** Table.Pagination: next-page control label. */
    paginationNext: string;
    /** Table.Pagination: range template (`{from}`, `{to}`, `{total}`). */
    paginationRange: string;
    /** CascadeMenu: collapse rail control. */
    collapseSidebar: string;
    /** CascadeMenu: expand rail control. */
    expandSidebar: string;
    /** CascadeMenu: resize handle. */
    resizeSidebar: string;
    /** CascadeMenu: pin item. */
    pinMenuItem: string;
    /** CascadeMenu: unpin item. */
    unpinMenuItem: string;
    /** CascadeMenu: pinned section label. */
    pinnedSection: string;
    /** CascadeMenu: empty pinned list hint (how to pin). */
    pinnedSectionHint: string;
    /** CascadeMenu: open leaf in new tab. */
    openInNewTab: string;
}

export type TAuiLabels = IAuiLabels;

/** Admin UI context value. */
export interface IAuiContextValue {
    locale: string;
    direction: TTextDirection;
    labels: IAuiLabels;
}

export interface IAdminUiProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'dir'> {
    children: ReactNode;
    /** Text direction. Defaults to `ltr`. */
    direction?: TTextDirection;
    /** BCP 47 locale. */
    locale?: string;
    /** Partial override of built-in labels. */
    labels?: Partial<IAuiLabels>;
}
