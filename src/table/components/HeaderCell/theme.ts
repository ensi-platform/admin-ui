import { cva } from 'class-variance-authority';

import styles from './styles.module.css';

export const tableHeaderCellVariants = cva(styles.root, {
    variants: {
        numeric: {
            true: styles.numeric,
            false: null,
        },
        align: {
            start: styles.alignStart,
            end: styles.alignEnd,
            center: styles.alignCenter,
        },
        noWrap: {
            true: styles.noWrap,
            false: null,
        },
        utility: {
            true: styles.utility,
            false: null,
        },
    },
});
