import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const drawerOverlayVariants = cva(styles.overlay, {
    variants: {
        placement: {
            left: styles.left,
            right: styles.right,
        },
    },
    defaultVariants: {
        placement: 'right',
    },
});

export const drawerPanelVariants = cva(styles.panel, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
        variant: {
            primary: styles.primary,
        },
        placement: {
            left: styles.panelLeft,
            right: styles.panelRight,
        },
        fullscreen: {
            true: styles.fullscreen,
            false: null,
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'primary',
        placement: 'right',
        fullscreen: false,
    },
});
