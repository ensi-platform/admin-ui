import { type ComponentProps, type ReactNode, useMemo, useState } from 'react';

import { CalendarDate } from '@internationalized/date';
import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { type DateRange } from 'react-aria-components';

import { Avatar } from '@/avatar';
import { Badge } from '@/badge';
import { Button } from '@/button';
import { DateRangePicker } from '@/date-range-picker';
import { typographyStyles } from '@/ds/typography';
import { Field, useField } from '@/field';
import { Cart, ChevronDown, LogoEnsiMark, Package, Users } from '@/icons';
import { Input } from '@/input';
import { Link } from '@/link';
import { NumberInput } from '@/number-input';
import { Popover } from '@/popover';
import { Select, type TComboboxValue } from '@/select';
import { Table, useTableRowSelection } from '@/table';
import { Tag } from '@/tag';

import { CascadeMenu } from '../Component';
import { type ICascadeMenuProps } from '../types';
import { type ICascadeMenuItem } from '../utils';

import styles from '../components/Header/styles.module.css';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

type TCascadeStoryProps = Omit<
    ICascadeMenuProps,
    'items' | 'header' | 'footer' | 'onChange' | 'onCollapsedChange' | 'onWidthChange' | 'value'
>;

/** Nested tree like Ensi menu.ts — cascade columns, not flat dissolve. */
const DEMO_ITEMS: ICascadeMenuItem[] = [
    {
        text: 'Products',
        code: 'products',
        icon: Package,
        children: [
            { text: 'Catalog', code: 'products_catalog', link: '#/products/catalog' },
            { text: 'Import', code: 'products_import', link: '#/products/import' },
            { text: 'Categories', code: 'products_categories', link: '#/products/categories' },
            {
                text: 'Directories',
                code: 'products_directories',
                children: [
                    {
                        text: 'Attributes',
                        code: 'products_attributes',
                        link: '#/products/directories/attributes',
                    },
                    {
                        text: 'Statuses',
                        code: 'products_statuses',
                        link: '#/products/directories/statuses',
                    },
                ],
            },
        ],
    },
    {
        text: 'Orders',
        code: 'orders',
        icon: Cart,
        children: [
            { text: 'List', code: 'orders_list', link: '#/orders/list' },
            { text: 'Refunds', code: 'orders_refunds', link: '#/orders/refunds' },
        ],
    },
    {
        text: 'Customers',
        code: 'customers',
        icon: Users,
        children: [
            { text: 'List', code: 'customers_list', link: '#/customers/list' },
            {
                text: 'Entities',
                code: 'customers_entities',
                children: [
                    {
                        text: 'Delete requests',
                        code: 'customers_delete',
                        link: '#/customers/entities/deleting',
                    },
                ],
            },
        ],
    },
];

const findLinkByCode = (nodes: ICascadeMenuItem[], code: string): string | undefined =>
    nodes.reduce<string | undefined>((found, node) => {
        if (found) {
            return found;
        }

        if (node.code === code) {
            return node.link;
        }

        return node.children ? findLinkByCode(node.children, code) : undefined;
    }, undefined);

const DEFAULT_ARGS: TCascadeStoryProps = {
    size: 'md',
    variant: 'primary',
    defaultCollapsed: false,
    defaultWidth: 280,
    minWidth: 200,
    maxWidth: 400,
    activePath: '#/products/catalog',
    pinUserId: 'storybook-demo',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TCascadeStoryProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    defaultCollapsed: { control: { type: 'boolean' } },
    defaultWidth: { control: { type: 'number' } },
};

const SHELL_STYLE = {
    display: 'flex',
    minHeight: 720,
    position: 'relative' as const,
};

const MAIN_STYLE = {
    flex: 1,
    minWidth: 0,
    overflow: 'auto',
    padding: 24,
    background: 'var(--aui-page-bg)',
    color: 'var(--aui-page-fg-primary)',
};

const FOOTER_TRIGGER_STYLE = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxSizing: 'border-box' as const,
    width: '100%',
    margin: 0,
    padding: 8,
    border: 'none',
    borderRadius: 'var(--aui-cascade-menu-radius-md)',
    background: 'transparent',
    color: 'var(--aui-cascade-menu-fg-primary)',
    font: 'inherit',
    textAlign: 'left' as const,
    cursor: 'pointer',
};

/** Shared CascadeMenu chrome + page slot. */
const CascadeMenuShell = ({
    children,
    ...props
}: TCascadeStoryProps & {
    children: ReactNode;
}) => {
    const [activePath, setActivePath] = useState(props.activePath ?? '#/products/catalog');
    const [collapsed, setCollapsed] = useState(props.defaultCollapsed ?? false);
    const [width, setWidth] = useState(props.defaultWidth ?? 280);

    const footer = (
        <Popover>
            <Popover.Trigger>
                <button type="button" style={FOOTER_TRIGGER_STYLE}>
                    <Avatar name="Alex S." initials="AS" size="md" />
                    {collapsed ? null : (
                        <>
                            <span style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
                                <span className={typographyStyles.bodyS}>Alex S.</span>
                                <span
                                    className={typographyStyles.bodyXs}
                                    style={{ color: 'var(--aui-cascade-menu-fg-muted)' }}
                                >
                                    Admin
                                </span>
                            </span>
                            <ChevronDown style={{ width: 16, height: 16, color: 'var(--aui-cascade-menu-fg-muted)' }} />
                        </>
                    )}
                </button>
            </Popover.Trigger>
            <Popover.Content placement="top start">
                <button type="button">Log out</button>
            </Popover.Content>
        </Popover>
    );

    return (
        <div style={SHELL_STYLE}>
            <CascadeMenu
                {...props}
                header={
                    collapsed ? (
                        <LogoEnsiMark width={28} height={28} title="ensi-opensource" />
                    ) : (
                        <span className={styles.brandLockup}>
                            <LogoEnsiMark width={28} height={28} aria-hidden title="" />
                            <span className={styles.brandWordmark}>Ensi opensource</span>
                        </span>
                    )
                }
                items={DEMO_ITEMS}
                activePath={activePath}
                onChange={code => {
                    const link = findLinkByCode(DEMO_ITEMS, code);

                    if (link) {
                        setActivePath(link);
                    }
                }}
                collapsed={collapsed}
                onCollapsedChange={setCollapsed}
                width={width}
                onWidthChange={setWidth}
                footer={footer}
            />
            <main style={MAIN_STYLE}>{children}</main>
        </div>
    );
};

/** Story wrapper for react-docgen-typescript. */
const CascadeMenuDemo = (props: TCascadeStoryProps) => <CascadeMenuShell {...props}>Page content</CascadeMenuShell>;

CascadeMenuDemo.displayName = 'CascadeMenu';

type TOrderStatus = 'In progress' | 'New' | 'On pause' | 'Completed' | 'Cancelled';

interface IOrderRow {
    id: string;
    name: string;
    client: string;
    assignee: string;
    status: TOrderStatus;
    amount: string;
    createdAt: string;
}

const ORDER_ROWS: IOrderRow[] = [
    {
        id: 'ORD-10421',
        name: 'Warehouse restock',
        client: 'Alice Petrova',
        assignee: 'Ivanov I.I.',
        status: 'In progress',
        amount: '125 450 ₽',
        createdAt: '2025-05-12',
    },
    {
        id: 'ORD-10422',
        name: 'Retail kit',
        client: 'Bob Ivanov',
        assignee: 'Smirnov A.A.',
        status: 'New',
        amount: '48 200 ₽',
        createdAt: '2025-05-11',
    },
    {
        id: 'ORD-10423',
        name: 'Promo pack',
        client: 'Clara Smirnova',
        assignee: 'Ivanov I.I.',
        status: 'On pause',
        amount: '9 870 ₽',
        createdAt: '2025-05-10',
    },
    {
        id: 'ORD-10424',
        name: 'B2B shipment',
        client: 'Dmitry Kozlov',
        assignee: 'Volkova E.E.',
        status: 'Completed',
        amount: '310 000 ₽',
        createdAt: '2025-05-09',
    },
    {
        id: 'ORD-10425',
        name: 'Sample order',
        client: 'Elena Volkova',
        assignee: 'Ivanov I.I.',
        status: 'Cancelled',
        amount: '2 150 ₽',
        createdAt: '2025-05-08',
    },
    {
        id: 'ORD-10426',
        name: 'Franchise refill',
        client: 'Fedor Sokolov',
        assignee: 'Smirnov A.A.',
        status: 'In progress',
        amount: '76 340 ₽',
        createdAt: '2025-05-07',
    },
    {
        id: 'ORD-10427',
        name: 'Seasonal box',
        client: 'Galina Orlova',
        assignee: 'Volkova E.E.',
        status: 'New',
        amount: '18 900 ₽',
        createdAt: '2025-05-06',
    },
    {
        id: 'ORD-10428',
        name: 'Express delivery',
        client: 'Ivan Morozov',
        assignee: 'Ivanov I.I.',
        status: 'Completed',
        amount: '5 420 ₽',
        createdAt: '2025-05-05',
    },
    {
        id: 'ORD-10429',
        name: 'Return replacement',
        client: 'Julia Belova',
        assignee: 'Smirnov A.A.',
        status: 'On pause',
        amount: '14 680 ₽',
        createdAt: '2025-05-04',
    },
    {
        id: 'ORD-10430',
        name: 'Partner order',
        client: 'Kirill Novikov',
        assignee: 'Volkova E.E.',
        status: 'In progress',
        amount: '99 100 ₽',
        createdAt: '2025-05-03',
    },
];

const statusBadgeVariant = (status: TOrderStatus) => {
    switch (status) {
        case 'In progress':
            return 'success' as const;
        case 'New':
            return 'info' as const;
        case 'On pause':
            return 'warning' as const;
        case 'Completed':
            return 'success' as const;
        case 'Cancelled':
            return 'danger' as const;
        default:
            return 'neutral' as const;
    }
};

const STATUS_OPTIONS = [
    { value: 'in_progress', label: 'In progress' },
    { value: 'new', label: 'New' },
    { value: 'on_pause', label: 'On pause' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const ASSIGNEE_OPTIONS = [
    { value: 'ivanov', label: 'Ivanov I.I.' },
    { value: 'smirnov', label: 'Smirnov A.A.' },
    { value: 'volkova', label: 'Volkova E.E.' },
];

const PAYMENT_OPTIONS = [
    { value: 'card', label: 'Card' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'cash', label: 'Cash' },
];

const FieldSelect = (props: ComponentProps<typeof Select>) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Select {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

const FieldInput = (props: ComponentProps<typeof Input>) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Input {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

const FieldDateRangePicker = (props: ComponentProps<typeof DateRangePicker>) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <DateRangePicker {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

interface IFilterTag {
    id: string;
    label: string;
}

const INITIAL_TAGS: IFilterTag[] = [
    { id: 'status', label: 'Status: In progress' },
    { id: 'assignee', label: 'Assignee: Ivanov I.I.' },
    { id: 'date', label: 'Created: 01.05.2025 – 31.05.2025' },
];

const ListPageContent = () => {
    const [view, setView] = useState<'table' | 'filters'>('table');
    const [tags, setTags] = useState(INITIAL_TAGS);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [status, setStatus] = useState<TComboboxValue | null>('in_progress');
    const [assignee, setAssignee] = useState<TComboboxValue | null>('ivanov');
    const [client, setClient] = useState('');
    const [period, setPeriod] = useState<DateRange | null>({
        start: new CalendarDate(2025, 5, 1),
        end: new CalendarDate(2025, 5, 31),
    });
    const [amountFrom, setAmountFrom] = useState<number | null>(null);
    const [amountTo, setAmountTo] = useState<number | null>(null);
    const [payment, setPayment] = useState<TComboboxValue | null>(null);

    const pageCount = Math.max(1, Math.ceil(ORDER_ROWS.length / pageSize));
    const currentPage = Math.min(page, pageCount);
    const pageRows = ORDER_ROWS.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const pageIds = useMemo(() => pageRows.map(r => r.id), [pageRows]);
    const { isSelected, toggle, isAllSelected, isIndeterminate, setAllOnPage } = useTableRowSelection(pageIds);

    const from = ORDER_ROWS.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, ORDER_ROWS.length);

    const resetFilters = () => {
        setStatus(null);
        setAssignee(null);
        setClient('');
        setPeriod(null);
        setAmountFrom(null);
        setAmountTo(null);
        setPayment(null);
    };

    const applyFilters = () => {
        const next: IFilterTag[] = [];

        if (status != null) {
            const label = STATUS_OPTIONS.find(o => o.value === status)?.label ?? String(status);
            next.push({ id: 'status', label: `Status: ${label}` });
        }

        if (assignee != null) {
            const label = ASSIGNEE_OPTIONS.find(o => o.value === assignee)?.label ?? String(assignee);
            next.push({ id: 'assignee', label: `Assignee: ${label}` });
        }

        if (period?.start && period?.end) {
            const fmt = (d: { day: number; month: number; year: number }) =>
                `${String(d.day).padStart(2, '0')}.${String(d.month).padStart(2, '0')}.${d.year}`;
            next.push({
                id: 'date',
                label: `Created: ${fmt(period.start)} – ${fmt(period.end)}`,
            });
        }

        setTags(next);
        setView('table');
        setPage(1);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                }}
            >
                <h1 className={typographyStyles.headingM} style={{ margin: 0 }}>
                    Orders
                </h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    {view === 'table' ? (
                        <>
                            <Button variant="secondary" onClick={() => setView('filters')}>
                                Filters
                            </Button>
                            <Button variant="primary">+ New order</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={resetFilters}>
                                Reset
                            </Button>
                            <Button variant="primary" onClick={applyFilters}>
                                Apply
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {view === 'filters' ? (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 16,
                        maxWidth: 880,
                    }}
                >
                    <Field>
                        <Field.Label>Status</Field.Label>
                        <FieldSelect
                            options={STATUS_OPTIONS}
                            value={status}
                            onChange={setStatus}
                            clear
                            placeholder="Select status"
                        />
                    </Field>
                    <Field>
                        <Field.Label>Assignee</Field.Label>
                        <FieldSelect
                            options={ASSIGNEE_OPTIONS}
                            value={assignee}
                            onChange={setAssignee}
                            clear
                            placeholder="Select assignee"
                        />
                    </Field>
                    <Field>
                        <Field.Label>Client</Field.Label>
                        <FieldInput
                            value={client}
                            onChange={e => setClient(e.target.value)}
                            placeholder="Name, email or phone"
                            clear
                        />
                    </Field>
                    <Field>
                        <Field.Label>Created</Field.Label>
                        <FieldDateRangePicker value={period} onChange={setPeriod} clear />
                    </Field>
                    <Field>
                        <Field.Label>Amount from / to</Field.Label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <NumberInput
                                aria-label="Amount from"
                                value={amountFrom}
                                onChange={setAmountFrom}
                                placeholder="From"
                                min={0}
                                clear
                            />
                            <NumberInput
                                aria-label="Amount to"
                                value={amountTo}
                                onChange={setAmountTo}
                                placeholder="To"
                                min={0}
                                clear
                            />
                        </div>
                    </Field>
                    <Field>
                        <Field.Label>Payment</Field.Label>
                        <FieldSelect
                            options={PAYMENT_OPTIONS}
                            value={payment}
                            onChange={setPayment}
                            clear
                            placeholder="Select payment"
                        />
                    </Field>
                </div>
            ) : (
                <>
                    {tags.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                            {tags.map(tag => (
                                <Tag key={tag.id} onRemove={() => setTags(prev => prev.filter(t => t.id !== tag.id))}>
                                    {tag.label}
                                </Tag>
                            ))}
                            <Link
                                href="#clear"
                                onClick={e => {
                                    e.preventDefault();
                                    setTags([]);
                                }}
                            >
                                Clear all
                            </Link>
                        </div>
                    ) : null}

                    <Table size="md" block hasChecked zebra>
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
                                        <Table.HeaderCell noWrap>ID</Table.HeaderCell>
                                        <Table.HeaderCell noWrap>Name</Table.HeaderCell>
                                        <Table.HeaderCell noWrap>Client</Table.HeaderCell>
                                        <Table.HeaderCell noWrap>Assignee</Table.HeaderCell>
                                        <Table.HeaderCell noWrap>Status</Table.HeaderCell>
                                        <Table.HeaderCell numeric noWrap>
                                            Amount
                                        </Table.HeaderCell>
                                        <Table.HeaderCell noWrap>Created</Table.HeaderCell>
                                        <Table.HeaderCell utility>Actions</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {pageRows.map(row => (
                                        <Table.Row key={row.id} checked={isSelected(row.id)}>
                                            <Table.CheckboxCell
                                                checked={isSelected(row.id)}
                                                onChange={() => toggle(row.id)}
                                                aria-label={`Select ${row.id}`}
                                            />
                                            <Table.Cell noWrap>
                                                <Link href={`#/orders/${row.id}`}>{row.id}</Link>
                                            </Table.Cell>
                                            <Table.Cell noWrap>{row.name}</Table.Cell>
                                            <Table.Cell noWrap>{row.client}</Table.Cell>
                                            <Table.Cell noWrap>{row.assignee}</Table.Cell>
                                            <Table.Cell noWrap>
                                                <Badge size="sm" variant={statusBadgeVariant(row.status)}>
                                                    {row.status}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell numeric noWrap>
                                                {row.amount}
                                            </Table.Cell>
                                            <Table.Cell noWrap>{row.createdAt}</Table.Cell>
                                            <Table.Cell utility>
                                                <Table.ActionBar
                                                    visibleCount={1}
                                                    items={[
                                                        { text: 'Open', onClick: () => undefined },
                                                        { text: 'Edit', onClick: () => undefined },
                                                        { text: 'Delete', onClick: () => undefined, danger: true },
                                                    ]}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Table>
                        </Table.Scroll>
                        <Table.Footer>
                            <Table.PageSize
                                value={pageSize}
                                onChange={next => {
                                    setPageSize(next);
                                    setPage(1);
                                }}
                            />
                            <Table.Pagination
                                page={currentPage}
                                pageCount={pageCount}
                                onPageChange={setPage}
                                from={from}
                                to={to}
                                total={ORDER_ROWS.length}
                            />
                        </Table.Footer>
                    </Table>
                </>
            )}
        </div>
    );
};

const ListPageDemo = (props: TCascadeStoryProps) => (
    <CascadeMenuShell {...props} activePath={props.activePath ?? '#/orders/list'}>
        <ListPageContent />
    </CascadeMenuShell>
);

ListPageDemo.displayName = 'CascadeMenu';

export default {
    title: 'App/CascadeMenu',
    component: CascadeMenuDemo,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        docsCssVariables,
    },
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof CascadeMenuDemo>;

export const Default: StoryObj<typeof CascadeMenuDemo> = {};

export const Collapsed: StoryObj<typeof CascadeMenuDemo> = {
    args: {
        defaultCollapsed: true,
    },
};

export const Dark: StoryObj<typeof CascadeMenuDemo> = {
    globals: {
        theme: 'dark',
    },
};

export const WithListPage: StoryObj<typeof ListPageDemo> = {
    render: args => <ListPageDemo {...args} />,
    args: {
        activePath: '#/orders/list',
    },
};
