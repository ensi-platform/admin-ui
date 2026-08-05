import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const menuListShellVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
        variant: {
            primary: styles.primary,
        },
        collapsed: {
            true: styles.collapsed,
            false: null,
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'primary',
        collapsed: false,
    },
});
