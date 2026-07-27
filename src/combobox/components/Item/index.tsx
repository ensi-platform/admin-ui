import { Check } from '@/icons';

import styles from './styles.module.css';

export { comboboxItemVariants } from './theme';

export interface IComboboxItemContentProps {
    label: string;
}

export const ComboboxItemContent = ({ label }: IComboboxItemContentProps) => (
    <>
        <span className={styles.label}>{label}</span>
        <Check className={styles.check} />
    </>
);

ComboboxItemContent.displayName = 'ComboboxItemContent';
