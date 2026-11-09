import { cva } from 'class-variance-authority';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

export const dropzoneVariants = cva(styles.root, {
    variants: {
        size: {
            sm: typographyStyles.bodyS,
            md: typographyStyles.bodyS,
            lg: typographyStyles.bodyM,
        },
        variant: {
            primary: styles.primary,
        },
        block: {
            true: styles.block,
            false: null,
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'primary',
        block: true,
    },
});
