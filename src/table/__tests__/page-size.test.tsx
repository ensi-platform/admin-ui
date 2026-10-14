import { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Table } from '..';

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('Table.PageSize', () => {
    it('renders label and current value', () => {
        renderWithProvider(<Table.PageSize value={10} onChange={() => undefined} dataTestId="page-size" />);

        expect(screen.getByTestId('page-size')).toBeInTheDocument();
        expect(screen.getByText('Строк на странице')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /10/ })).toBeInTheDocument();
    });

    it('calls onChange when an option is selected', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<Table.PageSize value={10} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: /Строк на странице/ }));
        await user.click(screen.getByRole('option', { name: '50' }));

        expect(onChange).toHaveBeenCalledWith(50);
    });

    it('disables the select when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<Table.PageSize value={10} onChange={onChange} disabled />);

        const trigger = screen.getByRole('button', { name: /Строк на странице/ });

        expect(trigger).toBeDisabled();
        await user.click(trigger);
        expect(onChange).not.toHaveBeenCalled();
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('renders custom label and options', async () => {
        const user = userEvent.setup();

        renderWithProvider(<Table.PageSize value={5} onChange={() => undefined} label="Rows" options={[5, 15]} />);

        expect(screen.getByText('Rows')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /Rows/ }));

        expect(screen.getByRole('option', { name: '15' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: '25' })).not.toBeInTheDocument();
    });

    it('includes 5 in default options', async () => {
        const user = userEvent.setup();

        renderWithProvider(<Table.PageSize value={5} onChange={() => undefined} />);

        await user.click(screen.getByRole('button', { name: /Строк на странице/ }));

        expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual(['5', '10', '25', '50', '100']);
    });
});
