import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const multiSelectPopoverVariants = cva(styles.root, {
    variants: {
        variant: {
            primary: styles.primary,
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});
