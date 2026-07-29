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
}: {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    dataTestId?: string;
}) => (
    <Tabs value={value} defaultValue={defaultValue} onChange={onChange} size={size} dataTestId={dataTestId}>
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

    it('throws when List is used outside Tabs', () => {
        expect(() => render(<Tabs.List>{null}</Tabs.List>)).toThrow(
            'This component must be used within a <Tabs> component'
        );
    });
});
