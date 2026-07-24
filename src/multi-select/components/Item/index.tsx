import { Check } from '@/icons';

import styles from './styles.module.css';

export { multiSelectItemVariants } from './theme';

export interface IMultiSelectItemContentProps {
    label: string;
}

export const MultiSelectItemContent = ({ label }: IMultiSelectItemContentProps) => (
    <>
        <span className={styles.label}>{label}</span>
        <Check className={styles.check} />
    </>
);

MultiSelectItemContent.displayName = 'MultiSelectItemContent';
