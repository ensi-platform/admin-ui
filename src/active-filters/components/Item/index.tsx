import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { tagVariants } from '@/tag/theme';

import { type IActiveFiltersItemProps } from '../../types';
import { ActiveFiltersRemove } from '../Remove';

import styles from './styles.module.css';

export const ActiveFiltersItem = supportRef(
    ({ ref, children, onRemove, disabled = false, className, dataTestId, ...props }: IActiveFiltersItemProps) => (
        <span
            {...props}
            ref={ref}
            className={cn(tagVariants({ size: 'md', variant: 'primary' }), className)}
            data-disabled={disabled || undefined}
            data-test-id={dataTestId}
        >
            <span className={styles.label}>{children}</span>
            {onRemove ? <ActiveFiltersRemove onRemove={onRemove} disabled={disabled} /> : null}
        </span>
    )
);

ActiveFiltersItem.displayName = 'ActiveFilters.Item';
