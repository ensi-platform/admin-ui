import { useContext } from 'react';

import cn from 'classnames';
import { OverlayTriggerStateContext } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { bottomSheetCloseButtonVariants } from './theme';
import { type IBottomSheetCloseButtonProps } from './types';

import styles from './styles.module.css';

export const BottomSheetCloseButton = ({
    className,
    dataTestId,
    onClick,
    size = 'md',
    ...props
}: IBottomSheetCloseButtonProps) => {
    const { close } = useAuiLabels();
    const state = useContext(OverlayTriggerStateContext);

    return (
        <button
            {...props}
            type="button"
            className={cn(bottomSheetCloseButtonVariants({ size }), className)}
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

BottomSheetCloseButton.displayName = 'BottomSheet.CloseButton';
