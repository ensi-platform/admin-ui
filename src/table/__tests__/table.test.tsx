import { type ReactElement, useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Loader } from '@/loader';
import { AdminUiProvider } from '@/provider';

import { Table, useTableRowSelection } from '..';

import cellStyles from '../components/Cell/styles.module.css';
import checkboxCellStyles from '../components/CheckboxCell/styles.module.css';
import footerStyles from '../components/Footer/styles.module.css';
import headerStyles from '../components/Header/styles.module.css';
import shellStyles from '../styles.module.css';

const rows = [
    { id: 1, name: 'Alice', amount: '1 200' },
    { id: 2, name: 'Bob', amount: '340' },
];

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('Table', () => {
    it('renders header and body cells', () => {
        render(
            <Table dataTestId="table">
                <Table.Scroll>
                    <Table.Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell numeric>Amount</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Alice</Table.Cell>
                                <Table.Cell numeric dataTestId="amount-cell">
                                    1 200
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        expect(screen.getByTestId('table')).toHaveClass(shellStyles.root);
        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
        expect(screen.getByTestId('amount-cell')).toHaveClass(cellStyles.numeric);
        expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('marks sticky header', () => {
        render(
            <Table>
                <Table.Scroll>
                    <Table.Table>
                        <Table.Header sticky dataTestId="thead">
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        expect(screen.getByTestId('thead')).toHaveAttribute('data-sticky');
        expect(screen.getByTestId('thead')).toHaveClass(headerStyles.sticky);
    });

    it('applies checked state on row', () => {
        render(
            <Table>
                <Table.Scroll>
                    <Table.Table>
                        <Table.Body>
                            <Table.Row checked dataTestId="row">
                                <Table.Cell>A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        expect(screen.getByTestId('row')).toHaveAttribute('data-checked');
    });

    it('marks zebra on shell', () => {
        render(
            <Table zebra dataTestId="zebra-table">
                <Table.Scroll>
                    <Table.Table>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>A</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        expect(screen.getByTestId('zebra-table')).toHaveAttribute('data-zebra');
        expect(screen.getByTestId('zebra-table')).toHaveClass(shellStyles.zebra);
    });

    it('applies disabled state on row', () => {
        render(
            <Table>
                <Table.Scroll>
                    <Table.Table>
                        <Table.Body>
                            <Table.Row disabled onClick={() => undefined} dataTestId="disabled-row">
                                <Table.Cell>B</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        const disabledRow = screen.getByTestId('disabled-row');
        expect(disabledRow).toHaveAttribute('data-disabled');
        expect(disabledRow).toHaveAttribute('aria-disabled', 'true');
        expect(disabledRow).not.toHaveAttribute('data-clickable');
    });

    it('cycles sort direction from HeaderCell', async () => {
        const user = userEvent.setup();
        const onSort = vi.fn();

        const SortDemo = () => {
            const [direction, setDirection] = useState<'asc' | 'desc' | undefined>();

            return (
                <Table>
                    <Table.Scroll>
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sortable
                                        sortDirection={direction}
                                        onSort={next => {
                                            onSort(next);
                                            setDirection(next);
                                        }}
                                    >
                                        Name
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                        </Table.Table>
                    </Table.Scroll>
                </Table>
            );
        };

        render(<SortDemo />);

        const sortButton = screen.getByRole('button', { name: 'Name' });
        await user.click(sortButton);
        expect(onSort).toHaveBeenLastCalledWith('asc');
        await user.click(sortButton);
        expect(onSort).toHaveBeenLastCalledWith('desc');
        await user.click(sortButton);
        expect(onSort).toHaveBeenLastCalledWith(undefined);
    });

    it('collapses ActionBar overflow into kebab popover', async () => {
        const user = userEvent.setup();
        const onEdit = vi.fn();
        const onDelete = vi.fn();

        render(
            <Table>
                <Table.Scroll>
                    <Table.Table>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell utility>
                                    <Table.ActionBar
                                        dataTestId="actions"
                                        visibleCount={1}
                                        items={[
                                            { text: 'Edit', onClick: onEdit },
                                            { text: 'Delete', onClick: onDelete, danger: true },
                                        ]}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'More actions' }));
        await user.click(await screen.findByRole('button', { name: 'Delete' }));
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('wires checkbox selection with useTableRowSelection', async () => {
        const user = userEvent.setup();

        const SelectionDemo = () => {
            const ids = rows.map(r => r.id);
            const { isSelected, toggle, isAllSelected, isIndeterminate, setAllOnPage } = useTableRowSelection(ids);

            return (
                <Table hasChecked dataTestId="selection-table">
                    <Table.Scroll>
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCheckboxCell
                                        checked={isAllSelected}
                                        indeterminate={isIndeterminate}
                                        onChange={setAllOnPage}
                                        aria-label="Select all"
                                    />
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {rows.map(row => (
                                    <Table.Row key={row.id} checked={isSelected(row.id)}>
                                        <Table.CheckboxCell
                                            checked={isSelected(row.id)}
                                            onChange={() => toggle(row.id)}
                                            aria-label={`Select ${row.name}`}
                                            dataTestId={`select-${row.name}`}
                                        />
                                        <Table.Cell>{row.name}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Table>
                    </Table.Scroll>
                </Table>
            );
        };

        render(<SelectionDemo />);

        expect(screen.getByTestId('select-Alice')).toHaveClass(checkboxCellStyles.root);

        await user.click(screen.getByRole('checkbox', { name: 'Select Alice' }));
        expect(screen.getByRole('checkbox', { name: 'Select Alice' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Select all' })).toBePartiallyChecked();

        await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
        expect(screen.getByRole('checkbox', { name: 'Select Alice' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Select Bob' })).toBeChecked();
    });

    it('keeps Footer outside Loader veil when composed by the app', () => {
        renderWithProvider(
            <Table>
                <Table.Scroll>
                    <Loader active dataTestId="table-loader">
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Alice</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Table>
                    </Loader>
                </Table.Scroll>
                <Table.Footer dataTestId="table-footer">status</Table.Footer>
            </Table>
        );

        const loader = screen.getByTestId('table-loader');
        expect(loader).toContainElement(screen.getByText('Alice'));
        expect(loader.querySelector('table')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByTestId('table-footer')).toBeInTheDocument();
        expect(loader).not.toContainElement(screen.getByTestId('table-footer'));
    });

    it('throws when context consumers render outside Table', () => {
        expect(() =>
            render(
                <table>
                    <tbody>
                        <tr>
                            <Table.CheckboxCell checked={false} onChange={() => undefined} aria-label="Select" />
                        </tr>
                    </tbody>
                </table>
            )
        ).toThrow(/must be used within/);
    });

    it('maps ActionBar buttons to md size when Table size is lg', async () => {
        const user = userEvent.setup();
        const onDelete = vi.fn();

        render(
            <Table size="lg">
                <Table.Scroll>
                    <Table.Table>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell utility>
                                    <Table.ActionBar
                                        visibleCount={1}
                                        items={[
                                            { text: 'Edit', onClick: () => undefined },
                                            { text: 'Delete', onClick: onDelete, danger: true },
                                        ]}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'More actions' }));
        await user.click(await screen.findByRole('button', { name: 'Delete' }));
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('renders ActionBar without overflow when all items are visible', () => {
        render(
            <Table>
                <Table.Scroll>
                    <Table.Table>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell utility>
                                    <Table.ActionBar
                                        visibleCount={2}
                                        items={[
                                            { key: 'edit', text: 'Edit', onClick: () => undefined },
                                            { key: 'copy', text: 'Copy', onClick: () => undefined },
                                        ]}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
    });

    it('stops row click when checkbox cells are clicked', async () => {
        const user = userEvent.setup();
        const onRowClick = vi.fn();
        const onHeaderCellClick = vi.fn();
        const onCellClick = vi.fn();

        render(
            <Table>
                <Table.Scroll>
                    <Table.Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCheckboxCell
                                    checked={false}
                                    onChange={() => undefined}
                                    aria-label="Select all"
                                    onClick={onHeaderCellClick}
                                    dataTestId="header-check"
                                />
                                <Table.HeaderCell>Name</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row onClick={onRowClick} dataTestId="clickable-row">
                                <Table.CheckboxCell
                                    checked={false}
                                    onChange={() => undefined}
                                    aria-label="Select Alice"
                                    onClick={onCellClick}
                                    dataTestId="row-check"
                                />
                                <Table.Cell>Alice</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
            </Table>
        );

        await user.click(screen.getByTestId('header-check'));
        expect(onHeaderCellClick).toHaveBeenCalledTimes(1);

        await user.click(screen.getByTestId('row-check'));
        expect(onCellClick).toHaveBeenCalledTimes(1);
        expect(onRowClick).not.toHaveBeenCalled();
    });

    it('marks non-sticky footer and clickable row without bottom border', async () => {
        const user = userEvent.setup();
        const onRowClick = vi.fn();

        render(
            <Table>
                <Table.Scroll>
                    <Table.Table>
                        <Table.Body>
                            <Table.Row onClick={onRowClick} bottomBorder={false} dataTestId="click-row">
                                <Table.Cell>Alice</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Table>
                </Table.Scroll>
                <Table.Footer sticky={false} dataTestId="non-sticky-footer">
                    footer
                </Table.Footer>
            </Table>
        );

        const row = screen.getByTestId('click-row');
        expect(row).toHaveAttribute('data-clickable');
        expect(row).toHaveAttribute('tabIndex', '0');
        expect(row).toHaveAttribute('data-bottom-border', 'false');

        await user.click(row);
        expect(onRowClick).toHaveBeenCalledTimes(1);

        const footer = screen.getByTestId('non-sticky-footer');
        expect(footer).not.toHaveAttribute('data-sticky');
        expect(footer).not.toHaveClass(footerStyles.sticky);
    });
});
