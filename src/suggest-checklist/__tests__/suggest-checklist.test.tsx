import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type IUseAutocompleteSuggest } from '@/autocomplete-async/types';
import { AdminUiProvider } from '@/provider';

import { SuggestChecklist } from '..';

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

const useLoadingSuggest: IUseAutocompleteSuggest = () => ({
    options: [],
    isLoading: true,
    hasMore: false,
});

describe('SuggestChecklist', () => {
    it('shows a suggestion checkbox and reports the selected value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <SuggestChecklist
                    aria-label="Brands"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        await user.type(screen.getByRole('textbox', { name: 'Brands' }), 'Ni');

        const nike = await screen.findByRole('checkbox', { name: 'Nike' });
        expect(screen.queryByRole('checkbox', { name: 'Adidas' })).not.toBeInTheDocument();

        await user.click(nike);

        expect(onChange).toHaveBeenCalledWith(['nike']);
    });

    it('shows the loading status while suggest is in flight', async () => {
        render(
            <AdminUiProvider>
                <SuggestChecklist aria-label="Brands" useSuggest={useLoadingSuggest} debounceMs={0} />
            </AdminUiProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('status', { name: 'Loading suggestions' })).toBeInTheDocument();
        });
    });

    it('keeps a selected option pinned after it leaves the page', async () => {
        const user = userEvent.setup();
        const useSuggest: IUseAutocompleteSuggest = ({ query }) => ({
            options: query === 'zz' ? [] : OPTIONS,
            isLoading: false,
            hasMore: false,
        });

        render(
            <AdminUiProvider>
                <SuggestChecklist aria-label="Brands" useSuggest={useSuggest} debounceMs={0} value={['nike']} />
            </AdminUiProvider>
        );

        expect(await screen.findByRole('checkbox', { name: 'Nike' })).toBeInTheDocument();

        await user.type(screen.getByRole('textbox', { name: 'Brands' }), 'zz');

        expect(await screen.findByRole('checkbox', { name: 'Nike' })).toBeInTheDocument();
    });

    it('unchecks a controlled value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider>
                <SuggestChecklist
                    aria-label="Brands"
                    useSuggest={useStaticSuggest}
                    debounceMs={0}
                    value={['nike']}
                    onChange={onChange}
                />
            </AdminUiProvider>
        );

        await user.click(await screen.findByRole('checkbox', { name: 'Nike' }));

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('shows the next-page loader', async () => {
        const usePaged: IUseAutocompleteSuggest = ({ page }) =>
            page > 0
                ? { options: [], isLoading: true, hasMore: true }
                : { options: OPTIONS, isLoading: false, hasMore: true };

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

        render(
            <AdminUiProvider>
                <SuggestChecklist aria-label="Brands" useSuggest={usePaged} debounceMs={0} />
            </AdminUiProvider>
        );

        expect(await screen.findByRole('checkbox', { name: 'Nike' })).toBeInTheDocument();
        expect(await screen.findByText('Loading suggestions')).toBeInTheDocument();
    });

    it('shows an error when suggest fails', async () => {
        const useError: IUseAutocompleteSuggest = () => ({
            options: [],
            isLoading: false,
            isError: true,
            hasMore: false,
        });

        render(
            <AdminUiProvider>
                <SuggestChecklist aria-label="Brands" useSuggest={useError} debounceMs={0} />
            </AdminUiProvider>
        );

        expect(await screen.findByRole('status')).toHaveTextContent('Failed to load suggestions');
    });

    it('omits a selected value that was never loaded', async () => {
        render(
            <AdminUiProvider>
                <SuggestChecklist aria-label="Brands" useSuggest={useStaticSuggest} debounceMs={0} value={['ghost']} />
            </AdminUiProvider>
        );

        expect(await screen.findByRole('checkbox', { name: 'Nike' })).toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: 'ghost' })).not.toBeInTheDocument();
    });
});
