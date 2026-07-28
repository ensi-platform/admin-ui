import { CalendarDate, type DateValue } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormDatePicker } from '..';

const schema = z.object({
    date: z.custom<DateValue>(v => v != null, 'Укажите дату'),
});

const renderForm = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('FormDatePicker', () => {
    it('submits selected date', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        renderForm(
            <Form
                initialValues={{ date: new CalendarDate(2024, 6, 15) as DateValue | null }}
                validationSchema={schema}
                onSubmit={onSubmit}
            >
                <FormDatePicker name="date" label="Дата" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByTestId('date-picker-calendar'));
        const day = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-20"]');
        expect(day).toBeTruthy();
        await user.click(day as HTMLElement);
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        const submitted = onSubmit.mock.calls[0][0].date as CalendarDate;
        expect(submitted.year).toBe(2024);
        expect(submitted.month).toBe(6);
        expect(submitted.day).toBe(20);
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        renderForm(
            <Form initialValues={{ date: null as DateValue | null }} validationSchema={schema} onSubmit={onSubmit}>
                <FormDatePicker name="date" label="Дата" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Укажите дату');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables picker when Form is disabled', () => {
        renderForm(
            <Form initialValues={{ date: null as DateValue | null }} disabled onSubmit={vi.fn()}>
                <FormDatePicker name="date" label="Дата" />
            </Form>
        );

        expect(screen.getByTestId('date-picker-calendar')).toBeDisabled();
    });

    it('sets data-test-id on Field root', () => {
        renderForm(
            <Form initialValues={{ date: null as DateValue | null }} onSubmit={vi.fn()}>
                <FormDatePicker name="date" label="Дата" dataTestId="date-field" />
            </Form>
        );

        expect(screen.getByTestId('date-field')).toBeInTheDocument();
    });

    it('renders hint', () => {
        renderForm(
            <Form initialValues={{ date: null as DateValue | null }} onSubmit={vi.fn()}>
                <FormDatePicker name="date" label="Дата" hint="Формат ДД.ММ.ГГГГ" />
            </Form>
        );

        expect(screen.getByText('Формат ДД.ММ.ГГГГ')).toBeInTheDocument();
    });

    it('renders without label and with nullish value', () => {
        renderForm(
            <Form initialValues={{ date: undefined }} onSubmit={vi.fn()}>
                <FormDatePicker name="date" aria-label="Дата" />
            </Form>
        );

        expect(screen.queryByText('Дата')).not.toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /день|day/i })).toBeInTheDocument();
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form initialValues={{ date: new CalendarDate(2024, 6, 15) as DateValue | null }} onSubmit={onSubmit}>
                    <FormDatePicker name="date" label="Дата" clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByTestId('date-picker-clear'));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ date: null });
    });
});
