import { Check } from '@/icons';

import styles from './styles.module.css';

export { autocompleteItemVariants } from './theme';

export interface IAutocompleteItemContentProps {
    label: string;
}

export const AutocompleteItemContent = ({ label }: IAutocompleteItemContentProps) => (
    <>
        <span className={styles.label}>{label}</span>
        <Check className={styles.check} />
    </>
);

AutocompleteItemContent.displayName = 'AutocompleteItemContent';
