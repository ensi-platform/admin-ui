import cn from 'classnames';
import { Dialog, Modal as RacModal, ModalOverlay } from 'react-aria-components';

import { useOverlayExitComplete } from '@/hooks';

import { DrawerBody } from './components/Body';
import { DrawerCloseButton } from './components/CloseButton';
import { DrawerFooter } from './components/Footer';
import { DrawerHeader } from './components/Header';
import { DrawerTitle } from './components/Title';
import { drawerOverlayVariants, drawerPanelVariants } from './theme';
import { type IDrawerProps } from './types';

import styles from './styles.module.css';

const DrawerExitComplete = ({
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

const DrawerRoot = ({
    ref,
    children,
    open,
    onOpenChange,
    onExitComplete,
    size = 'md',
    variant = 'primary',
    placement = 'right',
    fullscreen = false,
    dismissable = true,
    keyboardDismissable = true,
    className,
    dataTestId,
    ...props
}: IDrawerProps) => (
    <ModalOverlay
        {...props}
        isOpen={open}
        onOpenChange={onOpenChange}
        isDismissable={dismissable}
        isKeyboardDismissDisabled={!keyboardDismissable}
        className={drawerOverlayVariants({ placement })}
    >
        {({ isExiting }) => (
            <>
                <DrawerExitComplete open={open} isExiting={isExiting} onExitComplete={onExitComplete} />
                <RacModal
                    ref={ref}
                    className={cn(
                        drawerPanelVariants({
                            size: fullscreen ? undefined : size,
                            variant,
                            placement,
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

DrawerRoot.displayName = 'Drawer';

export const Drawer = Object.assign(DrawerRoot, {
    Header: DrawerHeader,
    Title: DrawerTitle,
    Body: DrawerBody,
    Footer: DrawerFooter,
    CloseButton: DrawerCloseButton,
});
