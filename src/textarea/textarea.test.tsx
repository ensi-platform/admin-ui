import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, useField } from '../field/index.js';

import styles from './styles.module.css';

import { TextArea } from './index.js';

const FieldBoundTextArea = () => {
    const { controlProps, size, isInvalid, disabled } = useField();

    return <TextArea {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} />;
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

    it('applies size class', () => {
        render(<TextArea aria-label="Comment" size="sm" />);

        const textarea = screen.getByRole('textbox', { name: 'Comment' });

        expect(textarea).toHaveClass(styles.root);
        expect(textarea).toHaveClass(styles.sm);
    });

    it('sets aria-invalid and data-invalid when isInvalid', () => {
        render(<TextArea aria-label="Comment" isInvalid />);

        const textarea = screen.getByRole('textbox', { name: 'Comment' });

        expect(textarea).toHaveAttribute('aria-invalid', 'true');
        expect(textarea).toHaveAttribute('data-invalid');
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

    it('works with Field via explicit controlProps', () => {
        render(
            <Field isInvalid disabled size="lg">
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
        expect(textarea).toHaveClass(styles.lg);
        expect(textarea.getAttribute('aria-describedby')?.split(' ')).toEqual(
            expect.arrayContaining([hint.id, error.id])
        );
    });
});
