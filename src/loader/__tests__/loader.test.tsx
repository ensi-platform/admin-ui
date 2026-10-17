import { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { Loader } from '..';

import styles from '../styles.module.css';

const renderWithProvider = (ui: ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('Loader', () => {
    it('sets data-test-id from dataTestId', () => {
        renderWithProvider(
            <Loader dataTestId="loader">
                <span>Content</span>
            </Loader>
        );

        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('hides overlay when inactive', () => {
        renderWithProvider(
            <Loader active={false} dataTestId="loader">
                <span>Content</span>
            </Loader>
        );

        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(screen.getByTestId('loader')).not.toHaveAttribute('aria-busy');
    });

    it('shows overlay and aria-busy when active', () => {
        renderWithProvider(
            <Loader active dataTestId="loader">
                <span>Content</span>
            </Loader>
        );

        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Загрузка');
        expect(screen.getByTestId('loader')).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByRole('status').querySelector(`.${styles.spinner}`)).toBeInTheDocument();
    });

    it('applies size class', () => {
        renderWithProvider(
            <Loader size="sm" dataTestId="loader">
                <span>Content</span>
            </Loader>
        );

        expect(screen.getByTestId('loader')).toHaveClass(styles.sm);
    });

    it('blocks clicks on children while active', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        renderWithProvider(
            <Loader active>
                <button type="button" onClick={onClick}>
                    Action
                </button>
            </Loader>
        );

        await user.click(screen.getByRole('status'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('lets clicks reach children when inactive', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        renderWithProvider(
            <Loader active={false}>
                <button type="button" onClick={onClick}>
                    Action
                </button>
            </Loader>
        );

        await user.click(screen.getByRole('button', { name: 'Action' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('uses an overridden loading label', () => {
        render(
            <AdminUiProvider labels={{ loading: 'Loading' }}>
                <Loader active>
                    <span>Content</span>
                </Loader>
            </AdminUiProvider>
        );

        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    });

    it('has no axe violations when idle and active', async () => {
        const idle = renderWithProvider(
            <Loader>
                <span>Content</span>
            </Loader>
        );

        expect(await axe(idle.container)).toHaveNoViolations();

        idle.unmount();

        const active = renderWithProvider(
            <Loader active>
                <span>Content</span>
            </Loader>
        );

        expect(await axe(active.container)).toHaveNoViolations();
    });
});
