import { type MouseEvent, type ReactElement, useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ContextMenu } from '@/context-menu';
import { AdminUiProvider } from '@/provider';

import { DataTable } from '../Component';
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
        const { container } = render(
            <>
                <DataTable.Filter />
                <DataTable.Filter active>
                    <span>Query</span>
                </DataTable.Filter>
            </>
        );

        expect(container).toBeEmptyDOMElement();
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

        await user.click(screen.getByRole('button', { name: 'More actions' }));

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
});
