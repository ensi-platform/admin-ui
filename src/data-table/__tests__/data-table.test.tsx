import { type MouseEvent, type ReactElement, useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ContextMenu } from '@/context-menu';
import { AdminUiProvider } from '@/provider';
import { useTableRowSelection } from '@/table';
import { axe } from '@/test/axe';

import { DataTable } from '..';
import { type IDataTableSort } from '../types';

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('DataTable', () => {
    it('cycles sort on a header click and replaces the active column', async () => {
        const user = userEvent.setup();

        const SortDemo = () => {
            const [sort, setSort] = useState<IDataTableSort>();

            return (
                <DataTable sort={sort} onSortChange={setSort} dataTestId="list">
                    <DataTable.Header>
                        <DataTable.Row>
                            <DataTable.HeaderCell column="city" sortable>
                                City
                            </DataTable.HeaderCell>
                            <DataTable.HeaderCell column="name" sortable>
                                Name
                            </DataTable.HeaderCell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body>
                        <DataTable.Row>
                            <DataTable.Cell>Kazan</DataTable.Cell>
                            <DataTable.Cell>Alice</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Body>
                </DataTable>
            );
        };

        render(<SortDemo />);

        expect(screen.getByTestId('list').querySelector('table')).not.toBeNull();
        expect(screen.getByRole('columnheader', { name: 'City' })).toHaveAttribute('aria-sort', 'none');

        await user.click(screen.getByRole('button', { name: 'City' }));
        expect(screen.getByRole('columnheader', { name: 'City' })).toHaveAttribute('aria-sort', 'ascending');

        await user.click(screen.getByRole('button', { name: 'Name' }));
        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
        expect(screen.getByRole('columnheader', { name: 'City' })).toHaveAttribute('aria-sort', 'none');

        await user.click(screen.getByRole('button', { name: 'Name' }));
        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'descending');

        await user.click(screen.getByRole('button', { name: 'Name' }));
        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'none');
    });

    it('reports direction for the sorted column', async () => {
        const user = userEvent.setup();
        const onSortChange = vi.fn();

        const SortDemo = () => {
            const [sort, setSort] = useState<IDataTableSort>();

            return (
                <DataTable
                    sort={sort}
                    onSortChange={next => {
                        onSortChange(next);
                        setSort(next);
                    }}
                >
                    <DataTable.Header>
                        <DataTable.Row>
                            <DataTable.HeaderCell column="city" sortable>
                                City
                            </DataTable.HeaderCell>
                        </DataTable.Row>
                    </DataTable.Header>
                </DataTable>
            );
        };

        render(<SortDemo />);

        const header = screen.getByRole('columnheader', { name: 'City' });

        await user.click(screen.getByRole('button', { name: 'City' }));
        expect(onSortChange).toHaveBeenLastCalledWith({ column: 'city', direction: 'asc' });
        expect(header).toHaveAttribute('aria-sort', 'ascending');

        await user.click(screen.getByRole('button', { name: 'City' }));
        expect(onSortChange).toHaveBeenLastCalledWith({ column: 'city', direction: 'desc' });
        expect(header).toHaveAttribute('aria-sort', 'descending');

        await user.click(screen.getByRole('button', { name: 'City' }));
        expect(onSortChange).toHaveBeenLastCalledWith(undefined);
        expect(header).toHaveAttribute('aria-sort', 'none');
    });

    it('reports direction when sort is committed from the keyboard', async () => {
        const user = userEvent.setup();
        const onSortChange = vi.fn();

        const SortDemo = () => {
            const [sort, setSort] = useState<IDataTableSort>();

            return (
                <DataTable
                    sort={sort}
                    onSortChange={next => {
                        onSortChange(next);
                        setSort(next);
                    }}
                >
                    <DataTable.Header>
                        <DataTable.Row>
                            <DataTable.HeaderCell column="city" sortable>
                                City
                            </DataTable.HeaderCell>
                        </DataTable.Row>
                    </DataTable.Header>
                </DataTable>
            );
        };

        render(<SortDemo />);

        screen.getByRole('button', { name: 'City' }).focus();
        await user.keyboard('{Enter}');

        expect(onSortChange).toHaveBeenCalledTimes(1);
        expect(onSortChange).toHaveBeenCalledWith({ column: 'city', direction: 'asc' });
        expect(screen.getByRole('columnheader', { name: 'City' })).toHaveAttribute('aria-sort', 'ascending');
    });

    it('sets direction from the filter sort rows', async () => {
        const user = userEvent.setup();
        const onSortChange = vi.fn();

        const SortDemo = () => {
            const [sort, setSort] = useState<IDataTableSort>();

            return (
                <DataTable
                    sort={sort}
                    onSortChange={next => {
                        onSortChange(next);
                        setSort(next);
                    }}
                >
                    <DataTable.Header>
                        <DataTable.Row>
                            <DataTable.HeaderCell column="city" sortable>
                                City
                                <DataTable.Filter>
                                    <span>Query</span>
                                </DataTable.Filter>
                            </DataTable.HeaderCell>
                        </DataTable.Row>
                    </DataTable.Header>
                </DataTable>
            );
        };

        renderWithProvider(<SortDemo />);

        await user.click(screen.getByRole('button', { name: 'City' }));
        await user.click(screen.getByRole('button', { name: 'По возрастанию' }));
        expect(onSortChange).toHaveBeenLastCalledWith({ column: 'city', direction: 'asc' });
        expect(screen.getByRole('columnheader', { hidden: true, name: 'City' })).toHaveAttribute(
            'aria-sort',
            'ascending'
        );

        await user.click(screen.getByRole('button', { name: 'По убыванию' }));
        expect(onSortChange).toHaveBeenLastCalledWith({ column: 'city', direction: 'desc' });
        expect(screen.getByRole('columnheader', { hidden: true, name: 'City' })).toHaveAttribute(
            'aria-sort',
            'descending'
        );
    });

    it('ignores sort when the column id or the handler is missing', async () => {
        const user = userEvent.setup();

        render(
            <DataTable>
                <DataTable.Header>
                    <DataTable.Row>
                        <DataTable.HeaderCell sortable>City</DataTable.HeaderCell>
                        <DataTable.HeaderCell column="name" sortable>
                            Name
                        </DataTable.HeaderCell>
                    </DataTable.Row>
                </DataTable.Header>
            </DataTable>
        );

        await user.click(screen.getByRole('button', { name: 'City' }));
        await user.click(screen.getByRole('button', { name: 'Name' }));

        expect(screen.getByRole('columnheader', { name: 'City' })).toHaveAttribute('aria-sort', 'none');
        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'none');
    });

    it('renders an empty filter marker', () => {
        render(
            <>
                <DataTable.Filter />
                <DataTable.Filter active>
                    <span>Query</span>
                </DataTable.Filter>
            </>
        );

        expect(screen.queryByText('Query')).not.toBeInTheDocument();
    });

    it('renders a plain header when the column has no filter', () => {
        renderWithProvider(
            <DataTable>
                <DataTable.Header>
                    <DataTable.Row>
                        <DataTable.HeaderCell>Email</DataTable.HeaderCell>
                    </DataTable.Row>
                </DataTable.Header>
                <DataTable.Body>
                    <DataTable.Row>
                        <DataTable.Cell>a@example.com</DataTable.Cell>
                    </DataTable.Row>
                </DataTable.Body>
            </DataTable>
        );

        expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Email' })).not.toBeInTheDocument();
    });

    it('opens the column filter drop and marks it active', async () => {
        const user = userEvent.setup();

        renderWithProvider(
            <DataTable>
                <DataTable.Header>
                    <DataTable.Row>
                        <DataTable.HeaderCell column="city" sortable>
                            City
                            <DataTable.Filter active>
                                <span>Query</span>
                            </DataTable.Filter>
                        </DataTable.HeaderCell>
                    </DataTable.Row>
                </DataTable.Header>
                <DataTable.Body>
                    <DataTable.Row>
                        <DataTable.Cell>Kazan</DataTable.Cell>
                    </DataTable.Row>
                </DataTable.Body>
            </DataTable>
        );

        const trigger = screen.getByRole('button', { name: 'City' });
        expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
        expect(trigger.querySelector('[data-active]')).not.toBeNull();

        await user.click(trigger);
        expect(screen.getByRole('dialog')).toHaveTextContent('Query');
    });

    it('opens a filter drop that has no children', async () => {
        const user = userEvent.setup();

        renderWithProvider(
            <DataTable>
                <DataTable.Header>
                    <DataTable.Row>
                        <DataTable.HeaderCell column="city" sortable>
                            City
                            <DataTable.Filter />
                        </DataTable.HeaderCell>
                    </DataTable.Row>
                </DataTable.Header>
            </DataTable>
        );

        const trigger = screen.getByRole('button', { name: 'City' });

        expect(trigger.querySelector('[data-active]')).toBeNull();

        await user.click(trigger);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('opens the menu from the kebab click wired by the caller', async () => {
        const user = userEvent.setup();
        const onOpen = vi.fn();
        const onDelete = vi.fn();

        const Screen = () => {
            const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
            const close = () => setMenu(null);

            return (
                <>
                    <DataTable>
                        <DataTable.Body>
                            <DataTable.Row>
                                <DataTable.Cell utility>
                                    <DataTable.Actions
                                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                            const rect = event.currentTarget.getBoundingClientRect();
                                            setMenu({ x: rect.left, y: rect.bottom });
                                        }}
                                    />
                                </DataTable.Cell>
                            </DataTable.Row>
                        </DataTable.Body>
                        <DataTable.Footer dataTestId="footer">footer</DataTable.Footer>
                    </DataTable>
                    <ContextMenu open={menu != null} x={menu?.x ?? 0} y={menu?.y ?? 0} onClose={close}>
                        <ContextMenu.Item
                            onClick={() => {
                                onOpen();
                                close();
                            }}
                        >
                            Open
                        </ContextMenu.Item>
                        <ContextMenu.Item
                            variant="danger"
                            disabled
                            onClick={() => {
                                onDelete();
                                close();
                            }}
                        >
                            Delete
                        </ContextMenu.Item>
                    </ContextMenu>
                </>
            );
        };

        renderWithProvider(<Screen />);

        const table = screen.getByRole('table');
        expect(table).not.toContainElement(screen.getByTestId('footer'));
        expect(screen.queryByRole('menuitem', { name: 'Open' })).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Ещё действия' }));

        const remove = screen.getByRole('menuitem', { name: 'Delete' });
        expect(remove).toBeDisabled();
        expect(remove).toHaveAttribute('data-variant', 'danger');
        expect(onDelete).not.toHaveBeenCalled();

        await user.click(screen.getByRole('menuitem', { name: 'Open' }));
        expect(onOpen).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('forwards onContextMenu from the row', async () => {
        const user = userEvent.setup();
        const onOpen = vi.fn();
        const onRowContextMenu = vi.fn();
        const onPlainContextMenu = vi.fn();

        const Screen = () => {
            const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
            const close = () => setMenu(null);

            return (
                <>
                    <DataTable>
                        <DataTable.Body>
                            <DataTable.Row
                                onContextMenu={(event: MouseEvent<HTMLTableRowElement>) => {
                                    onRowContextMenu(event);
                                    event.preventDefault();
                                    setMenu({ x: event.clientX, y: event.clientY });
                                }}
                            >
                                <DataTable.Cell>Kazan</DataTable.Cell>
                                <DataTable.Cell utility>
                                    <DataTable.Actions />
                                </DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row onContextMenu={onPlainContextMenu}>
                                <DataTable.Cell>Plain</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable.Body>
                    </DataTable>
                    <ContextMenu open={menu != null} x={menu?.x ?? 0} y={menu?.y ?? 0} onClose={close}>
                        <ContextMenu.Item
                            onClick={() => {
                                onOpen();
                                close();
                            }}
                        >
                            Open
                        </ContextMenu.Item>
                    </ContextMenu>
                </>
            );
        };

        renderWithProvider(<Screen />);

        await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Plain') });
        expect(onPlainContextMenu).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();

        await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Kazan') });
        expect(onRowContextMenu).toHaveBeenCalledTimes(1);
        await user.click(screen.getByRole('menuitem', { name: 'Open' }));
        expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('uses the actions label as the accessible name', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        renderWithProvider(
            <DataTable>
                <DataTable.Body>
                    <DataTable.Row>
                        <DataTable.Cell>
                            <DataTable.Actions label="Row actions" onClick={onClick} />
                        </DataTable.Cell>
                    </DataTable.Row>
                </DataTable.Body>
            </DataTable>
        );

        const button = screen.getByRole('button', { name: 'Row actions' });

        expect(screen.queryByRole('button', { name: 'Ещё действия' })).not.toBeInTheDocument();

        await user.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('selects a row from the cell and skips the actions button', async () => {
        const user = userEvent.setup();
        const onActions = vi.fn();

        const SelectionDemo = () => {
            const ids = ['alice', 'bob'];
            const { isSelected, toggle, isAllSelected, isIndeterminate, setAllOnPage } = useTableRowSelection(ids);

            return (
                <DataTable hasChecked>
                    <DataTable.Header>
                        <DataTable.Row>
                            <DataTable.HeaderCheckboxCell
                                checked={isAllSelected}
                                indeterminate={isIndeterminate}
                                onChange={setAllOnPage}
                                aria-label="Select all"
                            />
                            <DataTable.HeaderCell>Name</DataTable.HeaderCell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body>
                        <DataTable.Row checked={isSelected('alice')}>
                            <DataTable.CheckboxCell
                                checked={isSelected('alice')}
                                onChange={() => toggle('alice')}
                                aria-label="Select Alice"
                            />
                            <DataTable.Cell>Alice</DataTable.Cell>
                            <DataTable.Cell>
                                <DataTable.Actions label="Alice actions" onClick={onActions} />
                            </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row checked={isSelected('bob')}>
                            <DataTable.CheckboxCell
                                checked={isSelected('bob')}
                                onChange={() => toggle('bob')}
                                aria-label="Select Bob"
                            />
                            <DataTable.Cell>Bob</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Body>
                </DataTable>
            );
        };

        renderWithProvider(<SelectionDemo />);

        await user.click(screen.getByText('Alice'));
        expect(screen.getByRole('checkbox', { name: 'Select Alice' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Select Bob' })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Select all' })).toBePartiallyChecked();

        await user.click(screen.getByRole('button', { name: 'Alice actions' }));
        expect(onActions).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('checkbox', { name: 'Select Alice' })).toBeChecked();

        await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
        expect(screen.getByRole('checkbox', { name: 'Select Alice' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Select Bob' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Select all' })).toBeChecked();
    });

    it('has no axe violations in the default state', async () => {
        const { container } = renderWithProvider(
            <DataTable>
                <DataTable.Header>
                    <DataTable.Row>
                        <DataTable.HeaderCell>Name</DataTable.HeaderCell>
                    </DataTable.Row>
                </DataTable.Header>
                <DataTable.Body>
                    <DataTable.Row>
                        <DataTable.Cell>Alice</DataTable.Cell>
                    </DataTable.Row>
                </DataTable.Body>
            </DataTable>
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});
