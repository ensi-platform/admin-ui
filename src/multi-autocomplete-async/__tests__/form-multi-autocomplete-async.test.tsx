import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { type TUseAutocompleteSuggest } from '@/autocomplete-async/suggest';
import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormMultiAutocompleteAsync } from '..';

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

describe('FormMultiAutocompleteAsync', () => {
    it('submits selected values', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider>
                <Form
                    initialValues={{ brands: [] as string[] }}
                    validationSchema={z.object({ brands: z.array(z.string()).min(1) })}
                    onSubmit={onSubmit}
                >
                    <FormMultiAutocompleteAsync
                        name="brands"
                        label="Бренды"
                        useSuggest={useStaticSuggest}
                        debounceMs={0}
                    />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));
        await user.click(await screen.findByRole('option', { name: 'Nike' }));
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ brands: ['nike'] });
    });

    it('renders without label, with nullish value and hint', () => {
        render(
            <AdminUiProvider>
                <Form initialValues={{ brands: undefined }} onSubmit={vi.fn()}>
                    <FormMultiAutocompleteAsync
                        name="brands"
                        useSuggest={useStaticSuggest}
                        debounceMs={0}
                        hint="Pick brands"
                        aria-label="Бренды"
                    />
                </Form>
            </AdminUiProvider>
        );

        expect(screen.queryByText('Бренды')).not.toBeInTheDocument();
        expect(screen.getByText('Pick brands')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /Бренды/ })).toBeInTheDocument();
    });
});
