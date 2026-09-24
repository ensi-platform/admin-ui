import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import styles from './styles.module.css';

export const ActiveFiltersRemove = ({ onRemove, disabled = false }: { onRemove: () => void; disabled?: boolean }) => {
    const { clear } = useAuiLabels();

    return (
        <button
            type="button"
            className={styles.remove}
            aria-label={clear}
            data-part="remove"
            disabled={disabled}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                onRemove();
            }}
            onPointerDown={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
        >
            <Clear className={styles.icon} />
        </button>
    );
};
