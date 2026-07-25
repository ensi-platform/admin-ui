import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormNumberInput } from '..';

describe('FormNumberInput', () => {
    it('submits ruble store value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ price: null as number | null }} onSubmit={onSubmit}>
                <FormNumberInput
                    name="price"
                    label="Цена"
                    step={0.01}
                    formatOptions={{ style: 'currency', currency: 'RUB' }}
                />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Цена'), '10.5');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ price: 10.5 });
    });

    it('shows validation error for store schema', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const schema = z.object({
            price: z.number().min(10, 'Минимум 10 ₽'),
        });

        render(
            <Form initialValues={{ price: null as number | null }} validationSchema={schema} onSubmit={onSubmit}>
                <FormNumberInput name="price" label="Цена" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Цена'), '5');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Минимум 10 ₽');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables when Form is disabled', () => {
        render(
            <Form initialValues={{ price: 100 }} disabled onSubmit={vi.fn()}>
                <FormNumberInput name="price" label="Цена" />
            </Form>
        );

        expect(screen.getByLabelText('Цена')).toBeDisabled();
    });

    it('renders without label and with hint', () => {
        render(
            <Form initialValues={{ price: null as number | null }} onSubmit={vi.fn()}>
                <FormNumberInput name="price" hint="In rubles" aria-label="Цена" />
            </Form>
        );

        expect(screen.queryByText('Цена')).not.toBeInTheDocument();
        expect(screen.getByText('In rubles')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Цена' })).toBeInTheDocument();
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form initialValues={{ qty: 12 as number | null }} onSubmit={onSubmit}>
                    <FormNumberInput name="qty" label="Количество" clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ qty: null });
    });

    it('applies formatOptions after blur', async () => {
        const user = userEvent.setup();

        render(
            <Form initialValues={{ price: null as number | null }} onSubmit={vi.fn()}>
                <FormNumberInput
                    name="price"
                    label="Цена"
                    step={0.01}
                    formatOptions={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
                />
            </Form>
        );

        const input = screen.getByLabelText('Цена');
        await user.type(input, '10.5');
        await user.tab();

        expect(input).toHaveDisplayValue(/10[,.]50/);
    });
});
