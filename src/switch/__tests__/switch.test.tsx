import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from '..';

import styles from '../styles.module.css';

describe('Switch', () => {
    it('renders switch with label', () => {
        render(<Switch>Notifications</Switch>);

        expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(
            <Switch dataTestId="notif-switch" aria-label="Notifications">
                Notifications
            </Switch>
        );

        expect(screen.getByTestId('notif-switch')).toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        render(
            <Switch size="sm" variant="primary" dataTestId="sw">
                Size
            </Switch>
        );

        expect(screen.getByTestId('sw')).toHaveClass(styles.root);
        expect(screen.getByTestId('sw')).toHaveClass(styles.sm);
        expect(screen.getByTestId('sw')).toHaveClass(styles.primary);
    });

    it('toggles checked on click', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Switch checked={false} onChange={onChange}>
                Notifications
            </Switch>
        );

        await user.click(screen.getByRole('switch', { name: 'Notifications' }));

        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Switch disabled onChange={onChange}>
                Notifications
            </Switch>
        );

        const sw = screen.getByRole('switch', { name: 'Notifications' });

        expect(sw).toBeDisabled();
        await user.click(sw);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('applies invalid class when invalid', () => {
        render(
            <Switch invalid dataTestId="invalid-sw">
                Notifications
            </Switch>
        );

        expect(screen.getByTestId('invalid-sw')).toHaveClass(styles.invalid);
    });

    it('renders without label when children are omitted', () => {
        render(<Switch aria-label="Notifications" dataTestId="no-label" />);

        expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
        expect(screen.getByTestId('no-label').querySelector(`.${styles.label}`)).not.toBeInTheDocument();
    });
});
