import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '../field/index.js';

import styles from './styles.module.css';

import { Input } from './index.js';

const FieldBoundInput = () => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <Input {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} />;
};

describe('Input', () => {
    it('renders textbox', () => {
        render(<Input aria-label="Email" />);

        expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<Input aria-label="Email" dataTestId="email-input" />);

        expect(screen.getByTestId('email-input')).toBeInTheDocument();
    });

    it('applies size class', () => {
        render(<Input aria-label="Email" size="sm" />);

        const input = screen.getByRole('textbox', { name: 'Email' });

        expect(input).toHaveClass(styles.root);
        expect(input).toHaveClass(styles.sm);
    });

    it('sets aria-invalid and data-invalid when isInvalid', () => {
        render(<Input aria-label="Email" isInvalid />);

        const input = screen.getByRole('textbox', { name: 'Email' });

        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('data-invalid');
    });

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Input aria-label="Email" disabled onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'Email' });

        expect(input).toBeDisabled();
        await user.type(input, 'a');

        expect(onChange).not.toHaveBeenCalled();
    });

    it('works with Field via explicit controlProps', () => {
        render(
            <Field isInvalid disabled size="lg">
                <Field.Label>Email</Field.Label>
                <FieldBoundInput />
                <Field.Hint>Helper</Field.Hint>
                <Field.Error>Err</Field.Error>
            </Field>
        );

        const input = screen.getByLabelText('Email');
        const hint = screen.getByText('Helper');
        const error = screen.getByRole('alert');

        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveClass(styles.lg);
        expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(expect.arrayContaining([hint.id, error.id]));
    });
});
