import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { axe } from '@/test/axe';

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

    it('does not toggle on Enter', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Checkbox onChange={onChange}>Agree</Checkbox>);

        const checkbox = screen.getByRole('checkbox', { name: 'Agree' });
        checkbox.focus();
        await user.keyboard('{Enter}');

        expect(onChange).not.toHaveBeenCalled();
        expect(checkbox).not.toBeChecked();
    });

    it('keeps the controlled state when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        render(
            <Checkbox checked={false} onChange={() => undefined}>
                Agree
            </Checkbox>
        );

        const checkbox = screen.getByRole('checkbox', { name: 'Agree' });
        await user.click(checkbox);

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
        checkbox.focus();
        await user.keyboard(' ');

        expect(onChange).not.toHaveBeenCalled();
        expect(checkbox).not.toBeChecked();
    });

    it('sets aria-invalid when invalid', () => {
        render(
            <Checkbox invalid dataTestId="invalid-box">
                Agree
            </Checkbox>
        );

        expect(screen.getByRole('checkbox', { name: 'Agree' })).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByTestId('invalid-box')).toHaveAttribute('data-invalid');
    });

    it('exposes mixed when indeterminate', () => {
        render(
            <Checkbox indeterminate dataTestId="indet-box">
                All
            </Checkbox>
        );

        expect(screen.getByRole('checkbox', { name: 'All' })).toBePartiallyChecked();
        expect(screen.getByTestId('indet-box')).toHaveAttribute('data-indeterminate');
    });

    it('assigns object ref', () => {
        const ref = createRef<HTMLLabelElement>();

        render(<Checkbox ref={ref}>Agree</Checkbox>);

        expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it('renders without label when children are omitted', () => {
        render(<Checkbox aria-label="Agree" dataTestId="no-label" />);

        expect(screen.getByRole('checkbox', { name: 'Agree' })).toBeInTheDocument();
        expect(screen.getByTestId('no-label').querySelector(`.${styles.label}`)).not.toBeInTheDocument();
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = render(<Checkbox>Agree</Checkbox>);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(<Checkbox disabled>Agree</Checkbox>);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = render(<Checkbox invalid>Agree</Checkbox>);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
