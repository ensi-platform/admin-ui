import { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Table } from '..';

vi.mock('@/select', () => ({
    Select: ({
        value,
        onChange,
        disabled,
        options,
        'aria-labelledby': labelledBy,
    }: {
        value?: number | string | null;
        onChange?: (next: number | string | null) => void;
        disabled?: boolean;
        options: { value: number | string; label: string }[];
        'aria-labelledby'?: string;
    }) => (
        <div>
            <button type="button" disabled={disabled} aria-labelledby={labelledBy}>
                {value}
            </button>
            <button type="button" onClick={() => onChange?.(null)}>
                clear
            </button>
            <button type="button" onClick={() => onChange?.('25')}>
                select-string-25
            </button>
            <button type="button" onClick={() => onChange?.(50)}>
                select-number-50
            </button>
            <ul>
                {options.map(option => (
                    <li key={String(option.value)}>{option.label}</li>
                ))}
            </ul>
        </div>
    ),
}));

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('Table.PageSize', () => {
    it('renders label and current value', () => {
        renderWithProvider(<Table.PageSize value={10} onChange={() => undefined} dataTestId="page-size" />);

        expect(screen.getByTestId('page-size')).toBeInTheDocument();
        expect(screen.getByText('Per page')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Per page/ })).toHaveTextContent('10');
    });

    it('calls onChange when an option is selected', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<Table.PageSize value={10} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: 'select-number-50' }));

        expect(onChange).toHaveBeenCalledWith(50);
    });

    it('ignores null selection and coerces string values', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<Table.PageSize value={10} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: 'clear' }));
        expect(onChange).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: 'select-string-25' }));
        expect(onChange).toHaveBeenCalledWith(25);
    });

    it('disables the select when disabled', () => {
        renderWithProvider(<Table.PageSize value={10} onChange={() => undefined} disabled />);

        expect(screen.getByRole('button', { name: /Per page/ })).toBeDisabled();
    });

    it('renders custom label and options', () => {
        renderWithProvider(<Table.PageSize value={5} onChange={() => undefined} label="Rows" options={[5, 15]} />);

        expect(screen.getByText('Rows')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.queryByText('25')).not.toBeInTheDocument();
    });

    it('includes 5 in default options', () => {
        renderWithProvider(<Table.PageSize value={5} onChange={() => undefined} />);

        expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['5', '10', '25', '50', '100']);
    });
});
