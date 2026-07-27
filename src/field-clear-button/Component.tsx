import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { fieldClearVariants } from './theme';
import { type IFieldClearButtonProps } from './types';

import styles from './styles.module.css';

/** Presentational clear button for field triggers. */
export const FieldClearButton = ({ isDisabled, size, variant, onClear }: IFieldClearButtonProps) => {
    const { clear } = useAuiLabels();

    return (
        <button
            type="button"
            className={fieldClearVariants({ size, variant })}
            aria-label={clear}
            disabled={isDisabled}
            onPointerDown={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                onClear();
            }}
        >
            <Clear className={styles.root} />
        </button>
    );
};

FieldClearButton.displayName = 'FieldClearButton';
