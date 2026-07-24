import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '@/field';
import { AdminUiProvider } from '@/provider';

import { Input } from '..';

import styles from '../styles.module.css';

const FieldBoundInput = () => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Input {...controlProps} size={size} invalid={invalid} disabled={disabled} />;
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

    it('applies size and variant classes on shell', () => {
        render(<Input aria-label="Email" size="sm" variant="primary" dataTestId="email-input" />);

        const shell = screen.getByTestId('email-input');

        expect(shell).toHaveClass(styles.root);
        expect(shell).toHaveClass(styles.sm);
        expect(shell).toHaveClass(styles.primary);
        expect(shell).toHaveClass(styles.block);
    });

    it('omits block class when block={false}', () => {
        render(<Input aria-label="Email" block={false} dataTestId="email-input" />);

        expect(screen.getByTestId('email-input')).not.toHaveClass(styles.block);
    });

    it('sets aria-invalid when invalid', () => {
        render(<Input aria-label="Email" invalid dataTestId="email-input" />);

        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByTestId('email-input')).toHaveAttribute('data-invalid');
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

    it('clears value when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Input aria-label="Email" value="user@example.com" clear onChange={onChange} />
            </AdminUiProvider>
        );

        expect(screen.getByRole('button', { name: 'Очистить' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls[0][0].target.value).toBe('');
    });

    it('works with Field via explicit controlProps', () => {
        render(
            <Field invalid disabled size="lg">
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
        expect(input.parentElement).toHaveClass(styles.lg);
        expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(expect.arrayContaining([hint.id, error.id]));
    });
});
