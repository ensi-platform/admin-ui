import { type ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import tagStyles from '@/tag/styles.module.css';
import { axe } from '@/test/axe';

import { ActiveFilters } from '..';

const renderFilters = (ui: ReactNode) =>
    render(<AdminUiProvider labels={{ clear: 'Remove', clearFilters: 'Clear all' }}>{ui}</AdminUiProvider>);

describe('ActiveFilters', () => {
    it('renders nothing when there are no chips', () => {
        renderFilters(
            <ActiveFilters onClear={vi.fn()} dataTestId="applied">
                {null}
                {false}
            </ActiveFilters>
        );

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

        screen.getByRole('button', { name: 'Remove' }).focus();
        await user.keyboard('{Enter}');
        expect(onRemove).toHaveBeenCalledTimes(2);

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
        expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
    });

    it('removes a chip with Space', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Item onRemove={onRemove}>Name: milk</ActiveFilters.Item>
            </ActiveFilters>
        );

        screen.getByRole('button', { name: 'Remove' }).focus();
        await user.keyboard(' ');

        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('does not bubble the remove click and keeps focus on the previous control', async () => {
        const user = userEvent.setup();
        const onParentClick = vi.fn();
        const onParentPointerDown = vi.fn();

        renderFilters(
            <div onClick={onParentClick} onPointerDown={onParentPointerDown}>
                <button type="button">Trigger</button>
                <ActiveFilters>
                    <ActiveFilters.Item onRemove={vi.fn()}>Name: milk</ActiveFilters.Item>
                </ActiveFilters>
            </div>
        );

        const trigger = screen.getByRole('button', { name: 'Trigger' });

        trigger.focus();
        await user.pointer({ keys: '[MouseLeft>]', target: screen.getByRole('button', { name: 'Remove' }) });

        expect(onParentPointerDown).not.toHaveBeenCalled();
        expect(trigger).toHaveFocus();

        await user.click(screen.getByRole('button', { name: 'Remove' }));

        expect(onParentClick).not.toHaveBeenCalled();
    });

    it('does not remove a disabled chip and still removes an enabled one', async () => {
        const user = userEvent.setup();
        const onDisabled = vi.fn();
        const onEnabled = vi.fn();

        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Item disabled onRemove={onDisabled} dataTestId="locked">
                    Name: milk
                </ActiveFilters.Item>
                <ActiveFilters.Item onRemove={onEnabled}>Name: bread</ActiveFilters.Item>
            </ActiveFilters>
        );

        const [locked, enabled] = screen.getAllByRole('button', { name: 'Remove' });

        expect(screen.getByTestId('locked')).toHaveAttribute('data-disabled', 'true');
        expect(locked).toBeDisabled();
        expect(enabled).toBeEnabled();

        await user.click(locked);
        locked.focus();
        await user.keyboard('{Enter}');
        await user.keyboard(' ');

        expect(onDisabled).not.toHaveBeenCalled();

        await user.click(enabled);

        expect(onEnabled).toHaveBeenCalledTimes(1);
        expect(onDisabled).not.toHaveBeenCalled();
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

    it('shows a zero count on the group chip', () => {
        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Group label="Categories" count={0}>
                    <span>Meat</span>
                </ActiveFilters.Group>
            </ActiveFilters>
        );

        expect(screen.getByRole('button', { name: 'Categories: 0' })).toBeInTheDocument();
    });

    it('renders the chip as a md primary tag', () => {
        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Item>Name: milk</ActiveFilters.Item>
            </ActiveFilters>
        );

        expect(screen.getByText('Name: milk').parentElement).toHaveClass(tagStyles.md, tagStyles.primary);
    });

    it('opens the group with Space and closes it with Escape', async () => {
        const user = userEvent.setup();

        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Group label="Categories" count={5}>
                    <span>Meat</span>
                </ActiveFilters.Group>
            </ActiveFilters>
        );

        const trigger = screen.getByRole('button', { name: 'Categories: 5' });

        trigger.focus();
        await user.keyboard(' ');

        expect(screen.getByRole('dialog')).toHaveTextContent('Meat');
        expect(trigger).toHaveAttribute('data-open', 'true');

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await waitFor(() => expect(trigger).toHaveFocus());
        expect(trigger).not.toHaveAttribute('data-open');
    });

    it('removes a group from the keyboard without opening the list', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        renderFilters(
            <ActiveFilters>
                <ActiveFilters.Group label="Categories" count={5} onRemove={onRemove}>
                    <span>Meat</span>
                </ActiveFilters.Group>
            </ActiveFilters>
        );

        const remove = screen.getByRole('button', { name: 'Remove' });

        remove.focus();
        await user.keyboard('{Enter}');
        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        await user.keyboard(' ');
        expect(onRemove).toHaveBeenCalledTimes(2);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('points refs at the row, the chip, and the group trigger', () => {
        const rowRef = { current: null as HTMLDivElement | null };
        const chipRef = { current: null as HTMLSpanElement | null };
        const groupRef = { current: null as HTMLButtonElement | null };

        renderFilters(
            <ActiveFilters ref={rowRef} dataTestId="applied">
                <ActiveFilters.Item ref={chipRef} dataTestId="chip">
                    Name: milk
                </ActiveFilters.Item>
                <ActiveFilters.Group ref={groupRef} label="Categories" count={1} dataTestId="categories">
                    <span>Meat</span>
                </ActiveFilters.Group>
            </ActiveFilters>
        );

        expect(rowRef.current).toBe(screen.getByTestId('applied'));
        expect(chipRef.current).toBe(screen.getByTestId('chip'));
        expect(groupRef.current).toBe(screen.getByTestId('categories'));
        expect(groupRef.current).toBe(screen.getByRole('button', { name: 'Categories: 1' }));
    });

    it('has no axe violations in the default and disabled states', async () => {
        const { container, unmount } = render(
            <ActiveFilters onClear={() => undefined}>
                <ActiveFilters.Item onRemove={() => undefined}>Name: milk</ActiveFilters.Item>
                <ActiveFilters.Group label="Categories" count={5}>
                    <span>Meat</span>
                </ActiveFilters.Group>
            </ActiveFilters>
        );

        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(
            <ActiveFilters>
                <ActiveFilters.Item disabled onRemove={() => undefined}>
                    Name: milk
                </ActiveFilters.Item>
            </ActiveFilters>
        );

        expect(await axe(disabled.container)).toHaveNoViolations();
    });
});
