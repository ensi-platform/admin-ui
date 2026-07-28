import { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type TUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { AdminUiProvider } from '@/provider';
import { type TComboboxValue } from '@/select/types';

vi.mock('@/autocomplete', () => ({
    Autocomplete: ({
        onChange,
        onInputChange,
        options,
        inputValue,
    }: {
        onChange?: (value: string | null) => void;
        onInputChange?: (value: string) => void;
        options: { value: string; label: string }[];
        inputValue?: string;
    }) => (
        <div>
            <span data-test-id="input-value">{inputValue}</span>
            <span data-test-id="options-count">{options.length}</span>
            <button type="button" data-test-id="pick-nike" onClick={() => onChange?.('nike')}>
                Pick
            </button>
            <button type="button" data-test-id="clear-value" onClick={() => onChange?.(null)}>
                Clear
            </button>
            <button type="button" data-test-id="empty-input" onClick={() => onInputChange?.('')}>
                Empty input
            </button>
        </div>
    ),
}));

// Import after mock so AutocompleteAsync picks up mocked Autocomplete.
const { AutocompleteAsync } = await import('..');

describe('AutocompleteAsync cache label', () => {
    it('keeps label from cache when option is missing from list', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const Harness = () => {
            const [empty, setEmpty] = useState(false);
            const useSuggest: TUseAutocompleteSuggest = () => ({
                options: empty ? [] : [{ value: 'nike', label: 'Nike' }],
                isLoading: false,
            });

            return (
                <>
                    <AutocompleteAsync aria-label="Brand" useSuggest={useSuggest} debounceMs={0} onChange={onChange} />
                    <button type="button" data-test-id="hide-options" onClick={() => setEmpty(true)}>
                        Hide
                    </button>
                </>
            );
        };

        render(
            <AdminUiProvider>
                <Harness />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('options-count')).toHaveTextContent('1');
        await user.click(screen.getByTestId('pick-nike'));
        expect(onChange).toHaveBeenCalledWith('nike');
        expect(screen.getByTestId('input-value')).toHaveTextContent('Nike');

        await user.click(screen.getByTestId('hide-options'));
        expect(screen.getByTestId('options-count')).toHaveTextContent('0');

        await user.click(screen.getByTestId('pick-nike'));
        expect(onChange).toHaveBeenLastCalledWith('nike');
        expect(screen.getByTestId('input-value')).toHaveTextContent('Nike');
    });

    it('skips input sync when selected value has no label', async () => {
        const user = userEvent.setup();

        render(
            <AdminUiProvider>
                <AutocompleteAsync
                    aria-label="Brand"
                    useSuggest={() => ({ options: [], isLoading: false })}
                    debounceMs={0}
                />
            </AdminUiProvider>
        );

        await user.click(screen.getByTestId('pick-nike'));
        expect(screen.getByTestId('input-value')).toHaveTextContent('');
    });

    it('syncs controlled value from cache without rewriting selectedRef from options', async () => {
        const user = userEvent.setup();

        const Harness = () => {
            const [value, setValue] = useState<TComboboxValue | null>(null);
            const [empty, setEmpty] = useState(false);
            const useSuggest: TUseAutocompleteSuggest = () => ({
                options: empty ? [] : [{ value: 'nike', label: 'Nike' }],
                isLoading: false,
            });

            return (
                <>
                    <AutocompleteAsync
                        aria-label="Brand"
                        useSuggest={useSuggest}
                        debounceMs={0}
                        value={value}
                        onChange={setValue}
                    />
                    <button type="button" data-test-id="hide-options" onClick={() => setEmpty(true)}>
                        Hide
                    </button>
                </>
            );
        };

        render(
            <AdminUiProvider>
                <Harness />
            </AdminUiProvider>
        );

        await user.click(screen.getByTestId('pick-nike'));
        expect(screen.getByTestId('input-value')).toHaveTextContent('Nike');

        await user.click(screen.getByTestId('hide-options'));
        await user.click(screen.getByTestId('empty-input'));

        expect(screen.getByTestId('input-value')).toHaveTextContent('Nike');
        expect(screen.getByTestId('options-count')).toHaveTextContent('0');
    });
});
