import cn from 'classnames';

import { useFiltersGrid } from '../../context';
import { type IFiltersCellProps, type IFiltersCellStyle } from '../../types';
import { resolveSpan } from '../../utils';

import styles from './styles.module.css';

export const FiltersCell = ({ ref, children, kind, className, dataTestId, style, ...props }: IFiltersCellProps) => {
    const { columns, span } = useFiltersGrid();
    const cellStyle: IFiltersCellStyle = {
        ...style,
        '--aui-filters-span': resolveSpan(kind, span, columns),
    };

    return (
        <div {...props} ref={ref} className={cn(styles.cell, className)} style={cellStyle} data-test-id={dataTestId}>
            {children}
        </div>
    );
};

FiltersCell.displayName = 'Filters.Cell';
