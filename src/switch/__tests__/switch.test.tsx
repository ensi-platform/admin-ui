import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { axe } from '@/test/axe';

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

    it('toggles when the label text is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Switch checked={false} onChange={onChange}>
                Notifications
            </Switch>
        );

        await user.click(screen.getByText('Notifications'));

        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('toggles with Space and keeps defaultChecked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Switch defaultChecked onChange={onChange}>
                Notifications
            </Switch>
        );

        const sw = screen.getByRole('switch', { name: 'Notifications' });

        expect(sw).toBeChecked();
        sw.focus();
        await user.keyboard(' ');

        expect(onChange).toHaveBeenCalledWith(false);
        expect(sw).not.toBeChecked();
    });

    it('does not toggle on Enter', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Switch onChange={onChange}>Notifications</Switch>);

        const sw = screen.getByRole('switch', { name: 'Notifications' });
        sw.focus();
        await user.keyboard('{Enter}');

        expect(onChange).not.toHaveBeenCalled();
        expect(sw).not.toBeChecked();
    });

    it('keeps the controlled state when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        render(
            <Switch checked={false} onChange={() => undefined}>
                Notifications
            </Switch>
        );

        const sw = screen.getByRole('switch', { name: 'Notifications' });
        await user.click(sw);

        expect(sw).not.toBeChecked();
    });

    it('follows checked and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(
            <Switch checked={false} onChange={onChange}>
                Notifications
            </Switch>
        );

        rerender(
            <Switch checked onChange={onChange}>
                Notifications
            </Switch>
        );

        expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
        expect(onChange).not.toHaveBeenCalled();
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
        sw.focus();
        await user.keyboard(' ');

        expect(onChange).not.toHaveBeenCalled();
        expect(sw).not.toBeChecked();
    });

    it('sets aria-invalid when invalid', () => {
        render(
            <Switch invalid dataTestId="invalid-sw">
                Notifications
            </Switch>
        );

        expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByTestId('invalid-sw')).toHaveClass(styles.invalid);
    });

    it('assigns object ref', () => {
        const ref = createRef<HTMLLabelElement>();

        render(<Switch ref={ref}>Notifications</Switch>);

        expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it('renders without label when children are omitted', () => {
        render(<Switch aria-label="Notifications" dataTestId="no-label" />);

        expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
        expect(screen.getByTestId('no-label').querySelector(`.${styles.label}`)).not.toBeInTheDocument();
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = render(<Switch>Notifications</Switch>);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(<Switch disabled>Notifications</Switch>);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = render(<Switch invalid>Notifications</Switch>);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
