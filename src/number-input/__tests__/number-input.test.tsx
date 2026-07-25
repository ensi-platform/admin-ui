import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { NumberInput } from '..';

import styles from '../styles.module.css';

describe('NumberInput', () => {
    it('renders textbox', () => {
        render(<NumberInput aria-label="Qty" dataTestId="qty" />);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByTestId('qty')).toBeInTheDocument();
    });

    it('applies block class by default', () => {
        render(<NumberInput aria-label="Qty" dataTestId="qty" />);

        expect(screen.getByTestId('qty')).toHaveClass(styles.block);
    });

    it('omits block class when block={false}', () => {
        render(<NumberInput aria-label="Qty" dataTestId="qty" block={false} />);

        expect(screen.getByTestId('qty')).not.toHaveClass(styles.block);
    });

    it('calls onChange with number', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.type(input, '12');
        await user.tab();

        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls.at(-1)?.[0]).toBe(12);
    });

    it('renders suffix', () => {
        render(<NumberInput aria-label="Price" suffix="₽" />);

        expect(screen.getByText('₽')).toBeInTheDocument();
    });

    it('disables input when disabled', () => {
        render(<NumberInput aria-label="Qty" disabled />);

        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('sets invalid state', () => {
        render(<NumberInput aria-label="Qty" invalid />);

        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('clears value when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <NumberInput aria-label="Qty" value={12} clear onChange={onChange} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('clears uncontrolled value when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <NumberInput aria-label="Qty" defaultValue={12} clear onChange={onChange} />
            </AdminUiProvider>
        );

        expect(screen.getByRole('textbox', { name: 'Qty' })).toHaveValue('12');

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith(null);
        expect(screen.getByRole('textbox', { name: 'Qty' })).toHaveValue('');
    });

    it('treats NaN defaultValue as empty uncontrolled state', () => {
        render(<NumberInput aria-label="Qty" defaultValue={Number.NaN} />);

        expect(screen.getByRole('textbox', { name: 'Qty' })).toHaveValue('');
    });

    it('renders prefix', () => {
        render(<NumberInput aria-label="Price" prefix="$" />);

        expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('emits null when input is cleared via typing', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<NumberInput aria-label="Qty" defaultValue={5} onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Qty' });
        await user.clear(input);
        await user.tab();

        expect(onChange.mock.calls.at(-1)?.[0]).toBeNull();
    });
});
