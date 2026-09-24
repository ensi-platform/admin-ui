import cn from 'classnames';

import { type IFiltersFooterProps } from '../../types';

import styles from './styles.module.css';

export const FiltersFooter = ({ ref, children, className, dataTestId, ...props }: IFiltersFooterProps) => (
    <div {...props} ref={ref} className={cn(styles.footer, className)} data-test-id={dataTestId}>
        {children}
    </div>
);

FiltersFooter.displayName = 'Filters.Footer';
