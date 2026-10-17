import { type ReactElement, createRef } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import triggerStyles from '@/combobox/components/MultiTrigger/styles.module.css';
import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { MultiAutocomplete } from '..';

import styles from '../styles.module.css';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
    { value: 'new', label: 'новый' },
    { value: 'blocked', label: 'скрытый', disabled: true },
];

const renderMulti = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('MultiAutocomplete', () => {
    it('renders combobox', () => {
        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} />);

        expect(screen.getByRole('combobox', { name: /Tags/ })).toBeInTheDocument();
    });

    it('applies block class by default', () => {
        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} dataTestId="tags" />);

        expect(screen.getByTestId('tags')).toHaveClass(styles.block);
    });

    it('selects multiple options', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} onChange={onChange} />);

        const input = screen.getByRole('combobox', { name: /Tags/ });

        expect(input).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));
        await user.click(await screen.findByRole('option', { name: 'vip' }));
        await user.click(screen.getByRole('option', { name: 'новый' }));

        expect(onChange).toHaveBeenLastCalledWith(expect.arrayContaining(['vip', 'new']));
    });

    it('clears selection', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <MultiAutocomplete aria-label="Tags" options={OPTIONS} value={['vip']} clear onChange={onChange} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('removes one tag', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderMulti(
            <MultiAutocomplete aria-label="Tags" options={OPTIONS} value={['vip', 'new']} onChange={onChange} />
        );

        const removeButtons = screen.getAllByRole('button').filter(btn => btn.getAttribute('slot') === 'remove');

        expect(removeButtons.length).toBeGreaterThanOrEqual(1);
        await user.click(removeButtons[0]!);

        expect(onChange).toHaveBeenCalled();
        const next = onChange.mock.calls.at(-1)?.[0] as string[];

        expect(next).toHaveLength(1);
        expect(next).not.toContain('vip');
    });

    it('keeps the field open when focus stays inside', () => {
        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} value={['vip']} />);

        const input = screen.getByRole('combobox', { name: /Tags/ });
        const wrap = input.closest(`.${triggerStyles.triggerWrap}`);

        expect(wrap).not.toBeNull();

        fireEvent.blur(wrap!, { relatedTarget: input });

        expect(input).toBeInTheDocument();
    });

    it('shows selected tags from value and from defaultValue', () => {
        const onChange = vi.fn();
        const { rerender, unmount } = renderMulti(
            <MultiAutocomplete aria-label="Tags" options={OPTIONS} value={['vip', 'new']} onChange={onChange} />
        );

        expect(screen.getByRole('row', { name: 'vip' })).toBeInTheDocument();
        expect(screen.getByRole('row', { name: 'новый' })).toBeInTheDocument();

        rerender(
            <AdminUiProvider>
                <MultiAutocomplete aria-label="Tags" options={OPTIONS} value={['new']} onChange={onChange} />
            </AdminUiProvider>
        );

        expect(screen.queryByRole('row', { name: 'vip' })).not.toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
        unmount();

        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} defaultValue={['vip']} />);

        expect(screen.getByRole('row', { name: 'vip' })).toBeInTheDocument();
    });

    it('does not select a disabled option', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: /предложени|Show suggestions|suggestions/i }));

        const blocked = await screen.findByRole('option', { name: 'скрытый' });

        expect(blocked).toHaveAttribute('aria-disabled', 'true');

        await user.click(blocked);
        expect(onChange).not.toHaveBeenCalled();

        await user.click(screen.getByRole('option', { name: 'vip' }));
        expect(onChange).toHaveBeenCalledWith(['vip']);
    });

    it('commits with the keyboard and closes on Escape', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} onChange={onChange} />);

        const input = screen.getByRole('combobox', { name: /Tags/ });

        await user.click(input);
        await user.keyboard('{ArrowDown}{Escape}');

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(input).toHaveFocus();
        });

        await user.keyboard('{ArrowDown}{Enter}');

        expect(onChange).toHaveBeenCalledWith(['vip']);
    });

    it('filters locally and keeps the full list when clientFilter is off', async () => {
        const user = userEvent.setup();
        const { unmount } = renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} />);

        const input = screen.getByRole('combobox', { name: /Tags/ });

        await user.click(input);
        await user.type(input, 'vip');

        expect(await screen.findByRole('option', { name: 'vip' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'новый' })).not.toBeInTheDocument();
        unmount();

        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} clientFilter={false} />);

        const open = screen.getByRole('combobox', { name: /Tags/ });

        await user.click(open);
        await user.type(open, 'zzz');

        expect(await screen.findByRole('option', { name: 'vip' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'новый' })).toBeInTheDocument();
    });

    it('calls onLoadMore when the sentinel is reached and shows the page loader', async () => {
        const user = userEvent.setup();
        const onLoadMore = vi.fn();

        vi.stubGlobal(
            'IntersectionObserver',
            class {
                constructor(private callback: IntersectionObserverCallback) {}

                observe() {
                    this.callback(
                        [{ isIntersecting: true } as IntersectionObserverEntry],
                        this as unknown as IntersectionObserver
                    );
                }

                unobserve() {
                    return undefined;
                }

                disconnect() {
                    return undefined;
                }

                takeRecords() {
                    return [];
                }
            }
        );

        renderMulti(
            <MultiAutocomplete
                aria-label="Tags"
                options={OPTIONS}
                clientFilter={false}
                hasMore
                onLoadMore={onLoadMore}
            />
        );

        await user.click(screen.getByRole('combobox', { name: /Tags/ }));
        await user.keyboard('{ArrowDown}');

        await waitFor(() => {
            expect(onLoadMore).toHaveBeenCalled();
        });
        expect(screen.getByRole('option', { name: 'vip' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Загрузка подсказок' })).not.toBeInTheDocument();

        renderMulti(
            <MultiAutocomplete
                aria-label="Tags"
                options={OPTIONS}
                clientFilter={false}
                hasMore
                isLoadingMore
                onLoadMore={() => undefined}
            />
        );

        const loadingInput = screen.getAllByRole('combobox', { name: /Tags/ }).at(-1)!;

        await user.click(loadingInput);
        await user.keyboard('{ArrowDown}');

        expect(await screen.findByRole('option', { name: 'Загрузка подсказок' })).toBeInTheDocument();
    });

    it('moves to the previous option with ArrowUp', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} onChange={onChange} />);

        const input = screen.getByRole('combobox', { name: /Tags/ });

        await user.click(input);
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{Enter}');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(['vip']);
    });

    it('assigns object ref', () => {
        const ref = createRef<HTMLDivElement>();

        renderMulti(<MultiAutocomplete ref={ref} aria-label="Tags" options={OPTIONS} />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} disabled />);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = renderMulti(<MultiAutocomplete aria-label="Tags" options={OPTIONS} invalid />);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
