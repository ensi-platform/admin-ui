import { useState } from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type IUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { AdminUiProvider } from '@/provider';
import { type TComboboxValue } from '@/select/types';
import { axe } from '@/test/axe';

import { AutocompleteAsync } from '..';

const OPTIONS = [
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
];

const backspaceToEmpty = async (user: UserEvent, input: HTMLElement) => {
    await user.click(input);

    if (input instanceof HTMLInputElement) {
        input.setSelectionRange(input.value.length, input.value.length);
    }

    const erase = async (rests: readonly string[]): Promise<void> => {
        const [rest, ...tail] = rests;

        if (rest === undefined) {
            return;
        }

        await user.keyboard('{Backspace}');
        expect(input).toHaveValue(rest);
        await erase(tail);
    };

    await erase(['Nik', 'Ni', 'N', '']);
};

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
        const useSuggest = vi.fn<IUseAutocompleteSuggest>(() => ({ options: [], isLoading: false, hasMore: false }));

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
        const useLoadingSuggest: IUseAutocompleteSuggest = () => {
            const [options] = useState(OPTIONS);

            return { options, isLoading: true, hasMore: false };
        };

        render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useLoadingSuggest} debounceMs={0} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));

        expect(await screen.findByRole('status')).toHaveAttribute('aria-label', 'Загрузка подсказок');
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

    it('keeps the cached label when the option is renamed and then leaves the list', async () => {
        const user = userEvent.setup();

        const Harness = () => {
            const [value, setValue] = useState<TComboboxValue | null>('nike');
            const [phase, setPhase] = useState<'initial' | 'renamed' | 'gone'>('initial');
            const useSuggest: IUseAutocompleteSuggest = () => {
                if (phase === 'gone') {
                    return { options: [], isLoading: false, hasMore: false };
                }

                if (phase === 'renamed') {
                    return { options: [{ value: 'nike', label: 'Nike Inc' }], isLoading: false, hasMore: false };
                }

                return { options: [{ value: 'nike', label: 'Nike' }], isLoading: false, hasMore: false };
            };

            return (
                <>
                    <AutocompleteAsync
                        aria-label="Brand"
                        useSuggest={useSuggest}
                        debounceMs={0}
                        value={value}
                        onChange={setValue}
                    />
                    <button type="button" onClick={() => setPhase('renamed')}>
                        Rename
                    </button>
                    <button type="button" onClick={() => setPhase('gone')}>
                        Drop
                    </button>
                </>
            );
        };

        render(
            <AdminUiProvider>
                <Harness />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        await waitFor(() => {
            expect(input).toHaveValue('Nike');
        });

        await user.click(screen.getByRole('button', { name: 'Rename' }));

        await waitFor(() => {
            expect(input).toHaveValue('Nike Inc');
        });

        await user.click(screen.getByRole('button', { name: 'Drop' }));

        expect(input).toHaveValue('Nike Inc');
        expect(screen.queryByRole('option', { name: 'Nike' })).not.toBeInTheDocument();
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

    it('keeps the selected value while backspacing and restores the label on Tab', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onBlur = vi.fn();

        const Harness = () => {
            const [value, setValue] = useState<TComboboxValue | null>('nike');

            return (
                <>
                    <AutocompleteAsync
                        aria-label="Brand"
                        useSuggest={useStaticSuggest}
                        debounceMs={0}
                        value={value}
                        onBlur={onBlur}
                        onChange={next => {
                            onChange(next);
                            setValue(next);
                        }}
                    />
                    <button type="button">Next</button>
                </>
            );
        };

        render(
            <AdminUiProvider>
                <Harness />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        await waitFor(() => {
            expect(input).toHaveValue('Nike');
        });

        await backspaceToEmpty(user, input);

        expect(onChange).not.toHaveBeenCalled();
        expect(await screen.findByRole('option', { name: 'Adidas' })).toBeInTheDocument();

        await user.keyboard('{ArrowDown}');
        await user.tab();

        expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
        expect(input).toHaveValue('Nike');
        expect(onChange).not.toHaveBeenCalled();
        expect(onBlur).toHaveBeenCalled();
    });

    it('restores the label on Escape without changing the value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const Harness = () => {
            const [value, setValue] = useState<TComboboxValue | null>('nike');

            return (
                <AutocompleteAsync
                    aria-label="Brand"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    value={value}
                    onChange={next => {
                        onChange(next);
                        setValue(next);
                    }}
                />
            );
        };

        render(
            <AdminUiProvider>
                <Harness />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        await waitFor(() => {
            expect(input).toHaveValue('Nike');
        });

        await backspaceToEmpty(user, input);

        expect(await screen.findByRole('option', { name: 'Adidas' })).toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();

        await user.keyboard('{Escape}');

        expect(input).toHaveFocus();
        expect(input).toHaveValue('Nike');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('commits another option from the empty input', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const Harness = () => {
            const [value, setValue] = useState<TComboboxValue | null>('nike');

            return (
                <AutocompleteAsync
                    aria-label="Brand"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    value={value}
                    onChange={next => {
                        onChange(next);
                        setValue(next);
                    }}
                />
            );
        };

        render(
            <AdminUiProvider>
                <Harness />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        await waitFor(() => {
            expect(input).toHaveValue('Nike');
        });

        await backspaceToEmpty(user, input);

        await user.click(await screen.findByRole('option', { name: 'Adidas' }));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('adidas');
        expect(input).toHaveValue('Adidas');
    });

    it('ignores controlled value with no matching option', async () => {
        render(
            <AdminUiProvider>
                <AutocompleteAsync
                    aria-label="Brand"
                    useSuggest={() => ({ options: [], isLoading: false, hasMore: false })}
                    debounceMs={0}
                    value="missing"
                />
            </AdminUiProvider>
        );

        expect(screen.getByRole('combobox', { name: /Brand/ })).toHaveValue('');
    });

    it('waits for the default debounce before loading suggestions', async () => {
        vi.useFakeTimers();
        const queries: string[] = [];
        const useSuggest: IUseAutocompleteSuggest = ({ query, enabled }) => {
            if (enabled && query.length > 0) {
                queries.push(query);
            }

            return {
                options: query === 'Ni' ? [{ value: 'nike', label: 'Nike' }] : [],
                isLoading: false,
                hasMore: false,
            };
        };

        render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useSuggest} />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        // userEvent hangs while fake timers own the debounce delay.
        fireEvent.change(input, { target: { value: 'Ni' } });

        expect(queries).not.toContain('Ni');

        await act(async () => {
            await vi.advanceTimersByTimeAsync(299);
        });
        expect(queries).not.toContain('Ni');

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1);
        });

        expect(queries).toContain('Ni');
        vi.useRealTimers();
    });

    it('commits a suggestion with the keyboard', async () => {
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
        await screen.findByRole('option', { name: 'Nike' });
        await user.keyboard('{ArrowDown}{Enter}');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('nike');
        expect(input).toHaveValue('Nike');
    });

    it('shows an error status when suggest fails', async () => {
        const user = userEvent.setup();
        const useError: IUseAutocompleteSuggest = () => ({
            options: [],
            isLoading: false,
            isError: true,
            hasMore: false,
        });

        render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useError} debounceMs={0} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));

        expect(await screen.findByRole('status')).toHaveTextContent('Не удалось загрузить подсказки');
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
                <AutocompleteAsync aria-label="Brand" useSuggest={useStaleSuggest} debounceMs={0} />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        await user.click(input);
        await user.type(input, 'Ni');
        expect(await screen.findByRole('option', { name: 'Nike' })).toBeInTheDocument();

        await user.type(input, 'z');

        expect(await screen.findByRole('status', { name: 'Загрузка подсказок' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Nike' })).not.toBeInTheDocument();
    });

    it('does not load suggestions when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <AutocompleteAsync
                    aria-label="Brand"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    disabled
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        const input = screen.getByRole('combobox', { name: /Brand/ });

        expect(input).toBeDisabled();
        await user.click(input);

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.queryByRole('option', { name: 'Nike' })).not.toBeInTheDocument();
    });

    it('has no axe violations in the default and disabled states', async () => {
        const { container, unmount } = render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useStaticSuggest} debounceMs={0} />
            </AdminUiProvider>
        );
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(
            <AdminUiProvider>
                <AutocompleteAsync aria-label="Brand" useSuggest={useStaticSuggest} debounceMs={0} disabled />
            </AdminUiProvider>
        );
        expect(await axe(disabled.container)).toHaveNoViolations();
    });
});
