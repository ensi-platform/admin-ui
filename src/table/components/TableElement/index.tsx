import cn from 'classnames';

import { tableElementClassName } from '../../theme';
import { type ITableElementProps } from './types';

export const TableElement = ({ ref, children, className, dataTestId, ...props }: ITableElementProps) => (
    <table
        {...props}
        ref={ref}
        className={cn(tableElementClassName, className)}
        data-test-id={dataTestId}
    >
        {children}
    </table>
);

TableElement.displayName = 'Table.Table';
