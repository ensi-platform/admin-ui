import { cva } from 'class-variance-authority';
import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { type TComboboxSize } from '../../types';

import styles from './styles.module.css';

export const comboboxMultiTriggerVariants = cva(styles.trigger, {
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

export const comboboxTagSizeClass = (size: TComboboxSize) => (size === 'sm' ? styles.tagSm : styles.tagMd);

export const comboboxOverflowSizeClass = (size: TComboboxSize) => (size === 'sm' ? styles.overflowSm : styles.overflowMd);
