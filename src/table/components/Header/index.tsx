import { useMemo } from 'react';

import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { TableHeaderProvider } from './context';
import { type ITableHeaderProps } from './types';

import styles from './styles.module.css';

export const TableHeader = supportRef(
    ({ ref, children, sticky = false, className, dataTestId, ...props }: ITableHeaderProps) => {
        const value = useMemo(() => ({ sticky }), [sticky]);

        return (
            <TableHeaderProvider value={value}>
                <thead
                    {...props}
                    ref={ref}
                    className={cn(styles.root, sticky && styles.sticky, className)}
                    data-sticky={sticky || undefined}
                    data-test-id={dataTestId}
                >
                    {children}
                </thead>
            </TableHeaderProvider>
        );
    }
);

TableHeader.displayName = 'Table.Header';
