import { type InputHTMLAttributes } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Field, useField } from '..';

import styles from '../styles.module.css';

const DemoInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
    const { controlProps } = useField();

    return <input {...controlProps} {...props} />;
};

describe('Field', () => {
    it('applies block class by default', () => {
        render(
            <Field dataTestId="email-field">
                <Field.Label>Email</Field.Label>
                <DemoInput />
            </Field>
        );

        expect(screen.getByTestId('email-field')).toHaveClass(styles.block);
    });

    it('omits block class when block={false}', () => {
        render(
            <Field dataTestId="email-field" block={false}>
                <Field.Label>Email</Field.Label>
                <DemoInput />
            </Field>
        );

        expect(screen.getByTestId('email-field')).not.toHaveClass(styles.block);
    });

    it('associates label with control via controlProps', () => {
        render(
            <Field>
                <Field.Label>Email</Field.Label>
                <DemoInput />
            </Field>
        );

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('sets data-test-id from dataTestId', () => {
        render(
            <Field dataTestId="email-field">
                <Field.Label>Email</Field.Label>
                <DemoInput />
            </Field>
        );

        expect(screen.getByTestId('email-field')).toBeInTheDocument();
    });

    it('links hint through aria-describedby', () => {
        render(
            <Field>
                <Field.Label>Email</Field.Label>
                <DemoInput />
                <Field.Hint>Helper text</Field.Hint>
            </Field>
        );

        const input = screen.getByLabelText('Email');
        const hint = screen.getByText('Helper text');

        expect(input).toHaveAttribute('aria-describedby', hint.id);
    });

    it('sets aria-invalid and shows error when invalid', () => {
        render(
            <Field invalid>
                <Field.Label>Email</Field.Label>
                <DemoInput />
                <Field.Error>Некорректный email</Field.Error>
            </Field>
        );

        const input = screen.getByLabelText('Email');
        const error = screen.getByRole('alert');

        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(error).toHaveTextContent('Некорректный email');
        expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
    });

    it('does not render error without children or when valid', () => {
        const { rerender } = render(
            <Field invalid>
                <Field.Label>Email</Field.Label>
                <DemoInput />
                <Field.Error />
            </Field>
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        rerender(
            <Field>
                <Field.Label>Email</Field.Label>
                <DemoInput />
                <Field.Error>Hidden</Field.Error>
            </Field>
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('passes disabled through controlProps', () => {
        render(
            <Field disabled>
                <Field.Label>Email</Field.Label>
                <DemoInput />
            </Field>
        );

        expect(screen.getByLabelText('Email')).toBeDisabled();
    });

    it('exposes controlProps via useField', () => {
        render(
            <Field invalid>
                <Field.Label>Email</Field.Label>
                <DemoInput />
                <Field.Error>Err</Field.Error>
            </Field>
        );

        const input = screen.getByLabelText('Email');

        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input.id).toMatch(/^aui-field-/);
    });

    it('scales Label / Hint / Error typography by size', () => {
        const { rerender } = render(
            <Field size="md" invalid>
                <Field.Label>Email</Field.Label>
                <DemoInput />
                <Field.Hint>Hint</Field.Hint>
                <Field.Error>Error</Field.Error>
            </Field>
        );

        expect(screen.getByText('Email').className).toMatch(/bodyS/);
        expect(screen.getByText('Hint').className).toMatch(/bodyXs/);
        expect(screen.getByRole('alert').className).toMatch(/bodyXs/);

        rerender(
            <Field size="lg" invalid>
                <Field.Label>Email</Field.Label>
                <DemoInput />
                <Field.Hint>Hint</Field.Hint>
                <Field.Error>Error</Field.Error>
            </Field>
        );

        expect(screen.getByText('Email').className).toMatch(/bodyM/);
        expect(screen.getByText('Hint').className).toMatch(/bodyS/);
        expect(screen.getByRole('alert').className).toMatch(/bodyS/);
    });
});
