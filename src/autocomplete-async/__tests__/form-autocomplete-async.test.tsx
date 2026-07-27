import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { type TUseAutocompleteSuggest } from '@/autocomplete-async/suggest';
import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormAutocompleteAsync } from '..';

const OPTIONS = [
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
];

const useStaticSuggest: TUseAutocompleteSuggest = ({ query, enabled }) => {
    if (!enabled) {
        return { options: OPTIONS, isLoading: false };
    }

    return {
        options: OPTIONS.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
        isLoading: false,
    };
};

const schema = z.object({
    brand: z.string().min(1, 'Выберите бренд'),
});

describe('FormAutocompleteAsync', () => {
    it('submits selected value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
            <Form initialValues={{ brand: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormAutocompleteAsync name="brand" label="Бренд" useSuggest={useStaticSuggest} debounceMs={0} />
                <button type="submit">Save</button>
            </Form>
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Бренд/ });

        await user.click(input);
        await user.type(input, 'Adi');
        await user.click(await screen.findByRole('option', { name: 'Adidas' }));

        expect(input).toHaveValue('Adidas');

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ brand: 'adidas' });
    });

    it('shows initial value label', async () => {
        render(
            <AdminUiProvider>
            <Form initialValues={{ brand: 'nike' }} validationSchema={schema} onSubmit={() => undefined}>
                <FormAutocompleteAsync name="brand" label="Бренд" useSuggest={useStaticSuggest} debounceMs={0} />
            </Form>
            </AdminUiProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('combobox', { name: /Бренд/ })).toHaveValue('Nike');
        });
    });
});
