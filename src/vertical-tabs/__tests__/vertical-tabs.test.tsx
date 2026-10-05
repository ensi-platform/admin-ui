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

    it('throws when List is used outside VerticalTabs', () => {
        expect(() => render(<VerticalTabs.List>{null}</VerticalTabs.List>)).toThrow(
            'This component must be used within a <VerticalTabs> component'
        );
    });
});
