import cn from 'classnames';

import { type ITableBodyProps } from './types';

import styles from './styles.module.css';

export const TableBody = ({ ref, children, className, dataTestId, ...props }: ITableBodyProps) => (
    <tbody {...props} ref={ref} className={cn(styles.root, className)} data-test-id={dataTestId}>
        {children}
    </tbody>
);

TableBody.displayName = 'Table.Body';
