import { type ReactNode, type Ref } from 'react';

import {
    type TabListProps as RacTabListProps,
    type TabPanelProps as RacTabPanelProps,
    type TabProps as RacTabProps,
    type TabsProps as RacTabsProps,
} from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

/** Tabs size. */
export type TTabsSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TTabsVariant = 'primary';

/** Theme inputs. */
export interface ITabsThemeProps {
    /** Tabs size. */
    size?: TTabsSize;
    /** Visual variant. */
    variant?: TTabsVariant;
}

/** Control state (our names, not RAC). */
export interface ITabsControlProps {
    /** Controlled selected tab id. */
    value?: string;
    /** Uncontrolled initial selected tab id. */
    defaultValue?: string;
    /** Selection change handler. */
    onChange?: (value: string) => void;
}

/** Own / chrome props (not from RAC). */
export interface ITabsOwnProps extends IDataTestIdProps {
    /** Tab list and panels. */
    children: ReactNode;
    /** Ref to the tabs root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
    /** Disables all tabs. */
    disabled?: boolean;
}

export interface ITabsBaseProps extends ITabsThemeProps, ITabsControlProps, ITabsOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TTabsRacOmit = 'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange' | 'isDisabled';

export interface ITabsProps extends ITabsBaseProps, Omit<RacTabsProps, keyof ITabsBaseProps | TTabsRacOmit> {}

/** Tabs context value. */
export interface ITabsContextValue {
    size: TTabsSize;
    variant: TTabsVariant;
}

/** Own props for Tabs.List. */
export interface ITabsListOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Ref to the tab list (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface ITabsListProps
    extends ITabsListOwnProps, Omit<RacTabListProps<object>, keyof ITabsListOwnProps | 'items'> {}

/** Own props for Tabs.Tab. */
export interface ITabsTabOwnProps extends IDataTestIdProps {
    /** Unique tab id (matches Panel id). */
    id: string;
    children: ReactNode;
    /** Disables this tab. */
    disabled?: boolean;
    /** Ref to the tab (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

/** RAC keys omitted because names differ from ours. */
export type TTabsTabRacOmit = 'isDisabled';

export interface ITabsTabProps extends ITabsTabOwnProps, Omit<RacTabProps, keyof ITabsTabOwnProps | TTabsTabRacOmit> {}

/** Own props for Tabs.Panel. */
export interface ITabsPanelOwnProps extends IDataTestIdProps {
    /** Unique panel id (matches Tab id). */
    id: string;
    children?: ReactNode;
    /** Ref to the panel (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface ITabsPanelProps extends ITabsPanelOwnProps, Omit<RacTabPanelProps, keyof ITabsPanelOwnProps> {}
