import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { type ITableBodyProps } from './types';

import styles from './styles.module.css';

export const TableBody = supportRef(({ ref, children, className, dataTestId, ...props }: ITableBodyProps) => (
    <tbody {...props} ref={ref} className={cn(styles.root, className)} data-test-id={dataTestId}>
        {children}
    </tbody>
));

TableBody.displayName = 'Table.Body';
