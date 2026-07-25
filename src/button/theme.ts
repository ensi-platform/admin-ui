import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const buttonVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
        variant: {
            primary: styles.primary,
            secondary: styles.secondary,
            danger: styles.danger,
        },
        block: {
            true: styles.block,
            false: null,
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'primary',
        block: false,
    },
});
