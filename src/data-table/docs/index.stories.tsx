import { useState } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { ContextMenu } from '@/context-menu';
import { Select } from '@/select';

import { DataTable, type IDataTableProps, type IDataTableSort } from '..';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { DataTableStoryComponent } from '.';

const CITY_OPTIONS = [
    { value: 'Kazan', label: 'Kazan' },
    { value: 'Moscow', label: 'Moscow' },
];

const OrderRow = ({
    row,
    onOpen,
}: {
    row: { id: number; city: string; email: string; locked: boolean };
    onOpen: (x: number, y: number) => void;
}) => (
    <DataTable.Row
        onContextMenu={event => {
            event.preventDefault();
            onOpen(event.clientX, event.clientY);
        }}
    >
        <DataTable.Cell>{row.city}</DataTable.Cell>
        <DataTable.Cell>{row.email}</DataTable.Cell>
        <DataTable.Cell utility>
            <DataTable.Actions
                onClick={event => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    onOpen(rect.left, rect.bottom);
                }}
            />
        </DataTable.Cell>
    </DataTable.Row>
);

const ROWS = [
    { id: 1, city: 'Kazan', email: 'alice@example.com', locked: false },
    { id: 2, city: 'Moscow', email: 'bob@example.com', locked: true },
];

const DEFAULT_ARGS: IDataTableProps = {
    children: null,
    size: 'md',
    block: true,
    hasChecked: false,
    zebra: true,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IDataTableProps>> = {
    size: { control: { type: 'select' } },
    block: { control: { type: 'boolean' } },
    hasChecked: { control: { type: 'boolean' } },
    zebra: { control: { type: 'boolean' } },
};

export default {
    title: 'Base/DataTable',
    component: DataTableStoryComponent,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        controls: {
            expanded: true,
        },
    },
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof DataTableStoryComponent>;

/** Sort, an active column filter, and a row action menu. */
export const Default: StoryObj<IDataTableProps> = {
    render: function DefaultStory(args) {
        const [sort, setSort] = useState<IDataTableSort | undefined>({ column: 'city', direction: 'asc' });
        const [cities, setCities] = useState<string[]>(['Kazan']);
        const [menu, setMenu] = useState<{ x: number; y: number; locked: boolean } | null>(null);

        const rows = ROWS.filter(row => (cities.length === 0 ? true : cities.includes(row.city)));

        return (
            <>
                <DataTable {...args} sort={sort} onSortChange={setSort}>
                    <DataTable.Header sticky>
                        <DataTable.Row>
                            <DataTable.HeaderCell column="city" sortable>
                                City
                                <DataTable.Filter active={cities.length > 0}>
                                    <Select
                                        aria-label="City"
                                        placeholder="City"
                                        options={CITY_OPTIONS}
                                        value={cities[0] ?? null}
                                        clear
                                        onChange={next => setCities(next == null ? [] : [String(next)])}
                                    />
                                </DataTable.Filter>
                            </DataTable.HeaderCell>
                            <DataTable.HeaderCell>Email</DataTable.HeaderCell>
                            <DataTable.HeaderCell utility />
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body>
                        {rows.map(row => (
                            <OrderRow key={row.id} row={row} onOpen={(x, y) => setMenu({ x, y, locked: row.locked })} />
                        ))}
                    </DataTable.Body>
                    <DataTable.Footer>
                        <span>
                            {rows.length} of {ROWS.length}
                        </span>
                    </DataTable.Footer>
                </DataTable>
                <ContextMenu open={menu != null} x={menu?.x ?? 0} y={menu?.y ?? 0} onClose={() => setMenu(null)}>
                    <ContextMenu.Item onClick={() => setMenu(null)}>Open</ContextMenu.Item>
                    <ContextMenu.Item variant="danger" disabled={menu?.locked} onClick={() => setMenu(null)}>
                        Delete
                    </ContextMenu.Item>
                </ContextMenu>
            </>
        );
    },
};

/** Header without a filter drop. */
export const WithoutFilter: StoryObj<IDataTableProps> = {
    render: function WithoutFilterStory(args) {
        return (
            <DataTable {...args}>
                <DataTable.Header>
                    <DataTable.Row>
                        <DataTable.HeaderCell column="city" sortable>
                            City
                        </DataTable.HeaderCell>
                        <DataTable.HeaderCell>Email</DataTable.HeaderCell>
                    </DataTable.Row>
                </DataTable.Header>
                <DataTable.Body>
                    {ROWS.map(row => (
                        <DataTable.Row key={row.id}>
                            <DataTable.Cell>{row.city}</DataTable.Cell>
                            <DataTable.Cell>{row.email}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable.Body>
            </DataTable>
        );
    },
};
