import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormInput } from '..';

const schema = z.object({
    email: z.string().email('Некорректный email'),
});

describe('FormInput', () => {
    it('submits typed value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ email: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormInput name="email" label="Email" />
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

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ email: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormInput name="email" label="Email" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Email'), 'not-email');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Некорректный email');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables input when Form is disabled', () => {
        render(
            <Form initialValues={{ email: '' }} disabled onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" />
            </Form>
        );

        expect(screen.getByLabelText('Email')).toBeDisabled();
    });

    it('sets data-test-id on Field root', () => {
        render(
            <Form initialValues={{ email: '' }} onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" dataTestId="email-field" />
            </Form>
        );

        expect(screen.getByTestId('email-field')).toBeInTheDocument();
    });

    it('renders hint', () => {
        render(
            <Form initialValues={{ email: '' }} onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" hint="We never share email" />
            </Form>
        );

        expect(screen.getByText('We never share email')).toBeInTheDocument();
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form initialValues={{ email: 'user@example.com' }} onSubmit={onSubmit}>
                    <FormInput name="email" label="Email" clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ email: '' });
    });
});
