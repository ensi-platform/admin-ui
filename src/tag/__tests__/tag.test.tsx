import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { Tag } from '..';

import styles from '../styles.module.css';

describe('Tag', () => {
    it('renders children', () => {
        render(<Tag>vip</Tag>);

        expect(screen.getByText('vip')).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Tag dataTestId="label-tag">vip</Tag>);

        expect(screen.getByTestId('label-tag')).toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        render(
            <Tag size="sm" variant="primary">
                vip
            </Tag>
        );

        expect(screen.getByText('vip').parentElement).toHaveClass(styles.sm, styles.primary);
    });

    it('calls onRemove once and does not bubble the click', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        const onParentClick = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Удалить' }}>
                <div onClick={onParentClick}>
                    <Tag onRemove={onRemove}>vip</Tag>
                </div>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Удалить' }));

        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onParentClick).not.toHaveBeenCalled();
    });

    it('does not bubble pointerdown and keeps focus on the previous control', async () => {
        const user = userEvent.setup();
        const onParentPointerDown = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Удалить' }}>
                <button type="button">Trigger</button>
                <div onPointerDown={onParentPointerDown}>
                    <Tag onRemove={vi.fn()}>vip</Tag>
                </div>
            </AdminUiProvider>
        );

        const trigger = screen.getByRole('button', { name: 'Trigger' });

        trigger.focus();
        await user.pointer({ keys: '[MouseLeft>]', target: screen.getByRole('button', { name: 'Удалить' }) });

        expect(onParentPointerDown).not.toHaveBeenCalled();
        expect(trigger).toHaveFocus();
    });

    it('does not render remove without onRemove', () => {
        render(
            <AdminUiProvider labels={{ clear: 'Удалить' }}>
                <Tag>vip</Tag>
            </AdminUiProvider>
        );

        expect(screen.queryByRole('button', { name: 'Удалить' })).not.toBeInTheDocument();
    });

    it('disables remove when disabled', () => {
        render(
            <AdminUiProvider labels={{ clear: 'Удалить' }}>
                <Tag disabled onRemove={vi.fn()}>
                    vip
                </Tag>
            </AdminUiProvider>
        );

        const button = screen.getByRole('button', { name: 'Удалить' });

        expect(button).toBeDisabled();
    });
});
