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

    it('disables only fields listed in the Form disabled map', () => {
        render(
            <Form initialValues={{ email: '', name: '' }} disabled={{ email: true }} onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" />
                <FormInput name="name" label="Name" />
            </Form>
        );

        expect(screen.getByLabelText('Email')).toBeDisabled();
        expect(screen.getByLabelText('Name')).not.toBeDisabled();
    });

    it('treats a missing or false map key as enabled', () => {
        render(
            <Form initialValues={{ email: '', name: '' }} disabled={{ email: false }} onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" />
                <FormInput name="name" label="Name" />
            </Form>
        );

        expect(screen.getByLabelText('Email')).not.toBeDisabled();
        expect(screen.getByLabelText('Name')).not.toBeDisabled();
    });

    it('keeps an explicit field disabled when the form is not disabled', () => {
        render(
            <Form initialValues={{ email: '' }} onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" disabled />
            </Form>
        );

        expect(screen.getByLabelText('Email')).toBeDisabled();
    });

    it('lets an explicit field disabled override the form map', () => {
        render(
            <Form initialValues={{ email: '', name: '' }} disabled={{ email: true, name: false }} onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" disabled={false} />
                <FormInput name="name" label="Name" disabled />
            </Form>
        );

        expect(screen.getByLabelText('Email')).not.toBeDisabled();
        expect(screen.getByLabelText('Name')).toBeDisabled();
    });

    it('marks only mapped fields as read-only', () => {
        render(
            <Form initialValues={{ email: 'a', name: 'b' }} readOnly={{ email: true }} onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" />
                <FormInput name="name" label="Name" />
            </Form>
        );

        expect(screen.getByLabelText('Email')).toHaveAttribute('readonly');
        expect(screen.getByLabelText('Name')).not.toHaveAttribute('readonly');
    });

    it('lets an explicit readOnly override the form map', () => {
        render(
            <Form initialValues={{ email: 'a' }} readOnly={{ email: true }} onSubmit={vi.fn()}>
                <FormInput name="email" label="Email" readOnly={false} />
            </Form>
        );

        expect(screen.getByLabelText('Email')).not.toHaveAttribute('readonly');
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

    it('renders without label and with nullish value', () => {
        render(
            <Form initialValues={{ email: undefined }} onSubmit={vi.fn()}>
                <FormInput name="email" aria-label="Email" />
            </Form>
        );

        expect(screen.queryByText('Email')).not.toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('');
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
