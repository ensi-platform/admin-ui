import { type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Confirm button visual tone. */
export type TActionPopupTone = 'primary' | 'danger';

/** Control state (our names, not RAC). */
export interface IActionPopupControlProps {
    /** Controlled open state. */
    open: boolean;
    /** Open state change. */
    onOpenChange?: (open: boolean) => void;
    /** Called after the exit animation finishes (or immediately if skipped). */
    onExitComplete?: () => void;
    /** Close on outside click / light dismiss. */
    dismissable?: boolean;
}

/** Own / chrome props (not from RAC|DOM). */
export interface IActionPopupOwnProps extends IDataTestIdProps {
    /** Dialog title. */
    title: string;
    /** Optional description body. */
    children?: ReactNode;
    /** Confirm handler; closes after resolve, stays open on reject. */
    onConfirm: () => void | Promise<void>;
    /** Confirm button tone. */
    tone?: TActionPopupTone;
    /** Confirm button label. */
    confirmLabel: string;
    /** Cancel button label. */
    cancelLabel: string;
    /** Extra disable for the confirm button. */
    isConfirmDisabled?: boolean;
}

export interface IActionPopupProps extends IActionPopupControlProps, IActionPopupOwnProps {}

/** Content slice for ConfirmModal / DeleteModal presets. */
export type TConfirmModalProps = Omit<IActionPopupProps, 'tone' | 'confirmLabel' | 'cancelLabel'>;

export type TDeleteModalProps = TConfirmModalProps;
