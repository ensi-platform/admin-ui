import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { type ITableFooterProps } from './types';

import styles from './styles.module.css';

export const TableFooter = supportRef(
    ({ ref, children, sticky = true, className, dataTestId, ...props }: ITableFooterProps) => (
        <div
            {...props}
            ref={ref}
            className={cn(styles.root, className)}
            data-sticky={sticky || undefined}
            data-test-id={dataTestId}
        >
            {children}
        </div>
    )
);

TableFooter.displayName = 'Table.Footer';
