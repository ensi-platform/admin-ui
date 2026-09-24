import { useMemo } from 'react';

import cn from 'classnames';

import { FiltersGridProvider } from '../../context';
import { type IFiltersGridProps, type IFiltersGridStyle } from '../../types';
import { resolveColumns } from '../../utils';

import styles from './styles.module.css';

export const FiltersGrid = ({
    ref,
    children,
    columns = 4,
    span = {},
    className,
    dataTestId,
    style,
    ...props
}: IFiltersGridProps) => {
    const resolvedColumns = resolveColumns(columns);
    const value = useMemo(() => ({ columns: resolvedColumns, span }), [resolvedColumns, span]);
    const gridStyle: IFiltersGridStyle = {
        ...style,
        '--aui-filters-columns': resolvedColumns,
    };

    return (
        <FiltersGridProvider value={value}>
            <div
                {...props}
                ref={ref}
                className={cn(styles.grid, className)}
                style={gridStyle}
                data-test-id={dataTestId}
            >
                {children}
            </div>
        </FiltersGridProvider>
    );
};

FiltersGrid.displayName = 'Filters.Grid';
