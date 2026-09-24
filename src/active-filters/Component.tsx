import { Children } from 'react';

import cn from 'classnames';

import { Link } from '@/link';
import { useAuiLabels } from '@/provider';

import { ActiveFiltersGroup } from './components/Group';
import { ActiveFiltersItem } from './components/Item';
import { type IActiveFiltersProps } from './types';

import styles from './styles.module.css';

const ActiveFiltersRoot = ({ ref, children, onClear, className, dataTestId, ...props }: IActiveFiltersProps) => {
    const { clearFilters } = useAuiLabels();

    if (Children.toArray(children).length === 0) {
        return null;
    }

    return (
        <div {...props} ref={ref} className={cn(styles.root, className)} data-test-id={dataTestId}>
            {children}
            {onClear ? (
                <Link as="button" type="button" typography="bodyS" className={styles.clear} onClick={onClear}>
                    {clearFilters}
                </Link>
            ) : null}
        </div>
    );
};

ActiveFiltersRoot.displayName = 'ActiveFilters';

export const ActiveFilters = Object.assign(ActiveFiltersRoot, {
    Item: ActiveFiltersItem,
    Group: ActiveFiltersGroup,
});
