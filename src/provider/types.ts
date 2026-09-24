import { type ComponentPropsWithRef, type ElementType, type ReactNode } from 'react';

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
    /** CascadeMenu: search field accessible name and placeholder. */
    searchMenu: string;
    /** CascadeMenu: search panel when nothing matches. */
    searchMenuEmpty: string;
    /** CascadeMenu: open leaf in new tab. */
    openInNewTab: string;
    /** Table header filter: ascending sort action. */
    sortAscending: string;
    /** Table header filter: descending sort action. */
    sortDescending: string;
    /** DataTable actions: kebab accessible name. */
    moreActions: string;
    /** ArrangementSettings: save the draft. */
    save: string;
    /** ArrangementSettings: accessible name of the item list. */
    arrangementList: string;
    /** ActiveFilters: clear the whole row. */
    clearFilters: string;
}

export type TAuiLabels = IAuiLabels;

/** Host router link. Anchor props; `href` is the URL. */
export type TAuiLinkComponent = ElementType<ComponentPropsWithRef<'a'>>;

/** Admin UI context value. */
export interface IAuiContextValue {
    locale: string;
    direction: TTextDirection;
    labels: IAuiLabels;
    /** Host router link. Defaults to `a`. */
    linkComponent?: TAuiLinkComponent;
}

export interface IAdminUiProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'dir'> {
    children: ReactNode;
    /** Text direction. Defaults to `ltr`. */
    direction?: TTextDirection;
    /** BCP 47 locale. */
    locale?: string;
    /** Partial override of built-in labels. */
    labels?: Partial<IAuiLabels>;
    /** Host router link for menu navigation. Defaults to `a`. */
    linkComponent?: TAuiLinkComponent;
}
