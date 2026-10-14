import { useState, type MouseEvent } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Drawer } from '../index';
import { type IDrawerProps } from '../types';

import styles from '../styles.module.css';

const DrawerHarness = ({
    open: openProp = true,
    onOpenChange,
    closeButtonOnClick,
    ...props
}: Omit<IDrawerProps, 'open' | 'onOpenChange' | 'children'> & {
    open?: boolean;
    onOpenChange?: IDrawerProps['onOpenChange'];
    closeButtonOnClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) => {
    const [open, setOpen] = useState(openProp);

    return (
        <AdminUiProvider labels={{ close: 'Закрыть' }}>
            <Drawer
                {...props}
                open={open}
                onOpenChange={next => {
                    setOpen(next);
                    onOpenChange?.(next);
                }}
            >
                <Drawer.Header>
                    <Drawer.Title>Заголовок</Drawer.Title>
                    <Drawer.CloseButton dataTestId="drawer-close" onClick={closeButtonOnClick} />
                </Drawer.Header>
                <Drawer.Body>Контент</Drawer.Body>
                <Drawer.Footer>
                    <button type="button">OK</button>
                </Drawer.Footer>
            </Drawer>
        </AdminUiProvider>
    );
};

describe('Drawer', () => {
    it('renders dialog when open', () => {
        render(<DrawerHarness open dataTestId="drawer" />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('drawer')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument();
    });

    it('does not render dialog when closed', () => {
        render(<DrawerHarness open={false} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('applies size, variant and placement classes', () => {
        render(<DrawerHarness open size="sm" variant="primary" placement="left" />);

        expect(document.body.querySelector(`.${styles.sm}`)).toBeInTheDocument();
        expect(document.body.querySelector(`.${styles.primary}`)).toBeInTheDocument();
        expect(document.body.querySelector(`.${styles.left}`)).toBeInTheDocument();
        expect(document.body.querySelector(`.${styles.panelLeft}`)).toBeInTheDocument();
    });

    it('applies fullscreen class', () => {
        render(<DrawerHarness open fullscreen />);

        expect(document.body.querySelector(`.${styles.fullscreen}`)).toBeInTheDocument();
    });

    it('calls onOpenChange when close button is clicked', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<DrawerHarness open onOpenChange={onOpenChange} />);

        await user.click(screen.getByTestId('drawer-close'));

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not close when CloseButton onClick calls preventDefault', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <DrawerHarness
                open
                onOpenChange={onOpenChange}
                closeButtonOnClick={event => {
                    event.preventDefault();
                }}
            />
        );

        await user.click(screen.getByTestId('drawer-close'));

        expect(onOpenChange).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange on Escape when keyboardDismissable', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<DrawerHarness open onOpenChange={onOpenChange} />);

        await user.keyboard('{Escape}');

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not close on Escape when keyboardDismissable is false', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<DrawerHarness open onOpenChange={onOpenChange} keyboardDismissable={false} />);

        await user.keyboard('{Escape}');

        expect(onOpenChange).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes on outside click and stays open when dismissable is false', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        const { unmount } = render(<DrawerHarness open onOpenChange={onOpenChange} />);

        await user.click(document.querySelector('[data-testid="underlay"]') as HTMLElement);

        expect(onOpenChange).toHaveBeenCalledWith(false);
        unmount();

        onOpenChange.mockClear();
        render(<DrawerHarness open onOpenChange={onOpenChange} dismissable={false} />);

        await user.click(document.querySelector('[data-testid="underlay"]') as HTMLElement);

        expect(onOpenChange).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('moves focus into the dialog and returns it to the opener', async () => {
        const user = userEvent.setup();

        const Harness = () => {
            const [open, setOpen] = useState(false);

            return (
                <AdminUiProvider>
                    <button type="button" onClick={() => setOpen(true)}>
                        Open
                    </button>
                    <Drawer open={open} onOpenChange={setOpen}>
                        <Drawer.Header>
                            <Drawer.Title>Заголовок</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <button type="button">Inside</button>
                        </Drawer.Body>
                    </Drawer>
                </AdminUiProvider>
            );
        };

        render(<Harness />);

        const opener = screen.getByRole('button', { name: 'Open' });

        await user.click(opener);

        const dialog = screen.getByRole('dialog');

        await waitFor(() => {
            expect(dialog.contains(document.activeElement)).toBe(true);
        });

        await user.tab();
        expect(dialog.contains(document.activeElement)).toBe(true);

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(opener).toHaveFocus();
        });
    });
});
