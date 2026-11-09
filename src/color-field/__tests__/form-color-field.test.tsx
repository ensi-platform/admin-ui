import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';

import { FormColorField } from '..';

const schema = z.object({
    color: z.string().min(1, 'Укажите цвет'),
});

describe('FormColorField', () => {
    it('submits the hex typed in the field', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ color: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormColorField name="color" label="Цвет" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.type(screen.getByRole('textbox', { name: 'Цвет' }), '#112233');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });
        expect(onSubmit.mock.calls[0][0].color).toBe('#112233');
    });

    it('shows Field.Error when the color is empty', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ color: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormColorField name="color" label="Цвет" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Укажите цвет');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('focuses the hex input when validation fails', async () => {
        const user = userEvent.setup();

        render(
            <Form initialValues={{ color: '' }} validationSchema={schema} onSubmit={vi.fn()}>
                <FormColorField name="color" label="Цвет" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Цвет' })).toHaveFocus();
        });
    });

    it('disables the field when Form is disabled', () => {
        render(
            <Form initialValues={{ color: '#ff0000' }} disabled onSubmit={vi.fn()}>
                <FormColorField name="color" label="Цвет" />
            </Form>
        );

        expect(screen.getByTestId('color-field-trigger')).toBeDisabled();
    });

    it('sets data-test-id on the Field root', () => {
        render(
            <Form initialValues={{ color: '' }} onSubmit={vi.fn()}>
                <FormColorField name="color" label="Цвет" dataTestId="color-field" />
            </Form>
        );

        expect(screen.getByTestId('color-field')).toBeInTheDocument();
    });
});
