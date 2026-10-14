import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '@/button';

import { Tooltip } from '..';

import styles from '../styles.module.css';

describe('Tooltip', () => {
    // jsdom: no layout — hover and delay need pointer hit-testing. Focus open is covered below.
    it('does not show content for a disabled trigger', async () => {
        const user = userEvent.setup();

        render(
            <Tooltip delay={0}>
                <Tooltip.Trigger>
                    <Button disabled>Help</Button>
                </Tooltip.Trigger>
                <Tooltip.Content>Подсказка</Tooltip.Content>
            </Tooltip>
        );

        await user.click(screen.getByRole('button', { name: 'Help' }));

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('shows content on focus', async () => {
        const user = userEvent.setup();

        render(
            <Tooltip delay={0}>
                <Tooltip.Trigger>
                    <Button>Help</Button>
                </Tooltip.Trigger>
                <Tooltip.Content dataTestId="tip">Подсказка</Tooltip.Content>
            </Tooltip>
        );

        await user.tab();

        await waitFor(() => {
            expect(screen.getByRole('tooltip')).toHaveTextContent('Подсказка');
        });
    });

    it('hides content on Escape', async () => {
        const user = userEvent.setup();

        render(
            <Tooltip delay={0} closeDelay={0}>
                <Tooltip.Trigger>
                    <Button>Help</Button>
                </Tooltip.Trigger>
                <Tooltip.Content>Подсказка</Tooltip.Content>
            </Tooltip>
        );

        await user.tab();

        await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    it('hides content when focus leaves the trigger', async () => {
        const user = userEvent.setup();

        render(
            <>
                <Tooltip delay={0} closeDelay={0}>
                    <Tooltip.Trigger>
                        <Button>Help</Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Подсказка</Tooltip.Content>
                </Tooltip>
                <button type="button">Next</button>
            </>
        );

        await user.tab();

        await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        await user.tab();

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    });

    it('sets data-test-id from dataTestId', () => {
        render(
            <Tooltip delay={0} isOpen>
                <Tooltip.Trigger>
                    <Button>Help</Button>
                </Tooltip.Trigger>
                <Tooltip.Content dataTestId="help-tip">Текст</Tooltip.Content>
            </Tooltip>
        );

        expect(screen.getByTestId('help-tip')).toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        render(
            <Tooltip delay={0} isOpen>
                <Tooltip.Trigger>
                    <Button>Help</Button>
                </Tooltip.Trigger>
                <Tooltip.Content size="sm" variant="primary" dataTestId="tip">
                    Текст
                </Tooltip.Content>
            </Tooltip>
        );

        const tip = screen.getByTestId('tip');
        expect(tip).toHaveClass(styles.sm);
        expect(tip).toHaveClass(styles.primary);
    });

    it('renders arrow svg when arrow is set', () => {
        render(
            <Tooltip delay={0} isOpen>
                <Tooltip.Trigger>
                    <Button>Help</Button>
                </Tooltip.Trigger>
                <Tooltip.Content arrow dataTestId="tip">
                    Текст
                </Tooltip.Content>
            </Tooltip>
        );

        expect(screen.getByTestId('tip').querySelector('svg')).toBeInTheDocument();
    });

    it('does not render arrow without arrow prop', () => {
        render(
            <Tooltip delay={0} isOpen>
                <Tooltip.Trigger>
                    <Button>Help</Button>
                </Tooltip.Trigger>
                <Tooltip.Content dataTestId="tip">Текст</Tooltip.Content>
            </Tooltip>
        );

        expect(screen.getByTestId('tip').querySelector('svg')).not.toBeInTheDocument();
    });
});
