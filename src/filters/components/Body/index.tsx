import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { type IFiltersBodyProps } from '../../types';

import styles from './styles.module.css';

export const FiltersBody = supportRef(({ ref, children, className, dataTestId, ...props }: IFiltersBodyProps) => (
    <div {...props} ref={ref} className={cn(styles.root, className)} data-test-id={dataTestId}>
        {children}
    </div>
));

FiltersBody.displayName = 'Filters.Body';
