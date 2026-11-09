import { type ComponentPropsWithRef, type ComponentType, type CSSProperties, type ReactNode, type Ref } from 'react';

import { type Accept } from 'react-dropzone';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

/** One file in the dropzone value. */
export interface IDropzoneFile {
    /** Stable id. Server files keep their own id. */
    id: string;
    /** File name. */
    name: string;
    /** Size in bytes. */
    size: number;
    /** MIME type. */
    type: string;
    /** Newly picked file. Absent for a file that already lives on the server. */
    file?: File;
    /** Preview or download address of a server file. */
    url?: string;
}

export type TDropzoneSize = 'sm' | 'md' | 'lg';

/** A file that is visible but not in `value` yet. */
export interface IPendingDropzoneFile {
    /** Local id until the server id arrives. */
    id: string;
    /** File name. */
    name: string;
    /** Size in bytes. */
    size: number;
    /** MIME type. */
    type: string;
    /** File passed to `upload`. */
    file: File;
    /** `uploading` hides remove. `error` keeps the row. */
    status: 'uploading' | 'error';
    /** Absent until `onProgress` reports a number. */
    progress: number | null;
    /** This row replaces the single file already in the list. */
    replacing: boolean;
    /** Rejection text. Absent when the failure has no message. */
    error?: string;
}

/** One button on a file row. */
export interface IRowAction {
    key: 'remove' | 'retry' | 'dismiss' | 'cancel';
    label: string;
    run: () => void;
    disabled?: boolean;
}

/** Props shared by the row and the grid card. */
export type TDropzoneItemElement = 'div' | 'row';

/** Props of the file root. `row` is the settled list item. */
export interface IDropzoneItemElementProps {
    id?: string;
    textValue?: string;
    'aria-label'?: string;
    'data-file-id'?: string;
    'data-layout'?: 'stacked';
    'data-replacing'?: boolean;
    'data-flash'?: boolean;
    'data-flip'?: boolean;
    style?: CSSProperties;
}

export interface IDropzoneItem {
    /** Row root. `row` for a settled file, `div` while uploading. */
    element: TDropzoneItemElement;
    /** Props of that root (`id`, `textValue`, data attributes, drag shift). */
    elementProps: IDropzoneItemElementProps;
    /** File shown in the row. */
    file: IDropzoneFile;
    /** Control size. Sets the row height on the item root. */
    size: TDropzoneSize;
    /** Selected row paints the check. */
    selected: boolean;
    /** Grip label. Absent when reorder is off. */
    gripLabel?: string;
    /** Row actions. The grid card splits remove and dismiss onto the frame. */
    actions: readonly IRowAction[];
    /** Extra settled action from `renderAction`. */
    action?: ReactNode;
    /** Upload progress. `null` is indeterminate. Absent on a settled file. */
    progress?: number | null;
    /** Error caption. */
    failedLabel?: string;
    /** Replace caption. */
    replaceLabel?: string;
}

export type TDropzoneVariant = 'primary';

/** Theme inputs. */
export interface IDropzoneThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TDropzoneSize;
    /** Visual variant. */
    variant?: TDropzoneVariant;
}

export type TDropzoneLayout = 'list' | 'grid';

/** Props of the file list. `list` receives them. */
export interface IFileListProps {
    /** File element. The list passes the row model into it. */
    item: ComponentType<IDropzoneItem>;
    files: readonly IDropzoneFile[];
    pending: readonly IPendingDropzoneFile[];
    canReorder: boolean;
    removable: boolean;
    removeDisabled?: boolean;
    disabled?: boolean;
    selectable?: boolean;
    selectedKeys?: ReadonlySet<string>;
    onSelectionChange?: (keys: Set<string>) => void;
    renderAction?: (file: IDropzoneFile) => ReactNode;
    replacing?: boolean;
    replaceTarget?: boolean;
    flashId?: string | null;
    willReplaceLabel: string;
    focusId?: string | null;
    size: TDropzoneSize;
    listLabel: string;
    removeLabel: string;
    reorderLabel: string;
    retryLabel: string;
    cancelLabel: string;
    replacingLabel: string;
    failedLabel: string;
    onRemove: (file: IDropzoneFile) => void;
    onRetry: (id: string) => void;
    onDismiss: (id: string) => void;
    onCancel: (id: string) => void;
    onReorder: (files: IDropzoneFile[]) => void;
}

/** Upload rows that are not in `value` yet. */
export interface IDropzonePendingState {
    /** A file is still in flight. */
    uploading: boolean;
    /** A failed upload is still in the list. */
    failed: boolean;
}

/** `true` on a key blocks that action. `false` and omission leave it on. */
export interface IDropzoneDisabledFlags {
    add?: boolean;
    remove?: boolean;
    reorder?: boolean;
}

/** `true` blocks adding, removal, and reorder. An object blocks only the keys set to `true`. */
export type TDropzoneDisabled = boolean | IDropzoneDisabledFlags;

/** Server identity returned after `upload` resolves. */
export interface IDropzoneUploadResult {
    /** Server id. Replaces the local id. */
    id: string;
    /** Download or preview address. */
    url: string;
}

/** What `upload` receives besides the file. */
export interface IDropzoneUploadContext {
    /** Reports 0–100. Omit the calls for an indeterminate bar. */
    onProgress: (percent: number) => void;
    /** Aborted when the row is cancelled. */
    signal: AbortSignal;
}

/** Value and file rules. */
export interface IDropzoneControlProps {
    /** Selected files. */
    value?: IDropzoneFile[];
    /** Initial files when `value` is omitted. */
    defaultValue?: IDropzoneFile[];
    /** Called with the next file list. */
    onChange?: (files: IDropzoneFile[]) => void;
    /** Called after a file was removed from the list. */
    onRemove?: (file: IDropzoneFile) => void;
    /** Allowed MIME types and extensions. */
    accept?: Accept;
    /** Max size of one file, in bytes. */
    maxSize?: number;
    /** Max size of the whole list, in bytes. Includes files still uploading. */
    maxTotalSize?: number;
    /** Max number of files. `1` replaces the current file. */
    maxFiles?: number;
    /** Max file name length. */
    maxFileNameLength?: number;
    /** Accept a file pasted into the focused zone. */
    paste?: boolean;
    /**
     * `true` blocks adding, removal, and reorder.
     * An object blocks only the flags set to `true`.
     */
    disabled?: TDropzoneDisabled;
    /**
     * Sends a file as soon as it is accepted.
     * The file stays out of `value` until this resolves with `id` and `url`.
     */
    upload?: (file: File, context: IDropzoneUploadContext) => Promise<IDropzoneUploadResult>;
    /**
     * Custom refusal after type and size checks.
     * A string keeps the file out and becomes the alert reason.
     */
    validate?: (file: File) => string | null | undefined | Promise<string | null | undefined>;
    /** Fires when in-flight or failed uploads appear or clear. */
    onPendingChange?: (state: IDropzonePendingState) => void;
}

/** Own / chrome props (not from DOM). */
export interface IDropzoneOwnProps extends IDataTestIdProps {
    /** Ref to the dropzone root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
    /** Heading above the zone. */
    title?: ReactNode;
    /** Text under the heading and above the zone. */
    description?: ReactNode;
    /**
     * Extra rule in the zone line, after accepted types and the per-file limit.
     */
    hint?: ReactNode;
    /**
     * Receives the local rejection line.
     * When set, the line is not rendered inside the zone.
     */
    onRejectionChange?: (message: string) => void;
    /** Renders an extra action for a settled file, next to remove. */
    renderAction?: (file: IDropzoneFile) => ReactNode;
    /** Show a loader instead of the file list. */
    loading?: boolean;
    /** `list` is a row. `grid` is a card. Picks `list` and `item` when those are omitted. */
    layout?: TDropzoneLayout;
    /** File list. Defaults from `layout`. */
    list?: ComponentType<IFileListProps>;
    /** File element. Defaults from `layout`. Passed into the list. */
    item?: ComponentType<IDropzoneItem>;
}

export interface IDropzoneBaseProps
    extends IDropzoneThemeProps, Omit<IFieldStateProps, 'disabled'>, IDropzoneControlProps, IDropzoneOwnProps {}

/** DOM keys omitted because names differ from ours. */
export type TDropzoneDomOmit = 'defaultValue' | 'onChange';

export interface IDropzoneProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IDropzoneBaseProps | TDropzoneDomOmit>, IDropzoneBaseProps {}

/** Content slice for FormDropzone. */
export interface IDropzoneContentProps
    extends
        Omit<IDropzoneControlProps, 'value' | 'defaultValue' | 'onChange' | 'onPendingChange'>,
        Pick<IDropzoneOwnProps, 'renderAction' | 'loading' | 'layout' | 'list' | 'item'> {}

export interface IFormDropzoneProps
    extends Omit<IFormFieldLayoutProps, 'disabled'>, Pick<IDropzoneThemeProps, 'variant'>, IDropzoneContentProps {
    /** Ref to the dropzone root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}
