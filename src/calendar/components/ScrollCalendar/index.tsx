import { useContext } from 'react';

import { type CalendarDate } from '@internationalized/date';
import { CalendarContext, DatePickerStateContext, useSlottedContext } from 'react-aria-components';

import { useCalendarGridKeyboard } from '../../hooks/useCalendarGridKeyboard';
import { toCal, useFakeScrollCalendar } from '../../hooks/useFakeScrollCalendar';
import { type IScrollCalendarProps } from '../../types';
import { MonthList } from '../MonthList';
import { MonthView } from '../MonthView';

/** Vertical scroll calendar for DatePicker popover. */
export const ScrollCalendar = ({ scrollToDate, className, autoFocusDay = false }: IScrollCalendarProps) => {
    const { months, viewportRef, setMonthEl, scrollToMonth, ensureMonthVisible } = useFakeScrollCalendar(scrollToDate);
    const pickerState = useContext(DatePickerStateContext);
    const calendarProps = useSlottedContext(CalendarContext);

    const selectedDate = toCal(pickerState?.value ?? calendarProps?.value ?? null);
    const minValue = toCal(calendarProps?.minValue ?? null);
    const maxValue = toCal(calendarProps?.maxValue ?? null);
    const isDisabled = Boolean(calendarProps?.isDisabled);
    const isDateUnavailable = calendarProps?.isDateUnavailable
        ? (date: CalendarDate) => Boolean(calendarProps.isDateUnavailable?.(date))
        : undefined;

    const handleSelect = (date: CalendarDate) => {
        if (calendarProps?.onChange) {
            calendarProps.onChange(date);
            return;
        }
        pickerState?.setDateValue(date);
        pickerState?.close();
    };

    const { focusedDate, onDayFocus, onDayKeyDown, setFocusedDateFromParts, isGridEngaged } = useCalendarGridKeyboard({
        viewportRef,
        ensureMonthVisible,
        preferredDate: selectedDate ?? toCal(scrollToDate),
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
                    selectedDate={selectedDate}
                    minValue={minValue}
                    maxValue={maxValue}
                    isDateUnavailable={isDateUnavailable}
                    isDisabled={isDisabled}
                    onSelect={handleSelect}
                    onMonthYearChange={handleMonthYearChange}
                    focusedDate={focusedDate}
                    isGridEngaged={isGridEngaged}
                    onFocusDate={onDayFocus}
                    onDayKeyDown={onDayKeyDown}
                />
            )}
        </MonthList>
    );
};

ScrollCalendar.displayName = 'ScrollCalendar';
