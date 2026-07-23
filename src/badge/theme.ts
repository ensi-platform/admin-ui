import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const badgeVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
        },
        variant: {
            neutral: styles.neutral,
            success: styles.success,
            warning: styles.warning,
            danger: styles.danger,
            info: styles.info,
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'neutral',
    },
});
