import { type MouseEvent } from 'react';

import cn from 'classnames';

import { Checkbox } from '@/checkbox';

import { useTableContext } from '../../context';
import { TableHeaderCell } from '../HeaderCell';

import { type ITableHeaderCheckboxCellProps } from './types';

import styles from './styles.module.css';

export const TableHeaderCheckboxCell = ({
    checked,
    indeterminate = false,
    onChange,
    'aria-label': ariaLabel,
    className,
    dataTestId,
    onClick,
    children,
    ...props
}: ITableHeaderCheckboxCellProps) => {
    const { size } = useTableContext();

    const handleClick = (event: MouseEvent<HTMLTableCellElement>) => {
        event.stopPropagation();
        onClick?.(event);
    };

    return (
        <TableHeaderCell
            {...props}
            utility
            className={cn(styles.root, className)}
            dataTestId={dataTestId}
            onClick={handleClick}
        >
            <Checkbox
                size={size}
                checked={checked}
                indeterminate={indeterminate}
                onChange={onChange}
                aria-label={ariaLabel}
            >
                {children}
            </Checkbox>
        </TableHeaderCell>
    );
};

TableHeaderCheckboxCell.displayName = 'Table.HeaderCheckboxCell';
