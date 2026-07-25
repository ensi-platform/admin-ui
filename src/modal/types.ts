import { type ReactNode, type Ref } from 'react';

import { type ModalOverlayProps as RacModalOverlayProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

export type TModalSize = 'sm' | 'md' | 'lg';

export type TModalVariant = 'primary';

/** Theme inputs. */
export interface IModalThemeProps {
    /** Modal width size. Ignored when `fullscreen` is true. */
    size?: TModalSize;
    /** Visual variant. */
    variant?: TModalVariant;
    /** Stretch to the full viewport. Overrides `size` geometry. */
    fullscreen?: boolean;
}

/** Control state (our names, not RAC). */
export interface IModalControlProps {
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
export interface IModalOwnProps extends IDataTestIdProps {
    /** Header / Body / Footer slots. */
    children: ReactNode;
    /** Ref to the modal panel (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IModalBaseProps extends IModalThemeProps, IModalControlProps, IModalOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TModalRacOmit =
    'children' | 'isOpen' | 'defaultOpen' | 'onOpenChange' | 'isDismissable' | 'isKeyboardDismissDisabled';

export interface IModalProps
    extends IModalBaseProps, Omit<RacModalOverlayProps, keyof IModalBaseProps | TModalRacOmit> {}

export type { IModalHeaderProps } from './components/Header/types';
export type { IModalTitleProps } from './components/Title/types';
export type { IModalBodyProps } from './components/Body/types';
export type { IModalFooterProps } from './components/Footer/types';
export type { IModalCloseButtonProps } from './components/CloseButton/types';
