import { cva } from 'class-variance-authority';
import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

export const comboboxListBoxVariants = cva(styles.root, {
    variants: {
        size: {
            sm: cn(styles.sm, typographyStyles.bodyS),
            md: cn(styles.md, typographyStyles.bodyM),
            lg: cn(styles.lg, typographyStyles.bodyL),
        },
    },
    defaultVariants: {
        size: 'md',
    },
});
