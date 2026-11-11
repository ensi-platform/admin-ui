import { cva } from 'class-variance-authority';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

export const fieldLabelVariants = cva(styles.root, {
    variants: {
        size: {
            sm: typographyStyles.bodyS,
            md: typographyStyles.bodyS,
            lg: typographyStyles.bodyM,
        },
    },
    defaultVariants: {
        size: 'md',
    },
});
