import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const autocompleteVariants = cva(styles.root, {
    variants: {
        block: {
            true: styles.block,
            false: null,
        },
    },
    defaultVariants: {
        block: true,
    },
});
