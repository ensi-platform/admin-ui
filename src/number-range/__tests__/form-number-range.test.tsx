import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Form } from '@/form';

import { FormNumberRange } from '..';

describe('FormNumberRange', () => {
    it('submits the same range object', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ amount: { from: 1, to: 10 } }} onSubmit={onSubmit}>
                <FormNumberRange name="amount" label="Amount" fromLabel="From" toLabel="To" />
                <button type="submit">Save</button>
            </Form>
        );

        const from = screen.getByRole('textbox', { name: 'From' });
        await user.clear(from);
        await user.type(from, '20');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ amount: { from: 20, to: 20 } });
    });

    it('shows a hint without a label and disables empty fields', async () => {
        const user = userEvent.setup();

        render(
            <Form initialValues={{ amount: { from: null, to: null } }} onSubmit={() => undefined}>
                <FormNumberRange name="amount" hint="Bounds" fromLabel="From" toLabel="To" disabled />
            </Form>
        );

        expect(screen.getByText('Bounds')).toBeInTheDocument();
        expect(screen.queryByText('Amount')).not.toBeInTheDocument();

        const from = screen.getByRole('textbox', { name: 'From' });

        expect(from).toBeDisabled();
        expect(from).toHaveValue('');

        await user.tab();
    });
});
