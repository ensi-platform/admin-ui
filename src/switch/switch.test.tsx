import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import styles from './styles.module.css';

import { Switch } from './index.js';

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

    it('applies size class', () => {
        render(
            <Switch size="sm" dataTestId="sw">
                Size
            </Switch>
        );

        expect(screen.getByTestId('sw')).toHaveClass(styles.root);
        expect(screen.getByTestId('sw')).toHaveClass(styles.sm);
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

    it('applies invalid class when isInvalid', () => {
        render(
            <Switch isInvalid dataTestId="invalid-sw">
                Notifications
            </Switch>
        );

        expect(screen.getByTestId('invalid-sw')).toHaveClass(styles.invalid);
    });
});
