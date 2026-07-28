import { type ReactNode } from 'react';

import { CalendarDate, type DateValue } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    CalendarContext,
    DatePickerStateContext,
    DateRangePickerStateContext,
    RangeCalendarContext,
} from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { ScrollCalendar } from '../components/ScrollCalendar';
import { ScrollRangeCalendar } from '../components/ScrollRangeCalendar';

const renderWithProvider = (ui: ReactNode) => render(<AdminUiProvider>{ui}</AdminUiProvider>);
const noopChange = vi.fn();

describe('ScrollCalendar', () => {
    it('wraps isDateUnavailable from calendar context', async () => {
        const user = userEvent.setup();
        const isDateUnavailable = vi.fn((date: DateValue) => date.day === 16);
        renderWithProvider(
            <CalendarContext.Provider
                value={{
                    value: new CalendarDate(2024, 6, 15),
                    onChange: noopChange,
                    isDateUnavailable,
                }}
            >
                <ScrollCalendar scrollToDate={new CalendarDate(2024, 6, 15)} />
            </CalendarContext.Provider>
        );

        expect(screen.getByTestId('calendar-viewport')).toBeInTheDocument();
        expect(document.querySelector('[data-date="2024-06-16"][data-unavailable]')).toBeTruthy();
        await user.click(document.querySelector('[data-date="2024-06-16"]') as HTMLElement);
        expect(isDateUnavailable).toHaveBeenCalled();
    });

    it('falls back to pickerState.setDateValue when calendar onChange is missing', async () => {
        const user = userEvent.setup();
        const setDateValue = vi.fn();
        const close = vi.fn();
        renderWithProvider(
            <DatePickerStateContext.Provider
                value={{ value: new CalendarDate(2024, 6, 15), setDateValue, close } as never}
            >
                <CalendarContext.Provider value={{ value: new CalendarDate(2024, 6, 15) }}>
                    <ScrollCalendar scrollToDate={new CalendarDate(2024, 6, 15)} />
                </CalendarContext.Provider>
            </DatePickerStateContext.Provider>
        );

        await user.click(document.querySelector('[data-date="2024-06-20"]') as HTMLElement);
        expect(setDateValue).toHaveBeenCalled();
        expect(close).toHaveBeenCalled();
    });

    it('uses scrollToDate when contexts have no selected value', () => {
        renderWithProvider(
            <CalendarContext.Provider value={{}}>
                <ScrollCalendar scrollToDate={new CalendarDate(2024, 6, 15)} />
            </CalendarContext.Provider>
        );
        expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2024-06"]')).toBeTruthy();
        expect(document.querySelector('[data-date="2024-06-15"][data-selected]')).toBeNull();
    });
});

describe('ScrollRangeCalendar', () => {
    it('wraps isDateUnavailable and commits via rangeState when onChange is missing', async () => {
        const user = userEvent.setup();
        const isDateUnavailable = vi.fn((date: DateValue) => date.day === 12);
        const setValue = vi.fn();
        const close = vi.fn();

        renderWithProvider(
            <DateRangePickerStateContext.Provider
                value={
                    {
                        value: {
                            start: new CalendarDate(2024, 6, 1),
                            end: new CalendarDate(2024, 6, 15),
                        },
                        setValue,
                        close,
                    } as never
                }
            >
                <RangeCalendarContext.Provider
                    value={{
                        value: {
                            start: new CalendarDate(2024, 6, 1),
                            end: new CalendarDate(2024, 6, 15),
                        },
                        isDateUnavailable,
                    }}
                >
                    <ScrollRangeCalendar scrollToDate={new CalendarDate(2024, 6, 15)} />
                </RangeCalendarContext.Provider>
            </DateRangePickerStateContext.Provider>
        );

        expect(document.querySelector('[data-date="2024-06-12"][data-unavailable]')).toBeTruthy();
        await user.click(document.querySelector('[data-date="2024-06-10"]') as HTMLElement);
        await user.click(document.querySelector('[data-date="2024-06-18"]') as HTMLElement);
        expect(setValue).toHaveBeenCalled();
        expect(close).toHaveBeenCalled();
        expect(isDateUnavailable).toHaveBeenCalled();
    });

    it('jumps via month/year select', async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <RangeCalendarContext.Provider
                value={{
                    value: {
                        start: new CalendarDate(2024, 6, 1),
                        end: new CalendarDate(2024, 6, 15),
                    },
                    onChange: noopChange,
                }}
            >
                <ScrollRangeCalendar scrollToDate={new CalendarDate(2024, 6, 15)} />
            </RangeCalendarContext.Provider>
        );

        await user.click(screen.getByTestId('calendar-month-select-trigger'));
        await user.click(await screen.findByRole('option', { name: /august|август/i }));
        await waitFor(() => {
            expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2024-08"]')).toBeTruthy();
        });
    });

    it('commits reversed range when second click is before anchor', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderWithProvider(
            <RangeCalendarContext.Provider
                value={{
                    value: null,
                    onChange,
                }}
            >
                <ScrollRangeCalendar scrollToDate={new CalendarDate(2024, 6, 15)} />
            </RangeCalendarContext.Provider>
        );

        await user.click(document.querySelector('[data-date="2024-06-18"]') as HTMLElement);
        await user.click(document.querySelector('[data-date="2024-06-10"]') as HTMLElement);
        expect(onChange).toHaveBeenCalled();
        const next = onChange.mock.calls.at(-1)?.[0] as { start: CalendarDate; end: CalendarDate };
        expect(next.start.toString()).toBe('2024-06-10');
        expect(next.end.toString()).toBe('2024-06-18');
    });

    it('uses scrollToDate when range value is missing', () => {
        renderWithProvider(
            <RangeCalendarContext.Provider value={{ value: null, onChange: noopChange }}>
                <ScrollRangeCalendar scrollToDate={new CalendarDate(2024, 8, 1)} />
            </RangeCalendarContext.Provider>
        );
        expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2024-08"]')).toBeTruthy();
    });

    it('prefers range start when end is missing', () => {
        renderWithProvider(
            <RangeCalendarContext.Provider
                value={{
                    value: { start: new CalendarDate(2024, 7, 1), end: null },
                    onChange: noopChange,
                }}
            >
                <ScrollRangeCalendar scrollToDate={new CalendarDate(2024, 6, 1)} />
            </RangeCalendarContext.Provider>
        );
        expect(screen.getByTestId('calendar-viewport').querySelector('[data-month-key="2024-07"]')).toBeTruthy();
    });
});
