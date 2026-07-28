import { cva } from 'class-variance-authority';
import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

export const tableShellVariants = cva(styles.root, {
    variants: {
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
        block: {
            true: styles.block,
            false: null,
        },
        hasChecked: {
            true: styles.hasChecked,
            false: null,
        },
        zebra: {
            true: styles.zebra,
            false: null,
        },
    },
    defaultVariants: {
        size: 'md',
        block: true,
        hasChecked: false,
        zebra: false,
    },
});

export const tableScrollClassName = styles.scroll;

export const tableElementClassName = cn(styles.table, typographyStyles.bodyS);
