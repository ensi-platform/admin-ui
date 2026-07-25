import { type ReactElement, type ReactNode, type Ref } from 'react';

import {
    type DialogTriggerProps as RacDialogTriggerProps,
    type PopoverProps as RacPopoverProps,
} from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

export type TPopoverSize = 'sm' | 'md' | 'lg';

export type TPopoverVariant = 'primary';

/** Theme inputs. */
export interface IPopoverContentThemeProps {
    /** Popover size. */
    size?: TPopoverSize;
    /** Visual variant. */
    variant?: TPopoverVariant;
}

/** Own / chrome props (not from RAC). */
export interface IPopoverContentOwnProps extends IDataTestIdProps {
    /** Popover body. */
    children: ReactNode;
    /** Show placement arrow. */
    arrow?: boolean;
    /** Ref to the popover panel (React 19 prop). */
    ref?: Ref<HTMLElement>;
}

export interface IPopoverContentBaseProps extends IPopoverContentThemeProps, IPopoverContentOwnProps {}

export interface IPopoverContentProps
    extends IPopoverContentBaseProps, Omit<RacPopoverProps, keyof IPopoverContentBaseProps> {}

/** Custom trigger wrapper (RAC Pressable). */
export interface IPopoverTriggerProps {
    /** Pressable trigger element. */
    children: ReactElement;
}

/** Popover trigger root (RAC DialogTrigger). */
export type TPopoverProps = RacDialogTriggerProps;
