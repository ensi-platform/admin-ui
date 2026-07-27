import { cva } from 'class-variance-authority';
import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { type TSelectSize } from '@/select/types';

import styles from './styles.module.css';

export const multiAutocompleteTriggerVariants = cva(styles.trigger, {
    variants: {
        size: {
            sm: cn(styles.sm, typographyStyles.bodyS),
            md: cn(styles.md, typographyStyles.bodyS),
            lg: cn(styles.lg, typographyStyles.bodyM),
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

export const multiAutocompleteTagSizeClass = (size: TSelectSize) => (size === 'sm' ? styles.tagSm : styles.tagMd);

export const multiAutocompleteOverflowSizeClass = (size: TSelectSize) =>
    size === 'sm' ? styles.overflowSm : styles.overflowMd;
