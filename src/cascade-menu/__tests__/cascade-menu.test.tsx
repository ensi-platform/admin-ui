import { type ReactElement } from 'react';

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Cart, LogoEnsi, Package } from '@/icons';
import { AdminUiProvider } from '@/provider';

import { CascadeMenu } from '..';
import { COLLAPSED_STORAGE_PREFIX, WIDTH_STORAGE_PREFIX } from '../hooks/useCascadeMenuChrome';
import { HOVER_DELAY_MS, LEAVE_CLOSE_MS } from '../hooks/useHoverMenu';
import { type ICascadeMenuItem } from '../utils';

const items: ICascadeMenuItem[] = [
    {
        text: 'Products',
        code: 'products',
        icon: Package,
        children: [
            { text: 'Catalog', code: 'products_catalog', link: '/products/catalog' },
            { text: 'Import', code: 'products_import', link: '/products/import' },
            {
                text: 'Directories',
                code: 'products_directories',
                children: [
                    { text: 'Attributes', code: 'products_attributes', link: '/products/attributes' },
                    { text: 'Statuses', code: 'products_statuses', link: '/products/statuses' },
                ],
            },
        ],
    },
    {
        text: 'Orders',
        code: 'orders',
        icon: Cart,
        children: [{ text: 'List', code: 'orders_list', link: '/orders/list' }],
    },
];

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

const mockItemRect = (el: HTMLElement, top: number, right: number, height = 40) => {
    el.getBoundingClientRect = () =>
        ({
            top,
            right,
            left: right - 120,
            bottom: top + height,
            width: 120,
            height,
            x: right - 120,
            y: top,
            toJSON: () => ({}),
        }) as DOMRect;
};

describe('CascadeMenu', () => {
    beforeEach(() => {
        const store = new Map<string, string>();

        vi.stubGlobal('localStorage', {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => {
                store.set(key, value);
            },
            removeItem: (key: string) => {
                store.delete(key);
            },
            clear: () => store.clear(),
            key: () => null,
            length: 0,
        });
    });

    it('renders L0 folders, header, and footer', () => {
        renderWithProvider(
            <CascadeMenu
                header={
                    <div>
                        <LogoEnsi data-test-id="logo" />
                        <span>Opensource</span>
                    </div>
                }
                items={items}
                dataTestId="cascade"
                footer={<div>Alex S.</div>}
            />
        );

        expect(screen.getByTestId('cascade')).toBeInTheDocument();
        expect(screen.getByText('Opensource')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Products/ })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Catalog/ })).not.toBeInTheDocument();
        expect(screen.getByText('Alex S.')).toBeInTheDocument();
    });

    it('opens flyout full-height flush to L0 column edge', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const root = screen.getByTestId('cascade');
        mockItemRect(root, 48, 280, 640);
        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const flyout = screen.getByTestId('cascade-col-1');
        expect(flyout).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Catalog/ })).toBeInTheDocument();
        expect(products).toHaveAttribute('data-open', 'true');
        expect(flyout.style.top).toBe('48px');
        expect(flyout.style.height).toBe('640px');
        expect(flyout.style.left).toBe('280px');
        expect(flyout.style.width).toBe('280px');
    });

    it('shows open parent text in flyout header', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const header = screen.getByTestId('cascade-col-1-header');
        expect(header).toHaveTextContent('Products');

        const directories = screen.getByRole('button', { name: /Directories/ });
        mockItemRect(directories, 140, 500);
        fireEvent.mouseEnter(directories);

        expect(screen.getByTestId('cascade-col-2-header')).toHaveTextContent('Directories');
    });

    it('activates leaf, calls onChange, and collapses flyout', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" onChange={onChange} />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        await user.click(screen.getByRole('link', { name: /Catalog/ }));

        expect(onChange).toHaveBeenCalledWith('products_catalog');
        expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();

        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        expect(screen.getByRole('link', { name: /Catalog/ })).toHaveAttribute('data-active');
    });

    it('has no back button', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        expect(screen.queryByTestId('cascade-back-1')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    });

    it('collapses flyout after leave delay', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);
            const flyout = screen.getByTestId('cascade-col-1');
            expect(flyout).toBeInTheDocument();

            fireEvent.mouseLeave(products, { relatedTarget: document.body });
            fireEvent.mouseLeave(flyout, { relatedTarget: document.body });
            fireEvent.mouseLeave(screen.getByTestId('cascade'), { relatedTarget: document.body });

            act(() => {
                vi.advanceTimersByTime(LEAVE_CLOSE_MS);
            });

            expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps flyout open when leaving folder toward flyout', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);
            const flyout = screen.getByTestId('cascade-col-1');
            expect(flyout).toBeInTheDocument();

            fireEvent.mouseLeave(products, { relatedTarget: flyout });

            act(() => {
                vi.advanceTimersByTime(LEAVE_CLOSE_MS);
            });

            expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('collapses when leaving folder with null relatedTarget', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);
            const flyout = screen.getByTestId('cascade-col-1');
            expect(flyout).toBeInTheDocument();

            fireEvent.mouseLeave(products, { relatedTarget: null });
            fireEvent.mouseLeave(flyout, { relatedTarget: null });
            fireEvent.mouseLeave(screen.getByTestId('cascade'), { relatedTarget: null });

            act(() => {
                vi.advanceTimersByTime(LEAVE_CLOSE_MS);
            });

            expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps flyout open when leaving folder toward context menu', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);
            expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();

            fireEvent.contextMenu(screen.getByRole('link', { name: /Catalog/ }), {
                clientX: 40,
                clientY: 80,
            });
            const context = screen.getByTestId('cascade-context');

            fireEvent.mouseLeave(products, { relatedTarget: context });

            act(() => {
                vi.advanceTimersByTime(LEAVE_CLOSE_MS);
            });

            expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
            expect(screen.getByTestId('cascade-context')).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('trims deeper flyout when moving over flyout column gap', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const directories = screen.getByRole('button', { name: /Directories/ });
        mockItemRect(directories, 140, 500);
        fireEvent.mouseEnter(directories);
        expect(screen.getByTestId('cascade-col-2')).toBeInTheDocument();

        const flyoutColumn = screen.getByTestId('cascade-col-1-list').parentElement;
        expect(flyoutColumn).toBeTruthy();
        fireEvent.mouseMove(flyoutColumn!);

        expect(screen.queryByTestId('cascade-col-2')).not.toBeInTheDocument();
        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
    });

    it('keeps flyout open when hovering open context menu', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);
            const flyout = screen.getByTestId('cascade-col-1');
            expect(flyout).toBeInTheDocument();

            const catalog = screen.getByRole('link', { name: /Catalog/ });
            fireEvent.contextMenu(catalog, { clientX: 40, clientY: 80 });
            expect(screen.getByTestId('cascade-context')).toBeInTheDocument();

            // Leave chrome while RMB menu is open (portal is outside L0/flyout DOM).
            fireEvent.mouseLeave(catalog, { relatedTarget: document.body });
            fireEvent.mouseLeave(flyout, { relatedTarget: document.body });
            fireEvent.mouseLeave(screen.getByTestId('cascade'), { relatedTarget: document.body });

            act(() => {
                vi.advanceTimersByTime(LEAVE_CLOSE_MS);
            });

            expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
            expect(products).toHaveAttribute('data-open', 'true');
            expect(screen.getByTestId('cascade-context')).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('does not collapse flyout on scroll inside flyout', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);
        const flyout = screen.getByTestId('cascade-col-1');
        expect(flyout).toBeInTheDocument();

        fireEvent.scroll(flyout);

        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
    });

    it('collapses on outside click', () => {
        renderWithProvider(
            <div>
                <CascadeMenu items={items} dataTestId="cascade" />
                <button type="button">Outside</button>
            </div>
        );

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);
        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();

        fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
        expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();
    });

    it('filters by allowedCodes', () => {
        renderWithProvider(<CascadeMenu items={items} allowedCodes={['orders_list']} />);

        expect(screen.queryByRole('button', { name: /Products/ })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Orders/ })).toBeInTheDocument();
    });

    it('does not mark ancestor open from activePath alone', () => {
        renderWithProvider(<CascadeMenu items={items} activePath="/products/catalog" dataTestId="cascade" />);

        expect(screen.getByRole('button', { name: /Products/ })).not.toHaveAttribute('data-open');

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        expect(screen.getByRole('link', { name: /Catalog/ })).toHaveAttribute('data-active');
    });

    it('toggles collapsed rail and hides flyout', async () => {
        const user = userEvent.setup();
        const onCollapsedChange = vi.fn();

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultCollapsed={false}
                onCollapsedChange={onCollapsedChange}
            />
        );

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);
        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();

        await user.click(screen.getByTestId('cascade-collapse'));

        expect(onCollapsedChange).toHaveBeenCalledWith(true);
        expect(screen.getByTestId('cascade')).toHaveAttribute('data-collapsed', 'true');
        expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();
    });

    it('hides flyout on collapse when prefers-reduced-motion', async () => {
        const user = userEvent.setup();
        const originalMatchMedia = window.matchMedia;

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: vi.fn((query: string) => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultCollapsed={false} />);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);
            expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();

            await user.click(screen.getByTestId('cascade-collapse'));

            expect(screen.getByTestId('cascade')).toHaveAttribute('data-collapsed', 'true');
            expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();
        } finally {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                configurable: true,
                value: originalMatchMedia,
            });
        }
    });

    it('switches to icon-only layout immediately on collapse', async () => {
        const user = userEvent.setup();

        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultCollapsed={false} />);

        const root = screen.getByTestId('cascade');
        const products = screen.getByRole('button', { name: /Products/ });
        expect(products).not.toHaveAttribute('aria-label');
        expect(products).toHaveTextContent('Products');

        await user.click(screen.getByTestId('cascade-collapse'));

        expect(root).toHaveAttribute('data-collapsed', 'true');
        expect(root).toHaveAttribute('data-animating', 'true');
        expect(products).toHaveAttribute('aria-label', 'Products');
        expect(products.querySelector('span')).toBeNull();

        fireEvent.transitionEnd(root, { propertyName: 'width' });

        expect(root).not.toHaveAttribute('data-animating');
        expect(products).toHaveAttribute('aria-label', 'Products');
    });

    it('expands labels immediately while width animates', async () => {
        const user = userEvent.setup();

        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultCollapsed />);

        const root = screen.getByTestId('cascade');
        const products = screen.getByRole('button', { name: /Products/ });
        expect(products).toHaveAttribute('aria-label', 'Products');

        await user.click(screen.getByTestId('cascade-collapse'));

        expect(root).not.toHaveAttribute('data-collapsed');
        expect(root).toHaveAttribute('data-animating', 'true');
        expect(products).not.toHaveAttribute('aria-label');
        expect(products).toHaveTextContent('Products');

        fireEvent.transitionEnd(root, { propertyName: 'width' });

        expect(root).not.toHaveAttribute('data-animating');
        expect(products).not.toHaveAttribute('aria-label');
        expect(products).toHaveTextContent('Products');
    });

    it('opens flyout from collapsed rail folder hover', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultCollapsed />);

        const root = screen.getByTestId('cascade');
        expect(root).toHaveAttribute('data-collapsed', 'true');
        mockItemRect(root, 48, 64, 640);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 52);
        fireEvent.mouseEnter(products);

        const flyout = screen.getByTestId('cascade-col-1');
        expect(flyout).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Catalog/ })).toBeInTheDocument();
        expect(flyout.style.top).toBe('48px');
        expect(flyout.style.height).toBe('640px');
        expect(flyout.style.left).toBe('64px');
    });

    it('does not open flyout from collapsed rail leaf hover', () => {
        const leafItems: ICascadeMenuItem[] = [
            { text: 'Dashboard', code: 'dashboard', link: '/dashboard', icon: Package },
            ...items,
        ];

        renderWithProvider(<CascadeMenu items={leafItems} dataTestId="cascade" defaultCollapsed />);

        const dashboard = screen.getByRole('link', { name: /Dashboard/ });
        mockItemRect(dashboard, 80, 52);
        fireEvent.mouseEnter(dashboard);

        expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();
    });

    it('blocks hover flyout while expand width animates', async () => {
        const user = userEvent.setup();

        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultCollapsed />);

        const root = screen.getByTestId('cascade');
        expect(root).toHaveAttribute('data-collapsed', 'true');

        await user.click(screen.getByTestId('cascade-collapse'));

        expect(root).not.toHaveAttribute('data-collapsed');
        expect(root).toHaveAttribute('data-animating', 'true');

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(root, 48, 280, 640);
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();

        fireEvent.transitionEnd(root, { propertyName: 'width' });

        expect(root).not.toHaveAttribute('data-animating');

        fireEvent.mouseEnter(products);
        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
    });

    it('resizes L0 width via drag handle', () => {
        const onWidthChange = vi.fn();

        renderWithProvider(
            <CascadeMenu items={items} dataTestId="cascade" defaultWidth={280} onWidthChange={onWidthChange} />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 280, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 360, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(onWidthChange).toHaveBeenCalled();
        const last = onWidthChange.mock.calls.at(-1)?.[0] as number;
        expect(last).toBeGreaterThanOrEqual(200);
        expect(last).toBeLessThanOrEqual(400);
        expect(last).toBe(360);
    });

    it('ignores resize pointer move and up without pointer down', () => {
        const onWidthChange = vi.fn();
        const onCollapsedChange = vi.fn();

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultWidth={280}
                onWidthChange={onWidthChange}
                onCollapsedChange={onCollapsedChange}
            />
        );

        const root = screen.getByTestId('cascade');
        const widthBefore = root.style.width;
        const handle = screen.getByTestId('cascade-resize');

        fireEvent.pointerMove(handle, { clientX: 360, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(onWidthChange).not.toHaveBeenCalled();
        expect(onCollapsedChange).not.toHaveBeenCalled();
        expect(root.style.width).toBe(widthBefore);
        expect(root).not.toHaveAttribute('data-collapsed');
    });

    it('does not resize while flyout is open', () => {
        const onWidthChange = vi.fn();

        renderWithProvider(
            <CascadeMenu items={items} dataTestId="cascade" defaultWidth={280} onWidthChange={onWidthChange} />
        );

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);
        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();

        expect(screen.queryByTestId('cascade-resize')).not.toBeInTheDocument();
        expect(onWidthChange).not.toHaveBeenCalled();
    });

    it('does not collapse when resize drag stays above collapsed width', () => {
        const onCollapsedChange = vi.fn();
        const onWidthChange = vi.fn();

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultWidth={280}
                minWidth={200}
                onWidthChange={onWidthChange}
                onCollapsedChange={onCollapsedChange}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 280, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 200, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 100, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(onCollapsedChange).not.toHaveBeenCalled();
        expect(screen.getByTestId('cascade')).not.toHaveAttribute('data-collapsed');
        expect(onWidthChange.mock.calls.at(-1)?.[0]).toBe(200);
    });

    it('collapses when resize drag reaches collapsed width', () => {
        const onWidthChange = vi.fn();
        const onCollapsedChange = vi.fn();

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultWidth={280}
                minWidth={200}
                onWidthChange={onWidthChange}
                onCollapsedChange={onCollapsedChange}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 280, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 64, pointerId: 1 });

        expect(onCollapsedChange).toHaveBeenCalledWith(true);
        expect(screen.getByTestId('cascade')).toHaveAttribute('data-collapsed', 'true');

        const widthCalls = onWidthChange.mock.calls.map(call => call[0] as number);
        expect(widthCalls.every(w => w >= 200)).toBe(true);
    });

    it('expands again only when resize drag reaches expanded width', () => {
        const onCollapsedChange = vi.fn();
        const onWidthChange = vi.fn();

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultWidth={280}
                minWidth={200}
                onWidthChange={onWidthChange}
                onCollapsedChange={onCollapsedChange}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 280, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 50, pointerId: 1 });
        expect(onCollapsedChange).toHaveBeenCalledWith(true);

        fireEvent.pointerMove(handle, { clientX: 200, pointerId: 1 });
        expect(screen.getByTestId('cascade')).toHaveAttribute('data-collapsed', 'true');

        fireEvent.pointerMove(handle, { clientX: 280, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(onCollapsedChange).toHaveBeenCalledWith(false);
        expect(screen.getByTestId('cascade')).not.toHaveAttribute('data-collapsed');
    });

    it('does not expand from collapsed rail on a short resize drag', () => {
        const onCollapsedChange = vi.fn();

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultCollapsed
                defaultWidth={280}
                minWidth={200}
                onCollapsedChange={onCollapsedChange}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 64, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 200, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(onCollapsedChange).not.toHaveBeenCalled();
        expect(screen.getByTestId('cascade')).toHaveAttribute('data-collapsed', 'true');
    });

    it('expands from collapsed rail when drag reaches expanded width', () => {
        const onCollapsedChange = vi.fn();
        const onWidthChange = vi.fn();

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultCollapsed
                defaultWidth={280}
                minWidth={200}
                onWidthChange={onWidthChange}
                onCollapsedChange={onCollapsedChange}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 64, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 280, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(onCollapsedChange).toHaveBeenCalledWith(false);
        expect(screen.getByTestId('cascade')).not.toHaveAttribute('data-collapsed');
    });

    it('hydrates width and collapsed from localStorage via pinUserId', () => {
        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u1`, JSON.stringify(320));
        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u1`, '1');

        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" pinUserId="u1" defaultWidth={280} />);

        const root = screen.getByTestId('cascade');
        expect(root).toHaveAttribute('data-collapsed', 'true');
        expect(root.style.width).toBe('64px');
    });

    it('persists resized width to localStorage', () => {
        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                pinUserId="u1"
                defaultWidth={280}
                minWidth={200}
                maxWidth={400}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 280, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 340, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('340');
    });

    it('does not write localStorage width until resize pointer up', () => {
        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u1`, JSON.stringify(280));

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                pinUserId="u1"
                defaultWidth={280}
                minWidth={200}
                maxWidth={400}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 280, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 340, pointerId: 1 });

        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('280');
        expect(screen.getByTestId('cascade').style.width).toBe('340px');

        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('340');
    });

    it('discards width draft on resize snap collapse and keeps stored width after expand', () => {
        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u1`, JSON.stringify(300));

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                pinUserId="u1"
                defaultWidth={280}
                minWidth={200}
                maxWidth={400}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 300, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 220, pointerId: 1 });
        expect(screen.getByTestId('cascade').style.width).toBe('220px');

        fireEvent.pointerMove(handle, { clientX: 50, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('300');
        expect(screen.getByTestId('cascade')).toHaveAttribute('data-collapsed', 'true');

        fireEvent.pointerDown(handle, { clientX: 64, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 300, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(screen.getByTestId('cascade')).not.toHaveAttribute('data-collapsed');
        expect(screen.getByTestId('cascade').style.width).toBe('300px');
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('300');
    });

    it('persists collapse without overwriting stored width', async () => {
        const user = userEvent.setup();

        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u1`, JSON.stringify(320));

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                pinUserId="u1"
                defaultWidth={280}
                minWidth={200}
                maxWidth={400}
            />
        );

        expect(screen.getByTestId('cascade').style.width).toBe('320px');

        await user.click(screen.getByTestId('cascade-collapse'));

        expect(window.localStorage.getItem(`${COLLAPSED_STORAGE_PREFIX}u1`)).toBe('true');
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('320');
    });

    it('persists collapse via resize snap without overwriting stored width', () => {
        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u1`, JSON.stringify(300));

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                pinUserId="u1"
                defaultWidth={280}
                minWidth={200}
                maxWidth={400}
            />
        );

        const handle = screen.getByTestId('cascade-resize');
        fireEvent.pointerDown(handle, { clientX: 300, pointerId: 1 });
        fireEvent.pointerMove(handle, { clientX: 50, pointerId: 1 });
        fireEvent.pointerUp(handle, { pointerId: 1 });

        expect(window.localStorage.getItem(`${COLLAPSED_STORAGE_PREFIX}u1`)).toBe('true');
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('300');
    });

    it('persists expand to localStorage', async () => {
        const user = userEvent.setup();

        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u1`, '1');

        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" pinUserId="u1" defaultCollapsed />);

        await user.click(screen.getByTestId('cascade-collapse'));

        expect(window.localStorage.getItem(`${COLLAPSED_STORAGE_PREFIX}u1`)).toBe('false');
        expect(screen.getByTestId('cascade')).not.toHaveAttribute('data-collapsed');
    });

    it('closes deeper flyout when hovering a leaf on the parent level', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const directories = screen.getByRole('button', { name: /Directories/ });
        mockItemRect(directories, 140, 480);
        fireEvent.mouseEnter(directories);
        expect(screen.getByTestId('cascade-col-2')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Attributes/ })).toBeInTheDocument();

        fireEvent.mouseEnter(screen.getByRole('link', { name: /Catalog/ }));

        expect(screen.queryByTestId('cascade-col-2')).not.toBeInTheDocument();
        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
    });

    it('freezes hover layers while context menu is open on deeper item', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);

            const directories = screen.getByRole('button', { name: /Directories/ });
            mockItemRect(directories, 140, 480);
            fireEvent.mouseEnter(directories);
            expect(screen.getByTestId('cascade-col-2')).toBeInTheDocument();

            const attributes = screen.getByRole('link', { name: /Attributes/ });
            fireEvent.contextMenu(attributes, { clientX: 200, clientY: 160 });
            expect(screen.getByTestId('cascade-context')).toBeInTheDocument();

            fireEvent.mouseEnter(screen.getByRole('link', { name: /Catalog/ }));

            act(() => {
                vi.advanceTimersByTime(LEAVE_CLOSE_MS);
            });

            expect(screen.getByTestId('cascade-col-2')).toBeInTheDocument();
            expect(screen.getByTestId('cascade-context')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /Attributes/ })).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('does not trim L0 chrome while context menu is open', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);
        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();

        fireEvent.contextMenu(screen.getByRole('link', { name: /Catalog/ }), {
            clientX: 120,
            clientY: 100,
        });
        expect(screen.getByTestId('cascade-context')).toBeInTheDocument();

        const empty = screen.getByTestId('cascade-pinned-empty');
        fireEvent.mouseEnter(empty);
        fireEvent.mouseMove(empty);

        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
        expect(screen.getByTestId('cascade-context')).toBeInTheDocument();
    });

    it('does not trim flyout chrome while context menu is open', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const directories = screen.getByRole('button', { name: /Directories/ });
        mockItemRect(directories, 140, 480);
        fireEvent.mouseEnter(directories);
        expect(screen.getByTestId('cascade-col-2')).toBeInTheDocument();

        fireEvent.contextMenu(screen.getByRole('link', { name: /Attributes/ }), {
            clientX: 200,
            clientY: 160,
        });
        expect(screen.getByTestId('cascade-context')).toBeInTheDocument();

        const flyoutColumn = screen.getByTestId('cascade-col-1-list').parentElement;
        expect(flyoutColumn).toBeTruthy();
        fireEvent.mouseMove(flyoutColumn!);

        expect(screen.getByTestId('cascade-col-2')).toBeInTheDocument();
        expect(screen.getByTestId('cascade-context')).toBeInTheDocument();
    });

    it('delays L0 sibling switch while aiming at open flyout', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

            const root = screen.getByTestId('cascade');
            mockItemRect(root, 0, 280, 640);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);

            const flyout = screen.getByTestId('cascade-col-1');
            expect(flyout).toBeInTheDocument();
            mockItemRect(flyout, 0, 560, 640);
            flyout.getBoundingClientRect = () =>
                ({
                    top: 0,
                    left: 280,
                    right: 560,
                    bottom: 640,
                    width: 280,
                    height: 640,
                    x: 280,
                    y: 0,
                    toJSON: () => ({}),
                }) as DOMRect;

            fireEvent.mouseMove(products, { clientX: 150, clientY: 100 });
            fireEvent.mouseMove(products, { clientX: 180, clientY: 120 });
            fireEvent.mouseMove(products, { clientX: 200, clientY: 130 });

            const orders = screen.getByRole('button', { name: /Orders/ });
            mockItemRect(orders, 140, 220);
            fireEvent.mouseEnter(orders);

            expect(products).toHaveAttribute('data-open', 'true');
            expect(screen.getByRole('link', { name: /Catalog/ })).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(HOVER_DELAY_MS);
            });

            expect(orders).toHaveAttribute('data-open', 'true');
            expect(screen.getByRole('link', { name: /List/ })).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('shows empty Pinned hint when pins enabled and none pinned', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

        expect(screen.getByTestId('cascade-pinned-icon')).toBeInTheDocument();
        expect(screen.getByTestId('cascade-pinned')).toHaveTextContent('Pinned');
        const empty = screen.getByTestId('cascade-pinned-empty');
        expect(empty).toHaveTextContent('Right-click a menu item to pin it');
        expect(empty).not.toHaveTextContent('Empty');
    });

    it('does not offer pin on L0 items', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

        fireEvent.contextMenu(screen.getByRole('button', { name: /Products/ }), {
            clientX: 40,
            clientY: 80,
        });

        expect(screen.queryByTestId('cascade-context')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cascade-context-pin')).not.toBeInTheDocument();
    });

    it('pins leaf and folder via context menu without navigating', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(
            <CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} onChange={onChange} />
        );

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const directories = screen.getByRole('button', { name: /Directories/ });
        fireEvent.contextMenu(directories, { clientX: 120, clientY: 100 });
        await user.click(screen.getByTestId('cascade-context-pin'));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByTestId('cascade-pinned')).toBeInTheDocument();
        expect(screen.queryByTestId('cascade-pinned-empty')).not.toBeInTheDocument();

        const pinnedRoot = within(screen.getByTestId('cascade-pinned')).getByRole('button', {
            name: /^Pinned$/,
        });
        expect(
            within(screen.getByTestId('cascade-pinned')).queryByRole('button', { name: /Directories/ })
        ).not.toBeInTheDocument();

        mockItemRect(pinnedRoot, 96, 220);
        fireEvent.mouseEnter(pinnedRoot);
        expect(
            within(screen.getByTestId('cascade-col-1')).getByRole('button', { name: /Directories/ })
        ).toBeInTheDocument();

        fireEvent.mouseEnter(products);
        const catalog = screen.getByRole('link', { name: /Catalog/ });
        fireEvent.contextMenu(catalog, { clientX: 120, clientY: 120 });
        await user.click(screen.getByTestId('cascade-context-pin'));

        expect(onChange).not.toHaveBeenCalled();
        fireEvent.mouseEnter(pinnedRoot);
        expect(within(screen.getByTestId('cascade-col-1')).getByRole('link', { name: /Catalog/ })).toBeInTheDocument();
    });

    it('respects maxPinned when pinning via context menu', async () => {
        const user = userEvent.setup();

        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultPinnedCodes={['products_directories', 'products_catalog']}
                maxPinned={2}
            />
        );

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const importLink = screen.getByRole('link', { name: /Import/ });
        fireEvent.contextMenu(importLink, { clientX: 120, clientY: 100 });

        expect(screen.getByTestId('cascade-context-pin')).toBeDisabled();
        await user.click(screen.getByTestId('cascade-context-pin'));

        expect(
            within(screen.getByTestId('cascade-pinned')).queryByRole('link', { name: /Import/ })
        ).not.toBeInTheDocument();
        expect(
            within(screen.getByTestId('cascade-pinned')).getByRole('button', { name: /^Pinned$/ })
        ).toBeInTheDocument();
    });

    it('opens leaf in new tab from context menu', async () => {
        const user = userEvent.setup();
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

        try {
            renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 96, 220);
            fireEvent.mouseEnter(products);

            const catalog = screen.getByRole('link', { name: /Catalog/ });
            fireEvent.contextMenu(catalog, { clientX: 120, clientY: 100 });
            await user.click(screen.getByTestId('cascade-context-new-tab'));

            expect(openSpy).toHaveBeenCalledWith('/products/catalog', '_blank', 'noopener,noreferrer');
        } finally {
            openSpy.mockRestore();
        }
    });

    it('renders a single Pinned L0 item and opens pinned list in flyout', () => {
        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultPinnedCodes={['products_directories', 'products_catalog']}
            />
        );

        const pinned = screen.getByTestId('cascade-pinned');
        const pinnedRoot = within(pinned).getByRole('button', { name: /^Pinned$/ });
        expect(within(pinned).queryByRole('button', { name: /Directories/ })).not.toBeInTheDocument();
        expect(within(pinned).queryByRole('link', { name: /Catalog/ })).not.toBeInTheDocument();

        mockItemRect(pinnedRoot, 96, 220);
        fireEvent.mouseEnter(pinnedRoot);

        expect(pinnedRoot).toHaveAttribute('data-open', 'true');
        const flyout = screen.getByTestId('cascade-col-1');
        expect(within(flyout).getByRole('button', { name: /Directories/ })).toBeInTheDocument();
        expect(within(flyout).getByRole('link', { name: /Catalog/ })).toBeInTheDocument();
        expect(screen.getByTestId('cascade-col-1-header')).toHaveTextContent('Pinned');
    });

    it('opens nested flyout from folder inside pinned list', () => {
        renderWithProvider(
            <CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={['products_directories']} />
        );

        const pinnedRoot = within(screen.getByTestId('cascade-pinned')).getByRole('button', {
            name: /^Pinned$/,
        });
        mockItemRect(pinnedRoot, 96, 220);
        fireEvent.mouseEnter(pinnedRoot);

        const pinnedDirectories = within(screen.getByTestId('cascade-col-1')).getByRole('button', {
            name: /Directories/,
        });
        mockItemRect(pinnedDirectories, 96, 500);
        fireEvent.mouseEnter(pinnedDirectories);

        expect(screen.getByTestId('cascade-col-2')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Attributes/ })).toBeInTheDocument();
        expect(pinnedDirectories).toHaveAttribute('data-open', 'true');
        expect(pinnedRoot).toHaveAttribute('data-open', 'true');
        expect(screen.getByRole('button', { name: /Products/ })).not.toHaveAttribute('data-open');
    });

    it('shows a single Pin in collapsed rail for multiple pins', () => {
        renderWithProvider(
            <CascadeMenu
                items={items}
                dataTestId="cascade"
                defaultCollapsed
                defaultPinnedCodes={['products_directories', 'products_catalog']}
            />
        );

        const pinned = screen.getByTestId('cascade-pinned');
        const pinnedItems = within(pinned).getAllByRole('button');
        expect(pinnedItems).toHaveLength(1);
        expect(pinnedItems[0]).toHaveAttribute('aria-label', 'Pinned');
    });

    it('moves data-open from pinned to tree when hovering L0 folder', () => {
        renderWithProvider(
            <CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={['products_directories']} />
        );

        const pinnedRoot = within(screen.getByTestId('cascade-pinned')).getByRole('button', {
            name: /^Pinned$/,
        });
        mockItemRect(pinnedRoot, 96, 220);
        fireEvent.mouseEnter(pinnedRoot);
        expect(pinnedRoot).toHaveAttribute('data-open', 'true');

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 140, 220);
        fireEvent.mouseEnter(products);

        expect(products).toHaveAttribute('data-open', 'true');
        expect(pinnedRoot).not.toHaveAttribute('data-open');
        expect(screen.getByRole('link', { name: /Catalog/ })).toBeInTheDocument();
    });

    it('delays pinned to tree switch while aiming at open flyout', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(
                <CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={['products_directories']} />
            );

            const root = screen.getByTestId('cascade');
            mockItemRect(root, 0, 280, 640);

            const pinnedRoot = within(screen.getByTestId('cascade-pinned')).getByRole('button', {
                name: /^Pinned$/,
            });
            mockItemRect(pinnedRoot, 96, 220);
            fireEvent.mouseEnter(pinnedRoot);

            const flyout = screen.getByTestId('cascade-col-1');
            expect(flyout).toBeInTheDocument();
            mockItemRect(flyout, 0, 560, 640);
            flyout.getBoundingClientRect = () =>
                ({
                    top: 0,
                    left: 280,
                    right: 560,
                    bottom: 640,
                    width: 280,
                    height: 640,
                    x: 280,
                    y: 0,
                    toJSON: () => ({}),
                }) as DOMRect;

            fireEvent.mouseMove(pinnedRoot, { clientX: 150, clientY: 100 });
            fireEvent.mouseMove(pinnedRoot, { clientX: 180, clientY: 120 });
            fireEvent.mouseMove(pinnedRoot, { clientX: 200, clientY: 130 });

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 140, 220);
            fireEvent.mouseEnter(products);

            expect(pinnedRoot).toHaveAttribute('data-open', 'true');
            expect(within(flyout).getByRole('button', { name: /Directories/ })).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(HOVER_DELAY_MS);
            });

            expect(products).toHaveAttribute('data-open', 'true');
            expect(pinnedRoot).not.toHaveAttribute('data-open');
            expect(screen.getByRole('link', { name: /Catalog/ })).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps pinned source after aim cancel when entering flyout', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(
                <CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={['products_directories']} />
            );

            const root = screen.getByTestId('cascade');
            mockItemRect(root, 0, 280, 640);

            const pinnedRoot = within(screen.getByTestId('cascade-pinned')).getByRole('button', {
                name: /^Pinned$/,
            });
            mockItemRect(pinnedRoot, 96, 220);
            fireEvent.mouseEnter(pinnedRoot);

            const flyout = screen.getByTestId('cascade-col-1');
            mockItemRect(flyout, 0, 560, 640);
            flyout.getBoundingClientRect = () =>
                ({
                    top: 0,
                    left: 280,
                    right: 560,
                    bottom: 640,
                    width: 280,
                    height: 640,
                    x: 280,
                    y: 0,
                    toJSON: () => ({}),
                }) as DOMRect;

            fireEvent.mouseMove(pinnedRoot, { clientX: 150, clientY: 100 });
            fireEvent.mouseMove(pinnedRoot, { clientX: 180, clientY: 120 });
            fireEvent.mouseMove(pinnedRoot, { clientX: 200, clientY: 130 });

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 140, 220);
            fireEvent.mouseEnter(products);

            fireEvent.mouseEnter(flyout);

            act(() => {
                vi.advanceTimersByTime(HOVER_DELAY_MS);
            });

            expect(pinnedRoot).toHaveAttribute('data-open', 'true');
            expect(products).not.toHaveAttribute('data-open');
            expect(within(flyout).getByRole('button', { name: /Directories/ })).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('does not flip openSource to stale tree after flyout expands deeper', () => {
        vi.useFakeTimers();

        const nestedItems: ICascadeMenuItem[] = [
            {
                text: 'Products',
                code: 'products',
                children: [
                    {
                        text: 'Directories',
                        code: 'products_directories',
                        children: [
                            {
                                text: 'Meta',
                                code: 'products_meta',
                                children: [{ text: 'Attributes', code: 'products_attributes', link: '/a' }],
                            },
                        ],
                    },
                ],
            },
            {
                text: 'Orders',
                code: 'orders',
                children: [{ text: 'List', code: 'orders_list', link: '/o' }],
            },
        ];

        try {
            renderWithProvider(
                <CascadeMenu items={nestedItems} dataTestId="cascade" defaultPinnedCodes={['products_directories']} />
            );

            const root = screen.getByTestId('cascade');
            mockItemRect(root, 0, 280, 640);

            const pinnedRoot = within(screen.getByTestId('cascade-pinned')).getByRole('button', {
                name: /^Pinned$/,
            });
            mockItemRect(pinnedRoot, 96, 220);
            fireEvent.mouseEnter(pinnedRoot);

            const flyout = screen.getByTestId('cascade-col-1');
            mockItemRect(flyout, 0, 560, 640);
            flyout.getBoundingClientRect = () =>
                ({
                    top: 0,
                    left: 280,
                    right: 560,
                    bottom: 640,
                    width: 280,
                    height: 640,
                    x: 280,
                    y: 0,
                    toJSON: () => ({}),
                }) as DOMRect;

            fireEvent.mouseMove(pinnedRoot, { clientX: 150, clientY: 100 });
            fireEvent.mouseMove(pinnedRoot, { clientX: 180, clientY: 120 });
            fireEvent.mouseMove(pinnedRoot, { clientX: 200, clientY: 130 });

            const products = screen.getByRole('button', { name: /Products/ });
            mockItemRect(products, 140, 220);
            fireEvent.mouseEnter(products);
            fireEvent.mouseEnter(flyout);

            act(() => {
                vi.advanceTimersByTime(HOVER_DELAY_MS);
            });

            const pinnedDirectories = within(flyout).getByRole('button', { name: /Directories/ });
            mockItemRect(pinnedDirectories, 96, 500);
            fireEvent.mouseEnter(pinnedDirectories);

            const meta = screen.getByRole('button', { name: /Meta/ });
            mockItemRect(meta, 120, 500);
            fireEvent.mouseEnter(meta);

            expect(pinnedRoot).toHaveAttribute('data-open', 'true');
            expect(products).not.toHaveAttribute('data-open');
            expect(screen.getByRole('link', { name: /Attributes/ })).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('does not close pinned flyout when crossing pinned divider while aiming', () => {
        vi.useFakeTimers();

        try {
            renderWithProvider(
                <CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={['products_directories']} />
            );

            const root = screen.getByTestId('cascade');
            mockItemRect(root, 0, 280, 640);

            const pinnedRoot = within(screen.getByTestId('cascade-pinned')).getByRole('button', {
                name: /^Pinned$/,
            });
            mockItemRect(pinnedRoot, 96, 220);
            fireEvent.mouseEnter(pinnedRoot);

            const flyout = screen.getByTestId('cascade-col-1');
            mockItemRect(flyout, 0, 560, 640);
            flyout.getBoundingClientRect = () =>
                ({
                    top: 0,
                    left: 280,
                    right: 560,
                    bottom: 640,
                    width: 280,
                    height: 640,
                    x: 280,
                    y: 0,
                    toJSON: () => ({}),
                }) as DOMRect;

            fireEvent.mouseMove(pinnedRoot, { clientX: 150, clientY: 100 });
            fireEvent.mouseMove(pinnedRoot, { clientX: 180, clientY: 120 });
            fireEvent.mouseMove(pinnedRoot, { clientX: 200, clientY: 130 });

            const divider = screen.getByTestId('cascade-pinned').querySelector('[aria-hidden="true"]');
            expect(divider).toBeTruthy();
            fireEvent.mouseEnter(divider!);
            fireEvent.mouseMove(divider!);

            expect(pinnedRoot).toHaveAttribute('data-open', 'true');
            expect(within(flyout).getByRole('button', { name: /Directories/ })).toBeInTheDocument();

            fireEvent.mouseEnter(flyout);

            act(() => {
                vi.advanceTimersByTime(HOVER_DELAY_MS);
            });

            expect(pinnedRoot).toHaveAttribute('data-open', 'true');
            expect(within(flyout).getByRole('button', { name: /Directories/ })).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('opens flyout on folder click', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.click(products);

        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
        expect(products).toHaveAttribute('data-open', 'true');
    });

    it('trims flyouts when moving over L0 column gap', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const directories = screen.getByRole('button', { name: /Directories/ });
        mockItemRect(directories, 140, 500);
        fireEvent.mouseEnter(directories);
        expect(screen.getByTestId('cascade-col-2')).toBeInTheDocument();

        const column = screen.getByTestId('cascade-col-0').parentElement;
        expect(column).toBeTruthy();
        fireEvent.mouseMove(column!);

        expect(screen.queryByTestId('cascade-col-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();
    });

    it('does not open context menu when pins are disabled', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        fireEvent.contextMenu(screen.getByRole('link', { name: /Catalog/ }), {
            clientX: 120,
            clientY: 100,
        });

        expect(screen.queryByTestId('cascade-context')).not.toBeInTheDocument();
    });

    it('forwards callback ref to aside root', () => {
        const ref = vi.fn();

        renderWithProvider(<CascadeMenu items={items} ref={ref} dataTestId="cascade" />);

        expect(ref).toHaveBeenCalledWith(screen.getByTestId('cascade'));
    });

    it('forwards object ref to aside root', () => {
        const ref = { current: null as HTMLElement | null };

        renderWithProvider(<CascadeMenu items={items} ref={ref} dataTestId="cascade" />);

        expect(ref.current).toBe(screen.getByTestId('cascade'));
    });

    it('selects leaf from activePath when uncontrolled', () => {
        renderWithProvider(<CascadeMenu items={items} activePath="/products/catalog" dataTestId="cascade" />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        expect(screen.getByRole('link', { name: /Catalog/ })).toHaveAttribute('data-active');
        expect(screen.getByRole('link', { name: /Import/ })).not.toHaveAttribute('data-active');
    });

    it('keeps controlled value on leaf click and still notifies onChange', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderWithProvider(<CascadeMenu items={items} value="orders_list" dataTestId="cascade" onChange={onChange} />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        await user.click(screen.getByRole('link', { name: /Catalog/ }));

        expect(onChange).toHaveBeenCalledWith('products_catalog');

        const orders = screen.getByRole('button', { name: /Orders/ });
        mockItemRect(orders, 140, 220);
        fireEvent.mouseEnter(orders);

        expect(screen.getByRole('link', { name: /List/ })).toHaveAttribute('data-active');
        expect(screen.queryByRole('link', { name: /Catalog/ })).not.toBeInTheDocument();
    });

    it('shows empty Pinned hint without dataTestId', () => {
        renderWithProvider(<CascadeMenu items={items} defaultPinnedCodes={[]} />);

        expect(screen.getByText('Pinned')).toBeInTheDocument();
        expect(screen.getByText('Right-click a menu item to pin it')).toBeInTheDocument();
        expect(screen.queryByTestId('cascade-pinned')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cascade-pinned-empty')).not.toBeInTheDocument();
    });

    it('shows pin-only context menu for folder without link', () => {
        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        fireEvent.contextMenu(screen.getByRole('button', { name: /Directories/ }), {
            clientX: 120,
            clientY: 100,
        });

        expect(screen.getByTestId('cascade-context-pin')).toBeInTheDocument();
        expect(screen.getByTestId('cascade-context-pin')).toHaveTextContent('Pin');
        expect(screen.queryByTestId('cascade-context-new-tab')).not.toBeInTheDocument();
    });

    it('opens context menu without dataTestId', () => {
        renderWithProvider(<CascadeMenu items={items} defaultPinnedCodes={[]} />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        fireEvent.contextMenu(screen.getByRole('link', { name: /Catalog/ }), {
            clientX: 120,
            clientY: 100,
        });

        expect(screen.getByRole('menuitem', { name: /Pin/ })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /Open in new tab/i })).toBeInTheDocument();
        expect(screen.queryByTestId('cascade-context')).not.toBeInTheDocument();
    });

    it('shows Unpin after item is pinned', async () => {
        const user = userEvent.setup();

        renderWithProvider(<CascadeMenu items={items} dataTestId="cascade" defaultPinnedCodes={[]} />);

        const products = screen.getByRole('button', { name: /Products/ });
        mockItemRect(products, 96, 220);
        fireEvent.mouseEnter(products);

        const catalog = screen.getByRole('link', { name: /Catalog/ });
        fireEvent.contextMenu(catalog, { clientX: 120, clientY: 100 });
        await user.click(screen.getByTestId('cascade-context-pin'));

        fireEvent.mouseEnter(products);
        fireEvent.contextMenu(screen.getByRole('link', { name: /Catalog/ }), {
            clientX: 120,
            clientY: 120,
        });

        expect(screen.getByTestId('cascade-context-pin')).toHaveTextContent('Unpin');
    });

    it('opens link-only context menu on L0 leaf when pins enabled', () => {
        const leafItems: ICascadeMenuItem[] = [
            { text: 'Dashboard', code: 'dashboard', link: '/dashboard', icon: Package },
        ];

        renderWithProvider(<CascadeMenu items={leafItems} dataTestId="cascade" defaultPinnedCodes={[]} />);

        fireEvent.contextMenu(screen.getByRole('link', { name: /Dashboard/ }), {
            clientX: 40,
            clientY: 80,
        });

        expect(screen.getByTestId('cascade-context-new-tab')).toBeInTheDocument();
        expect(screen.queryByTestId('cascade-context-pin')).not.toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: /^Pin$/ })).not.toBeInTheDocument();
    });

    it('renders pinned column without dataTestId', () => {
        renderWithProvider(<CascadeMenu items={items} defaultPinnedCodes={['products_catalog']} />);

        expect(screen.getByRole('button', { name: /^Pinned$/ })).toBeInTheDocument();
        expect(screen.queryByTestId('cascade-pinned')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cascade-pinned-col')).not.toBeInTheDocument();
    });
});
