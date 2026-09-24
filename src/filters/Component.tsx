import cn from 'classnames';

import { FiltersCell } from './components/Cell';
import { FiltersFooter } from './components/Footer';
import { FiltersGrid } from './components/Grid';
import { type IFiltersProps } from './types';

import styles from './styles.module.css';

const FiltersRoot = ({ ref, children, className, dataTestId, ...props }: IFiltersProps) => (
    <div {...props} ref={ref} className={cn(styles.root, className)} data-test-id={dataTestId}>
        {children}
    </div>
);

FiltersRoot.displayName = 'Filters';

export const Filters = Object.assign(FiltersRoot, {
    Grid: FiltersGrid,
    Cell: FiltersCell,
    Footer: FiltersFooter,
});
