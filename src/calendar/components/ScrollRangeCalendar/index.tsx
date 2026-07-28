import { useContext, useState } from 'react';

import { type CalendarDate } from '@internationalized/date';
import { DateRangePickerStateContext, RangeCalendarContext, useSlottedContext } from 'react-aria-components';

import { useCalendarGridKeyboard } from '../../hooks/useCalendarGridKeyboard';
import { toCal, useFakeScrollCalendar } from '../../hooks/useFakeScrollCalendar';
import { type IScrollCalendarProps } from '../../types';
import { MonthList } from '../MonthList';
import { MonthView } from '../MonthView';

/** Vertical scroll range calendar for DateRangePicker popover. */
export const ScrollRangeCalendar = ({ scrollToDate, className, autoFocusDay = false }: IScrollCalendarProps) => {
    const { months, viewportRef, setMonthEl, scrollToMonth } = useFakeScrollCalendar(scrollToDate);
    const rangeState = useContext(DateRangePickerStateContext);
    const calendarProps = useSlottedContext(RangeCalendarContext);
    const [rangeAnchor, setRangeAnchor] = useState<CalendarDate | null>(null);
    const [hoveredDate, setHoveredDate] = useState<CalendarDate | null>(null);

    const value = rangeState?.value ?? calendarProps?.value ?? null;
    const rangeStart = toCal(value?.start ?? null);
    const rangeEnd = toCal(value?.end ?? null);
    const minValue = toCal(calendarProps?.minValue ?? null);
    const maxValue = toCal(calendarProps?.maxValue ?? null);
    const isDisabled = Boolean(calendarProps?.isDisabled);
    const isDateUnavailable = calendarProps?.isDateUnavailable
        ? (date: CalendarDate) =>
              Boolean((calendarProps.isDateUnavailable as ((value: CalendarDate) => boolean) | undefined)?.(date))
        : undefined;

    const handleSelect = (date: CalendarDate) => {
        if (!rangeAnchor) {
            setRangeAnchor(date);
            return;
        }

        const start = date.compare(rangeAnchor) <= 0 ? date : rangeAnchor;
        const end = date.compare(rangeAnchor) <= 0 ? rangeAnchor : date;
        const next = { start, end };
        setRangeAnchor(null);
        setHoveredDate(null);

        if (calendarProps?.onChange) {
            calendarProps.onChange(next);
            return;
        }
        rangeState?.setValue(next);
        rangeState?.close();
    };

    const { focusedDate, onDayFocus, onDayBlur, onDayKeyDown, setFocusedDateFromParts, isGridEngaged } =
        useCalendarGridKeyboard({
            viewportRef,
            ensureMonthVisible: scrollToMonth,
            preferredDate: rangeEnd ?? rangeStart ?? toCal(scrollToDate),
            minValue,
            maxValue,
            isDateUnavailable,
            onSelect: handleSelect,
            autoFocusDay,
        });

    const handleMonthYearChange = (date: CalendarDate) => {
        scrollToMonth(date);
        setFocusedDateFromParts(date.year, date.month);
    };

    return (
        <MonthList months={months} viewportRef={viewportRef} setMonthEl={setMonthEl} className={className}>
            {({ monthKey, top, height }) => (
                <MonthView
                    monthKey={monthKey}
                    monthTop={top}
                    monthHeight={height}
                    rangeStart={rangeAnchor ? null : rangeStart}
                    rangeEnd={rangeAnchor ? null : rangeEnd}
                    rangeAnchor={rangeAnchor}
                    hoveredDate={hoveredDate}
                    minValue={minValue}
                    maxValue={maxValue}
                    isDateUnavailable={isDateUnavailable}
                    isDisabled={isDisabled}
                    onSelect={handleSelect}
                    onHoverChange={setHoveredDate}
                    onMonthYearChange={handleMonthYearChange}
                    focusedDate={focusedDate}
                    isGridEngaged={isGridEngaged}
                    onFocusDate={onDayFocus}
                    onBlurDate={onDayBlur}
                    onDayKeyDown={onDayKeyDown}
                />
            )}
        </MonthList>
    );
};

ScrollRangeCalendar.displayName = 'ScrollRangeCalendar';
