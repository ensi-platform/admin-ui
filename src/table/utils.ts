import { type TTableSortDirection } from './types';

/** Next sort direction in none → asc → desc → none cycle. */
export const getNextSortDirection = (current: TTableSortDirection | undefined): TTableSortDirection | undefined => {
    if (current === undefined) return 'asc';
    if (current === 'asc') return 'desc';
    return undefined;
};
