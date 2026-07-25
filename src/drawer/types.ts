import { type ReactNode, type Ref } from 'react';

import { type ModalOverlayProps as RacModalOverlayProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

export type TDrawerSize = 'sm' | 'md' | 'lg';

export type TDrawerVariant = 'primary';

export type TDrawerPlacement = 'left' | 'right';

/** Theme inputs. */
export interface IDrawerThemeProps {
    /** Drawer panel width. Ignored when `fullscreen` is true. */
    size?: TDrawerSize;
    /** Visual variant. */
    variant?: TDrawerVariant;
    /** Physical side of the viewport. */
    placement?: TDrawerPlacement;
    /** Stretch panel to the full viewport width. Overrides `size` geometry. */
    fullscreen?: boolean;
}

/** Control state (our names, not RAC). */
export interface IDrawerControlProps {
    /** Controlled open state. */
    open: boolean;
    /** Open state change. */
    onOpenChange?: (open: boolean) => void;
    /** Close on outside click / light dismiss. */
    dismissable?: boolean;
    /** Close on Escape. */
    keyboardDismissable?: boolean;
    /** Called after the exit animation finishes (or immediately if skipped). */
    onExitComplete?: () => void;
}

/** Own / chrome props (not from RAC). */
export interface IDrawerOwnProps extends IDataTestIdProps {
    /** Header / Body / Footer slots. */
    children: ReactNode;
    /** Ref to the drawer panel (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IDrawerBaseProps extends IDrawerThemeProps, IDrawerControlProps, IDrawerOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TDrawerRacOmit =
    'children' | 'isOpen' | 'defaultOpen' | 'onOpenChange' | 'isDismissable' | 'isKeyboardDismissDisabled';

export interface IDrawerProps
    extends IDrawerBaseProps, Omit<RacModalOverlayProps, keyof IDrawerBaseProps | TDrawerRacOmit> {}

export type { IDrawerHeaderProps } from './components/Header/types';
export type { IDrawerTitleProps } from './components/Title/types';
export type { IDrawerBodyProps } from './components/Body/types';
export type { IDrawerFooterProps } from './components/Footer/types';
export type { IDrawerCloseButtonProps } from './components/CloseButton/types';
