import cn from 'classnames';

import { type ITableFooterProps } from './types';

import styles from './styles.module.css';

export const TableFooter = ({ ref, children, sticky = true, className, dataTestId, ...props }: ITableFooterProps) => (
    <div
        {...props}
        ref={ref}
        className={cn(styles.root, sticky && styles.sticky, className)}
        data-sticky={sticky || undefined}
        data-test-id={dataTestId}
    >
        {children}
    </div>
);

TableFooter.displayName = 'Table.Footer';
