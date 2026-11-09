import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormMask } from '..';

const phoneOpts = { mask: '+7 (000) 000-00-00' };

describe('FormMask', () => {
    it('submits the masked string', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ phone: '' }} onSubmit={onSubmit}>
                <FormMask name="phone" label="Phone" opts={phoneOpts} />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Phone'), '9991234567');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ phone: '+7 (999) 123-45-67' });
    });

    it('clears the form value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Clear' }}>
                <Form initialValues={{ phone: '+7 (999) 123-45-67' }} onSubmit={onSubmit}>
                    <FormMask name="phone" label="Phone" opts={phoneOpts} clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Clear' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ phone: '' });
        expect(screen.getByLabelText('Phone')).toHaveValue('');
    });

    it('submits a raw initial value after the mask normalizes it', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ phone: '+79991234567' }} onSubmit={onSubmit}>
                <FormMask name="phone" label="Phone" opts={phoneOpts} />
                <button type="submit">Save</button>
            </Form>
        );

        expect(await screen.findByLabelText('Phone')).toHaveValue('+7 (999) 123-45-67');

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ phone: '+7 (999) 123-45-67' });
    });

    it('restores the initial value on reset', async () => {
        const user = userEvent.setup();

        render(
            <Form initialValues={{ phone: '+7 (999' }} onSubmit={vi.fn()}>
                {({ reset }) => (
                    <>
                        <FormMask name="phone" label="Phone" opts={phoneOpts} />
                        <button type="button" onClick={() => reset()}>
                            Reset
                        </button>
                    </>
                )}
            </Form>
        );

        const input = screen.getByLabelText('Phone');
        await user.type(input, '1');
        expect(input).toHaveValue('+7 (999) 1');

        await user.click(screen.getByRole('button', { name: 'Reset' }));

        expect(input).toHaveValue('+7 (999');
    });

    it('shows a validation error after blur', async () => {
        const user = userEvent.setup();

        render(
            <Form
                initialValues={{ phone: '' }}
                mode="onBlur"
                validationSchema={z.object({
                    phone: z.string().min(18, 'Too short'),
                })}
                onSubmit={vi.fn()}
            >
                <FormMask name="phone" label="Phone" opts={phoneOpts} />
            </Form>
        );

        const input = screen.getByLabelText('Phone');
        await user.type(input, '999');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        await user.tab();

        expect(await screen.findByRole('alert')).toHaveTextContent('Too short');
    });

    it('disables the field when the form is disabled', () => {
        render(
            <Form initialValues={{ phone: '' }} disabled onSubmit={vi.fn()}>
                <FormMask name="phone" label="Phone" opts={phoneOpts} />
            </Form>
        );

        expect(screen.getByLabelText('Phone')).toBeDisabled();
    });
});
