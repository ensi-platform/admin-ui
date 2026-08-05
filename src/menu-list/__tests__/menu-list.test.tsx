import { type ReactElement, type SVGProps } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { MenuList } from '..';

import itemStyles from '../components/Item/styles.module.css';
import rootStyles from '../styles.module.css';

const BagIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg data-test-id="bag-icon" viewBox="0 0 16 16" {...props}>
        <path d="M2 2h12v12H2z" />
    </svg>
);

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

const BasicList = ({
    value,
    defaultValue = 'orders',
    onChange,
    size = 'md',
    collapsed,
    dataTestId,
}: {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    collapsed?: boolean;
    dataTestId?: string;
}) => (
    <MenuList
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        size={size}
        collapsed={collapsed}
        dataTestId={dataTestId}
    >
        <MenuList.Group label="SALES">
            <MenuList.Item id="orders" href="/orders" icon={BagIcon}>
                Orders
            </MenuList.Item>
            <MenuList.Item id="clients" href="/clients" icon={BagIcon}>
                Clients
            </MenuList.Item>
        </MenuList.Group>
        <MenuList.Group label="SETTINGS">
            <MenuList.Item id="settings" href="/settings" disabled>
                Settings
            </MenuList.Item>
        </MenuList.Group>
    </MenuList>
);

describe('MenuList', () => {
    it('renders groups and items', () => {
        renderWithProvider(<BasicList />);

        expect(screen.getByText('SALES')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Orders/ })).toBeInTheDocument();
    });

    it('marks the active leaf', () => {
        renderWithProvider(<BasicList value="orders" />);

        const orders = screen.getByRole('link', { name: /Orders/ });
        expect(orders).toHaveAttribute('data-active', 'true');
        expect(orders).toHaveClass(itemStyles.active);
    });

    it('calls onChange when a leaf is activated', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<BasicList value="orders" onChange={onChange} />);

        await user.click(screen.getByRole('link', { name: /Clients/ }));

        expect(onChange).toHaveBeenCalledWith('clients');
    });

    it('does not activate a disabled item', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<BasicList value="orders" onChange={onChange} />);

        await user.click(screen.getByRole('link', { name: /Settings/ }));

        expect(onChange).not.toHaveBeenCalled();
    });

    it('hides group labels when collapsed', () => {
        renderWithProvider(<BasicList collapsed dataTestId="list" />);

        expect(screen.queryByText('SALES')).not.toBeInTheDocument();
        expect(screen.getByTestId('list')).toHaveClass(rootStyles.collapsed);
        expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument();
    });

    it('shows tooltip for collapsed leaf but not for folder', async () => {
        const user = userEvent.setup();

        renderWithProvider(
            <MenuList collapsed>
                <MenuList.Item id="orders" href="/orders" icon={BagIcon}>
                    Orders
                </MenuList.Item>
                <MenuList.Item id="products" hasChildren icon={BagIcon}>
                    Products
                </MenuList.Item>
            </MenuList>
        );

        await user.hover(screen.getByRole('button', { name: 'Products' }));
        await expect(screen.findByRole('tooltip', {}, { timeout: 500 })).rejects.toThrow();

        await user.hover(screen.getByRole('link', { name: 'Orders' }));
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Orders');
    });

    it('throws when Group is used outside MenuList', () => {
        expect(() =>
            render(
                <MenuList.Group label="X">
                    <MenuList.Item id="a">A</MenuList.Item>
                </MenuList.Group>
            )
        ).toThrow('This component must be used within a <MenuList> component');
    });

    it('marks open folder and shows chevron without activating leaf', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(
            <MenuList value="orders" onChange={onChange}>
                <MenuList.Item id="products" hasChildren open>
                    Products
                </MenuList.Item>
            </MenuList>
        );

        const folder = screen.getByRole('button', { name: /Products/ });
        expect(folder).toHaveAttribute('data-open', 'true');
        expect(folder).toHaveClass(itemStyles.open);
        expect(folder.querySelector('svg')).toBeTruthy();

        await user.click(folder);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('renders trailing outside the control when expanded', () => {
        renderWithProvider(
            <MenuList value="orders">
                <MenuList.Item id="orders" href="/orders" trailing={<span data-test-id="badge">3</span>}>
                    Orders
                </MenuList.Item>
                <MenuList.Item id="products" hasChildren open trailing={<span data-test-id="folder-badge">1</span>}>
                    Products
                </MenuList.Item>
                <MenuList.Item
                    id="settings"
                    href="/settings"
                    disabled
                    trailing={<span data-test-id="disabled-badge">0</span>}
                >
                    Settings
                </MenuList.Item>
            </MenuList>
        );

        const row = screen.getByTestId('badge').closest('[data-menu-list-item]');
        expect(row).toHaveClass(itemStyles.row, itemStyles.active);

        expect(screen.getByTestId('folder-badge').closest('[data-menu-list-item]')).toHaveClass(itemStyles.open);
        expect(screen.getByTestId('disabled-badge').closest('[data-menu-list-item]')).toHaveClass(
            itemStyles.rowDisabled
        );

        const control = screen.getByRole('link', { name: /Orders/ });
        expect(control).toHaveClass(itemStyles.rowControl);
        expect(control).not.toHaveAttribute('data-menu-list-item');
    });

    it('hides trailing when collapsed', () => {
        renderWithProvider(
            <MenuList collapsed>
                <MenuList.Item id="orders" href="/orders" trailing={<span data-test-id="badge">3</span>}>
                    Orders
                </MenuList.Item>
            </MenuList>
        );

        expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
    });

    it('does not show tooltip for collapsed leaf with non-string children', async () => {
        const user = userEvent.setup();

        renderWithProvider(
            <MenuList collapsed>
                <MenuList.Item id="orders" href="/orders" dataTestId="orders" icon={BagIcon}>
                    <span>Orders</span>
                </MenuList.Item>
            </MenuList>
        );

        await user.hover(screen.getByTestId('orders'));
        await expect(screen.findByRole('tooltip', {}, { timeout: 500 })).rejects.toThrow();
    });
});
