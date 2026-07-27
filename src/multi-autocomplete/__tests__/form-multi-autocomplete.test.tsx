import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormMultiAutocomplete } from '..';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
];

const schema = z.object({
    tags: z.array(z.string()).min(1, 'Выберите метки'),
});

describe('FormMultiAutocomplete', () => {
    it('submits selected values', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form initialValues={{ tags: [] as string[] }} validationSchema={schema} onSubmit={onSubmit}>
                    <FormMultiAutocomplete name="tags" label="Метки" options={OPTIONS} />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));
        await user.click(await screen.findByRole('option', { name: 'vip' }));
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ tags: ['vip'] });
    });

    it('renders without label, with nullish value and hint', () => {
        render(
            <AdminUiProvider>
                <Form initialValues={{ tags: undefined }} onSubmit={vi.fn()}>
                    <FormMultiAutocomplete name="tags" options={OPTIONS} hint="Pick tags" aria-label="Метки" />
                </Form>
            </AdminUiProvider>
        );

        expect(screen.queryByText('Метки')).not.toBeInTheDocument();
        expect(screen.getByText('Pick tags')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /Метки/ })).toBeInTheDocument();
    });
});
