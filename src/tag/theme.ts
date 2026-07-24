import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const tagVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
        },
        variant: {
            primary: styles.primary,
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'primary',
    },
});
