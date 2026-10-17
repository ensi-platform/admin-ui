import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/button';
import { axe } from '@/test/axe';

import { Popover } from '..';

import styles from '../styles.module.css';

describe('Popover', () => {
    it('opens dialog content on click', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content dataTestId="panel">Контент</Popover.Content>
            </Popover>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.getByRole('dialog')).toHaveTextContent('Контент');
        expect(screen.getByTestId('panel')).toBeInTheDocument();
    });

    it('opens with Enter on the trigger and does not open a disabled trigger', async () => {
        const user = userEvent.setup();

        render(
            <>
                <Popover>
                    <Popover.Trigger>
                        <Button>Open</Button>
                    </Popover.Trigger>
                    <Popover.Content>Контент</Popover.Content>
                </Popover>
                <Popover>
                    <Popover.Trigger>
                        <Button disabled>Closed</Button>
                    </Popover.Trigger>
                    <Popover.Content>Скрыто</Popover.Content>
                </Popover>
            </>
        );

        await user.tab();
        expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        await user.keyboard('{Enter}');
        expect(screen.getByRole('dialog')).toHaveTextContent('Контент');

        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Closed' }));
        expect(screen.queryByText('Скрыто')).not.toBeInTheDocument();
    });

    it('does not open on hover and opens on click', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content>Контент</Popover.Content>
            </Popover>
        );

        const trigger = screen.getByRole('button', { name: 'Open' });

        await user.hover(trigger);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        await user.click(trigger);
        expect(screen.getByRole('dialog')).toHaveTextContent('Контент');
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content>Контент</Popover.Content>
            </Popover>
        );

        const trigger = screen.getByRole('button', { name: 'Open' });

        await user.click(trigger);
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('keeps Tab inside the popover', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content>
                    <button type="button">Inside</button>
                </Popover.Content>
            </Popover>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));
        const dialog = screen.getByRole('dialog');
        await user.tab();
        expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();

        await user.tab();
        expect(dialog.contains(document.activeElement)).toBe(true);
    });

    it('closes on outside click', async () => {
        const user = userEvent.setup();

        render(
            <>
                <button type="button">Outside</button>
                <Popover>
                    <Popover.Trigger>
                        <Button>Open</Button>
                    </Popover.Trigger>
                    <Popover.Content>Контент</Popover.Content>
                </Popover>
            </>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await user.click(screen.getByText('Outside'));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('follows the open prop and does not open when it stays closed', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Popover isOpen={false} onOpenChange={onOpenChange}>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content>Контент</Popover.Content>
            </Popover>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('sets data-test-id from dataTestId', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content dataTestId="filters-panel">Фильтры</Popover.Content>
            </Popover>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.getByTestId('filters-panel')).toBeInTheDocument();
    });

    it('applies size and variant classes', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content size="sm" variant="primary" dataTestId="panel">
                    Контент
                </Popover.Content>
            </Popover>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));

        const panel = screen.getByTestId('panel');
        expect(panel).toHaveClass(styles.sm);
        expect(panel).toHaveClass(styles.primary);
    });

    it('renders arrow svg when arrow is set', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content arrow dataTestId="panel">
                    Контент
                </Popover.Content>
            </Popover>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.getByTestId('panel').querySelector('svg')).toBeInTheDocument();
    });

    it('does not render arrow without arrow prop', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content dataTestId="panel">Контент</Popover.Content>
            </Popover>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.getByTestId('panel').querySelector('svg')).not.toBeInTheDocument();
    });

    it('has no axe violations when open', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <Button>Open</Button>
                </Popover.Trigger>
                <Popover.Content>Контент</Popover.Content>
            </Popover>
        );

        await user.click(screen.getByRole('button', { name: 'Open' }));

        expect(await axe(container)).toHaveNoViolations();
    });
});
