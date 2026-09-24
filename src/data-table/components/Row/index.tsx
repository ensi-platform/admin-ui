import { Table } from '@/table';

import { type IDataTableRowProps } from '../../types';

export const DataTableRow = ({ children, className, ...props }: IDataTableRowProps) => (
    <Table.Row {...props} className={className}>
        {children}
    </Table.Row>
);

DataTableRow.displayName = 'DataTable.Row';
