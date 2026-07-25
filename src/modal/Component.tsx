import cn from 'classnames';
import { Dialog, Modal as RacModal, ModalOverlay } from 'react-aria-components';

import { useOverlayExitComplete } from '@/hooks';

import { ModalBody } from './components/Body';
import { ModalCloseButton } from './components/CloseButton';
import { ModalFooter } from './components/Footer';
import { ModalHeader } from './components/Header';
import { ModalTitle } from './components/Title';
import { modalOverlayVariants, modalPanelVariants } from './theme';
import { type IModalProps } from './types';

import styles from './styles.module.css';

const ModalExitComplete = ({
    open,
    isExiting,
    onExitComplete,
}: {
    open: boolean;
    isExiting: boolean;
    onExitComplete?: () => void;
}) => {
    useOverlayExitComplete(open, isExiting, onExitComplete);

    return null;
};

const ModalRoot = ({
    ref,
    children,
    open,
    onOpenChange,
    onExitComplete,
    size = 'md',
    variant = 'primary',
    fullscreen = false,
    dismissable = true,
    keyboardDismissable = true,
    className,
    dataTestId,
    ...props
}: IModalProps) => (
    <ModalOverlay
        {...props}
        isOpen={open}
        onOpenChange={onOpenChange}
        isDismissable={dismissable}
        isKeyboardDismissDisabled={!keyboardDismissable}
        className={modalOverlayVariants()}
    >
        {({ isExiting }) => (
            <>
                <ModalExitComplete open={open} isExiting={isExiting} onExitComplete={onExitComplete} />
                <RacModal
                    ref={ref}
                    className={cn(
                        modalPanelVariants({
                            size: fullscreen ? undefined : size,
                            variant,
                            fullscreen,
                        }),
                        className
                    )}
                >
                    <Dialog className={styles.dialog} data-test-id={dataTestId}>
                        {children}
                    </Dialog>
                </RacModal>
            </>
        )}
    </ModalOverlay>
);

ModalRoot.displayName = 'Modal';

export const Modal = Object.assign(ModalRoot, {
    Header: ModalHeader,
    Title: ModalTitle,
    Body: ModalBody,
    Footer: ModalFooter,
    CloseButton: ModalCloseButton,
});
