import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type IUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

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

    it('waits for minLength before showing suggestions', async () => {
        const user = userEvent.setup();

        render(
            <AdminUiProvider>
                <MultiAutocompleteAsync
                    aria-label="Brands"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    minLength={2}
                    placeholder="Бренды…"
                />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brands/ });

        expect(input).toHaveAttribute('placeholder', 'Бренды…');

        await user.click(input);
        await user.type(input, 'N');

        expect(screen.queryByRole('option', { name: 'Nike' })).not.toBeInTheDocument();

        await user.type(input, 'i');

        expect(await screen.findByRole('option', { name: 'Nike' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Adidas' })).not.toBeInTheDocument();
    });

    it('does not show the previous page while a newer query is loading', async () => {
        const user = userEvent.setup();
        const useStaleSuggest: IUseAutocompleteSuggest = ({ query, enabled }) => {
            if (!enabled || query.length === 0) {
                return { options: [], isLoading: false, hasMore: false };
            }

            if (query === 'Ni') {
                return { options: [{ value: 'nike', label: 'Nike' }], isLoading: false, hasMore: false };
            }

            return {
                options: [{ value: 'nike', label: 'Nike' }],
                isLoading: true,
                hasMore: false,
            };
        };

        render(
            <AdminUiProvider>
                <MultiAutocompleteAsync aria-label="Brands" useSuggest={useStaleSuggest} debounceMs={0} />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brands/ });

        await user.click(input);
        await user.type(input, 'Ni');
        expect(await screen.findByRole('option', { name: 'Nike' })).toBeInTheDocument();

        await user.type(input, 'z');

        expect(await screen.findByRole('status', { name: 'Загрузка подсказок' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Nike' })).not.toBeInTheDocument();
    });

    it('calls onBlur when focus leaves the field', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(
            <AdminUiProvider>
                <MultiAutocompleteAsync
                    aria-label="Brands"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    onBlur={onBlur}
                />
                <button type="button">Next</button>
            </AdminUiProvider>
        );

        await user.tab();
        await user.tab();

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('has no axe violations in the default and disabled states', async () => {
        const { container, unmount } = render(
            <AdminUiProvider>
                <MultiAutocompleteAsync aria-label="Brands" useSuggest={useStaticSuggest} debounceMs={0} />
            </AdminUiProvider>
        );
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(
            <AdminUiProvider>
                <MultiAutocompleteAsync aria-label="Brands" useSuggest={useStaticSuggest} debounceMs={0} disabled />
            </AdminUiProvider>
        );
        expect(await axe(disabled.container)).toHaveNoViolations();
    });
});
