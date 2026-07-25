import { useState } from 'react';

import { Button } from '@/button';
import { Modal } from '@/modal';

import { type IActionPopupProps } from './types';

export const ActionPopup = ({
    open,
    onOpenChange,
    onExitComplete,
    dismissable = true,
    title,
    children,
    onConfirm,
    tone = 'primary',
    confirmLabel,
    cancelLabel,
    isConfirmDisabled = false,
    dataTestId,
}: IActionPopupProps) => {
    const [isPending, setIsPending] = useState(false);

    const handleCancel = () => {
        onOpenChange?.(false);
    };

    const handleConfirm = async () => {
        setIsPending(true);

        try {
            await onConfirm();
            onOpenChange?.(false);
        } catch {
            // Keep open on reject.
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            onExitComplete={onExitComplete}
            size="sm"
            dismissable={dismissable && !isPending}
            keyboardDismissable={!isPending}
            dataTestId={dataTestId}
        >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            {children != null ? <Modal.Body>{children}</Modal.Body> : null}
            <Modal.Footer>
                <Button variant="secondary" disabled={isPending} onClick={handleCancel}>
                    {cancelLabel}
                </Button>
                <Button
                    variant={tone === 'danger' ? 'danger' : 'primary'}
                    disabled={isPending || isConfirmDisabled}
                    onClick={handleConfirm}
                >
                    {confirmLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ActionPopup.displayName = 'ActionPopup';
