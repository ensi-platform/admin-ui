import { useEffect, useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form, getError, useAuiForm, useFieldHook } from '..';

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

const FieldHookBranchesField = () => {
    const { field, onChangeHandler, onBlurHandler, inputProps } = useFieldHook({ name: 'email' });

    useEffect(() => {
        onChangeHandler(undefined, 'from-val');
        onChangeHandler();
    }, [onChangeHandler]);

    return (
        <input
            {...inputProps}
            aria-label="Email"
            value={field.value ?? ''}
            onChange={e => onChangeHandler(e)}
            onBlur={e => onBlurHandler(e)}
        />
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

    it('calls onReset when reset is invoked from children render prop', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();

        render(
            <Form initialValues={{ email: '' }} onReset={onReset} onSubmit={vi.fn()}>
                {({ reset }) => (
                    <>
                        <EmailField />
                        <button type="button" onClick={() => reset({ email: 'reset@example.com' })}>
                            Reset
                        </button>
                    </>
                )}
            </Form>
        );

        await user.type(screen.getByLabelText('Email'), 'a');
        await user.click(screen.getByRole('button', { name: 'Reset' }));

        await waitFor(() => {
            expect(onReset).toHaveBeenCalled();
        });

        expect(onReset.mock.calls[0][0]).toEqual({ email: 'reset@example.com' });
        expect(screen.getByLabelText('Email')).toHaveValue('reset@example.com');
    });

    it('resets without onReset callback', async () => {
        const user = userEvent.setup();

        render(
            <Form initialValues={{ email: '' }} onSubmit={vi.fn()}>
                {({ reset }) => (
                    <>
                        <EmailField />
                        <button type="button" onClick={() => reset({ email: 'reset@example.com' })}>
                            Reset
                        </button>
                    </>
                )}
            </Form>
        );

        await user.type(screen.getByLabelText('Email'), 'a');
        await user.click(screen.getByRole('button', { name: 'Reset' }));

        await waitFor(() => {
            expect(screen.getByLabelText('Email')).toHaveValue('reset@example.com');
        });
    });

    it('submits via onSubmitHandler without an event', async () => {
        const onSubmit = vi.fn();

        const SubmitProbe = () => {
            const { onSubmitHandler } = useAuiForm();

            useEffect(() => {
                onSubmitHandler();
            }, [onSubmitHandler]);

            return null;
        };

        render(
            <Form initialValues={{ email: 'user@example.com' }} validationSchema={schema} onSubmit={onSubmit}>
                <SubmitProbe />
            </Form>
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ email: 'user@example.com' }, expect.anything());
        });
    });

    it('reinitializes values when enableReinitialize and initialValues change', async () => {
        const onSubmit = vi.fn();

        const Harness = () => {
            const [initialValues, setInitialValues] = useState({ email: 'first@example.com' });

            return (
                <>
                    <button type="button" onClick={() => setInitialValues({ email: 'second@example.com' })}>
                        Reinit
                    </button>
                    <Form initialValues={initialValues} enableReinitialize onSubmit={onSubmit}>
                        <EmailField />
                    </Form>
                </>
            );
        };

        const user = userEvent.setup();
        render(<Harness />);

        expect(screen.getByLabelText('Email')).toHaveValue('first@example.com');

        await user.click(screen.getByRole('button', { name: 'Reinit' }));

        await waitFor(() => {
            expect(screen.getByLabelText('Email')).toHaveValue('second@example.com');
        });
    });

    it('triggers validation after reinitialize when triggerOnReinitialize', async () => {
        const user = userEvent.setup();

        const Harness = () => {
            const [initialValues, setInitialValues] = useState({ email: 'ok@example.com' });

            return (
                <>
                    <button type="button" onClick={() => setInitialValues({ email: 'bad' })}>
                        Reinit
                    </button>
                    <Form
                        initialValues={initialValues}
                        validationSchema={schema}
                        enableReinitialize
                        triggerOnReinitialize
                        onSubmit={vi.fn()}
                    >
                        <EmailField />
                    </Form>
                </>
            );
        };

        render(<Harness />);

        await user.click(screen.getByRole('button', { name: 'Reinit' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Некорректный email');
    });

    it('calls onBlur from Form', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();

        render(
            <Form initialValues={{ email: 'a@example.com' }} onBlur={onBlur} onSubmit={vi.fn()}>
                <EmailField />
            </Form>
        );

        await user.click(screen.getByLabelText('Email'));
        await user.tab();

        await waitFor(() => {
            expect(onBlur).toHaveBeenCalled();
        });

        expect(onBlur.mock.calls[0][0]).toMatchObject({ email: 'a@example.com' });
        expect(onBlur.mock.calls[0][2]).toEqual({ email: 'a@example.com' });
    });

    it('covers useFieldHook onChangeHandler val and empty event branches', async () => {
        render(
            <Form initialValues={{ email: '' }} onSubmit={vi.fn()}>
                <FieldHookBranchesField />
            </Form>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('Email')).toHaveValue('from-val');
        });
    });
});

describe('getError', () => {
    it('returns the first item when value is an array', () => {
        expect(
            getError([
                { type: 'custom', message: 'first' },
                { type: 'custom', message: 'second' },
            ] as never)
        ).toEqual({ type: 'custom', message: 'first' });
    });

    it('returns the value when it is not an array', () => {
        expect(getError({ type: 'custom', message: 'solo' })).toEqual({ type: 'custom', message: 'solo' });
    });
});
