import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import styles from './styles.module.css';

import { Checkbox } from './index.js';

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

    it('applies size class', () => {
        render(
            <Checkbox size="sm" dataTestId="box">
                Size
            </Checkbox>
        );

        expect(screen.getByTestId('box')).toHaveClass(styles.root);
        expect(screen.getByTestId('box')).toHaveClass(styles.sm);
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

    it('sets data-invalid when isInvalid', () => {
        render(
            <Checkbox isInvalid dataTestId="invalid-box">
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
});
