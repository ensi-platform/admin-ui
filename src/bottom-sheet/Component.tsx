import { useCallback, useMemo, useRef } from 'react';

import cn from 'classnames';
import { Dialog, Modal as RacModal, ModalOverlay } from 'react-aria-components';

import { useOverlayExitComplete } from '@/hooks';

import { BottomSheetBody } from './components/Body';
import { BottomSheetCloseButton } from './components/CloseButton';
import { BottomSheetFooter } from './components/Footer';
import { BottomSheetHeader } from './components/Header';
import { BottomSheetTitle } from './components/Title';
import { BottomSheetContext } from './context';
import { useBottomSheetSwipe } from './hooks/useBottomSheetSwipe';
import { bottomSheetOverlayVariants, bottomSheetPanelVariants } from './theme';
import { type IBottomSheetProps } from './types';

import styles from './styles.module.css';

const BottomSheetExitComplete = ({
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

const BottomSheetRoot = ({
    ref,
    children,
    open,
    onOpenChange,
    onExitComplete,
    variant = 'primary',
    fullscreen = false,
    dismissable = true,
    keyboardDismissable = true,
    className,
    dataTestId,
    ...props
}: IBottomSheetProps) => {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const setPanelRef = useCallback(
        (node: HTMLDivElement | null) => {
            panelRef.current = node;

            if (typeof ref === 'function') {
                ref(node);
                return;
            }

            if (ref) {
                ref.current = node;
            }
        },
        [ref]
    );

    const onSwipeClose = useCallback(() => {
        onOpenChange?.(false);
    }, [onOpenChange]);

    const swipeHandlers = useBottomSheetSwipe({
        enabled: dismissable,
        onClose: onSwipeClose,
        panelRef,
        contentRef,
    });

    const contextValue = useMemo(() => ({ contentRef }), []);

    return (
        <ModalOverlay
            {...props}
            isOpen={open}
            onOpenChange={onOpenChange}
            isDismissable={dismissable}
            isKeyboardDismissDisabled={!keyboardDismissable}
            className={bottomSheetOverlayVariants()}
        >
            {({ isExiting }) => (
                <>
                    <BottomSheetExitComplete open={open} isExiting={isExiting} onExitComplete={onExitComplete} />
                    <BottomSheetContext.Provider value={contextValue}>
                        <RacModal
                            ref={setPanelRef}
                            className={cn(
                                bottomSheetPanelVariants({
                                    variant,
                                    fullscreen,
                                }),
                                className
                            )}
                            {...swipeHandlers}
                        >
                            <Dialog className={styles.dialog} data-test-id={dataTestId}>
                                <div className={styles.handle} aria-hidden>
                                    <span className={styles.handleLine} />
                                </div>
                                {children}
                            </Dialog>
                        </RacModal>
                    </BottomSheetContext.Provider>
                </>
            )}
        </ModalOverlay>
    );
};

BottomSheetRoot.displayName = 'BottomSheet';

export const BottomSheet = Object.assign(BottomSheetRoot, {
    Header: BottomSheetHeader,
    Title: BottomSheetTitle,
    Body: BottomSheetBody,
    Footer: BottomSheetFooter,
    CloseButton: BottomSheetCloseButton,
});
