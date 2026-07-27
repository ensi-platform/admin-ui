import { cva } from 'class-variance-authority';
import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

export const autocompleteListBoxVariants = cva(styles.root, {
    variants: {
        size: {
            sm: cn(styles.sm, typographyStyles.bodyS),
            md: cn(styles.md, typographyStyles.bodyS),
            lg: cn(styles.lg, typographyStyles.bodyM),
        },
    },
    defaultVariants: {
        size: 'md',
    },
});
