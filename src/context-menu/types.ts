import { type ComponentPropsWithRef, type MouseEvent, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps, type TSVGRIcon } from '@ds/common';

/** ContextMenu size. */
export type TContextMenuSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TContextMenuVariant = 'primary';

/** Theme inputs. */
export interface IContextMenuThemeProps {
    /** ContextMenu size. */
    size?: TContextMenuSize;
    /** Visual variant. */
    variant?: TContextMenuVariant;
}

/** Control state (our names, not RAC). */
export interface IContextMenuControlProps {
    /** Whether the menu is open. */
    open?: boolean;
    /** Fixed left position (viewport px). */
    x: number;
    /** Fixed top position (viewport px). */
    y: number;
    /** Close handler (outside click / Escape). */
    onClose: () => void;
}

/** Own / chrome props (not from DOM). */
export interface IContextMenuOwnProps extends IDataTestIdProps {
    /** Menu items. */
    children?: ReactNode;
    /** Called when pointer enters the menu surface. */
    onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
    /** Ref to the menu root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IContextMenuBaseProps extends IContextMenuThemeProps, IContextMenuControlProps, IContextMenuOwnProps {}

export interface IContextMenuProps
    extends IContextMenuBaseProps, Omit<ComponentPropsWithRef<'div'>, keyof IContextMenuBaseProps | 'children'> {}

/** Own / chrome props for ContextMenu.Item. */
export interface IContextMenuItemOwnProps extends IDataTestIdProps {
    /** Label. */
    children: ReactNode;
    /** Leading icon (SVGR). */
    icon?: TSVGRIcon;
    /** Disables this item. */
    disabled?: boolean;
    /** Ref to the item button (React 19 prop). */
    ref?: Ref<HTMLButtonElement>;
}

export interface IContextMenuItemProps
    extends
        IContextMenuItemOwnProps,
        Omit<ComponentPropsWithRef<'button'>, keyof IContextMenuItemOwnProps | 'children' | 'type'> {}

/** Own / chrome props for ContextMenu.Separator. */
export interface IContextMenuSeparatorOwnProps extends IDataTestIdProps {}

export interface IContextMenuSeparatorProps
    extends
        IContextMenuSeparatorOwnProps,
        Omit<ComponentPropsWithRef<'div'>, keyof IContextMenuSeparatorOwnProps | 'children' | 'role'> {}
