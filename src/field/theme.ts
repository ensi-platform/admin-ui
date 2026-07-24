import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const fieldVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
        block: {
            true: styles.block,
            false: null,
        },
    },
    defaultVariants: {
        size: 'md',
        block: true,
    },
});
