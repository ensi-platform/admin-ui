import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type IUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { AdminUiProvider } from '@/provider';

import { MultiAutocompleteAsync } from '..';

const OPTIONS = [
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
];

const useStaticSuggest: IUseAutocompleteSuggest = ({ query, enabled }) => {
    if (!enabled) {
        return { options: [], isLoading: false, hasMore: false };
    }

    return {
        options: OPTIONS.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
        isLoading: false,
        hasMore: false,
    };
};

describe('MultiAutocompleteAsync', () => {
    it('loads options via useSuggest', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <MultiAutocompleteAsync
                    aria-label="Brands"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brands/ });

        await user.click(input);
        await user.type(input, 'Ni');

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Nike' })).toBeInTheDocument();
        });

        await user.click(screen.getByRole('option', { name: 'Nike' }));

        expect(onChange).toHaveBeenCalledWith(['nike']);
    });

    it('removes a selected option', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const Harness = () => {
            const [value, setValue] = useState<string[]>([]);

            return (
                <MultiAutocompleteAsync
                    aria-label="Brands"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    value={value}
                    onChange={next => {
                        onChange(next);
                        setValue((next ?? []).map(String));
                    }}
                />
            );
        };

        render(
            <AdminUiProvider>
                <Harness />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brands/ });

        await user.click(input);
        await user.type(input, 'Ni');
        const option = await screen.findByRole('option', { name: 'Nike' });

        await user.click(option);
        expect(onChange).toHaveBeenCalledWith(['nike']);

        await user.click(screen.getByRole('option', { name: 'Nike' }));

        expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it('does not load suggestions when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <MultiAutocompleteAsync
                    aria-label="Brands"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    disabled
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brands/ });

        expect(input).toBeDisabled();
        await user.click(input);

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.queryByRole('option', { name: 'Nike' })).not.toBeInTheDocument();
    });
});
