import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '..';

import styles from '../styles.module.css';

describe('Checkbox', () => {
    it('renders checkbox with label', () => {
        render(<Checkbox>Agree</Checkbox>);

        expect(screen.getByRole('checkbox', { name: 'Agree' })).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(
            <Checkbox dataTestId="agree-checkbox" aria-label="Agree">
                Agree
            </Checkbox>
        );

        expect(screen.getByTestId('agree-checkbox')).toBeInTheDocument();
    });

    it('applies size and variant classes', () => {
        render(
            <Checkbox size="sm" variant="primary" dataTestId="box">
                Size
            </Checkbox>
        );

        expect(screen.getByTestId('box')).toHaveClass(styles.root);
        expect(screen.getByTestId('box')).toHaveClass(styles.sm);
        expect(screen.getByTestId('box')).toHaveClass(styles.primary);
    });

    it('toggles checked on click', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Checkbox checked={false} onChange={onChange}>
                Agree
            </Checkbox>
        );

        await user.click(screen.getByRole('checkbox', { name: 'Agree' }));

        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('toggles when the label text is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Checkbox checked={false} onChange={onChange}>
                Agree
            </Checkbox>
        );

        await user.click(screen.getByText('Agree'));

        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('toggles with Space and keeps defaultChecked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Checkbox defaultChecked onChange={onChange}>
                Agree
            </Checkbox>
        );

        const checkbox = screen.getByRole('checkbox', { name: 'Agree' });

        expect(checkbox).toBeChecked();
        checkbox.focus();
        await user.keyboard(' ');

        expect(onChange).toHaveBeenCalledWith(false);
        expect(checkbox).not.toBeChecked();
    });

    it('follows checked and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(
            <Checkbox checked={false} onChange={onChange}>
                Agree
            </Checkbox>
        );

        rerender(
            <Checkbox checked onChange={onChange}>
                Agree
            </Checkbox>
        );

        expect(screen.getByRole('checkbox', { name: 'Agree' })).toBeChecked();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Checkbox disabled onChange={onChange}>
                Agree
            </Checkbox>
        );

        const checkbox = screen.getByRole('checkbox', { name: 'Agree' });

        expect(checkbox).toBeDisabled();
        await user.click(checkbox);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('sets data-invalid when invalid', () => {
        render(
            <Checkbox invalid dataTestId="invalid-box">
                Agree
            </Checkbox>
        );

        expect(screen.getByTestId('invalid-box')).toHaveAttribute('data-invalid');
    });

    it('sets data-indeterminate when indeterminate', () => {
        render(
            <Checkbox indeterminate dataTestId="indet-box">
                All
            </Checkbox>
        );

        expect(screen.getByTestId('indet-box')).toHaveAttribute('data-indeterminate');
    });

    it('renders without label when children are omitted', () => {
        render(<Checkbox aria-label="Agree" dataTestId="no-label" />);

        expect(screen.getByRole('checkbox', { name: 'Agree' })).toBeInTheDocument();
        expect(screen.getByTestId('no-label').querySelector(`.${styles.label}`)).not.toBeInTheDocument();
    });

    it('applies compact field class on CheckboxField without label', () => {
        const { container } = render(<Checkbox aria-label="Agree" dataTestId="compact" />);

        const field = container.querySelector(`.${styles.field}`);

        expect(field).toBeTruthy();
        expect(field).toHaveClass(styles.field);
        expect(screen.getByTestId('compact').querySelector(`.${styles.box}`)).toBeTruthy();
    });
});
