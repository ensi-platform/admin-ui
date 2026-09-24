import { type ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { ActiveFilters } from '..';

const renderFilters = (ui: ReactNode) =>
    render(<AdminUiProvider labels={{ clear: 'Remove', clearFilters: 'Clear all' }}>{ui}</AdminUiProvider>);

describe('ActiveFilters', () => {
    it('renders nothing when there are no chips', () => {
        renderFilters(<ActiveFilters onClear={vi.fn()} dataTestId="applied" />);

        expect(screen.queryByTestId('applied')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
    });

    it('renders chips and clears them all', async () => {
        const user = userEvent.setup();
        const onClear = vi.fn();
        const onRemove = vi.fn();

        renderFilters(
            <ActiveFilters onClear={onClear} dataTestId="applied">
                <ActiveFilters.Item onRemove={onRemove}>Name: milk</ActiveFilters.Item>
            </ActiveFilters>
        );

        expect(screen.getByTestId('applied')).toBeInTheDocument();
        expect(screen.getByText('Name: milk')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Remove' }));
        expect(onRemove).toHaveBeenCalledOnce();

        await user.click(screen.getByRole('button', { name: 'Clear all' }));
        expect(onClear).toHaveBeenCalledOnce();
    });

    it('renders a chip without a remove control', () => {
        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Item>Name: milk</ActiveFilters.Item>
            </ActiveFilters>
        );

        expect(screen.getByText('Name: milk')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
    });

    it('opens the grouped chip with the filter list', async () => {
        const user = userEvent.setup();

        renderFilters(
            <ActiveFilters onClear={vi.fn()}>
                <ActiveFilters.Group label="Categories" count={5} dataTestId="categories">
                    <span>Meat</span>
                </ActiveFilters.Group>
            </ActiveFilters>
        );

        await user.click(screen.getByRole('button', { name: 'Categories: 5' }));

        expect(screen.getByTestId('categories')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toHaveTextContent('Meat');
        expect(screen.getByRole('dialog').parentElement).toHaveAttribute('data-scroll', 'auto');
    });

    it('sizes the drop to the chip and ignores an outside click on a nested overlay', async () => {
        const user = userEvent.setup();
        const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => 160 });

        try {
            renderFilters(
                <ActiveFilters>
                    <ActiveFilters.Group label="Categories" count={5}>
                        <span>Meat</span>
                    </ActiveFilters.Group>
                </ActiveFilters>
            );

            await user.click(screen.getByRole('button', { name: 'Categories: 5' }));

            const dialog = screen.getByRole('dialog');

            expect(dialog.parentElement).toHaveStyle({ minWidth: '160px' });

            const nested = document.createElement('div');
            nested.setAttribute('role', 'listbox');
            document.body.append(nested);
            await user.click(nested);
            nested.remove();

            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await user.click(document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        } finally {
            if (width) {
                Object.defineProperty(HTMLElement.prototype, 'offsetWidth', width);
            }
        }
    });

    it('lets a virtual list own the drop scroll', async () => {
        const user = userEvent.setup();

        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Group label="Categories" count={5} scroll="virtual">
                    <span>Meat</span>
                </ActiveFilters.Group>
            </ActiveFilters>
        );

        await user.click(screen.getByRole('button', { name: 'Categories: 5' }));

        expect(screen.getByRole('dialog').parentElement).toHaveAttribute('data-scroll', 'virtual');
    });

    it('clears a group from its remove control', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Group label="Categories" count={5} onRemove={onRemove}>
                    <span>Meat</span>
                </ActiveFilters.Group>
            </ActiveFilters>
        );

        await user.click(screen.getByRole('button', { name: 'Remove' }));

        expect(onRemove).toHaveBeenCalledOnce();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
