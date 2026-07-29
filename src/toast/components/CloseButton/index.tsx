import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import styles from './styles.module.css';

interface ICloseButtonProps {
    onClose: () => void;
}

export const CloseButton = ({ onClose }: ICloseButtonProps) => {
    const { close } = useAuiLabels();

    return (
        <button
            type="button"
            className={styles.root}
            aria-label={close}
            onClick={event => {
                event.currentTarget.blur();
                onClose();
            }}
        >
            <Clear className={styles.icon} />
        </button>
    );
};

CloseButton.displayName = 'Toast.CloseButton';
