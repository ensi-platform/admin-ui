import { useState } from 'react';

import { CalendarDate, parseDateTime, type DateValue } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { DatePicker } from '../Component';

const renderPicker = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('DatePicker', () => {
    it('renders date segments', () => {
        renderPicker(<DatePicker aria-label="Дата" dataTestId="date" />);
        expect(screen.getByTestId('date')).toBeInTheDocument();
    });

    it('opens calendar popover via calendar button', async () => {
        const user = userEvent.setup();
        renderPicker(<DatePicker aria-label="Дата" defaultValue={new CalendarDate(2024, 6, 15)} />);

        await user.click(screen.getByTestId('date-picker-calendar'));
        expect(screen.getByTestId('calendar-viewport')).toBeInTheDocument();
    });

    it('does not focus a day cell on pointer open', async () => {
        const user = userEvent.setup();
        renderPicker(<DatePicker aria-label="Дата" defaultValue={new CalendarDate(2024, 6, 15)} />);

        await user.click(screen.getByTestId('date-picker-calendar'));
        expect(screen.getByTestId('calendar-viewport')).toBeInTheDocument();
        await waitFor(() => {
            expect(document.activeElement?.getAttribute('data-date')).toBeNull();
        });
    });

    it('focuses selected day and moves with arrow keys on keyboard open', async () => {
        const user = userEvent.setup();
        renderPicker(<DatePicker aria-label="Дата" defaultValue={new CalendarDate(2024, 6, 15)} />);

        const calendarButton = screen.getByTestId('date-picker-calendar');
        calendarButton.focus();
        await user.keyboard('{Enter}');
        const viewport = screen.getByTestId('calendar-viewport');
        await waitFor(() => {
            const focused = document.activeElement as HTMLElement | null;
            expect(viewport.contains(focused)).toBe(true);
            expect(focused?.getAttribute('data-date')).toBe('2024-06-15');
        });

        await user.keyboard('{ArrowRight}');
        await waitFor(() => {
            expect(document.activeElement?.getAttribute('data-date')).toBe('2024-06-16');
        });
    });

    it('selects a day from the calendar', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPicker(<DatePicker aria-label="Дата" defaultValue={new CalendarDate(2024, 6, 15)} onChange={onChange} />);

        await user.click(screen.getByTestId('date-picker-calendar'));
        const day = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-20"]');
        expect(day).toBeTruthy();
        await user.click(day as HTMLElement);
        expect(onChange).toHaveBeenCalled();
        const next = onChange.mock.calls.at(-1)?.[0] as CalendarDate;
        expect(next.year).toBe(2024);
        expect(next.month).toBe(6);
        expect(next.day).toBe(20);
    });

    it('scrolls calendar to entered month', async () => {
        const user = userEvent.setup();

        const Harness = () => {
            const [value, setValue] = useState<DateValue | null>(new CalendarDate(2024, 6, 15));

            return (
                <>
                    <button
                        type="button"
                        data-test-id="set-jan"
                        onClick={() => setValue(new CalendarDate(2025, 1, 10))}
                    >
                        set-jan
                    </button>
                    <DatePicker aria-label="Дата" value={value} onChange={setValue} />
                </>
            );
        };

        renderPicker(<Harness />);
        await user.click(screen.getByTestId('set-jan'));
        await user.click(screen.getByTestId('date-picker-calendar'));
        await waitFor(() => {
            expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2025-01"]')).toBeTruthy();
        });
    });

    it('syncs open calendar when value month changes', async () => {
        const user = userEvent.setup();
        const setValueRef: { current: ((next: DateValue | null) => void) | null } = { current: null };

        const Harness = () => {
            const [value, setValue] = useState<DateValue | null>(new CalendarDate(2024, 6, 15));
            setValueRef.current = setValue;

            return <DatePicker aria-label="Дата" value={value} onChange={setValue} />;
        };

        renderPicker(<Harness />);
        await user.click(screen.getByTestId('date-picker-calendar'));
        expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2024-06"]')).toBeTruthy();

        setValueRef.current?.(new CalendarDate(2025, 1, 10));
        await waitFor(() => {
            const viewport = screen.getByTestId('calendar-viewport');
            expect(viewport.querySelector('[data-month-key="2025-01"]')).toBeTruthy();
            expect(viewport.querySelector('[data-date="2025-01-10"][data-selected]')).toBeTruthy();
        });
    });

    it('jumps to month via month select', async () => {
        const user = userEvent.setup();
        renderPicker(<DatePicker aria-label="Дата" defaultValue={new CalendarDate(2024, 6, 15)} />);

        await user.click(screen.getByTestId('date-picker-calendar'));
        const trigger = await screen.findByTestId('calendar-month-select-trigger');
        await user.click(trigger);
        await user.click(await screen.findByRole('option', { name: /august|август/i }));
        await waitFor(() => {
            expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2024-08"]')).toBeTruthy();
        });
    });

    it('clears value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPicker(<DatePicker aria-label="Дата" clear value={new CalendarDate(2024, 6, 15)} onChange={onChange} />);

        await user.click(screen.getByTestId('date-picker-clear'));
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('applies default year max to calendar year select', async () => {
        const user = userEvent.setup();
        renderPicker(<DatePicker aria-label="Дата" defaultValue={new CalendarDate(2024, 6, 15)} />);

        await user.click(screen.getByTestId('date-picker-calendar'));
        await user.click(screen.getByTestId('calendar-year-select-trigger'));
        expect(screen.getByRole('option', { name: '2100' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: '2101' })).not.toBeInTheDocument();
    });

    it('respects props maxValue over default year max', async () => {
        const user = userEvent.setup();
        renderPicker(
            <DatePicker
                aria-label="Дата"
                defaultValue={new CalendarDate(2019, 6, 15)}
                maxValue={new CalendarDate(2020, 12, 31)}
            />
        );

        await user.click(screen.getByTestId('date-picker-calendar'));
        await user.click(screen.getByTestId('calendar-year-select-trigger'));
        expect(screen.getByRole('option', { name: '2020' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: '2021' })).not.toBeInTheDocument();
    });

    it('restores last valid value on blur when out of bounds', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onBlur = vi.fn();
        const setValueRef: { current: ((next: DateValue | null) => void) | null } = { current: null };

        const Harness = () => {
            const [value, setValue] = useState<DateValue | null>(new CalendarDate(2024, 6, 15));
            const handleChange = (next: DateValue | null) => {
                setValue(next);
                onChange(next);
            };
            setValueRef.current = handleChange;

            return (
                <>
                    <DatePicker
                        aria-label="Дата"
                        value={value}
                        onChange={handleChange}
                        onBlur={onBlur}
                        dataTestId="date"
                    />
                    <button type="button" data-test-id="outside">
                        out
                    </button>
                </>
            );
        };

        renderPicker(<Harness />);
        const yearSegment = screen.getByRole('spinbutton', { name: /год|year/i });
        await user.click(yearSegment);
        setValueRef.current?.(new CalendarDate(2, 6, 15));
        await waitFor(() => {
            expect(document.querySelector('input[type="date"]')).toHaveValue('0002-06-15');
        });
        await user.click(screen.getByTestId('outside'));
        expect(onBlur).toHaveBeenCalled();
        await waitFor(() => {
            const next = onChange.mock.calls.at(-1)?.[0] as CalendarDate | null;
            expect(next?.year).toBe(2024);
            expect(next?.month).toBe(6);
            expect(next?.day).toBe(15);
        });
    });

    it('renders with minute granularity and datetime value', () => {
        renderPicker(
            <DatePicker
                aria-label="Дата и время"
                dataTestId="datetime"
                granularity="minute"
                defaultValue={parseDateTime('2024-06-15T14:30')}
            />
        );

        expect(screen.getByTestId('datetime')).toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /час|hour/i })).toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /минут|minute/i })).toBeInTheDocument();
    });

    it('preserves time when selecting a day with minute granularity', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPicker(
            <DatePicker
                aria-label="Дата и время"
                granularity="minute"
                defaultValue={parseDateTime('2024-06-15T14:30')}
                onChange={onChange}
            />
        );

        await user.click(screen.getByTestId('date-picker-calendar'));
        const day = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-20"]');
        expect(day).toBeTruthy();
        await user.click(day as HTMLElement);
        expect(onChange).toHaveBeenCalled();
        const next = onChange.mock.calls.at(-1)?.[0] as DateValue;
        expect(next.year).toBe(2024);
        expect(next.month).toBe(6);
        expect(next.day).toBe(20);
        expect('hour' in next && next.hour).toBe(14);
        expect('minute' in next && next.minute).toBe(30);
    });

    it('marks unavailable days and selects via Enter on focused day', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPicker(
            <DatePicker
                aria-label="Дата"
                defaultValue={new CalendarDate(2024, 6, 15)}
                isDateUnavailable={date => date.day === 16}
                onChange={onChange}
            />
        );

        const calendarButton = screen.getByTestId('date-picker-calendar');
        calendarButton.focus();
        await user.keyboard('{Enter}');
        await waitFor(() => {
            expect(document.activeElement?.getAttribute('data-date')).toBe('2024-06-15');
        });
        expect(
            screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-16"][data-unavailable]')
        ).toBeTruthy();

        await user.keyboard('{Enter}');
        expect(onChange).toHaveBeenCalled();
    });
});
