import { DataTable } from '../Component';
import { type IDataTableProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const DataTableStoryComponent = (props: IDataTableProps) => <DataTable {...props} />;

DataTableStoryComponent.displayName = 'DataTable';
