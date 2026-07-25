import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const drawerCloseButtonVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
    },
    defaultVariants: {
        size: 'md',
    },
});
