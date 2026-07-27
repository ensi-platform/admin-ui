import { cva } from 'class-variance-authority';
import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import styles from './styles.module.css';

export const comboboxTriggerVariants = cva(styles.trigger, {
    variants: {
        size: {
            sm: cn(styles.sm, typographyStyles.bodyS),
            md: cn(styles.md, typographyStyles.bodyM),
            lg: cn(styles.lg, typographyStyles.bodyL),
        },
        variant: {
            primary: styles.primary,
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'primary',
    },
});
