import { Time, type TimeFields } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormTimeField } from '..';

const schema = z.object({
    time: z.custom<TimeFields>(v => v != null, 'Укажите время'),
});

const renderForm = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('FormTimeField', () => {
    it('submits value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        renderForm(
            <Form
                initialValues={{ time: new Time(14, 30) as TimeFields | null }}
                validationSchema={schema}
                onSubmit={onSubmit}
            >
                <FormTimeField name="time" label="Время" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        const submitted = onSubmit.mock.calls[0][0].time as Time;
        expect(submitted.hour).toBe(14);
        expect(submitted.minute).toBe(30);
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        renderForm(
            <Form initialValues={{ time: null as TimeFields | null }} validationSchema={schema} onSubmit={onSubmit}>
                <FormTimeField name="time" label="Время" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Укажите время');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables field when Form is disabled', () => {
        renderForm(
            <Form initialValues={{ time: null as TimeFields | null }} disabled onSubmit={vi.fn()}>
                <FormTimeField name="time" label="Время" />
            </Form>
        );

        expect(screen.getByRole('spinbutton', { name: /час|hour/i })).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets data-test-id on Field root', () => {
        renderForm(
            <Form initialValues={{ time: null as TimeFields | null }} onSubmit={vi.fn()}>
                <FormTimeField name="time" label="Время" dataTestId="time-field" />
            </Form>
        );

        expect(screen.getByTestId('time-field')).toBeInTheDocument();
    });

    it('renders hint', () => {
        renderForm(
            <Form initialValues={{ time: null as TimeFields | null }} onSubmit={vi.fn()}>
                <FormTimeField name="time" label="Время" hint="ЧЧ:ММ" />
            </Form>
        );

        expect(screen.getByText('ЧЧ:ММ')).toBeInTheDocument();
    });

    it('renders without label and with nullish value', () => {
        renderForm(
            <Form initialValues={{ time: undefined }} onSubmit={vi.fn()}>
                <FormTimeField name="time" aria-label="Время" />
            </Form>
        );

        expect(screen.queryByText('Время')).not.toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /час|hour/i })).toBeInTheDocument();
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form initialValues={{ time: new Time(14, 30) as TimeFields | null }} onSubmit={onSubmit}>
                    <FormTimeField name="time" label="Время" clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByRole('button', { name: 'Очистить' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ time: null });
    });
});
