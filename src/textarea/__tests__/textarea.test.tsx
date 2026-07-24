import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '@/field';
import { AdminUiProvider } from '@/provider';

import { TextArea } from '..';

import styles from '../styles.module.css';

const FieldBoundTextArea = () => {
    const { controlProps, size, invalid, disabled } = useField();

    return <TextArea {...controlProps} size={size} invalid={invalid} disabled={disabled} />;
};

describe('TextArea', () => {
    it('renders textbox', () => {
        render(<TextArea aria-label="Comment" />);

        expect(screen.getByRole('textbox', { name: 'Comment' })).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(<TextArea aria-label="Comment" dataTestId="comment-textarea" />);

        expect(screen.getByTestId('comment-textarea')).toBeInTheDocument();
    });

    it('applies size and variant classes on shell', () => {
        render(<TextArea aria-label="Comment" size="sm" variant="primary" dataTestId="comment-textarea" />);

        const shell = screen.getByTestId('comment-textarea');

        expect(shell).toHaveClass(styles.root);
        expect(shell).toHaveClass(styles.sm);
        expect(shell).toHaveClass(styles.primary);
        expect(shell).toHaveClass(styles.block);
    });

    it('omits block class when block={false}', () => {
        render(<TextArea aria-label="Comment" block={false} dataTestId="comment-textarea" />);

        expect(screen.getByTestId('comment-textarea')).not.toHaveClass(styles.block);
    });

    it('sets aria-invalid when invalid', () => {
        render(<TextArea aria-label="Comment" invalid dataTestId="comment-textarea" />);

        expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByTestId('comment-textarea')).toHaveAttribute('data-invalid');
    });

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<TextArea aria-label="Comment" disabled onChange={onChange} />);

        const textarea = screen.getByRole('textbox', { name: 'Comment' });

        expect(textarea).toBeDisabled();
        await user.type(textarea, 'a');

        expect(onChange).not.toHaveBeenCalled();
    });

    it('clears value when clear is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <TextArea aria-label="Comment" value="Hello" clear onChange={onChange} />
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));

        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls[0][0].target.value).toBe('');
    });

    it('works with Field via explicit controlProps', () => {
        render(
            <Field invalid disabled size="lg">
                <Field.Label>Comment</Field.Label>
                <FieldBoundTextArea />
                <Field.Hint>Helper</Field.Hint>
                <Field.Error>Err</Field.Error>
            </Field>
        );

        const textarea = screen.getByLabelText('Comment');
        const hint = screen.getByText('Helper');
        const error = screen.getByRole('alert');

        expect(textarea).toBeDisabled();
        expect(textarea).toHaveAttribute('aria-invalid', 'true');
        expect(textarea.parentElement).toHaveClass(styles.lg);
        expect(textarea.getAttribute('aria-describedby')?.split(' ')).toEqual(
            expect.arrayContaining([hint.id, error.id])
        );
    });
});
