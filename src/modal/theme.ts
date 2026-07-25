import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const modalOverlayVariants = cva(styles.overlay);

export const modalPanelVariants = cva(styles.panel, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
        variant: {
            primary: styles.primary,
        },
        fullscreen: {
            true: styles.fullscreen,
            false: null,
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'primary',
        fullscreen: false,
    },
});
