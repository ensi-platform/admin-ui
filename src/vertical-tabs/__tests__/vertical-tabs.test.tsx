import { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { VerticalTabs } from '..';

import itemStyles from '../components/Item/styles.module.css';
import listStyles from '../components/List/styles.module.css';
import rootStyles from '../styles.module.css';

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

const BasicTabs = ({
    value,
    defaultValue = 'person',
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
    <VerticalTabs value={value} defaultValue={defaultValue} onChange={onChange} size={size} dataTestId={dataTestId}>
        <VerticalTabs.List>
            <VerticalTabs.Item id="person">Person</VerticalTabs.Item>
            <VerticalTabs.Item id="signin">Sign in</VerticalTabs.Item>
            <VerticalTabs.Item id="roles" disabled>
                Roles
            </VerticalTabs.Item>
        </VerticalTabs.List>
        <VerticalTabs.Panels>
            <VerticalTabs.Panel id="person">Person fields</VerticalTabs.Panel>
            <VerticalTabs.Panel id="signin">Sign-in fields</VerticalTabs.Panel>
            <VerticalTabs.Panel id="roles">Role fields</VerticalTabs.Panel>
        </VerticalTabs.Panels>
    </VerticalTabs>
);

describe('VerticalTabs', () => {
    it('renders a vertical list and the selected panel', () => {
        renderWithProvider(<BasicTabs dataTestId="vertical-tabs" />);

        expect(screen.getByTestId('vertical-tabs')).toHaveAttribute('data-orientation', 'vertical');
        expect(screen.getByTestId('vertical-tabs')).toHaveClass(rootStyles.md);
        expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
        expect(screen.getByRole('tablist')).toHaveClass(listStyles.md);
        expect(screen.getByRole('tab', { name: 'Person' })).toHaveClass(itemStyles.md);
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Person fields');
    });

    it('calls onChange and keeps a disabled item unselected', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<BasicTabs value="person" onChange={onChange} />);

        await user.click(screen.getByRole('tab', { name: 'Sign in' }));
        expect(onChange).toHaveBeenCalledWith('signin');

        await user.click(screen.getByRole('tab', { name: 'Roles' }));
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('tab', { name: 'Roles' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies the size class', () => {
        renderWithProvider(<BasicTabs size="sm" dataTestId="vertical-tabs" />);

        expect(screen.getByTestId('vertical-tabs')).toHaveClass(rootStyles.sm);
        expect(screen.getByRole('tablist')).toHaveClass(listStyles.sm);
        expect(screen.getByRole('tab', { name: 'Person' })).toHaveClass(itemStyles.sm);
    });

    it('moves with ArrowDown and skips a disabled item', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<BasicTabs onChange={onChange} />);

        screen.getByRole('tab', { name: 'Person' }).focus();
        await user.keyboard('{ArrowDown}');

        expect(onChange).toHaveBeenLastCalledWith('signin');
        expect(screen.getByRole('tab', { name: 'Sign in' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Sign-in fields');

        await user.keyboard('{ArrowDown}');

        expect(screen.getByRole('tab', { name: 'Roles' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('tab', { name: 'Person' })).toHaveAttribute('aria-selected', 'true');
        expect(onChange).toHaveBeenLastCalledWith('person');

        await user.keyboard('{End}');
        expect(screen.getByRole('tab', { name: 'Sign in' })).toHaveAttribute('aria-selected', 'true');

        await user.keyboard('{Home}');
        expect(screen.getByRole('tab', { name: 'Person' })).toHaveAttribute('aria-selected', 'true');

        await user.keyboard('{ArrowDown}');
        await user.keyboard('{ArrowUp}');
        expect(screen.getByRole('tab', { name: 'Person' })).toHaveAttribute('aria-selected', 'true');
    });

    it('follows the value prop and does not call onChange for it', () => {
        const onChange = vi.fn();
        const { rerender } = renderWithProvider(<BasicTabs value="person" onChange={onChange} />);

        rerender(<BasicTabs value="signin" onChange={onChange} />);

        expect(screen.getByRole('tab', { name: 'Sign in' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Sign-in fields');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('throws when List is used outside VerticalTabs', () => {
        expect(() => render(<VerticalTabs.List>{null}</VerticalTabs.List>)).toThrow(
            'This component must be used within a <VerticalTabs> component'
        );
    });
});
