import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const menuListItemVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
        active: {
            true: styles.active,
            false: null,
        },
        open: {
            true: styles.open,
            false: null,
        },
        collapsed: {
            true: styles.collapsed,
            false: null,
        },
    },
    defaultVariants: {
        size: 'md',
        active: false,
        open: false,
        collapsed: false,
    },
});
