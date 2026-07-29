import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const toastVariants = cva(styles.root, {
    variants: {
        variant: {
            neutral: styles.neutral,
            success: styles.success,
            warning: styles.warning,
            danger: styles.danger,
            info: styles.info,
        },
    },
    defaultVariants: {
        variant: 'neutral',
    },
});
