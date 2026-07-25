import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '@/button';

import { Tooltip } from '..';

import styles from '../styles.module.css';

describe('Tooltip', () => {
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
            expect(screen.getByTestId('tip')).toHaveTextContent('Подсказка');
        });
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
