import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '@/field';
import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { Input } from '..';

import styles from '../styles.module.css';

const FieldBoundInput = () => {
    const { controlProps, size, invalid, disabled } = useField();

    return <Input {...controlProps} size={size} invalid={invalid} disabled={disabled} />;
};

describe('Input', () => {
    it('keeps a read-only value focusable and unchanged', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Input aria-label="Email" value="keep" readOnly onChange={onChange} dataTestId="email-input" />);

        const input = screen.getByRole('textbox', { name: 'Email' });

        expect(input).toHaveAttribute('readonly');
        expect(input).not.toBeDisabled();
        expect(screen.getByTestId('email-input')).not.toHaveAttribute('data-disabled');
        expect(screen.getByTestId('email-input')).toHaveAttribute('data-readonly', 'true');

        await user.click(input);
        await user.type(input, 'x');

        expect(onChange).not.toHaveBeenCalled();
        expect(input).toHaveValue('keep');
    });

    it('hides the clear button when read-only', () => {
        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <Input aria-label="Email" value="keep" readOnly clear />
            </AdminUiProvider>
        );

        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });

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

    it('follows value and does not call onChange when the prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Input aria-label="Email" value="a" onChange={onChange} />);

        rerender(<Input aria-label="Email" value="b" onChange={onChange} />);

        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('b');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('assigns object ref', () => {
        const ref = createRef<HTMLInputElement>();

        render(<Input aria-label="Email" ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('updates uncontrolled value on type and clear', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Input aria-label="Email" defaultValue="hello" clear onChange={onChange} />
            </AdminUiProvider>
        );

        const input = screen.getByRole('textbox', { name: 'Email' });

        expect(input).toHaveValue('hello');

        await user.type(input, '!');
        expect(onChange).toHaveBeenCalled();
        expect(input).toHaveValue('hello!');

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange.mock.calls.at(-1)?.[0].target.value).toBe('');
        expect(input).toHaveValue('');
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

    it('blocks input past maxLength and accepts paste', async () => {
        const user = userEvent.setup();

        render(<Input aria-label="Code" maxLength={3} />);

        const input = screen.getByRole('textbox', { name: 'Code' });
        await user.type(input, 'abcd');
        expect(input).toHaveValue('abc');

        await user.clear(input);
        await user.paste('12');
        expect(input).toHaveValue('12');
    });

    it('replaces the selected text', async () => {
        const user = userEvent.setup();

        render(<Input aria-label="Email" defaultValue="abcd" />);

        const input = screen.getByRole('textbox', { name: 'Email' });
        await user.click(input);
        await user.keyboard('{Control>}a{/Control}z');

        expect(input).toHaveValue('z');
    });

    it('shows the placeholder and calls onBlur', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(<Input aria-label="Email" placeholder="name@example.com" onBlur={onBlur} />);

        const input = screen.getByRole('textbox', { name: 'Email' });

        expect(input).toHaveAttribute('placeholder', 'name@example.com');

        await user.click(input);
        await user.tab();

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('keeps the controlled value when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        render(<Input aria-label="Email" value="keep" onChange={() => undefined} />);

        const input = screen.getByRole('textbox', { name: 'Email' });
        await user.type(input, 'x');

        expect(input).toHaveValue('keep');
    });

    it('sets the native type', () => {
        render(<Input aria-label="Email" type="email" />);

        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = render(<Input aria-label="Email" />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = render(<Input aria-label="Email" disabled value="a" />);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = render(<Input aria-label="Email" invalid value="a" />);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });

    // n/a: Escape and Enter have no Input contract. Enter only submits a parent form.
});
