import { useContext } from 'react';

import cn from 'classnames';
import { OverlayTriggerStateContext } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { modalCloseButtonVariants } from './theme';
import { type IModalCloseButtonProps } from './types';

import styles from './styles.module.css';

export const ModalCloseButton = ({ className, dataTestId, onClick, size = 'md', ...props }: IModalCloseButtonProps) => {
    const { close } = useAuiLabels();
    const state = useContext(OverlayTriggerStateContext);

    return (
        <button
            {...props}
            type="button"
            className={cn(modalCloseButtonVariants({ size }), className)}
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

ModalCloseButton.displayName = 'Modal.CloseButton';
