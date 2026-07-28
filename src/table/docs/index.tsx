import { Table } from '../Component';
import { type ITableProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const TableStoryComponent = (props: ITableProps) => <Table {...props} />;

TableStoryComponent.displayName = 'Table';
