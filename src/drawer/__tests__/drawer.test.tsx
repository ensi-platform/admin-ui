import { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Drawer } from '../index';
import { type IDrawerProps } from '../types';

import styles from '../styles.module.css';

const DrawerHarness = ({
    open: openProp = true,
    onOpenChange,
    ...props
}: Omit<IDrawerProps, 'open' | 'onOpenChange' | 'children'> & {
    open?: boolean;
    onOpenChange?: IDrawerProps['onOpenChange'];
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
                    <Drawer.CloseButton dataTestId="drawer-close" />
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

    it('calls onOpenChange on Escape when keyboardDismissable', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(<DrawerHarness open onOpenChange={onOpenChange} />);

        await user.keyboard('{Escape}');

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
