import { useState } from 'react';

import { CalendarDate, type DateValue } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type DateRange } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { DateRangePicker } from '../Component';

const renderPicker = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('DateRangePicker', () => {
    it('renders range inputs', () => {
        renderPicker(<DateRangePicker aria-label="Период" dataTestId="range" />);
        expect(screen.getByTestId('range')).toBeInTheDocument();
    });

    it('opens calendar popover via calendar button', async () => {
        const user = userEvent.setup();
        renderPicker(
            <DateRangePicker
                aria-label="Период"
                defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
            />
        );

        await user.click(screen.getByTestId('date-range-picker-calendar'));
        expect(screen.getByTestId('calendar-viewport')).toBeInTheDocument();
    });

    it('selects a range from the calendar', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPicker(
            <DateRangePicker
                aria-label="Период"
                defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                onChange={onChange}
            />
        );

        await user.click(screen.getByTestId('date-range-picker-calendar'));
        const startDay = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-10"]');
        const endDay = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-18"]');
        expect(startDay).toBeTruthy();
        expect(endDay).toBeTruthy();
        await user.click(startDay as HTMLElement);
        await user.click(endDay as HTMLElement);
        expect(onChange).toHaveBeenCalled();
        const next = onChange.mock.calls.at(-1)?.[0] as { start: CalendarDate; end: CalendarDate };
        expect(next.start.day).toBe(10);
        expect(next.end.day).toBe(18);
    });

    it('syncs open calendar when range end month changes', async () => {
        const user = userEvent.setup();
        const setValueRef: {
            current: ((next: { start: DateValue; end: DateValue } | null) => void) | null;
        } = { current: null };

        const Harness = () => {
            const [value, setValue] = useState<{ start: DateValue; end: DateValue } | null>({
                start: new CalendarDate(2024, 6, 1),
                end: new CalendarDate(2024, 6, 15),
            });
            setValueRef.current = setValue;

            return <DateRangePicker aria-label="Период" value={value} onChange={setValue} />;
        };

        renderPicker(<Harness />);
        await user.click(screen.getByTestId('date-range-picker-calendar'));
        setValueRef.current?.({
            start: new CalendarDate(2024, 6, 1),
            end: new CalendarDate(2024, 8, 20),
        });
        await waitFor(() => {
            expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2024-08"]')).toBeTruthy();
        });
    });

    it('clears value', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPicker(
            <DateRangePicker
                aria-label="Период"
                clear
                value={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                onChange={onChange}
            />
        );

        await user.click(screen.getByTestId('date-range-picker-clear'));
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('focuses selected day on keyboard open', async () => {
        const user = userEvent.setup();
        renderPicker(
            <DateRangePicker
                aria-label="Период"
                defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
            />
        );

        const calendarButton = screen.getByTestId('date-range-picker-calendar');
        calendarButton.focus();
        await user.keyboard('{Enter}');
        const viewport = screen.getByTestId('calendar-viewport');
        await waitFor(() => {
            const focused = document.activeElement as HTMLElement | null;
            expect(viewport.contains(focused)).toBe(true);
            expect(focused?.getAttribute('data-date')).toBeTruthy();
        });
    });

    it('restores last valid range on blur when partial', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onBlur = vi.fn();
        const setValueRef: {
            current: ((next: DateRange | null) => void) | null;
        } = { current: null };

        const Harness = () => {
            const [value, setValue] = useState<DateRange | null>({
                start: new CalendarDate(2024, 6, 1),
                end: new CalendarDate(2024, 6, 15),
            });
            const handleChange = (next: DateRange | null) => {
                setValue(next);
                onChange(next);
            };
            setValueRef.current = handleChange;

            return (
                <>
                    <DateRangePicker aria-label="Период" value={value} onChange={handleChange} onBlur={onBlur} />
                    <button type="button" data-test-id="outside">
                        out
                    </button>
                </>
            );
        };

        renderPicker(<Harness />);
        await user.click(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]!);
        // RAC can surface a partial range while editing; force it for blur restore.
        setValueRef.current?.({ start: new CalendarDate(2024, 6, 1), end: null } as unknown as DateRange);
        await user.click(screen.getByTestId('outside'));
        expect(onBlur).toHaveBeenCalled();
        await waitFor(() => {
            const next = onChange.mock.calls.at(-1)?.[0] as DateRange | null;
            expect(next?.end?.day).toBe(15);
        });
    });

    it('marks unavailable days and jumps via month select', async () => {
        const user = userEvent.setup();
        renderPicker(
            <DateRangePicker
                aria-label="Период"
                defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                isDateUnavailable={date => date.day === 12}
            />
        );

        await user.click(screen.getByTestId('date-range-picker-calendar'));
        expect(
            screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-12"][data-unavailable]')
        ).toBeTruthy();

        await user.click(screen.getByTestId('calendar-month-select-trigger'));
        await user.click(await screen.findByRole('option', { name: /august|август/i }));
        await waitFor(() => {
            expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2024-08"]')).toBeTruthy();
        });
    });

    it('shows hover preview while selecting range end', async () => {
        const user = userEvent.setup();
        renderPicker(
            <DateRangePicker
                aria-label="Период"
                defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
            />
        );

        await user.click(screen.getByTestId('date-range-picker-calendar'));
        await user.click(
            screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-10"]') as HTMLElement
        );
        await user.hover(
            screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-18"]') as HTMLElement
        );
        expect(
            screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-15"][data-in-range]')
        ).toBeTruthy();
    });

    it('does not update lastValid for out-of-bounds range from RAC onChange', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onBlur = vi.fn();
        renderPicker(
            <>
                <DateRangePicker
                    aria-label="Период"
                    defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                    minValue={new CalendarDate(2000, 1, 1)}
                    maxValue={new CalendarDate(2030, 12, 31)}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                <button type="button" data-test-id="outside">
                    out
                </button>
            </>
        );

        const endYear = screen.getAllByRole('spinbutton', { name: /год|year/i })[1]!;
        await user.click(endYear);
        await user.keyboard('{Control>}a{/Control}1990');
        await user.click(screen.getByTestId('outside'));
        expect(onBlur).toHaveBeenCalled();
        await waitFor(() => {
            const restored = onChange.mock.calls.find(call => {
                const next = call[0] as { start?: CalendarDate; end?: CalendarDate } | null;
                return next?.end?.year === 2024 && next?.end?.day === 15;
            });
            expect(restored).toBeTruthy();
        });
    });
});
