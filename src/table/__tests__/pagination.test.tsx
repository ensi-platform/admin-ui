import { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Table } from '..';

const renderWithProvider = (ui: ReactElement, labels?: { paginationRange?: string }) =>
    render(<AdminUiProvider labels={labels}>{ui}</AdminUiProvider>);

const baseProps = {
    page: 1,
    pageCount: 2,
    from: 1,
    to: 5,
    total: 10,
    onPageChange: () => undefined,
};

describe('Table.Pagination', () => {
    it('renders range text and prev/next controls', () => {
        renderWithProvider(<Table.Pagination {...baseProps} dataTestId="pager" />);

        expect(screen.getByTestId('pager')).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
        expect(screen.getByText('1–5 of 10')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    });

    it('calls onPageChange for prev and next', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        renderWithProvider(
            <Table.Pagination
                {...baseProps}
                page={2}
                pageCount={5}
                from={6}
                to={10}
                total={25}
                onPageChange={onPageChange}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Previous' }));
        expect(onPageChange).toHaveBeenCalledWith(1);

        await user.click(screen.getByRole('button', { name: 'Next' }));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('disables next on the last page', () => {
        renderWithProvider(<Table.Pagination {...baseProps} page={2} pageCount={2} from={6} to={10} />);

        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    });

    it('still renders when pageCount is below 2', () => {
        renderWithProvider(<Table.Pagination {...baseProps} page={1} pageCount={1} from={1} to={3} total={3} />);

        expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
        expect(screen.getByText('1–3 of 3')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('uses paginationRange label template', () => {
        renderWithProvider(<Table.Pagination {...baseProps} />, {
            paginationRange: '{from}–{to} из {total}',
        });

        expect(screen.getByText('1–5 из 10')).toBeInTheDocument();
    });

    it('prefers rangeLabel over the template', () => {
        renderWithProvider(<Table.Pagination {...baseProps} rangeLabel="custom range" />);

        expect(screen.getByText('custom range')).toBeInTheDocument();
        expect(screen.queryByText('1–5 of 10')).not.toBeInTheDocument();
    });

    it('renders inside Table.Footer without wrapping table cells', () => {
        renderWithProvider(
            <Table dataTestId="table">
                <Table.Scroll>
                    <Table.Table>
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
                    </Table.Table>
                </Table.Scroll>
                <Table.Footer dataTestId="footer">
                    <Table.PageSize value={5} onChange={() => undefined} />
                    <Table.Pagination {...baseProps} dataTestId="pager" />
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
