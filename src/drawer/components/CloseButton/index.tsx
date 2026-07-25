import { useContext } from 'react';

import cn from 'classnames';
import { OverlayTriggerStateContext } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { drawerCloseButtonVariants } from './theme';
import { type IDrawerCloseButtonProps } from './types';

import styles from './styles.module.css';

export const DrawerCloseButton = ({
    className,
    dataTestId,
    onClick,
    size = 'md',
    ...props
}: IDrawerCloseButtonProps) => {
    const { close } = useAuiLabels();
    const state = useContext(OverlayTriggerStateContext);

    return (
        <button
            {...props}
            type="button"
            className={cn(drawerCloseButtonVariants({ size }), className)}
            aria-label={close}
            data-test-id={dataTestId}
            onClick={event => {
                onClick?.(event);
                if (!event.defaultPrevented) {
                    state?.close();
                }
            }}
        >
            <Clear className={styles.icon} />
        </button>
    );
};

DrawerCloseButton.displayName = 'Drawer.CloseButton';
