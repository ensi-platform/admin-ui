import { useState } from 'react';

import { CalendarDate, type DateValue } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type DateRange } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';

import { AdminUiProvider } from '@/provider';
import { axe } from '@/test/axe';

import { DateRangePicker } from '..';

import styles from '../styles.module.css';

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

    it('closes the calendar on Escape and on outside click', async () => {
        const user = userEvent.setup();

        renderPicker(
            <DateRangePicker
                aria-label="Период"
                defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
            />
        );

        await user.click(screen.getByTestId('date-range-picker-calendar'));
        expect(screen.getByTestId('calendar-viewport')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        expect(screen.queryByTestId('calendar-viewport')).not.toBeInTheDocument();

        await user.click(screen.getByTestId('date-range-picker-calendar'));
        expect(screen.getByTestId('calendar-viewport')).toBeInTheDocument();

        const underlay = document.querySelector('[data-testid="underlay"]');

        expect(underlay).toBeInstanceOf(HTMLElement);
        await user.click(underlay as HTMLElement);

        expect(screen.queryByTestId('calendar-viewport')).not.toBeInTheDocument();
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
        expect(onChange).toHaveBeenCalledTimes(1);
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

    it('restores the end date on blur when its year is cleared', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onBlur = vi.fn();

        renderPicker(
            <>
                <DateRangePicker
                    aria-label="Период"
                    defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
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
        await user.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}');
        await user.click(screen.getByTestId('outside'));
        expect(onBlur).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.getAllByRole('spinbutton', { name: /год|year/i })[1]).toHaveTextContent('2024');
            expect(screen.getAllByRole('spinbutton', { name: /день|day/i })[1]).toHaveTextContent('15');
        });
        const reversed = onChange.mock.calls.some(call => {
            const next = call[0] as DateRange | null;
            return next?.end != null && next.end.year < 1900;
        });
        expect(reversed).toBe(false);
    });

    it('swaps a typed range when the end date is before the start', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderPicker(
            <>
                <DateRangePicker
                    aria-label="Период"
                    defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                    onChange={onChange}
                />
                <button type="button" data-test-id="outside">
                    out
                </button>
            </>
        );

        await user.click(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]!);
        await user.keyboard('1111200001112000');
        await user.click(screen.getByTestId('outside'));

        await waitFor(() => {
            const next = onChange.mock.calls.at(-1)?.[0] as DateRange | null;
            expect(next?.start.year).toBe(2000);
            expect(next?.start.month).toBe(11);
            expect(next?.start.day).toBe(1);
            expect(next?.end.year).toBe(2000);
            expect(next?.end.month).toBe(11);
            expect(next?.end.day).toBe(11);
        });
        expect(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]).toHaveTextContent('01');
        expect(screen.getAllByRole('spinbutton', { name: /день|day/i })[1]).toHaveTextContent('11');

        const reversed = onChange.mock.calls.some(call => {
            const next = call[0] as DateRange | null;
            return next?.start != null && next.end != null && next.end.compare(next.start) < 0;
        });
        expect(reversed).toBe(false);
    });

    it('swaps when the start date is typed after the end date', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderPicker(
            <>
                <DateRangePicker
                    aria-label="Период"
                    defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                    onChange={onChange}
                />
                <button type="button" data-test-id="outside">
                    out
                </button>
            </>
        );

        await user.click(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]!);
        await user.keyboard('20');
        await user.click(screen.getByTestId('outside'));

        await waitFor(() => {
            const next = onChange.mock.calls.at(-1)?.[0] as DateRange;
            expect(next.start.day).toBe(15);
            expect(next.end.day).toBe(20);
            expect(next.end.compare(next.start) > 0).toBe(true);
        });
    });

    it('keeps a single-day range when start and end are equal', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderPicker(
            <>
                <DateRangePicker
                    aria-label="Период"
                    defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                    onChange={onChange}
                />
                <button type="button" data-test-id="outside">
                    out
                </button>
            </>
        );

        await user.click(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]!);
        await user.keyboard('15');
        await user.click(screen.getByTestId('outside'));

        await waitFor(() => {
            const next = onChange.mock.calls.at(-1)?.[0] as DateRange;
            expect(next.start.day).toBe(15);
            expect(next.end.day).toBe(15);
            expect(next.start.compare(next.end)).toBe(0);
        });
    });

    it('restores the start date on blur when the year is out of bounds', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderPicker(
            <>
                <DateRangePicker
                    aria-label="Период"
                    defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                    onChange={onChange}
                />
                <button type="button" data-test-id="outside">
                    out
                </button>
            </>
        );

        const startYear = screen.getAllByRole('spinbutton', { name: /год|year/i })[0]!;
        await user.click(startYear);
        await user.keyboard('{Control>}a{/Control}1899');
        await user.click(screen.getByTestId('outside'));

        await waitFor(() => {
            expect(screen.getAllByRole('spinbutton', { name: /год|year/i })[0]).toHaveTextContent('2024');
        });
        const outOfBounds = onChange.mock.calls.some(call => {
            const next = call[0] as DateRange | null;
            return next?.start != null && next.start.year < 1900;
        });
        expect(outOfBounds).toBe(false);
    });

    it('orders a range picked from the later day to the earlier day', async () => {
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
        const later = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-18"]');
        const earlier = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-10"]');
        expect(later).toBeTruthy();
        expect(earlier).toBeTruthy();
        await user.click(later as HTMLElement);
        await user.click(earlier as HTMLElement);

        await waitFor(() => {
            const next = onChange.mock.calls.at(-1)?.[0] as DateRange;
            expect(next.start.day).toBe(10);
            expect(next.end.day).toBe(18);
        });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('does not change the range when an unavailable day is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPicker(
            <DateRangePicker
                aria-label="Период"
                defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                isDateUnavailable={date => date.day === 12}
                onChange={onChange}
            />
        );

        await user.click(screen.getByTestId('date-range-picker-calendar'));
        const unavailable = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-12"]');
        expect(unavailable).toBeDisabled();
        await user.click(unavailable as HTMLElement);
        expect(onChange).not.toHaveBeenCalled();

        const availableStart = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-10"]');
        const availableEnd = screen.getByTestId('calendar-viewport').querySelector('[data-date="2024-06-18"]');
        await user.click(availableStart as HTMLElement);
        await user.click(availableEnd as HTMLElement);
        await waitFor(() => {
            const next = onChange.mock.calls.at(-1)?.[0] as DateRange;
            expect(next.start.day).toBe(10);
            expect(next.end.day).toBe(18);
        });
    });

    it('keeps the controlled value when the parent ignores onChange', async () => {
        const user = userEvent.setup();
        renderPicker(
            <>
                <DateRangePicker
                    aria-label="Период"
                    value={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                    onChange={() => undefined}
                />
                <button type="button" data-test-id="outside">
                    out
                </button>
            </>
        );

        await user.click(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]!);
        await user.keyboard('20');
        await user.click(screen.getByTestId('outside'));

        await waitFor(() => {
            expect(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]).toHaveTextContent('01');
            expect(screen.getAllByRole('spinbutton', { name: /день|day/i })[1]).toHaveTextContent('15');
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

    it('does not publish an out-of-bounds end year', async () => {
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
            expect(screen.getAllByRole('spinbutton', { name: /год|year/i })[1]).toHaveTextContent('2024');
            expect(screen.getAllByRole('spinbutton', { name: /день|day/i })[1]).toHaveTextContent('15');
        });
        const outOfBounds = onChange.mock.calls.some(call => {
            const next = call[0] as { end?: CalendarDate } | null;
            return next?.end != null && next.end.year < 2000;
        });
        expect(outOfBounds).toBe(false);
    });

    it('shows a parent value that replaces the draft while the field is focused', async () => {
        const user = userEvent.setup();

        const replacement: DateRange = {
            start: new CalendarDate(2025, 1, 2),
            end: new CalendarDate(2025, 1, 9),
        };

        const Harness = () => {
            const [value, setValue] = useState<DateRange | null>({
                start: new CalendarDate(2024, 6, 1),
                end: new CalendarDate(2024, 6, 15),
            });

            return (
                <>
                    <DateRangePicker aria-label="Период" value={value} onChange={setValue} />
                    <button
                        type="button"
                        onMouseDown={event => event.preventDefault()}
                        onClick={() => setValue(replacement)}
                    >
                        replace
                    </button>
                </>
            );
        };

        renderPicker(<Harness />);
        await user.click(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]!);
        await user.keyboard('20');
        await user.click(screen.getByRole('button', { name: 'replace' }));

        await waitFor(() => {
            expect(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]).toHaveTextContent('02');
            expect(screen.getAllByRole('spinbutton', { name: /год|year/i })[0]).toHaveTextContent('2025');
        });
    });

    it('keeps a start date typed exactly on minValue', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderPicker(
            <>
                <DateRangePicker
                    aria-label="Период"
                    defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                    minValue={new CalendarDate(2000, 1, 1)}
                    maxValue={new CalendarDate(2030, 12, 31)}
                    onChange={onChange}
                />
                <button type="button" data-test-id="outside">
                    out
                </button>
            </>
        );

        await user.click(screen.getAllByRole('spinbutton', { name: /день|day/i })[0]!);
        await user.keyboard('01');
        await user.click(screen.getAllByRole('spinbutton', { name: /месяц|month/i })[0]!);
        await user.keyboard('01');
        await user.click(screen.getAllByRole('spinbutton', { name: /год|year/i })[0]!);
        await user.keyboard('{Control>}a{/Control}2000');
        await user.click(screen.getByTestId('outside'));

        await waitFor(() => {
            const next = onChange.mock.calls.at(-1)?.[0] as DateRange;
            expect(next.start.year).toBe(2000);
            expect(next.start.month).toBe(1);
            expect(next.start.day).toBe(1);
            expect(next.end.year).toBe(2024);
        });
    });

    it('does not open or change the range when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        renderPicker(
            <DateRangePicker
                aria-label="Период"
                disabled
                defaultValue={{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) }}
                onChange={onChange}
            />
        );

        screen.getAllByRole('spinbutton').forEach(segment => {
            expect(segment).toHaveAttribute('aria-disabled', 'true');
        });

        await user.click(screen.getByTestId('date-range-picker-calendar'));

        expect(screen.queryByTestId('calendar-viewport')).not.toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('marks the field invalid', () => {
        renderPicker(<DateRangePicker aria-label="Период" invalid dataTestId="range" />);

        expect(screen.getByTestId('range')).toHaveAttribute('data-invalid', 'true');
    });

    it('uses the sm size and primary variant classes', () => {
        renderPicker(
            <DateRangePicker aria-label="Период" size="sm" variant="primary" block={false} dataTestId="range" />
        );

        const group = screen.getByTestId('range');

        expect(group).toHaveClass(styles.sm);
        expect(group).toHaveClass(styles.primary);
        expect(group).not.toHaveClass(styles.block);
    });

    it('has no axe violations in the default, disabled, and invalid states', async () => {
        const { container, unmount } = renderPicker(<DateRangePicker aria-label="Период" />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();

        const disabled = renderPicker(<DateRangePicker aria-label="Период" disabled />);
        expect(await axe(disabled.container)).toHaveNoViolations();
        disabled.unmount();

        const invalid = renderPicker(<DateRangePicker aria-label="Период" invalid />);
        expect(await axe(invalid.container)).toHaveNoViolations();
    });
});
