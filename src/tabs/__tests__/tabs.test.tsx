import { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Tabs } from '..';

import listStyles from '../components/List/styles.module.css';
import tabStyles from '../components/Tab/styles.module.css';
import rootStyles from '../styles.module.css';

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

const BasicTabs = ({
    value,
    defaultValue = 'a',
    onChange,
    size = 'md',
    dataTestId,
    keyboardActivation,
}: {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    dataTestId?: string;
    keyboardActivation?: 'automatic' | 'manual';
}) => (
    <Tabs
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        size={size}
        dataTestId={dataTestId}
        keyboardActivation={keyboardActivation}
    >
        <Tabs.List>
            <Tabs.Tab id="a">Общее</Tabs.Tab>
            <Tabs.Tab id="b">Товары</Tabs.Tab>
            <Tabs.Tab id="c" disabled>
                История
            </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="a">Панель A</Tabs.Panel>
        <Tabs.Panel id="b">Панель B</Tabs.Panel>
        <Tabs.Panel id="c">Панель C</Tabs.Panel>
    </Tabs>
);

describe('Tabs', () => {
    it('renders tabs and the selected panel', () => {
        renderWithProvider(<BasicTabs />);

        expect(screen.getByRole('tab', { name: 'Общее' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Товары' })).toBeInTheDocument();
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Панель A');
    });

    it('sets data-test-id from dataTestId', () => {
        renderWithProvider(<BasicTabs dataTestId="page-tabs" />);

        expect(screen.getByTestId('page-tabs')).toBeInTheDocument();
    });

    it('calls onChange and switches panel when a tab is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<BasicTabs value="a" onChange={onChange} />);

        await user.click(screen.getByRole('tab', { name: 'Товары' }));

        expect(onChange).toHaveBeenCalledWith('b');
    });

    it('does not select a disabled tab', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<BasicTabs value="a" onChange={onChange} />);

        await user.click(screen.getByRole('tab', { name: 'История' }));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('tab', { name: 'История' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Панель A');
    });

    it('applies size classes to root, list, and tab', () => {
        const { container } = renderWithProvider(<BasicTabs size="sm" dataTestId="sized-tabs" />);

        expect(screen.getByTestId('sized-tabs')).toHaveClass(rootStyles.sm);
        expect(container.querySelector('[role="tablist"]')).toHaveClass(listStyles.sm);
        expect(screen.getByRole('tab', { name: 'Общее' })).toHaveClass(tabStyles.sm);
    });

    it('moves with ArrowRight, skips a disabled tab, and jumps with Home and End', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<BasicTabs onChange={onChange} />);

        const first = screen.getByRole('tab', { name: 'Общее' });

        first.focus();
        await user.keyboard('{ArrowRight}');

        expect(onChange).toHaveBeenLastCalledWith('b');
        expect(screen.getByRole('tab', { name: 'Товары' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Панель B');

        await user.keyboard('{ArrowRight}');

        expect(screen.getByRole('tab', { name: 'История' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('tab', { name: 'Общее' })).toHaveAttribute('aria-selected', 'true');
        expect(onChange).toHaveBeenLastCalledWith('a');

        await user.keyboard('{End}');

        expect(screen.getByRole('tab', { name: 'Товары' })).toHaveAttribute('aria-selected', 'true');

        await user.keyboard('{Home}');

        expect(screen.getByRole('tab', { name: 'Общее' })).toHaveAttribute('aria-selected', 'true');

        await user.keyboard('{ArrowRight}');
        await user.keyboard('{ArrowLeft}');

        expect(screen.getByRole('tab', { name: 'Общее' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Панель A');
    });

    it('selects a tab with Enter when activation is manual', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<BasicTabs keyboardActivation="manual" onChange={onChange} />);

        screen.getByRole('tab', { name: 'Общее' }).focus();
        await user.keyboard('{ArrowRight}');

        expect(screen.getByRole('tab', { name: 'Товары' })).toHaveFocus();
        expect(screen.getByRole('tab', { name: 'Общее' })).toHaveAttribute('aria-selected', 'true');

        await user.keyboard('{Enter}');

        expect(onChange).toHaveBeenLastCalledWith('b');
    });

    it('follows the value prop and does not call onChange for it', () => {
        const onChange = vi.fn();
        const { rerender } = renderWithProvider(<BasicTabs value="a" onChange={onChange} />);

        rerender(<BasicTabs value="b" onChange={onChange} />);

        expect(screen.getByRole('tab', { name: 'Товары' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Панель B');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('throws when List is used outside Tabs', () => {
        expect(() => render(<Tabs.List>{null}</Tabs.List>)).toThrow(
            'This component must be used within a <Tabs> component'
        );
    });
});
