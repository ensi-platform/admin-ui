import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '../provider/index.js';

import styles from './styles.module.css';

import { Tag } from './index.js';

describe('Tag', () => {
    it('renders children', () => {
        render(<Tag>vip</Tag>);

        expect(screen.getByText('vip')).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Tag dataTestId="label-tag">vip</Tag>);

        expect(screen.getByTestId('label-tag')).toBeInTheDocument();
    });

    it('applies size class', () => {
        const { container } = render(<Tag size="sm">vip</Tag>);

        expect(container.firstChild).toHaveClass(styles.sm);
    });

    it('calls onRemove when clear is clicked', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Удалить' }}>
                <Tag onRemove={onRemove}>vip</Tag>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Удалить' }));

        expect(onRemove).toHaveBeenCalledTimes(1);
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

        expect(screen.getByRole('button', { name: 'Удалить' })).toBeDisabled();
    });
});
