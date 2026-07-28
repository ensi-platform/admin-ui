import { type MouseEvent } from 'react';

import cn from 'classnames';

import { Checkbox } from '@/checkbox';

import { useTableContext } from '../../context';
import { TableCell } from '../Cell';

import { type ITableCheckboxCellProps } from './types';

import styles from './styles.module.css';

export const TableCheckboxCell = ({
    checked,
    indeterminate = false,
    onChange,
    'aria-label': ariaLabel,
    className,
    dataTestId,
    onClick,
    children,
    ...props
}: ITableCheckboxCellProps) => {
    const { size } = useTableContext();

    const handleClick = (event: MouseEvent<HTMLTableCellElement>) => {
        event.stopPropagation();
        onClick?.(event);
    };

    return (
        <TableCell
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
        </TableCell>
    );
};

TableCheckboxCell.displayName = 'Table.CheckboxCell';
