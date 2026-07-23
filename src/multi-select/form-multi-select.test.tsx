import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '../form/index.js';
import { AdminUiProvider } from '../provider/index.js';

import { FormMultiSelect } from './index.js';

const OPTIONS = [
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
];

const schema = z.object({
    tags: z.array(z.string()).min(1, 'Выберите метки'),
});

describe('FormMultiSelect', () => {
    it('submits selected values', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ tags: [] as string[] }} validationSchema={schema} onSubmit={onSubmit}>
                <FormMultiSelect name="tags" label="Метки" options={OPTIONS} />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: /Метки/ }));
        await user.click(screen.getByRole('option', { name: 'vip' }));
        await user.click(screen.getByRole('option', { name: 'постоянный клиент' }));
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ tags: ['vip', 'regular'] });
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ tags: [] as string[] }} validationSchema={schema} onSubmit={onSubmit}>
                <FormMultiSelect name="tags" label="Метки" options={OPTIONS} />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Выберите метки');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables select when Form is disabled', () => {
        render(
            <Form initialValues={{ tags: [] as string[] }} disabled onSubmit={vi.fn()}>
                <FormMultiSelect name="tags" label="Метки" options={OPTIONS} />
            </Form>
        );

        expect(screen.getByRole('button', { name: /Метки/ })).toBeDisabled();
    });

    it('sets data-test-id on Field root', () => {
        render(
            <Form initialValues={{ tags: [] as string[] }} onSubmit={vi.fn()}>
                <FormMultiSelect name="tags" label="Метки" options={OPTIONS} dataTestId="tags-field" />
            </Form>
        );

        expect(screen.getByTestId('tags-field')).toBeInTheDocument();
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form initialValues={{ tags: ['vip'] }} validationSchema={schema} onSubmit={onSubmit}>
                    <FormMultiSelect name="tags" label="Метки" options={OPTIONS} clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Выберите метки');
        expect(onSubmit).not.toHaveBeenCalled();
    });
});
