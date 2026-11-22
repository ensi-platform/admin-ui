import { type ComponentPropsWithRef, type ElementType, type ReactNode } from 'react';

import { type TMergeElementProps } from '@ds/common';

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
    /** ColorPicker: open the palette. */
    openPalette: string;
    /** ColorPicker: hex field accessible name. */
    colorCode: string;
    /** ColorPicker: hue slider accessible name. */
    colorHue: string;
    /** ColorPicker: palette dialog accessible name. */
    colorPalette: string;
    /** ColorPicker: preset swatch list accessible name. */
    colorPresets: string;
    /** Password: reveal the value. */
    showPassword: string;
    /** Password: hide the value. */
    hidePassword: string;
    /** Table.PageSize: label before the select. */
    pageSize: string;
    /** Table.Pagination: previous-page control label. */
    paginationPrev: string;
    /** Table.Pagination: next-page control label. */
    paginationNext: string;
    /** Table.Pagination: page button accessible name (`{page}`). */
    paginationPage: string;
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
    /** CopyButton: idle accessible name prefix. */
    copy: string;
    /** CopyButton: success tooltip. `{value}` is the copied text. */
    copied: string;
    /** CopyButton: clipboard failure tooltip. */
    copyFailed: string;
    /** Dropzone: zone instruction while the list is empty. */
    dropzonePrompt: string;
    /** Dropzone: kept for label overrides. The zone uses `dropzonePrompt`. */
    dropzoneAdd: string;
    /** Dropzone: remove-file button. */
    dropzoneRemove: string;
    /** Dropzone: file list accessible name. */
    dropzoneList: string;
    /** Dropzone: reorder handle. */
    dropzoneReorder: string;
    /** Dropzone: file exceeds `maxSize`. `{size}` is the limit. */
    dropzoneTooBig: string;
    /** Dropzone: size below 1 KB. `{size}` is a byte count. */
    dropzoneByte: string;
    /** Dropzone: size in kilobytes. `{size}` is the number. */
    dropzoneKilobyte: string;
    /** Dropzone: size in megabytes. `{size}` is the number. */
    dropzoneMegabyte: string;
    /** Dropzone: file type is outside `accept`. */
    dropzoneBadType: string;
    /** Dropzone: list is already at `maxFiles`. `{count}` is the limit. */
    dropzoneTooMany: string;
    /** Dropzone: file name is longer than `maxFileNameLength`. `{count}` is the limit. */
    dropzoneNameLength: string;
    /** Dropzone: a file with the same name is already in the list. */
    dropzoneDuplicate: string;
    /** Dropzone: rejection that has no specific copy. */
    dropzoneRejected: string;
    /** Dropzone: upload request failed. */
    dropzoneUploadFailed: string;
    /** Dropzone: retry a failed upload. */
    dropzoneRetry: string;
    /** Dropzone: hint under a multi-file list before the first selection. */
    dropzoneSelectHint: string;
    /** Dropzone: toolbar count. `{count}` selected, `{total}` in the list. */
    dropzoneSelected: string;
    /** Dropzone: select every settled file. */
    dropzoneSelectAll: string;
    /** Dropzone: remove the selection. */
    dropzoneDeleteSelected: string;
    /** Dropzone: live announcement. `{count}` is how many files left. */
    dropzoneDeleted: string;
    /** Dropzone: zone copy when `maxFiles` is 1 and a file is present. */
    dropzoneReplace: string;
    /** Dropzone: zone copy while a replacement is dragged. `{name}` is the current file. */
    dropzoneReplaceDrop: string;
    /** Dropzone: mark on the file a replacement upload will swap out. */
    dropzoneReplacing: string;
    /** Dropzone: file that a dragged file will replace. */
    dropzoneWillReplace: string;
    /** Dropzone: prefix when a replacement was refused. `{reason}` follows. */
    dropzoneNotReplaced: string;
    /** Dropzone: cancel an in-flight upload. */
    dropzoneCancel: string;
    /** Dropzone: file count quota. `{count}` used, `{max}` allowed. */
    dropzoneQuotaCount: string;
    /** Dropzone: byte quota. `{size}` and `{max}` are formatted. */
    dropzoneQuotaBytes: string;
    /** Dropzone: per-file ceiling. `{size}` is formatted. */
    dropzonePerFile: string;
    /** Dropzone: file does not fit `maxTotalSize`. `{name}`, `{size}` is the room left. */
    dropzoneTotalTooBig: string;
    /** Dropzone: the list is full. `{count}` and `{max}` are file counts. */
    dropzoneLimitReached: string;
    /** Dropzone: form message while a file is still uploading. */
    dropzoneUploading: string;
    /** Rating value text (`{value}`, `{max}`). */
    ratingValue: string;
    /** TextEditor: bold. */
    bold: string;
    /** TextEditor: italic. */
    italic: string;
    /** TextEditor: heading button. `{level}` is 1–4. */
    heading: string;
    /** TextEditor: bulleted list. */
    bulletList: string;
    /** TextEditor: numbered list. */
    orderedList: string;
    /** TextEditor: align left. */
    alignLeft: string;
    /** TextEditor: align center. */
    alignCenter: string;
    /** TextEditor: align right. */
    alignRight: string;
    /** TextEditor: justify. */
    alignJustify: string;
    /** TextEditor: link. */
    link: string;
    /** TextEditor: anchor id. */
    anchor: string;
    /** TextEditor: image. */
    image: string;
    /** TextEditor: text color. */
    textColor: string;
    /** TextEditor: background color. */
    bgColor: string;
    /** TextEditor: switch to the HTML source. */
    editorSource: string;
    /** TextEditor: switch to the visual surface. */
    editorVisual: string;
    /** TextEditor: foreign HTML chip. */
    htmlBlock: string;
    /** TextEditor: remove a foreign HTML chip. */
    htmlBlockRemove: string;
    /** TextEditor: paragraph item in the heading menu. */
    paragraph: string;
    /** TextEditor: undo. */
    undo: string;
    /** TextEditor: redo. */
    redo: string;
    /** TextEditor: clear marks and blocks. */
    clearFormat: string;
    /** TextEditor: underline. */
    underline: string;
    /** TextEditor: strikethrough. */
    strike: string;
    /** TextEditor: inline code. */
    inlineCode: string;
    /** TextEditor: code block. */
    codeBlock: string;
    /** TextEditor: blockquote. */
    blockquote: string;
    /** TextEditor: horizontal rule. */
    horizontalRule: string;
    /** TextEditor: subscript. */
    subscript: string;
    /** TextEditor: superscript. */
    superscript: string;
    /** TextEditor: font family menu. */
    fontFamily: string;
    /** TextEditor: font size menu. */
    fontSize: string;
    /** TextEditor: line height menu. */
    lineHeight: string;
    /** TextEditor: task list. */
    taskList: string;
    /** TextEditor: increase indent. */
    indent: string;
    /** TextEditor: decrease indent. */
    outdent: string;
    /** TextEditor: emoji menu. */
    emoji: string;
    /** TextEditor: video. */
    video: string;
    /** TextEditor: video URL field. */
    videoUrl: string;
    /** TextEditor: insert a table. */
    table: string;
    /** TextEditor: add a table row. */
    tableRow: string;
    /** TextEditor: add a table column. */
    tableColumn: string;
    /** TextEditor: toggle the header row. */
    tableHeader: string;
    /** TextEditor: delete the table. */
    tableDelete: string;
    /** TextEditor: image width. */
    imageWidth: string;
    /** TextEditor: image file input. */
    imageFile: string;
    /** TextEditor: enter fullscreen. */
    fullscreen: string;
    /** TextEditor: leave fullscreen. */
    fullscreenExit: string;
    /** TextEditor: visible character count. `{count}` and optional `{max}`. */
    editorCount: string;
    /** TextEditor: link URL field. */
    linkUrl: string;
    /** TextEditor: open the link in a new window. */
    linkNewWindow: string;
    /** TextEditor: image URL field. */
    imageUrl: string;
    /** TextEditor: image alt field. */
    imageAlt: string;
    /** TextEditor: anchor id field. */
    anchorId: string;
    /** TextEditor: custom hex field. */
    colorHex: string;
    /** TextEditor: apply a popover value. */
    editorApply: string;
    /** TextEditor: rejected URL. */
    invalidUrl: string;
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

/** Own / chrome props (not from DOM). */
export interface IAdminUiProviderOwnProps {
    children: ReactNode;
    /** Text direction. Defaults to the locale direction. */
    direction?: TTextDirection;
    /** BCP 47 locale. */
    locale?: string;
    /** Partial override of built-in labels. */
    labels?: Partial<IAuiLabels>;
    /** Host router link for menu navigation. Defaults to `a`. */
    linkComponent?: TAuiLinkComponent;
}

export type TAdminUiProviderProps<P extends ElementType = 'div'> = {
    /** Root element. Defaults to `div`. */
    as?: P;
} & Omit<TMergeElementProps<P, IAdminUiProviderOwnProps>, 'dir'>;
