import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps, type TMergeElementProps, type TSVGRIcon } from '@ds/common';

/** MenuList size. */
export type TMenuListSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TMenuListVariant = 'primary';

/** Theme inputs. */
export interface IMenuListThemeProps {
    /** MenuList size. */
    size?: TMenuListSize;
    /** Visual variant. */
    variant?: TMenuListVariant;
}

/** Control state (our names, not RAC). */
export interface IMenuListControlProps {
    /** Controlled active leaf item id. */
    value?: string;
    /** Uncontrolled initial active leaf item id. */
    defaultValue?: string;
    /** Active leaf change handler. */
    onChange?: (value: string) => void;
}

/** Own / chrome props (not from DOM). */
export interface IMenuListOwnProps extends IDataTestIdProps {
    /** Groups and items. */
    children: ReactNode;
    /** Ref to the list root (React 19 prop). */
    ref?: Ref<HTMLElement>;
    /** Disables all items. */
    disabled?: boolean;
    /** Icon-only compact mode (hides labels / group titles). */
    collapsed?: boolean;
}

export interface IMenuListBaseProps extends IMenuListThemeProps, IMenuListControlProps, IMenuListOwnProps {}

export interface IMenuListProps
    extends IMenuListBaseProps, Omit<ComponentPropsWithoutRef<'nav'>, keyof IMenuListBaseProps> {}

/** MenuList context value. */
export interface IMenuListContextValue {
    size: TMenuListSize;
    variant: TMenuListVariant;
    activeId: string | undefined;
    setActiveId: (id: string) => void;
    disabled: boolean;
    collapsed: boolean;
}

/** Own / chrome props for MenuList.Group. */
export interface IMenuListGroupOwnProps extends IDataTestIdProps {
    /** Uppercase group label. */
    label: string;
    children: ReactNode;
    /** Ref to the group (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IMenuListGroupProps
    extends IMenuListGroupOwnProps, Omit<ComponentPropsWithoutRef<'div'>, keyof IMenuListGroupOwnProps> {}

/** Own / chrome props for MenuList.Item. */
export interface IMenuListItemOwnProps extends IDataTestIdProps {
    /** Unique item id. */
    id: string;
    /** Label. */
    children: ReactNode;
    /** Leading icon (SVGR). */
    icon?: TSVGRIcon;
    /** Shows trailing chevron (folder / has children). */
    hasChildren?: boolean;
    /** Open folder in cascade path (soft pill, not leaf active). */
    open?: boolean;
    /** Trailing control before chevron (e.g. pin). Hidden when collapsed. */
    trailing?: ReactNode;
    /** Disables this item. */
    disabled?: boolean;
    /** Ref to the item control (React 19 prop). */
    ref?: Ref<HTMLElement>;
}

export type TMenuListItemProps<P extends ElementType = 'a'> = {
    /** Polymorphic root. Defaults to `a` when `href` is set, otherwise `button`. */
    as?: P;
} & TMergeElementProps<P, IMenuListItemOwnProps>;
