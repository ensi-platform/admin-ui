import { type ReactElement, type ReactNode, type Ref } from 'react';

import {
    type TooltipProps as RacTooltipProps,
    type TooltipTriggerComponentProps as RacTooltipTriggerProps,
} from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

export type TTooltipSize = 'sm' | 'md' | 'lg';

export type TTooltipVariant = 'primary';

/** Theme inputs. */
export interface ITooltipContentThemeProps {
    /** Tooltip size. */
    size?: TTooltipSize;
    /** Visual variant. */
    variant?: TTooltipVariant;
}

/** Own / chrome props (not from RAC). */
export interface ITooltipContentOwnProps extends IDataTestIdProps {
    /** Tooltip body. */
    children: ReactNode;
    /** Show placement arrow. */
    arrow?: boolean;
    /** Ref to the tooltip panel (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface ITooltipContentBaseProps extends ITooltipContentThemeProps, ITooltipContentOwnProps {}

export interface ITooltipContentProps
    extends ITooltipContentBaseProps, Omit<RacTooltipProps, keyof ITooltipContentBaseProps> {}

/** Custom trigger wrapper (RAC Focusable). */
export interface ITooltipTriggerProps {
    /** Focusable / hoverable trigger element. */
    children: ReactElement;
}

/** Tooltip trigger root (RAC TooltipTrigger). */
export type TTooltipProps = RacTooltipTriggerProps;
