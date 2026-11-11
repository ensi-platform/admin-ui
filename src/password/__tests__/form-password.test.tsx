import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormPassword } from '..';

const schema = z.object({
    password: z.string().min(1),
});

describe('FormPassword', () => {
    it('submits the typed password', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ showPassword: 'Show password', hidePassword: 'Hide password' }}>
                <Form initialValues={{ password: '' }} validationSchema={schema} onSubmit={onSubmit}>
                    <FormPassword name="password" label="Password" />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.type(screen.getByLabelText('Password'), 'secret');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ password: 'secret' });
    });
});
