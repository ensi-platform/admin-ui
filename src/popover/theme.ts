import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const popoverVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
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
