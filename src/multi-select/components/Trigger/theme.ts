import { cva } from 'class-variance-authority';
import cn from 'classnames';

import { type TSelectSize } from '../../../select/types.js';
import { typographyStyles } from '../../../typography/index.js';

import styles from './styles.module.css';

export const multiSelectTypeClass = (size: TSelectSize = 'md') =>
    size === 'lg' ? typographyStyles.bodyM : typographyStyles.bodyS;

export const multiSelectTriggerVariants = cva(styles.trigger, {
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

export const multiSelectTagSizeClass = (size: TSelectSize) => (size === 'sm' ? styles.tagSm : styles.tagMd);
