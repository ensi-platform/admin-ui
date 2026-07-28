import cn from 'classnames';

import { type ITableHeaderProps } from './types';

import styles from './styles.module.css';

export const TableHeader = ({ ref, children, sticky = false, className, dataTestId, ...props }: ITableHeaderProps) => (
    <thead
        {...props}
        ref={ref}
        className={cn(styles.root, sticky && styles.sticky, className)}
        data-sticky={sticky || undefined}
        data-test-id={dataTestId}
    >
        {children}
    </thead>
);

TableHeader.displayName = 'Table.Header';
