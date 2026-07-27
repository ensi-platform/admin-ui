import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormAutocomplete } from '..';

const OPTIONS = [
    { value: 'msk', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
];

const schema = z.object({
    city: z.string().min(1, 'Выберите город'),
});

describe('FormAutocomplete', () => {
    it('submits selected value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ city: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormAutocomplete name="city" label="Город" options={OPTIONS} />
                <button type="submit">Save</button>
            </Form>
        );

        const input = screen.getByRole('combobox', { name: /Город/ });

        await user.click(input);
        await user.type(input, 'Мос');
        await user.click(await screen.findByRole('option', { name: 'Москва' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ city: 'msk' });
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ city: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormAutocomplete name="city" label="Город" options={OPTIONS} />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Выберите город');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form initialValues={{ city: 'msk' }} onSubmit={onSubmit}>
                    <FormAutocomplete name="city" label="Город" options={OPTIONS} clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ city: '' });
    });
});
