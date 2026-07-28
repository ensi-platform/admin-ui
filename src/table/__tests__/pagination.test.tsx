import { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Table } from '..';

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('Table.Pagination', () => {
    it('renders page buttons and next control', () => {
        renderWithProvider(
            <Table.Pagination page={1} pageCount={5} onPageChange={() => undefined} dataTestId="pager" />
        );

        expect(screen.getByTestId('pager')).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
        expect(screen.getByText('1')).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled();
    });

    it('calls onPageChange for page and next', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        renderWithProvider(<Table.Pagination page={2} pageCount={5} onPageChange={onPageChange} />);

        await user.click(screen.getByRole('button', { name: 'Page 4' }));
        expect(onPageChange).toHaveBeenCalledWith(4);

        await user.click(screen.getByRole('button', { name: /Next/ }));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('disables next on the last page', () => {
        renderWithProvider(<Table.Pagination page={5} pageCount={5} onPageChange={() => undefined} />);

        expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled();
    });

    it('returns null when pageCount is below 2', () => {
        const { container } = renderWithProvider(
            <Table.Pagination page={1} pageCount={1} onPageChange={() => undefined} />
        );

        expect(container.querySelector('nav')).toBeNull();
    });

    it('renders ellipsis for large page counts', () => {
        renderWithProvider(<Table.Pagination page={1} pageCount={20} onPageChange={() => undefined} />);

        expect(screen.getByText('…')).toBeInTheDocument();
        expect(screen.getByText('…')).toHaveAttribute('aria-hidden');
    });

    it('renders inside Table.Footer without wrapping table cells', () => {
        renderWithProvider(
            <Table dataTestId="table">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>A</Table.Cell>
                    </Table.Row>
                </Table.Body>
                <Table.Footer dataTestId="footer">
                    <span>Показано 1–10 из 20</span>
                    <Table.Pagination page={1} pageCount={2} onPageChange={() => undefined} dataTestId="pager" />
                </Table.Footer>
            </Table>
        );

        const footer = screen.getByTestId('footer');
        expect(footer.tagName).toBe('DIV');
        expect(footer).toHaveAttribute('data-sticky');
        expect(screen.getByTestId('pager')).toBeInTheDocument();
        expect(screen.getByTestId('table').querySelector('tfoot')).toBeNull();
    });
});
