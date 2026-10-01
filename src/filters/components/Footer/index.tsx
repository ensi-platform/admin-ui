import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { type IFiltersFooterProps } from '../../types';

import styles from './styles.module.css';

export const FiltersFooter = supportRef(({ ref, children, className, dataTestId, ...props }: IFiltersFooterProps) => (
    <div {...props} ref={ref} className={cn(styles.footer, className)} data-test-id={dataTestId}>
        {children}
    </div>
));

FiltersFooter.displayName = 'Filters.Footer';
