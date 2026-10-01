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
        expect(screen.getByText('1–5 из 10')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Назад' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Далее' })).toBeEnabled();
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

        await user.click(screen.getByRole('button', { name: 'Назад' }));
        expect(onPageChange).toHaveBeenCalledWith(1);

        await user.click(screen.getByRole('button', { name: 'Далее' }));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('jumps to a numbered page and the last page', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        renderWithProvider(
            <Table.Pagination
                {...baseProps}
                page={1}
                pageCount={20}
                from={1}
                to={5}
                total={100}
                onPageChange={onPageChange}
            />
        );

        expect(screen.getByText('1', { selector: '[aria-current="page"]' })).toBeInTheDocument();
        expect(screen.getByText('…')).toHaveAttribute('aria-hidden', 'true');

        await user.click(screen.getByRole('button', { name: 'Страница 3' }));
        expect(onPageChange).toHaveBeenCalledWith(3);

        await user.click(screen.getByRole('button', { name: 'Страница 20' }));
        expect(onPageChange).toHaveBeenCalledWith(20);
    });

    it('disables next on the last page', () => {
        renderWithProvider(<Table.Pagination {...baseProps} page={2} pageCount={2} from={6} to={10} />);

        expect(screen.getByRole('button', { name: 'Далее' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Назад' })).toBeEnabled();
    });

    it('still renders when pageCount is below 2', () => {
        renderWithProvider(<Table.Pagination {...baseProps} page={1} pageCount={1} from={1} to={3} total={3} />);

        expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
        expect(screen.getByText('1–3 из 3')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Назад' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Далее' })).toBeDisabled();
    });

    it('uses paginationRange label template', () => {
        renderWithProvider(<Table.Pagination {...baseProps} />, {
            paginationRange: '{from}-{to}/{total}',
        });

        expect(screen.getByText('1-5/10')).toBeInTheDocument();
    });

    it('prefers rangeLabel over the template', () => {
        renderWithProvider(<Table.Pagination {...baseProps} rangeLabel="custom range" />);

        expect(screen.getByText('custom range')).toBeInTheDocument();
        expect(screen.queryByText('1–5 из 10')).not.toBeInTheDocument();
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
