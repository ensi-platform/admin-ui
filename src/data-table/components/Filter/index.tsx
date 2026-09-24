import { type IDataTableFilterProps } from '../../types';

/** Marker. `HeaderCell` reads it and does not render this node. */
export const DataTableFilter = ({ children, active }: IDataTableFilterProps) => {
    if (children == null && !active) return null;

    return null;
};

DataTableFilter.displayName = 'DataTable.Filter';
