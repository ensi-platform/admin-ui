import { type SVGProps } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { ContextMenu } from '../index';

import itemStyles from '../components/Item/styles.module.css';
import styles from '../styles.module.css';

const StubIcon = (props: SVGProps<SVGSVGElement>) => <svg data-test-id="stub-icon" {...props} />;

describe('ContextMenu', () => {
    it('renders nothing when open is false', () => {
        render(
            <ContextMenu open={false} x={10} y={20} onClose={() => undefined} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        expect(screen.queryByTestId('cm')).not.toBeInTheDocument();
    });

    it('portals menu into the provider root', () => {
        render(
            <AdminUiProvider data-test-id="aui-root">
                <ContextMenu open x={40} y={80} onClose={() => undefined} dataTestId="cm">
                    <ContextMenu.Item>Pin</ContextMenu.Item>
                </ContextMenu>
            </AdminUiProvider>
        );

        expect(screen.getByTestId('aui-root')).toContainElement(screen.getByTestId('cm'));
    });

    it('portals menu into the provider root at x/y', () => {
        render(
            <ContextMenu open x={40} y={80} onClose={() => undefined} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        const menu = screen.getByTestId('cm');

        expect(menu).toHaveAttribute('role', 'menu');
        expect(menu.parentElement).toHaveAttribute('dir', 'ltr');
        expect(menu).toHaveStyle({ top: '80px', left: '40px' });
        expect(menu).toHaveClass(styles.root, styles.md, styles.primary);
    });

    it('keeps the placed position when the menu content changes', () => {
        const { rerender } = render(
            <ContextMenu open x={40} y={80} onClose={() => undefined} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        rerender(
            <ContextMenu open x={40} y={80} onClose={() => undefined} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
                <ContextMenu.Item>Open</ContextMenu.Item>
            </ContextMenu>
        );

        expect(screen.getByTestId('cm')).toHaveStyle({ top: '80px', left: '40px' });
    });

    it('forwards callback ref to menu root', () => {
        const ref = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined} ref={ref} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        expect(ref).toHaveBeenCalledWith(screen.getByTestId('cm'));
    });

    it('forwards object ref to menu root', () => {
        const ref = { current: null as HTMLDivElement | null };

        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined} ref={ref} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        expect(ref.current).toBe(screen.getByTestId('cm'));
    });

    it('sets data-test-id from dataTestId', () => {
        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined} dataTestId="ctx">
                <ContextMenu.Item dataTestId="ctx-pin">Pin</ContextMenu.Item>
            </ContextMenu>
        );

        expect(screen.getByTestId('ctx')).toBeInTheDocument();
        expect(screen.getByTestId('ctx-pin')).toBeInTheDocument();
    });

    it('marks a danger item', () => {
        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined}>
                <ContextMenu.Item variant="danger">Delete</ContextMenu.Item>
            </ContextMenu>
        );

        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-variant', 'danger');
    });

    it('closes on outside mousedown', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <>
                <button type="button">Outside</button>
                <ContextMenu open x={0} y={0} onClose={onClose} dataTestId="cm">
                    <ContextMenu.Item>Pin</ContextMenu.Item>
                </ContextMenu>
            </>
        );

        await user.click(screen.getByRole('button', { name: 'Outside' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on mousedown inside menu', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={onClose} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        await user.click(screen.getByRole('menu'));

        expect(onClose).not.toHaveBeenCalled();
    });

    it('closes on Escape', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={onClose} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        screen.getByRole('menu').focus();
        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on a key other than Escape', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={onClose} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        screen.getByRole('menu').focus();
        await user.keyboard('a');

        expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onMouseEnter when the pointer enters the menu', async () => {
        const user = userEvent.setup();
        const onMouseEnter = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined} onMouseEnter={onMouseEnter}>
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        await user.hover(screen.getByRole('menu'));

        expect(onMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('applies the sm size to the menu and its items', () => {
        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined} size="sm" dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        expect(screen.getByTestId('cm')).toHaveClass(styles.sm);
        expect(screen.getByRole('menuitem', { name: 'Pin' })).toHaveClass(itemStyles.sm);
    });

    it('activates the focused item with Space', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined}>
                <ContextMenu.Item onClick={onClick}>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        screen.getByRole('menuitem', { name: 'Pin' }).focus();
        await user.keyboard(' ');

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('moves focus to the next enabled item with Tab and skips a disabled item', async () => {
        const user = userEvent.setup();

        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined}>
                <ContextMenu.Item>Pin</ContextMenu.Item>
                <ContextMenu.Item disabled>Hidden</ContextMenu.Item>
                <ContextMenu.Item>Open</ContextMenu.Item>
            </ContextMenu>
        );

        screen.getByRole('menuitem', { name: 'Pin' }).focus();
        await user.tab();

        expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
        expect(screen.getByRole('menuitem', { name: 'Hidden' })).toBeDisabled();
    });

    it('activates the focused item with Enter', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined}>
                <ContextMenu.Item onClick={onClick}>Pin</ContextMenu.Item>
                <ContextMenu.Item>Open</ContextMenu.Item>
            </ContextMenu>
        );

        screen.getByRole('menuitem', { name: 'Pin' }).focus();
        await user.keyboard('{Enter}');

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls Item onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined}>
                <ContextMenu.Item onClick={onClick}>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        await user.click(screen.getByRole('menuitem', { name: 'Pin' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when Item is disabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined}>
                <ContextMenu.Item disabled onClick={onClick}>
                    Pin
                </ContextMenu.Item>
            </ContextMenu>
        );

        const item = screen.getByRole('menuitem', { name: 'Pin' });

        expect(item).toBeDisabled();
        await user.click(item);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('renders Item icon', () => {
        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined}>
                <ContextMenu.Item icon={StubIcon}>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        expect(screen.getByTestId('stub-icon')).toBeInTheDocument();
    });

    it('renders Separator', () => {
        render(
            <ContextMenu open x={0} y={0} onClose={() => undefined} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
                <ContextMenu.Separator dataTestId="cm-sep" />
                <ContextMenu.Item>Open in new tab</ContextMenu.Item>
            </ContextMenu>
        );

        expect(screen.getByTestId('cm-sep')).toHaveAttribute('role', 'separator');
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has no axe violations when open', async () => {
        const { container } = render(
            <ContextMenu open x={0} y={0} onClose={() => undefined}>
                <ContextMenu.Item>Pin</ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item>Open</ContextMenu.Item>
            </ContextMenu>
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});
