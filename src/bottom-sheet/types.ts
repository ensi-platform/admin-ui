import { type ReactNode, type Ref } from 'react';

import { type ModalOverlayProps as RacModalOverlayProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

export type TBottomSheetVariant = 'primary';

/** Theme inputs. */
export interface IBottomSheetThemeProps {
    /** Visual variant. */
    variant?: TBottomSheetVariant;
    /** Stretch panel to the full viewport height. */
    fullscreen?: boolean;
}

/** Control state (our names, not RAC). */
export interface IBottomSheetControlProps {
    /** Controlled open state. */
    open: boolean;
    /** Open state change. */
    onOpenChange?: (open: boolean) => void;
    /** Close on outside click / light dismiss / swipe. */
    dismissable?: boolean;
    /** Close on Escape. */
    keyboardDismissable?: boolean;
    /** Called after the exit animation finishes (or immediately if skipped). */
    onExitComplete?: () => void;
}

/** Own / chrome props (not from RAC). */
export interface IBottomSheetOwnProps extends IDataTestIdProps {
    /** Header / Body / Footer slots. */
    children: ReactNode;
    /** Ref to the bottom sheet panel (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IBottomSheetBaseProps extends IBottomSheetThemeProps, IBottomSheetControlProps, IBottomSheetOwnProps {}

/** RAC keys omitted because names differ from ours or already live in Base. */
export type TBottomSheetRacOmit =
    'children' | 'isOpen' | 'defaultOpen' | 'onOpenChange' | 'isDismissable' | 'isKeyboardDismissDisabled';

export interface IBottomSheetProps
    extends IBottomSheetBaseProps, Omit<RacModalOverlayProps, keyof IBottomSheetBaseProps | TBottomSheetRacOmit> {}

export type { IBottomSheetHeaderProps } from './components/Header/types';
export type { IBottomSheetTitleProps } from './components/Title/types';
export type { IBottomSheetBodyProps } from './components/Body/types';
export type { IBottomSheetFooterProps } from './components/Footer/types';
export type { IBottomSheetCloseButtonProps } from './components/CloseButton/types';
