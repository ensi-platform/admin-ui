import { useAuiLabels } from '@/provider';

import styles from './styles.module.css';

export interface IComboboxListStatusProps {
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
}

/** Loading skeleton / empty / error chrome for combobox. */
export const ComboboxListStatus = ({ isLoading, isError, isEmpty }: IComboboxListStatusProps) => {
    const { loadingSuggestions, noSuggestions, suggestionsError } = useAuiLabels();

    if (isLoading) {
        return (
            <div className={styles.root} role="status" aria-live="polite" aria-label={loadingSuggestions}>
                <div className={styles.skeletonList}>
                    <div className={styles.skeletonRow} />
                    <div className={styles.skeletonRow} />
                    <div className={styles.skeletonRow} />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.root} role="status" aria-live="polite">
                <p className={styles.message}>{suggestionsError}</p>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className={styles.root} role="status" aria-live="polite">
                <p className={styles.message}>{noSuggestions}</p>
            </div>
        );
    }

    return null;
};

ComboboxListStatus.displayName = 'ComboboxListStatus';
