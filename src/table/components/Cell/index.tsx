import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';

import { tableCellVariants } from './theme';
import { type ITableCellProps } from './types';

export const TableCell = supportRef(
    ({
        ref,
        children,
        numeric = false,
        align,
        noWrap = false,
        utility = false,
        pin,
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
            className={cn(tableCellVariants({ numeric, align, noWrap, utility, pin: pin != null }), className)}
            style={{ width, minWidth: width, ...style }}
            data-numeric={numeric || undefined}
            data-utility={utility || undefined}
            data-pin={pin}
            data-test-id={dataTestId}
        >
            {children}
        </td>
    )
);

TableCell.displayName = 'Table.Cell';
