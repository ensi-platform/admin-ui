import { useAuiLabels } from '@/provider';

import styles from './styles.module.css';

export interface IAutocompleteListStatusProps {
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
}

/** Loading skeleton / empty / error chrome for autocomplete listbox. */
export const AutocompleteListStatus = ({ isLoading, isError, isEmpty }: IAutocompleteListStatusProps) => {
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

AutocompleteListStatus.displayName = 'AutocompleteListStatus';
