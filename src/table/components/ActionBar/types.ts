import { type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type IButtonIconProps } from '@/button';

/** Single row / toolbar action. */
export interface ITableActionItem {
    /** Stable key (defaults to text). */
    key?: string;
    /** Label. */
    text: ReactNode;
    /** Optional icon. */
    icon?: IButtonIconProps;
    /** Click handler. */
    onClick?: () => void;
    /** Disabled state. */
    disabled?: boolean;
    /** Danger tone. */
    danger?: boolean;
}

/** Action bar props. */
export interface ITableActionBarOwnProps extends IDataTestIdProps {
    /** Actions to render. */
    items: ITableActionItem[];
    /** How many actions stay visible before kebab overflow. */
    visibleCount?: number;
    /** Accessible name for the overflow trigger. */
    overflowLabel?: string;
    /** Extra class on the root. */
    className?: string;
}

export interface ITableActionBarProps extends ITableActionBarOwnProps {}
