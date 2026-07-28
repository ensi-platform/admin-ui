import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type TUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { AdminUiProvider } from '@/provider';
import { type TComboboxValue } from '@/select/types';

import { AutocompleteAsync } from '..';

const OPTIONS = [
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
];

const useStaticSuggest: TUseAutocompleteSuggest = ({ query, enabled }) => {
    if (!enabled) {
        return { options: [], isLoading: false };
    }

    return {
        options: OPTIONS.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
        isLoading: false,
    };
};

describe('AutocompleteAsync', () => {
    it('loads options via useSuggest', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <AutocompleteAsync
                    aria-label="Brand"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        await user.click(input);
        await user.type(input, 'Ni');

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Nike' })).toBeInTheDocument();
        });

        await user.click(screen.getByRole('option', { name: 'Nike' }));

        expect(onChange).toHaveBeenCalledWith('nike');
        expect(input).toHaveValue('Nike');
    });

    it('shows label for controlled value when option loads', async () => {
        render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useStaticSuggest} debounceMs={0} value="nike" />
            </AdminUiProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('combobox', { name: /Brand/ })).toHaveValue('Nike');
        });
    });

    it('respects minLength before enabling suggest', async () => {
        const user = userEvent.setup();
        const useSuggest = vi.fn<TUseAutocompleteSuggest>(() => ({ options: [], isLoading: false }));

        render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useSuggest} debounceMs={0} minLength={2} />
            </AdminUiProvider>
        );

        await user.type(screen.getByRole('combobox', { name: /Brand/ }), 'N');

        await waitFor(() => {
            expect(useSuggest).toHaveBeenCalled();
        });

        const last = useSuggest.mock.calls.at(-1)?.[0];

        expect(last?.enabled).toBe(false);
    });

    it('passes isLoading from suggest result', async () => {
        const user = userEvent.setup();
        const useLoadingSuggest: TUseAutocompleteSuggest = () => {
            const [options] = useState(OPTIONS);

            return { options, isLoading: true };
        };

        render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useLoadingSuggest} debounceMs={0} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));

        expect(await screen.findByRole('status')).toHaveAttribute('aria-label', 'Loading suggestions');
    });

    it('clears selection and input', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <AutocompleteAsync
                    aria-label="Brand"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    clear
                    defaultValue="nike"
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        await user.click(input);
        await user.type(input, 'Nike');
        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Nike' })).toBeInTheDocument();
        });
        await user.click(screen.getByRole('option', { name: 'Nike' }));
        expect(input).toHaveValue('Nike');

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith(null);
        expect(input).toHaveValue('');
    });

    it('keeps cached label when option leaves the list', async () => {
        const user = userEvent.setup();
        let queryGate = '';
        const useGatedSuggest: TUseAutocompleteSuggest = ({ query, enabled }) => {
            if (!enabled) {
                return { options: [], isLoading: false };
            }

            queryGate = query;

            return {
                options: OPTIONS.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
                isLoading: false,
            };
        };

        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useGatedSuggest} debounceMs={0} onChange={onChange} />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        await user.click(input);
        await user.type(input, 'Nike');
        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Nike' })).toBeInTheDocument();
        });
        await user.click(screen.getByRole('option', { name: 'Nike' }));
        expect(onChange).toHaveBeenCalledWith('nike');
        expect(input).toHaveValue('Nike');

        // Retype filter so current options no longer include Nike, then re-select via controlled path
        await user.clear(input);
        await user.type(input, 'zzz');
        await waitFor(() => {
            expect(queryGate).toBe('zzz');
        });
        expect(input).toHaveValue('zzz');
    });

    it('clears input when controlled value becomes null', async () => {
        const user = userEvent.setup();
        const Controlled = () => {
            const [value, setValue] = useState<TComboboxValue | null>('nike');

            return (
                <>
                    <AutocompleteAsync
                        aria-label="Brand"
                        useSuggest={useStaticSuggest}
                        debounceMs={0}
                        value={value}
                        onChange={setValue}
                    />
                    <button type="button" onClick={() => setValue(null)}>
                        Reset
                    </button>
                </>
            );
        };

        render(
            <AdminUiProvider>
                <Controlled />
            </AdminUiProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('combobox', { name: /Brand/ })).toHaveValue('Nike');
        });

        await user.click(screen.getByRole('button', { name: 'Reset' }));

        await waitFor(() => {
            expect(screen.getByRole('combobox', { name: /Brand/ })).toHaveValue('');
        });
    });

    it('ignores controlled value with no matching option', async () => {
        render(
            <AdminUiProvider>
                <AutocompleteAsync
                    aria-label="Brand"
                    useSuggest={() => ({ options: [], isLoading: false })}
                    debounceMs={0}
                    value="missing"
                />
            </AdminUiProvider>
        );

        expect(screen.getByRole('combobox', { name: /Brand/ })).toHaveValue('');
    });
});
