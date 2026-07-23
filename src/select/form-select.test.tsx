import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '../form/index.js';
import { AdminUiProvider } from '../provider/index.js';

import { FormSelect } from './index.js';

const OPTIONS = [
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликован' },
];

const schema = z.object({
    status: z.string().min(1, 'Выберите статус'),
});

describe('FormSelect', () => {
    it('submits selected value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ status: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormSelect name="status" label="Статус" options={OPTIONS} />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: /Статус/ }));
        await user.click(screen.getByRole('option', { name: 'Опубликован' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ status: 'published' });
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <Form initialValues={{ status: '' }} validationSchema={schema} onSubmit={onSubmit}>
                <FormSelect name="status" label="Статус" options={OPTIONS} />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Выберите статус');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables select when Form is disabled', () => {
        render(
            <Form initialValues={{ status: '' }} disabled onSubmit={vi.fn()}>
                <FormSelect name="status" label="Статус" options={OPTIONS} />
            </Form>
        );

        expect(screen.getByRole('button', { name: /Статус/ })).toBeDisabled();
    });

    it('sets data-test-id on Field root', () => {
        render(
            <Form initialValues={{ status: '' }} onSubmit={vi.fn()}>
                <FormSelect name="status" label="Статус" options={OPTIONS} dataTestId="status-field" />
            </Form>
        );

        expect(screen.getByTestId('status-field')).toBeInTheDocument();
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form initialValues={{ status: 'draft' }} onSubmit={onSubmit}>
                    <FormSelect name="status" label="Статус" options={OPTIONS} clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ status: '' });
    });
});
