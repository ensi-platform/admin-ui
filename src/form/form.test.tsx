import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form, getError, useAuiForm, useFieldHook } from './index.js';

const schema = z.object({
    email: z.string().email('Некорректный email'),
});

const EmailField = () => {
    const { field, fieldState, onChangeHandler, onBlurHandler, inputProps } = useFieldHook({ name: 'email' });
    const error = getError(fieldState.error)?.message;

    return (
        <>
            <input
                {...inputProps}
                aria-label="Email"
                value={field.value ?? ''}
                onChange={e => onChangeHandler(e)}
                onBlur={e => onBlurHandler(e)}
            />
            {error ? <span role="alert">{error}</span> : null}
        </>
    );
};

const DisabledProbe = () => {
    const { disabled } = useAuiForm();

    return <span data-test-id="disabled-flag">{String(disabled)}</span>;
};

describe('Form', () => {
    it('submits valid values', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ email: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <EmailField />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Email'), 'user@example.com');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ email: 'user@example.com' });
    });

    it('shows validation error and calls onError', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const onError = vi.fn();

        render(
            <Form initialValues={{ email: '' }} validationSchema={schema} onSubmit={onSubmit} onError={onError}>
                <EmailField />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Email'), 'not-email');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Некорректный email');
        expect(onSubmit).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(onError).toHaveBeenCalled();
        });
    });

    it('passes disabled through FormContext', () => {
        render(
            <Form initialValues={{ email: '' }} disabled onSubmit={vi.fn()}>
                <DisabledProbe />
            </Form>
        );

        expect(screen.getByTestId('disabled-flag')).toHaveTextContent('true');
    });

    it('renders div when isForm is false', () => {
        const { container } = render(
            <Form initialValues={{ email: '' }} isForm={false} onSubmit={vi.fn()}>
                <span>content</span>
            </Form>
        );

        expect(container.querySelector('form')).toBeNull();
        expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('calls onChange without onSubmit', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Form initialValues={{ email: '' }} onChange={onChange}>
                <EmailField />
            </Form>
        );

        await user.type(screen.getByLabelText('Email'), 'a');

        await waitFor(() => {
            expect(onChange).toHaveBeenCalled();
        });

        expect(onChange.mock.calls.at(-1)?.[0]).toMatchObject({ email: 'a' });
        expect(onChange.mock.calls.at(-1)?.[2]).toEqual({ email: 'a' });
    });

    it('throws useAuiForm outside Form', () => {
        expect(() => render(<DisabledProbe />)).toThrow('This component must be used within a <Form> component');
    });
});
