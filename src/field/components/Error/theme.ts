import { cva } from 'class-variance-authority';

import { typographyStyles } from '../../../typography/index.js';

import styles from './styles.module.css';

export const fieldErrorVariants = cva(styles.root, {
    variants: {
        size: {
            sm: typographyStyles.bodyXs,
            md: typographyStyles.bodyXs,
            lg: typographyStyles.bodyS,
        },
    },
    defaultVariants: {
        size: 'md',
    },
});
