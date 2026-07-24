import { Check } from '@/icons';

import styles from './styles.module.css';

export { selectItemVariants } from './theme';

export interface ISelectItemContentProps {
    label: string;
}

export const SelectItemContent = ({ label }: ISelectItemContentProps) => (
    <>
        <span className={styles.label}>{label}</span>
        <Check className={styles.check} />
    </>
);

SelectItemContent.displayName = 'SelectItemContent';
