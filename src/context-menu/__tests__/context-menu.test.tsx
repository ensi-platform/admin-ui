import { type SVGProps } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ContextMenu } from '../index';

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

    it('portals menu to document.body at x/y', () => {
        render(
            <ContextMenu open x={40} y={80} onClose={() => undefined} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        const menu = screen.getByTestId('cm');

        expect(menu).toHaveAttribute('role', 'menu');
        expect(menu.parentElement).toBe(document.body);
        expect(menu).toHaveStyle({ top: '80px', left: '40px' });
        expect(menu).toHaveClass(styles.root, styles.md, styles.primary);
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

    it('closes on outside mousedown', () => {
        const onClose = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={onClose} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        fireEvent.mouseDown(document.body);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on mousedown inside menu', () => {
        const onClose = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={onClose} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        fireEvent.mouseDown(screen.getByTestId('cm'));

        expect(onClose).not.toHaveBeenCalled();
    });

    it('closes on Escape', () => {
        const onClose = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={onClose} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on non-Escape key', () => {
        const onClose = vi.fn();

        render(
            <ContextMenu open x={0} y={0} onClose={onClose} dataTestId="cm">
                <ContextMenu.Item>Pin</ContextMenu.Item>
            </ContextMenu>
        );

        fireEvent.keyDown(document, { key: 'Enter' });

        expect(onClose).not.toHaveBeenCalled();
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
});
