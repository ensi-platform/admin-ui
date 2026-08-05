import { type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type TMenuListSize, type TMenuListVariant } from '@/menu-list';

import { type ICascadeMenuItem } from './utils';

/** Theme inputs. */
export interface ICascadeMenuThemeProps {
    /** Size forwarded to MenuList. */
    size?: TMenuListSize;
    /** Visual variant. */
    variant?: TMenuListVariant;
}

/** Own / chrome props (not from DOM). */
export interface ICascadeMenuOwnProps extends IDataTestIdProps {
    /** Header slot (brand composed by the app). */
    header?: ReactNode;
    /** Menu tree (required for cascade columns). */
    items: ICascadeMenuItem[];
    /** Permission codes; omit = show all. */
    allowedCodes?: string[];
    /** Pathname for active leaf match. */
    activePath?: string;
    /** Controlled active leaf id. */
    value?: string;
    /** Uncontrolled initial active leaf id. */
    defaultValue?: string;
    /** Active leaf change. */
    onChange?: (value: string) => void;
    /** Controlled collapsed rail. */
    collapsed?: boolean;
    /** Uncontrolled initial collapsed. */
    defaultCollapsed?: boolean;
    /** Collapse change. */
    onCollapsedChange?: (collapsed: boolean) => void;
    /** Controlled L0 width in px (ignored when collapsed). */
    width?: number;
    /** Uncontrolled initial L0 width. */
    defaultWidth?: number;
    /** Width change after resize. */
    onWidthChange?: (width: number) => void;
    /** Min L0 width while resizing. */
    minWidth?: number;
    /** Max L0 width while resizing. */
    maxWidth?: number;
    /** Footer slot (user block composed by the app). */
    footer?: ReactNode;
    /** Stable user id for localStorage pins, width, and collapsed (`aui-cascade-menu-*:${id}`). */
    pinUserId?: string;
    /** Controlled pinned item codes (leaf or folder). */
    pinnedCodes?: string[];
    /** Uncontrolled initial pins (ignored when `pinnedCodes` or LS hydrate). */
    defaultPinnedCodes?: string[];
    /** Pin list change. */
    onPinnedChange?: (codes: string[]) => void;
    /** Max pinned codes. */
    maxPinned?: number;
    /** Ref to the aside root (React 19 prop). */
    ref?: Ref<HTMLElement>;
}

export interface ICascadeMenuBaseProps extends ICascadeMenuThemeProps, ICascadeMenuOwnProps {}

export interface ICascadeMenuProps
    extends ICascadeMenuBaseProps, Omit<ComponentPropsWithoutRef<'aside'>, keyof ICascadeMenuBaseProps> {}

export type { ICascadeMenuItem };
