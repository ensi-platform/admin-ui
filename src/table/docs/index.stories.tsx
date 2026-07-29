import { useMemo, useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@/button';
import { Loader } from '@/loader';

import { Table } from '../Component';
import { useTableRowSelection } from '../hooks/useTableRowSelection';
import { type ITableBaseProps, type TTableSortDirection } from '../types';

import Description from './Description.md';

import { TableStoryComponent } from '.';

const CITIES = ['Moscow', 'SPb', 'Kazan', 'Novosibirsk', 'Yekaterinburg', 'Nizhny Novgorod', 'Samara', 'Rostov'];
const STATUSES = ['New', 'In progress', 'Paid', 'Shipped', 'Cancelled'] as const;
const NAMES = [
    'Alice Petrova',
    'Bob Ivanov',
    'Clara Smirnova',
    'Dmitry Kozlov',
    'Elena Volkova',
    'Fedor Sokolov',
    'Galina Orlova',
    'Ivan Morozov',
    'Julia Belova',
    'Kirill Novikov',
];

interface IDemoRow {
    id: number;
    order: string;
    name: string;
    email: string;
    city: string;
    status: (typeof STATUSES)[number];
    qty: number;
    amount: string;
    updatedAt: string;
    manager: string;
    warehouse: string;
    channel: string;
    note: string;
}

const DEMO_ROWS: IDemoRow[] = Array.from({ length: 48 }, (_, i) => {
    const id = i + 1;
    const name = NAMES[i % NAMES.length];
    const city = CITIES[i % CITIES.length];
    const status = STATUSES[i % STATUSES.length];
    const qty = ((i * 3) % 40) + 1;
    const amountValue = (qty * (1200 + (i % 7) * 350)).toLocaleString('ru-RU');

    return {
        id,
        order: `ORD-${String(10_000 + id)}`,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        city,
        status,
        qty,
        amount: amountValue,
        updatedAt: `2026-07-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:30`,
        manager: NAMES[(i + 3) % NAMES.length],
        warehouse: `WH-${(i % 5) + 1}`,
        channel: i % 2 === 0 ? 'Site' : 'Offline',
        note: i % 5 === 0 ? 'Priority client, confirm delivery window' : '—',
    };
});

type TSortKey = 'order' | 'name' | 'city' | 'status' | 'qty' | 'amount' | 'updatedAt';

const DEFAULT_ARGS: ITableBaseProps = {
    children: null,
    size: 'md',
    block: true,
    hasChecked: true,
    zebra: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ITableBaseProps>> = {
    size: { control: { type: 'select' } },
    block: { control: { type: 'boolean' } },
    hasChecked: { control: { type: 'boolean' } },
    zebra: { control: { type: 'boolean' } },
};

export default {
    title: 'Table',
    component: TableStoryComponent,
    parameters: {
        docs: {
            description: {
                component: Description,
            },
        },
        controls: {
            expanded: true,
        },
    },
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof TableStoryComponent>;

/** Kitchen-sink: selection, multi-sort UI, sticky, numeric, noWrap, actions, clickable rows, scroll, pagination. */
export const Default: StoryObj<ITableBaseProps> = {
    render: function DefaultStory(args) {
        const [sortKey, setSortKey] = useState<TSortKey | undefined>('updatedAt');
        const [sortDirection, setSortDirection] = useState<TTableSortDirection | undefined>('desc');
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(5);

        const sortedRows = useMemo(() => {
            if (!sortKey || !sortDirection) return DEMO_ROWS;

            const copy = [...DEMO_ROWS];
            copy.sort((a, b) => {
                const left = a[sortKey];
                const right = b[sortKey];
                const cmp =
                    typeof left === 'number' && typeof right === 'number'
                        ? left - right
                        : String(left).localeCompare(String(right), 'ru', { numeric: true });
                return sortDirection === 'asc' ? cmp : -cmp;
            });
            return copy;
        }, [sortKey, sortDirection]);

        const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
        const currentPage = Math.min(page, pageCount);
        const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        const pageIds = useMemo(() => pageRows.map(r => r.id), [pageRows]);
        const { isSelected, toggle, isAllSelected, isIndeterminate, setAllOnPage, clearAll, selected } =
            useTableRowSelection(pageIds);

        const from = sortedRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
        const to = Math.min(currentPage * pageSize, sortedRows.length);

        const handlePageChange = (next: number) => {
            clearAll();
            setPage(next);
        };

        const handlePageSizeChange = (size: number) => {
            clearAll();
            setPageSize(size);
            setPage(1);
        };

        const handleSort = (key: TSortKey) => (direction: TTableSortDirection | undefined) => {
            clearAll();
            setSortKey(direction ? key : undefined);
            setSortDirection(direction);
            setPage(1);
        };

        const directionFor = (key: TSortKey) => (sortKey === key ? sortDirection : undefined);

        return (
            <div style={{ height: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin: 0, color: 'var(--aui-page-fg-muted)' }}>
                    Selected: {selected.size} · Sort: {sortKey ?? 'none'} {sortDirection ?? ''}
                </p>
                <Table {...args} hasChecked={args.hasChecked ?? true}>
                    <Table.Scroll>
                        <Table.Table>
                            <Table.Header sticky>
                                <Table.Row>
                                    <Table.HeaderCheckboxCell
                                        checked={isAllSelected}
                                        indeterminate={isIndeterminate}
                                        onChange={setAllOnPage}
                                        aria-label="Select all"
                                    />
                                    <Table.HeaderCell
                                        noWrap
                                        sortable
                                        sortDirection={directionFor('order')}
                                        onSort={handleSort('order')}
                                    >
                                        Order
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        noWrap
                                        sortable
                                        sortDirection={directionFor('name')}
                                        onSort={handleSort('name')}
                                    >
                                        Customer
                                    </Table.HeaderCell>
                                    <Table.HeaderCell noWrap>Email</Table.HeaderCell>
                                    <Table.HeaderCell
                                        noWrap
                                        sortable
                                        sortDirection={directionFor('city')}
                                        onSort={handleSort('city')}
                                    >
                                        City
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        noWrap
                                        sortable
                                        sortDirection={directionFor('status')}
                                        onSort={handleSort('status')}
                                    >
                                        Status
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        numeric
                                        noWrap
                                        sortable
                                        sortDirection={directionFor('qty')}
                                        onSort={handleSort('qty')}
                                    >
                                        Qty
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        numeric
                                        noWrap
                                        sortable
                                        sortDirection={directionFor('amount')}
                                        onSort={handleSort('amount')}
                                    >
                                        Amount, ₽
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        noWrap
                                        sortable
                                        sortDirection={directionFor('updatedAt')}
                                        onSort={handleSort('updatedAt')}
                                    >
                                        Updated
                                    </Table.HeaderCell>
                                    <Table.HeaderCell noWrap>Manager</Table.HeaderCell>
                                    <Table.HeaderCell noWrap>Warehouse</Table.HeaderCell>
                                    <Table.HeaderCell noWrap>Channel</Table.HeaderCell>
                                    <Table.HeaderCell noWrap width={220}>
                                        Note
                                    </Table.HeaderCell>
                                    <Table.HeaderCell utility>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {pageRows.map(row => {
                                    const isDisabled = row.id === 5;

                                    return (
                                        <Table.Row
                                            key={row.id}
                                            checked={isSelected(row.id)}
                                            disabled={isDisabled}
                                            onClick={isDisabled ? undefined : () => undefined}
                                        >
                                            <Table.CheckboxCell
                                                checked={isSelected(row.id)}
                                                onChange={() => toggle(row.id)}
                                                aria-label={`Select ${row.order}`}
                                            />
                                            <Table.Cell noWrap>{row.order}</Table.Cell>
                                            <Table.Cell noWrap>{row.name}</Table.Cell>
                                            <Table.Cell noWrap>{row.email}</Table.Cell>
                                            <Table.Cell noWrap>{row.city}</Table.Cell>
                                            <Table.Cell noWrap>{row.status}</Table.Cell>
                                            <Table.Cell numeric noWrap>
                                                {row.qty}
                                            </Table.Cell>
                                            <Table.Cell numeric noWrap>
                                                {row.amount}
                                            </Table.Cell>
                                            <Table.Cell noWrap>{row.updatedAt}</Table.Cell>
                                            <Table.Cell noWrap>{row.manager}</Table.Cell>
                                            <Table.Cell noWrap>{row.warehouse}</Table.Cell>
                                            <Table.Cell noWrap>{row.channel}</Table.Cell>
                                            <Table.Cell noWrap>{row.note}</Table.Cell>
                                            <Table.Cell utility>
                                                <Table.ActionBar
                                                    visibleCount={1}
                                                    items={[
                                                        { text: 'Open', onClick: () => undefined },
                                                        { text: 'Edit', onClick: () => undefined },
                                                        { text: 'Duplicate', onClick: () => undefined },
                                                        { text: 'Delete', onClick: () => undefined, danger: true },
                                                    ]}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Table>
                    </Table.Scroll>
                    <Table.Footer>
                        <Table.PageSize value={pageSize} onChange={handlePageSizeChange} />
                        <Table.Pagination
                            page={currentPage}
                            pageCount={pageCount}
                            onPageChange={handlePageChange}
                            from={from}
                            to={to}
                            total={sortedRows.length}
                        />
                    </Table.Footer>
                </Table>
            </div>
        );
    },
};

const SIMPLE_ROWS = [
    { id: 1, name: 'Alice', amount: '1 200' },
    { id: 2, name: 'Bob', amount: '3 400' },
    { id: 3, name: 'Clara', amount: '890' },
];

/** Loader wraps table inside Scroll; Footer stays outside the veil. */
export const WithLoader: StoryObj<ITableBaseProps> = {
    render: function WithLoaderStory(args) {
        const [active, setActive] = useState(true);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: 280 }}>
                <Button size="sm" variant="secondary" onClick={() => setActive(v => !v)}>
                    {active ? 'Stop fetching' : 'Start fetching'}
                </Button>
                <Table {...args} hasChecked={false}>
                    <Table.Scroll>
                        <Loader active={active}>
                            <Table.Table>
                                <Table.Header sticky>
                                    <Table.Row>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell numeric>Amount</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {SIMPLE_ROWS.map(row => (
                                        <Table.Row key={row.id}>
                                            <Table.Cell>{row.name}</Table.Cell>
                                            <Table.Cell numeric>{row.amount}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Table>
                        </Loader>
                    </Table.Scroll>
                    <Table.Footer>
                        <span>3 rows</span>
                    </Table.Footer>
                </Table>
            </div>
        );
    },
};

/** Empty body (no rows) — app markup; no Loader. */
export const Empty: StoryObj<ITableBaseProps> = {
    render: function EmptyStory(args) {
        return (
            <div style={{ height: 280 }}>
                <Table {...args} hasChecked={false}>
                    <Table.Scroll>
                        <Table.Table>
                            <Table.Header sticky>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell numeric>Amount</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell colSpan={2} align="center" style={{ padding: 48 }}>
                                        <p style={{ margin: 0, fontWeight: 600 }}>Ничего не найдено</p>
                                        <p style={{ margin: '8px 0 0', color: 'var(--aui-page-fg-muted)' }}>
                                            Измените фильтры или добавьте записи
                                        </p>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Table>
                    </Table.Scroll>
                    <Table.Footer>
                        <span>No rows</span>
                    </Table.Footer>
                </Table>
            </div>
        );
    },
};
