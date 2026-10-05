import { type ReactNode, type Ref } from 'react';

import {
    type TabListProps as RacTabListProps,
    type TabPanelProps as RacTabPanelProps,
    type TabPanelsProps as RacTabPanelsProps,
    type TabProps as RacTabProps,
    type TabsProps as RacTabsProps,
} from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

/** Vertical tabs size. */
export type TVerticalTabsSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TVerticalTabsVariant = 'primary';

/** Theme inputs. */
export interface IVerticalTabsThemeProps {
    /** Vertical tabs size. */
    size?: TVerticalTabsSize;
    /** Visual variant. */
    variant?: TVerticalTabsVariant;
}

/** Control state (our names, not RAC). */
export interface IVerticalTabsControlProps {
    /** Controlled selected item id. */
    value?: string;
    /** Uncontrolled initial selected item id. */
    defaultValue?: string;
    /** Selection change handler. */
    onChange?: (value: string) => void;
}

/** Own / chrome props (not from RAC). */
export interface IVerticalTabsOwnProps extends IDataTestIdProps {
    /** List and panels. */
    children: ReactNode;
    /** Ref to the tabs root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
    /** Disables every item. */
    disabled?: boolean;
}

export interface IVerticalTabsBaseProps extends IVerticalTabsThemeProps, IVerticalTabsControlProps, IVerticalTabsOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TVerticalTabsRacOmit =
    'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange' | 'isDisabled' | 'orientation';

export interface IVerticalTabsProps
    extends IVerticalTabsBaseProps, Omit<RacTabsProps, keyof IVerticalTabsBaseProps | TVerticalTabsRacOmit> {}

/** Vertical tabs context value. */
export interface IVerticalTabsContextValue {
    size: TVerticalTabsSize;
    variant: TVerticalTabsVariant;
}

/** Own props for VerticalTabs.List. */
export interface IVerticalTabsListOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Ref to the list (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IVerticalTabsListProps
    extends IVerticalTabsListOwnProps, Omit<RacTabListProps<object>, keyof IVerticalTabsListOwnProps | 'items'> {}

/** Own props for VerticalTabs.Item. */
export interface IVerticalTabsItemOwnProps extends IDataTestIdProps {
    /** Unique item id (matches Panel id). */
    id: string;
    children: ReactNode;
    /** Disables this item. */
    disabled?: boolean;
    /** Ref to the item (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

/** RAC keys omitted because names differ from ours. */
export type TVerticalTabsItemRacOmit = 'isDisabled';

export interface IVerticalTabsItemProps
    extends IVerticalTabsItemOwnProps, Omit<RacTabProps, keyof IVerticalTabsItemOwnProps | TVerticalTabsItemRacOmit> {}

/** Own props for VerticalTabs.Panel. */
export interface IVerticalTabsPanelOwnProps extends IDataTestIdProps {
    /** Unique panel id (matches Item id). */
    id: string;
    children?: ReactNode;
    /** Ref to the panel (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IVerticalTabsPanelProps
    extends IVerticalTabsPanelOwnProps, Omit<RacTabPanelProps, keyof IVerticalTabsPanelOwnProps> {}

/** Own props for VerticalTabs.Panels. */
export interface IVerticalTabsPanelsOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Ref to the panels container (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IVerticalTabsPanelsProps
    extends IVerticalTabsPanelsOwnProps, Omit<RacTabPanelsProps<object>, keyof IVerticalTabsPanelsOwnProps | 'items'> {}
