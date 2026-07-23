import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '../form/index.js';

import { FormNumberInput, kopecksTransform } from './index.js';

describe('FormNumberInput', () => {
    it('submits scaled store value with kopecksTransform', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ price: null as number | null }} onSubmit={onSubmit}>
                <FormNumberInput name="price" label="Цена" suffix="₽" transform={kopecksTransform} step={0.01} />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Цена'), '10.5');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ price: 1050 });
    });

    it('shows validation error for store schema', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const schema = z.object({
            price: z.number().min(1000, 'Минимум 10 ₽'),
        });

        render(
            <Form initialValues={{ price: null as number | null }} validationSchema={schema} onSubmit={onSubmit}>
                <FormNumberInput name="price" label="Цена" transform={kopecksTransform} />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByLabelText('Цена'), '5');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Минимум 10 ₽');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables when Form is disabled', () => {
        render(
            <Form initialValues={{ price: 100 }} disabled onSubmit={vi.fn()}>
                <FormNumberInput name="price" label="Цена" />
            </Form>
        );

        expect(screen.getByLabelText('Цена')).toBeDisabled();
    });
});
