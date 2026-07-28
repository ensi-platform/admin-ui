import cn from 'classnames';

import { tableCellVariants } from './theme';
import { type ITableCellProps } from './types';

export const TableCell = ({
    ref,
    children,
    numeric = false,
    align,
    noWrap = false,
    utility = false,
    width,
    colSpan,
    className,
    dataTestId,
    style,
    ...props
}: ITableCellProps) => (
    <td
        {...props}
        ref={ref}
        colSpan={colSpan}
        className={cn(tableCellVariants({ numeric, align, noWrap, utility }), className)}
        style={{ width, ...style }}
        data-numeric={numeric || undefined}
        data-utility={utility || undefined}
        data-test-id={dataTestId}
    >
        {children}
    </td>
);

TableCell.displayName = 'Table.Cell';
