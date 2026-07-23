import { cva } from 'class-variance-authority';
import cn from 'classnames';

import { typographyStyles } from '../../../typography/index.js';
import { type TSelectSize } from '../../types.js';

import styles from './styles.module.css';

export const selectTypeClass = (size: TSelectSize = 'md') =>
    size === 'lg' ? typographyStyles.bodyM : typographyStyles.bodyS;

export const selectTriggerVariants = cva(styles.trigger, {
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
