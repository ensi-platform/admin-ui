import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const bottomSheetOverlayVariants = cva(styles.overlay);

export const bottomSheetPanelVariants = cva(styles.panel, {
    variants: {
        variant: {
            primary: styles.primary,
        },
        fullscreen: {
            true: styles.fullscreen,
            false: null,
        },
    },
    defaultVariants: {
        variant: 'primary',
        fullscreen: false,
    },
});
