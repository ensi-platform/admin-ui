import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '../form/index.js';

import { FormCheckbox } from './index.js';

describe('FormCheckbox', () => {
    it('submits checked value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ agree: false }} onSubmit={onSubmit}>
                <FormCheckbox name="agree">Agree</FormCheckbox>
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('checkbox', { name: 'Agree' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ agree: true });
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const schema = z.object({
            agree: z.literal(true, { error: 'Обязательно' }),
        });

        render(
            <Form initialValues={{ agree: false }} validationSchema={schema} onSubmit={onSubmit}>
                <FormCheckbox name="agree">Agree</FormCheckbox>
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('renders hint', () => {
        render(
            <Form initialValues={{ agree: false }} onSubmit={vi.fn()}>
                <FormCheckbox name="agree" hint="Required">
                    Agree
                </FormCheckbox>
            </Form>
        );

        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('disables when Form is disabled', () => {
        render(
            <Form initialValues={{ agree: false }} disabled onSubmit={vi.fn()}>
                <FormCheckbox name="agree">Agree</FormCheckbox>
            </Form>
        );

        expect(screen.getByRole('checkbox', { name: 'Agree' })).toBeDisabled();
    });
});
