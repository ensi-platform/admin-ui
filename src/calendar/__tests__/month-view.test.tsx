import { CalendarDate } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';

import { MonthView } from '../components/MonthView';

const renderView = (ui: React.ReactElement) => render(<AdminUiProvider>{ui}</AdminUiProvider>);

describe('MonthView', () => {
    it('returns null for invalid monthKey', () => {
        renderView(<MonthView monthKey="not-a-month" />);
        expect(document.querySelector('[data-date]')).toBeNull();
        expect(screen.queryByTestId('calendar-month-select-trigger')).not.toBeInTheDocument();
    });

    it('clamps month when year change exceeds max month', async () => {
        const user = userEvent.setup();
        const onMonthYearChange = vi.fn();
        renderView(
            <MonthView
                monthKey="2024-06"
                monthTop={0}
                monthHeight={280}
                minValue={new CalendarDate(2024, 1, 1)}
                maxValue={new CalendarDate(2025, 3, 31)}
                onMonthYearChange={onMonthYearChange}
            />
        );

        await user.click(screen.getByTestId('calendar-year-select-trigger'));
        await user.click(await screen.findByRole('option', { name: '2025' }));
        await waitFor(() => {
            expect(onMonthYearChange).toHaveBeenCalled();
        });
        const next = onMonthYearChange.mock.calls.at(-1)?.[0] as CalendarDate;
        expect(next.year).toBe(2025);
        expect(next.month).toBe(3);
    });

    it('renders range preview while hovering after anchor', () => {
        renderView(
            <MonthView
                monthKey="2024-06"
                monthTop={0}
                monthHeight={280}
                rangeAnchor={new CalendarDate(2024, 6, 10)}
                hoveredDate={new CalendarDate(2024, 6, 18)}
            />
        );

        expect(document.querySelector('[data-date="2024-06-15"][data-in-range]')).toBeTruthy();
        expect(document.querySelector('[data-date="2024-06-10"][data-selection-start]')).toBeTruthy();
        expect(document.querySelector('[data-date="2024-06-18"][data-selection-end]')).toBeTruthy();
    });

    it('renders plain heading when month is not interactive', () => {
        renderView(<MonthView monthKey="2024-06" monthTop={80} monthHeight={280} />);
        expect(screen.queryByTestId('calendar-month-select-trigger')).not.toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('keeps outside-month day out of roving tabindex when focusedDate matches', () => {
        // June 2024 ends on Sunday — July 1 is outside in the following month grid only;
        // use a month whose grid includes next-month trailing days: May 2024 ends Friday.
        renderView(
            <MonthView
                monthKey="2024-05"
                monthTop={0}
                monthHeight={280}
                focusedDate={new CalendarDate(2024, 6, 1)}
                isGridEngaged
            />
        );

        const outside = document.querySelector(
            '[data-date="2024-06-01"][data-outside-month]'
        ) as HTMLButtonElement | null;
        expect(outside).toBeTruthy();
        expect(outside).toHaveAttribute('tabindex', '-1');
    });

    it('keeps focusedDate day in tab order when grid is not engaged', () => {
        renderView(
            <MonthView
                monthKey="2024-06"
                monthTop={0}
                monthHeight={280}
                focusedDate={new CalendarDate(2024, 6, 15)}
                isGridEngaged={false}
            />
        );

        const day = document.querySelector('[data-date="2024-06-15"]') as HTMLButtonElement | null;
        expect(day).toBeTruthy();
        expect(day).toHaveAttribute('tabindex', '0');
        expect(day).not.toHaveAttribute('data-focused');
    });

    it('marks focusedDate day as data-focused when grid is engaged', () => {
        renderView(
            <MonthView
                monthKey="2024-06"
                monthTop={0}
                monthHeight={280}
                focusedDate={new CalendarDate(2024, 6, 15)}
                isGridEngaged
            />
        );

        const day = document.querySelector('[data-date="2024-06-15"]') as HTMLButtonElement | null;
        expect(day).toBeTruthy();
        expect(day).toHaveAttribute('tabindex', '0');
        expect(day).toHaveAttribute('data-focused');
    });

    it('paints range anchor without hover as selected start', () => {
        renderView(
            <MonthView
                monthKey="2024-06"
                monthTop={0}
                monthHeight={280}
                rangeAnchor={new CalendarDate(2024, 6, 10)}
            />
        );

        const day = document.querySelector('[data-date="2024-06-10"]') as HTMLButtonElement | null;
        expect(day).toBeTruthy();
        expect(day).toHaveAttribute('data-selected');
        expect(day).toHaveAttribute('data-selection-start');
        expect(day).toHaveAttribute('data-selection-end');
    });
});
