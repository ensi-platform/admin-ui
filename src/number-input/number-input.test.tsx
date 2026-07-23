import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NumberInput } from './index.js';

describe('NumberInput', () => {
    it('renders textbox', () => {
        render(<NumberInput aria-label="Qty" dataTestId="qty" />);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByTestId('qty')).toBeInTheDocument();
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
        render(<NumberInput aria-label="Qty" isInvalid />);

        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
});
