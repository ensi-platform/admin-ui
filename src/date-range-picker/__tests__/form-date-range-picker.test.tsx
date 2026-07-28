import { CalendarDate, type DateValue } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '@/form';
import { AdminUiProvider } from '@/provider';

import { FormDateRangePicker } from '..';

type TRange = { start: DateValue; end: DateValue } | null;

const schema = z.object({
    period: z.custom<TRange>(v => v != null && v.start != null && v.end != null, 'Укажите период'),
});

const renderForm = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('FormDateRangePicker', () => {
    it('submits selected range', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const initial: TRange = {
            start: new CalendarDate(2024, 6, 1),
            end: new CalendarDate(2024, 6, 15),
        };

        renderForm(
            <Form initialValues={{ period: initial }} validationSchema={schema} onSubmit={onSubmit}>
                <FormDateRangePicker name="period" label="Период" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByTestId('date-range-picker-calendar'));
        const startDay = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-10"]');
        const endDay = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-18"]');
        expect(startDay).toBeTruthy();
        expect(endDay).toBeTruthy();
        await user.click(startDay as HTMLElement);
        await user.click(endDay as HTMLElement);
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        const submitted = onSubmit.mock.calls[0][0].period as { start: CalendarDate; end: CalendarDate };
        expect(submitted.start.day).toBe(10);
        expect(submitted.end.day).toBe(18);
    });

    it('shows Field.Error on validation failure', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        renderForm(
            <Form initialValues={{ period: null as TRange }} validationSchema={schema} onSubmit={onSubmit}>
                <FormDateRangePicker name="period" label="Период" />
                <button type="submit">Save</button>
            </Form>
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Укажите период');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('disables picker when Form is disabled', () => {
        renderForm(
            <Form initialValues={{ period: null as TRange }} disabled onSubmit={vi.fn()}>
                <FormDateRangePicker name="period" label="Период" />
            </Form>
        );

        expect(screen.getByTestId('date-range-picker-calendar')).toBeDisabled();
    });

    it('sets data-test-id on Field root', () => {
        renderForm(
            <Form initialValues={{ period: null as TRange }} onSubmit={vi.fn()}>
                <FormDateRangePicker name="period" label="Период" dataTestId="range-field" />
            </Form>
        );

        expect(screen.getByTestId('range-field')).toBeInTheDocument();
    });

    it('renders hint', () => {
        renderForm(
            <Form initialValues={{ period: null as TRange }} onSubmit={vi.fn()}>
                <FormDateRangePicker name="period" label="Период" hint="Выберите интервал" />
            </Form>
        );

        expect(screen.getByText('Выберите интервал')).toBeInTheDocument();
    });

    it('renders without label and with nullish value', () => {
        renderForm(
            <Form initialValues={{ period: undefined }} onSubmit={vi.fn()}>
                <FormDateRangePicker name="period" aria-label="Период" />
            </Form>
        );

        expect(screen.queryByText('Период')).not.toBeInTheDocument();
        expect(screen.getByTestId('date-range-picker-calendar')).toBeInTheDocument();
    });

    it('clears value with clear', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <AdminUiProvider labels={{ clear: 'Очистить' }}>
                <Form
                    initialValues={{
                        period: {
                            start: new CalendarDate(2024, 6, 1),
                            end: new CalendarDate(2024, 6, 15),
                        } as TRange,
                    }}
                    onSubmit={onSubmit}
                >
                    <FormDateRangePicker name="period" label="Период" clear />
                    <button type="submit">Save</button>
                </Form>
            </AdminUiProvider>
        );

        await user.click(screen.getByTestId('date-range-picker-clear'));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit.mock.calls[0][0]).toEqual({ period: null });
    });
});
