import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '@/button';

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
});
