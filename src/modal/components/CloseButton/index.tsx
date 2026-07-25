import { useContext } from 'react';

import cn from 'classnames';
import { OverlayTriggerStateContext } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { type IModalCloseButtonProps } from './types';

import styles from './styles.module.css';

export const ModalCloseButton = ({ className, dataTestId, onClick, ...props }: IModalCloseButtonProps) => {
    const { close } = useAuiLabels();
    const state = useContext(OverlayTriggerStateContext);

    return (
        <button
            {...props}
            type="button"
            className={cn(styles.root, className)}
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
