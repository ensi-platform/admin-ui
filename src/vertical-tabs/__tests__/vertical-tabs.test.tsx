import { createRef, type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

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

    it('keeps the panel when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        renderWithProvider(<BasicTabs value="person" onChange={vi.fn()} />);

        await user.click(screen.getByRole('tab', { name: 'Sign in' }));

        expect(screen.getByRole('tab', { name: 'Person' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Person fields');
    });

    it('does not select an item when the group is disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(
            <VerticalTabs value="person" onChange={onChange} disabled>
                <VerticalTabs.List>
                    <VerticalTabs.Item id="person">Person</VerticalTabs.Item>
                    <VerticalTabs.Item id="signin">Sign in</VerticalTabs.Item>
                </VerticalTabs.List>
                <VerticalTabs.Panels>
                    <VerticalTabs.Panel id="person">Person fields</VerticalTabs.Panel>
                    <VerticalTabs.Panel id="signin">Sign-in fields</VerticalTabs.Panel>
                </VerticalTabs.Panels>
            </VerticalTabs>
        );

        await user.click(screen.getByRole('tab', { name: 'Sign in' }));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('tab', { name: 'Sign in' })).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Person fields');
    });

    it('applies the primary variant class', () => {
        renderWithProvider(<BasicTabs dataTestId="vertical-tabs" />);

        expect(screen.getByTestId('vertical-tabs')).toHaveClass(rootStyles.primary);
        expect(screen.getByRole('tab', { name: 'Person' })).toHaveClass(itemStyles.primary);
    });

    it('puts data-test-id on the list and the item', () => {
        renderWithProvider(
            <VerticalTabs defaultValue="person">
                <VerticalTabs.List dataTestId="v-list">
                    <VerticalTabs.Item id="person" dataTestId="v-item">
                        Person
                    </VerticalTabs.Item>
                </VerticalTabs.List>
                <VerticalTabs.Panels dataTestId="v-panels">
                    <VerticalTabs.Panel id="person" dataTestId="v-panel">
                        Person fields
                    </VerticalTabs.Panel>
                </VerticalTabs.Panels>
            </VerticalTabs>
        );

        expect(screen.getByTestId('v-list')).toHaveAttribute('role', 'tablist');
        expect(screen.getByTestId('v-item')).toHaveAttribute('role', 'tab');
        expect(screen.getByTestId('v-panel')).toHaveAttribute('role', 'tabpanel');
        expect(screen.getByTestId('v-panels')).toContainElement(screen.getByTestId('v-panel'));
    });

    it('points ref at the root', () => {
        const ref = createRef<HTMLDivElement>();

        renderWithProvider(
            <VerticalTabs ref={ref} defaultValue="person" dataTestId="vertical-tabs">
                <VerticalTabs.List>
                    <VerticalTabs.Item id="person">Person</VerticalTabs.Item>
                </VerticalTabs.List>
                <VerticalTabs.Panels>
                    <VerticalTabs.Panel id="person">Person fields</VerticalTabs.Panel>
                </VerticalTabs.Panels>
            </VerticalTabs>
        );

        expect(ref.current).toBe(screen.getByTestId('vertical-tabs'));
    });

    it('has no axe violations in the default and disabled states', async () => {
        const enabled = renderWithProvider(<BasicTabs />);

        expect(await axe(enabled.container)).toHaveNoViolations();

        enabled.unmount();

        const disabled = renderWithProvider(
            <VerticalTabs defaultValue="person" disabled>
                <VerticalTabs.List>
                    <VerticalTabs.Item id="person">Person</VerticalTabs.Item>
                </VerticalTabs.List>
                <VerticalTabs.Panels>
                    <VerticalTabs.Panel id="person">Person fields</VerticalTabs.Panel>
                </VerticalTabs.Panels>
            </VerticalTabs>
        );

        expect(await axe(disabled.container)).toHaveNoViolations();
    });
});
