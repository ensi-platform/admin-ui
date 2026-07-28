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
});
