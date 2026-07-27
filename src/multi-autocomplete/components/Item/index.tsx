import { Check } from '@/icons';

import styles from './styles.module.css';

export { multiAutocompleteItemVariants } from './theme';

export interface IMultiAutocompleteItemContentProps {
    label: string;
}

export const MultiAutocompleteItemContent = ({ label }: IMultiAutocompleteItemContentProps) => (
    <>
        <span className={styles.label}>{label}</span>
        <Check className={styles.check} />
    </>
);

MultiAutocompleteItemContent.displayName = 'MultiAutocompleteItemContent';
