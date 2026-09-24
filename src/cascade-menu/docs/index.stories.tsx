import { type ComponentProps, type ReactNode, useMemo, useState } from 'react';

import { CalendarDate } from '@internationalized/date';
import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { type DateRange } from 'react-aria-components';

import { ActiveFilters } from '@/active-filters';
import { ArrangementSettings, type IArrangementSettingsItem } from '@/arrangement-settings';
import { type IUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { Avatar } from '@/avatar';
import { Badge } from '@/badge';
import { Button } from '@/button';
import { ContextMenu } from '@/context-menu';
import { DataTable, type IDataTableSort } from '@/data-table';
import { DateRangePicker } from '@/date-range-picker';
import { typographyStyles } from '@/ds/typography';
import { Field, useField } from '@/field';
import { Filters } from '@/filters';
import { Cart, ChevronDown, LogoEnsiMark, Package, Users } from '@/icons';
import { Input } from '@/input';
import { Link } from '@/link';
import { MultiAutocompleteAsync } from '@/multi-autocomplete-async';
import { NumberRange, type INumberRangeValue } from '@/number-range';
import { Popover } from '@/popover';
import { Select, type TComboboxValue } from '@/select';
import { SuggestChecklist } from '@/suggest-checklist';
import { useTableRowSelection } from '@/table';

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

const formatDate = (date: { day: number; month: number; year: number }) =>
    `${String(date.day).padStart(2, '0')}.${String(date.month).padStart(2, '0')}.${date.year}`;

const dateKey = (date: { day: number; month: number; year: number }) =>
    date.year * 10_000 + date.month * 100 + date.day;

const createdKey = (createdAt: string) => {
    const [year, month, day] = createdAt.split('-').map(Number);

    return year * 10_000 + month * 100 + day;
};

const parseAmount = (amount: string) => Number(amount.replace(/[^\d]/g, ''));

const FILTER_ITEMS: IArrangementSettingsItem[] = [
    { id: 'status', label: 'Status' },
    { id: 'assignee', label: 'Assignee' },
    { id: 'client', label: 'Client' },
    { id: 'created', label: 'Created' },
    { id: 'amount', label: 'Amount' },
    { id: 'payment', label: 'Payment' },
];

const optionSuggest =
    (options: { value: string; label: string }[]): IUseAutocompleteSuggest =>
    ({ query, enabled }) => {
        if (!enabled) {
            return { options: [], isLoading: false, hasMore: false };
        }

        const needle = query.trim().toLowerCase();

        return {
            options: options.filter(item => item.label.toLowerCase().includes(needle)),
            isLoading: false,
            hasMore: false,
        };
    };

const useStatusSuggest = optionSuggest(STATUS_OPTIONS);
const useAssigneeSuggest = optionSuggest(ASSIGNEE_OPTIONS);

const optionLabel = (options: { value: string; label: string }[], value: string) =>
    options.find(item => item.value === value)?.label ?? value;

const ChecklistFilter = ({
    label,
    useSuggest,
    value,
    onChange,
}: {
    label: string;
    useSuggest: IUseAutocompleteSuggest;
    value: string[];
    onChange: (value: string[]) => void;
}) => (
    <SuggestChecklist
        aria-label={label}
        placeholder="Search"
        useSuggest={useSuggest}
        value={value}
        debounceMs={0}
        onChange={next => onChange(next.map(String))}
    />
);

const FieldMultiAutocompleteAsync = (props: ComponentProps<typeof MultiAutocompleteAsync>) => {
    const { controlProps, size, invalid, disabled } = useField();

    return <MultiAutocompleteAsync {...controlProps} size={size} invalid={invalid} disabled={disabled} {...props} />;
};

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

const FieldNumberRange = (props: ComponentProps<typeof NumberRange>) => {
    const { size, invalid, disabled } = useField();

    return <NumberRange size={size} invalid={invalid} disabled={disabled} {...props} />;
};

const TABLE_COLUMNS: IArrangementSettingsItem[] = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'client', label: 'Client' },
    { id: 'assignee', label: 'Assignee' },
    { id: 'status', label: 'Status' },
    { id: 'amount', label: 'Amount' },
    { id: 'created', label: 'Created' },
];

const ListPageContent = () => {
    const [view, setView] = useState<'table' | 'filters'>('table');
    const [columns, setColumns] = useState<string[]>(() => TABLE_COLUMNS.map(column => column.id));
    const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<IDataTableSort>();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [visibleFilters, setVisibleFilters] = useState(() => FILTER_ITEMS.map(item => item.id));
    const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

    const [statuses, setStatuses] = useState<string[]>(['in_progress']);
    const [assignees, setAssignees] = useState<string[]>([]);
    const [client, setClient] = useState('');
    const [period, setPeriod] = useState<DateRange | null>({
        start: new CalendarDate(2025, 5, 1),
        end: new CalendarDate(2025, 5, 31),
    });
    const [amount, setAmount] = useState<INumberRangeValue>({ from: null, to: null });
    const [payment, setPayment] = useState<TComboboxValue | null>(null);

    const rows = useMemo(() => {
        const statusLabels = statuses.map(value => STATUS_OPTIONS.find(item => item.value === value)?.label ?? value);
        const assigneeLabels = assignees.map(
            value => ASSIGNEE_OPTIONS.find(item => item.value === value)?.label ?? value
        );
        const filtered = ORDER_ROWS.filter(row => {
            if (statusLabels.length > 0 && !statusLabels.includes(row.status)) {
                return false;
            }

            if (assigneeLabels.length > 0 && !assigneeLabels.includes(row.assignee)) {
                return false;
            }

            if (client && !`${row.client} ${row.name}`.toLowerCase().includes(client.toLowerCase())) {
                return false;
            }

            if (
                period?.start &&
                period.end &&
                (createdKey(row.createdAt) < dateKey(period.start) || createdKey(row.createdAt) > dateKey(period.end))
            ) {
                return false;
            }

            const rowAmount = parseAmount(row.amount);

            if (amount.from != null && rowAmount < amount.from) {
                return false;
            }

            if (amount.to != null && rowAmount > amount.to) {
                return false;
            }

            return true;
        });

        if (!sort) {
            return filtered;
        }

        const direction = sort.direction === 'asc' ? 1 : -1;

        return [...filtered].sort((left, right) => {
            if (sort.column === 'assignee') {
                return left.assignee.localeCompare(right.assignee) * direction;
            }

            if (sort.column === 'status') {
                return left.status.localeCompare(right.status) * direction;
            }

            if (sort.column === 'amount') {
                return (parseAmount(left.amount) - parseAmount(right.amount)) * direction;
            }

            return (createdKey(left.createdAt) - createdKey(right.createdAt)) * direction;
        });
    }, [amount, assignees, client, period, sort, statuses]);

    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    const currentPage = Math.min(page, pageCount);
    const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const pageIds = useMemo(() => pageRows.map(row => row.id), [pageRows]);
    const { isSelected, toggle, isAllSelected, isIndeterminate, setAllOnPage } = useTableRowSelection(pageIds);

    const from = rows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, rows.length);

    const resetFilters = () => {
        setStatuses([]);
        setAssignees([]);
        setClient('');
        setPeriod(null);
        setAmount({ from: null, to: null });
        setPayment(null);
        setPage(1);
    };

    const applyFilters = () => {
        setView('table');
        setPage(1);
    };

    const applyMulti = (apply: (next: string[]) => void) => (next: string[]) => {
        apply(next);
        setPage(1);
    };

    const multiChips = (
        label: string,
        values: string[],
        options: { value: string; label: string }[],
        suggest: IUseAutocompleteSuggest,
        apply: (next: string[]) => void
    ) => {
        if (values.length === 0) {
            return null;
        }

        const onChange = applyMulti(apply);

        if (values.length === 1) {
            return (
                <ActiveFilters.Item onRemove={() => onChange([])}>
                    {label}: {optionLabel(options, values[0])}
                </ActiveFilters.Item>
            );
        }

        return (
            <ActiveFilters.Group label={label} count={values.length} onRemove={() => onChange([])}>
                <ChecklistFilter label={label} useSuggest={suggest} value={values} onChange={onChange} />
            </ActiveFilters.Group>
        );
    };

    const filterCell = (id: string) => {
        if (id === 'status') {
            return (
                <Filters.Cell key={id}>
                    <Field>
                        <Field.Label>Status</Field.Label>
                        <FieldMultiAutocompleteAsync
                            useSuggest={useStatusSuggest}
                            value={statuses}
                            debounceMs={0}
                            clear
                            placeholder="Select status"
                            onChange={next => setStatuses(next.map(String))}
                        />
                    </Field>
                </Filters.Cell>
            );
        }

        if (id === 'assignee') {
            return (
                <Filters.Cell key={id}>
                    <Field>
                        <Field.Label>Assignee</Field.Label>
                        <FieldMultiAutocompleteAsync
                            useSuggest={useAssigneeSuggest}
                            value={assignees}
                            debounceMs={0}
                            clear
                            placeholder="Select assignee"
                            onChange={next => setAssignees(next.map(String))}
                        />
                    </Field>
                </Filters.Cell>
            );
        }

        if (id === 'client') {
            return (
                <Filters.Cell key={id}>
                    <Field>
                        <Field.Label>Client</Field.Label>
                        <FieldInput
                            value={client}
                            onChange={e => setClient(e.target.value)}
                            placeholder="Name, email or phone"
                            clear
                        />
                    </Field>
                </Filters.Cell>
            );
        }

        if (id === 'created') {
            return (
                <Filters.Cell key={id} kind="range">
                    <Field>
                        <Field.Label>Created</Field.Label>
                        <FieldDateRangePicker value={period} onChange={setPeriod} clear />
                    </Field>
                </Filters.Cell>
            );
        }

        if (id === 'amount') {
            return (
                <Filters.Cell key={id} kind="range">
                    <Field>
                        <Field.Label>Amount from / to</Field.Label>
                        <FieldNumberRange
                            fromLabel="Amount from"
                            toLabel="Amount to"
                            fromPlaceholder="From"
                            toPlaceholder="To"
                            value={amount}
                            onChange={setAmount}
                            min={0}
                            clear
                        />
                    </Field>
                </Filters.Cell>
            );
        }

        if (id === 'payment') {
            return (
                <Filters.Cell key={id}>
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
                </Filters.Cell>
            );
        }

        return null;
    };

    const headerColumn = (id: string) => {
        if (id === 'id') {
            return (
                <DataTable.HeaderCell key={id} noWrap>
                    ID
                </DataTable.HeaderCell>
            );
        }

        if (id === 'name') {
            return (
                <DataTable.HeaderCell key={id} noWrap>
                    Name
                </DataTable.HeaderCell>
            );
        }

        if (id === 'client') {
            return (
                <DataTable.HeaderCell key={id} noWrap>
                    Client
                </DataTable.HeaderCell>
            );
        }

        if (id === 'assignee') {
            return (
                <DataTable.HeaderCell key={id} column="assignee" sortable noWrap>
                    Assignee
                    <DataTable.Filter active={assignees.length > 0}>
                        <ChecklistFilter
                            label="Assignee"
                            useSuggest={useAssigneeSuggest}
                            value={assignees}
                            onChange={applyMulti(setAssignees)}
                        />
                    </DataTable.Filter>
                </DataTable.HeaderCell>
            );
        }

        if (id === 'status') {
            return (
                <DataTable.HeaderCell key={id} column="status" sortable noWrap>
                    Status
                    <DataTable.Filter active={statuses.length > 0}>
                        <ChecklistFilter
                            label="Status"
                            useSuggest={useStatusSuggest}
                            value={statuses}
                            onChange={applyMulti(setStatuses)}
                        />
                    </DataTable.Filter>
                </DataTable.HeaderCell>
            );
        }

        if (id === 'amount') {
            return (
                <DataTable.HeaderCell key={id} column="amount" sortable numeric noWrap>
                    Amount
                    <DataTable.Filter active={amount.from != null || amount.to != null}>
                        <NumberRange
                            fromLabel="Amount from"
                            toLabel="Amount to"
                            fromPlaceholder="From"
                            toPlaceholder="To"
                            value={amount}
                            min={0}
                            clear
                            onChange={next => {
                                setAmount(next);
                                setPage(1);
                            }}
                        />
                    </DataTable.Filter>
                </DataTable.HeaderCell>
            );
        }

        if (id === 'created') {
            return (
                <DataTable.HeaderCell key={id} column="created" sortable noWrap>
                    Created
                    <DataTable.Filter active={period?.start != null && period.end != null}>
                        <DateRangePicker
                            aria-label="Created"
                            value={period}
                            onChange={value => {
                                setPeriod(value);
                                setPage(1);
                            }}
                            clear
                        />
                    </DataTable.Filter>
                </DataTable.HeaderCell>
            );
        }

        return null;
    };

    const bodyColumn = (row: IOrderRow, id: string) => {
        if (id === 'id') {
            return (
                <DataTable.Cell key={id} noWrap>
                    <Link href={`#/orders/${row.id}`}>{row.id}</Link>
                </DataTable.Cell>
            );
        }

        if (id === 'name') {
            return (
                <DataTable.Cell key={id} noWrap>
                    {row.name}
                </DataTable.Cell>
            );
        }

        if (id === 'client') {
            return (
                <DataTable.Cell key={id} noWrap>
                    {row.client}
                </DataTable.Cell>
            );
        }

        if (id === 'assignee') {
            return (
                <DataTable.Cell key={id} noWrap>
                    {row.assignee}
                </DataTable.Cell>
            );
        }

        if (id === 'status') {
            return (
                <DataTable.Cell key={id} noWrap>
                    <Badge size="sm" variant={statusBadgeVariant(row.status)}>
                        {row.status}
                    </Badge>
                </DataTable.Cell>
            );
        }

        if (id === 'amount') {
            return (
                <DataTable.Cell key={id} numeric noWrap>
                    {row.amount}
                </DataTable.Cell>
            );
        }

        if (id === 'created') {
            return (
                <DataTable.Cell key={id} noWrap>
                    {row.createdAt}
                </DataTable.Cell>
            );
        }

        return null;
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
                            <Button variant="secondary" onClick={() => setColumnSettingsOpen(true)}>
                                Configure table
                            </Button>
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
                <>
                    <Filters>
                        <Filters.Grid columns={2} span={{ range: 2 }}>
                            {visibleFilters.map(filterCell)}
                        </Filters.Grid>
                        <Filters.Footer>
                            <Button type="button" variant="secondary" onClick={() => setSettingsOpen(true)}>
                                Filter settings
                            </Button>
                        </Filters.Footer>
                    </Filters>
                    <ArrangementSettings
                        open={settingsOpen}
                        onOpenChange={setSettingsOpen}
                        title="Filter settings"
                        items={FILTER_ITEMS}
                        value={visibleFilters}
                        onSave={setVisibleFilters}
                    />
                </>
            ) : (
                <>
                    <ActiveFilters onClear={resetFilters}>
                        {multiChips('Status', statuses, STATUS_OPTIONS, useStatusSuggest, setStatuses)}
                        {multiChips('Assignee', assignees, ASSIGNEE_OPTIONS, useAssigneeSuggest, setAssignees)}
                        {client ? (
                            <ActiveFilters.Item
                                onRemove={() => {
                                    setClient('');
                                    setPage(1);
                                }}
                            >
                                Client: {client}
                            </ActiveFilters.Item>
                        ) : null}
                        {period?.start && period.end ? (
                            <ActiveFilters.Item
                                onRemove={() => {
                                    setPeriod(null);
                                    setPage(1);
                                }}
                            >
                                Created: {formatDate(period.start)} – {formatDate(period.end)}
                            </ActiveFilters.Item>
                        ) : null}
                        {amount.from != null || amount.to != null ? (
                            <ActiveFilters.Item
                                onRemove={() => {
                                    setAmount({ from: null, to: null });
                                    setPage(1);
                                }}
                            >
                                Amount: {amount.from == null ? '…' : amount.from} –{' '}
                                {amount.to == null ? '…' : amount.to}
                            </ActiveFilters.Item>
                        ) : null}
                        {payment != null ? (
                            <ActiveFilters.Item
                                onRemove={() => {
                                    setPayment(null);
                                    setPage(1);
                                }}
                            >
                                Payment:{' '}
                                {PAYMENT_OPTIONS.find(item => item.value === payment)?.label ?? String(payment)}
                            </ActiveFilters.Item>
                        ) : null}
                    </ActiveFilters>

                    <DataTable size="md" block hasChecked zebra sort={sort} onSortChange={setSort}>
                        <DataTable.Header sticky>
                            <DataTable.Row>
                                <DataTable.HeaderCheckboxCell
                                    checked={isAllSelected}
                                    indeterminate={isIndeterminate}
                                    onChange={setAllOnPage}
                                    aria-label="Select all"
                                />
                                {columns.map(headerColumn)}
                                <DataTable.HeaderCell utility />
                            </DataTable.Row>
                        </DataTable.Header>
                        <DataTable.Body>
                            {pageRows.map(row => (
                                <DataTable.Row
                                    key={row.id}
                                    checked={isSelected(row.id)}
                                    onContextMenu={event => {
                                        event.preventDefault();
                                        setMenu({ x: event.clientX, y: event.clientY });
                                    }}
                                >
                                    <DataTable.CheckboxCell
                                        checked={isSelected(row.id)}
                                        onChange={() => toggle(row.id)}
                                        aria-label={`Select ${row.id}`}
                                    />
                                    {columns.map(id => bodyColumn(row, id))}
                                    <DataTable.Cell utility>
                                        <DataTable.Actions
                                            onClick={event => {
                                                const rect = event.currentTarget.getBoundingClientRect();
                                                setMenu({ x: rect.left, y: rect.bottom });
                                            }}
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable.Body>
                        <DataTable.Footer>
                            <DataTable.PageSize
                                value={pageSize}
                                onChange={next => {
                                    setPageSize(next);
                                    setPage(1);
                                }}
                            />
                            <DataTable.Pagination
                                page={currentPage}
                                pageCount={pageCount}
                                onPageChange={setPage}
                                from={from}
                                to={to}
                                total={rows.length}
                            />
                        </DataTable.Footer>
                    </DataTable>
                    <ArrangementSettings
                        open={columnSettingsOpen}
                        onOpenChange={setColumnSettingsOpen}
                        title="Configure table"
                        placement="right"
                        items={TABLE_COLUMNS}
                        value={columns}
                        onSave={setColumns}
                    />
                    <ContextMenu open={menu != null} x={menu?.x ?? 0} y={menu?.y ?? 0} onClose={() => setMenu(null)}>
                        <ContextMenu.Item onClick={() => setMenu(null)}>Open</ContextMenu.Item>
                        <ContextMenu.Item onClick={() => setMenu(null)}>Edit</ContextMenu.Item>
                        <ContextMenu.Item variant="danger" onClick={() => setMenu(null)}>
                            Delete
                        </ContextMenu.Item>
                    </ContextMenu>
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
