import { type ReactNode } from 'react';

import { Star } from '@/icons';

import { type TRatingSize, type TRatingVariant } from '../../types';

import { ratingStarVariants } from './theme';

import styles from './styles.module.css';

export interface IRatingStarProps {
    fill: number;
    size: TRatingSize;
    variant: TRatingVariant;
    preview?: boolean;
    children?: ReactNode;
}

export const RatingStar = ({ fill, size, variant, preview = false, children }: IRatingStarProps) => (
    <span className={ratingStarVariants({ size, variant })} data-fill={fill} data-preview={preview || undefined}>
        <span className={styles.glyph} aria-hidden>
            <Star className={styles.icon} />
            <span className={styles.clip} style={{ width: `${fill * 100}%` }}>
                <Star className={styles.icon} />
            </span>
        </span>
        {children}
    </span>
);

RatingStar.displayName = 'RatingStar';
