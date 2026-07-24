import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';

import { FormSwitch } from '..';

describe('FormSwitch', () => {
    it('submits checked value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ enabled: false }} onSubmit={onSubmit}>
                <FormSwitch name="enabled">Enabled</FormSwitch>
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('switch', { name: 'Enabled' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ enabled: true });
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const schema = z.object({
            enabled: z.literal(true, { error: 'Включите' }),
        });

        render(
            <Form initialValues={{ enabled: false }} validationSchema={schema} onSubmit={onSubmit}>
                <FormSwitch name="enabled">Enabled</FormSwitch>
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('renders hint', () => {
        render(
            <Form initialValues={{ enabled: false }} onSubmit={vi.fn()}>
                <FormSwitch name="enabled" hint="Optional">
                    Enabled
                </FormSwitch>
            </Form>
        );

        expect(screen.getByText('Optional')).toBeInTheDocument();
    });

    it('disables when Form is disabled', () => {
        render(
            <Form initialValues={{ enabled: false }} disabled onSubmit={vi.fn()}>
                <FormSwitch name="enabled">Enabled</FormSwitch>
            </Form>
        );

        expect(screen.getByRole('switch', { name: 'Enabled' })).toBeDisabled();
    });
});
