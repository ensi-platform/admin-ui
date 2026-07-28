import { useMemo, useState, type KeyboardEventHandler } from 'react';

import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import cn from 'classnames';
import { useLocale } from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import {
    getMonthLabels,
    getMonthRangeForYear,
    getMonthWeeks,
    getWeekdayLabels,
    getYearRange,
    isDateInRange,
    isDateOutOfBounds,
    isSameDay,
    isSameMonth,
    parseMonthKey,
} from '../../utils/date';
import { getStickyHeadingOffset, isMonthHeadingInteractive } from '../../utils/sticky';
import { DayCell } from '../DayCell';
import { MonthYearSelect } from '../MonthYearSelect';

import styles from './styles.module.css';

const FIRST_DAY_OF_WEEK = 1;

/** Selection / constraint slice for a month grid. */
export interface IMonthViewSelection {
    /** Selected single date. */
    selectedDate?: CalendarDate | null;
    /** Selected range start. */
    rangeStart?: CalendarDate | null;
    /** Selected range end. */
    rangeEnd?: CalendarDate | null;
    /** Anchor while picking the second range end. */
    rangeAnchor?: CalendarDate | null;
    /** Hovered date for range preview. */
    hoveredDate?: CalendarDate | null;
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    isDateUnavailable?: (date: CalendarDate) => boolean;
    isDisabled?: boolean;
    onSelect?: (date: CalendarDate) => void;
    onHoverChange?: (date: CalendarDate | null) => void;
    /** Jump fake-scroll window to month/year. */
    onMonthYearChange?: (date: CalendarDate) => void;
    /** Roving keyboard focus date. */
    focusedDate?: CalendarDate | null;
    /** When false, all day cells stay tabIndex=-1 (pointer open). */
    isGridEngaged?: boolean;
    onFocusDate?: (date: CalendarDate) => void;
    onDayKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
}

export interface IMonthViewProps extends IMonthViewSelection {
    monthKey: string;
    /** Absolute `top` of the month block in the viewport. */
    monthTop?: number;
    /** Measured / estimated month block height. */
    monthHeight?: number;
}

/** One month: heading + weekday row + day grid. */
export const MonthView = ({
    monthKey,
    monthTop = 0,
    monthHeight = 0,
    selectedDate = null,
    rangeStart = null,
    rangeEnd = null,
    rangeAnchor = null,
    hoveredDate = null,
    minValue = null,
    maxValue = null,
    isDateUnavailable,
    isDisabled = false,
    onSelect,
    onHoverChange,
    onMonthYearChange,
    focusedDate = null,
    isGridEngaged = true,
    onFocusDate,
    onDayKeyDown,
}: IMonthViewProps) => {
    const { locale } = useLocale();
    const timeZone = getLocalTimeZone();
    const month = useMemo(() => parseMonthKey(monthKey), [monthKey]);
    const weeks = useMemo(() => (month ? getMonthWeeks(month, FIRST_DAY_OF_WEEK) : []), [month]);
    const weekdayLabels = useMemo(() => getWeekdayLabels(locale, FIRST_DAY_OF_WEEK), [locale]);
    const todayDate = today(timeZone);
    const headingOffset = getStickyHeadingOffset(monthTop, monthHeight);
    const headingInteractive = !isDisabled && isMonthHeadingInteractive(monthTop, monthHeight);
    const [monthSelectOpen, setMonthSelectOpen] = useState(false);
    const [yearSelectOpen, setYearSelectOpen] = useState(false);
    const showMonthYearSelect = headingInteractive || monthSelectOpen || yearSelectOpen;
    const yearRange = useMemo(() => getYearRange(minValue, maxValue), [minValue, maxValue]);
    const monthRange = useMemo(
        () => (month ? getMonthRangeForYear(month.year, minValue, maxValue) : { minMonth: 1, maxMonth: 12 }),
        [month, minValue, maxValue]
    );
    const monthLabels = useMemo(() => getMonthLabels(locale), [locale]);

    const dateFormatter = useMemo(
        () => new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        [locale]
    );

    if (!month) {
        return null;
    }

    const previewEnd = hoveredDate ?? rangeEnd;
    const hasCompleteRange = rangeStart != null && rangeEnd != null;
    const hasPreviewRange = rangeAnchor != null && previewEnd != null;

    const handleMonthChange = (nextMonth: number) => {
        onMonthYearChange?.(new CalendarDate(month.year, nextMonth, 1));
    };

    const handleYearChange = (nextYear: number) => {
        const range = getMonthRangeForYear(nextYear, minValue, maxValue);
        const nextMonth = Math.min(Math.max(month.month, range.minMonth), range.maxMonth);
        onMonthYearChange?.(new CalendarDate(nextYear, nextMonth, 1));
    };

    return (
        <>
            <div className={cn(styles.heading, typographyStyles.bodyS)} style={{ top: headingOffset }}>
                {showMonthYearSelect ? (
                    <>
                        <MonthYearSelect
                            type="month"
                            value={month.month}
                            minValue={monthRange.minMonth}
                            maxValue={monthRange.maxMonth}
                            isDisabled={isDisabled}
                            aria-label={monthLabels[month.month - 1]}
                            onChange={handleMonthChange}
                            onOpenChange={setMonthSelectOpen}
                        />
                        <MonthYearSelect
                            type="year"
                            value={month.year}
                            minValue={yearRange.minYear}
                            maxValue={yearRange.maxYear}
                            isDisabled={isDisabled}
                            aria-label={String(month.year)}
                            onChange={handleYearChange}
                            onOpenChange={setYearSelectOpen}
                        />
                    </>
                ) : (
                    <>
                        <span>{monthLabels[month.month - 1]}</span>
                        <span>{month.year}</span>
                    </>
                )}
            </div>
            <table className={styles.grid} role="grid">
                <thead>
                    <tr>
                        {weekdayLabels.map((label, index) => (
                            <th key={index} scope="col">
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map(week => (
                        <tr key={week[0]?.toString()} role="row">
                            {week.map(date => {
                                const outside = !isSameMonth(date, month);
                                const outOfBounds = isDateOutOfBounds(date, minValue, maxValue);
                                const unavailable = Boolean(isDateUnavailable?.(date));
                                const disabled = isDisabled || outOfBounds;
                                const isToday = isSameDay(date, todayDate);
                                const isFocused = focusedDate != null && isSameDay(date, focusedDate);
                                const isRovingTarget = isFocused && isGridEngaged;

                                let isSelected = false;
                                let isSelectionStart = false;
                                let isSelectionEnd = false;
                                let isInRange = false;

                                if (selectedDate != null && isSameDay(date, selectedDate)) {
                                    isSelected = true;
                                }

                                if (hasCompleteRange && rangeStart && rangeEnd) {
                                    isSelectionStart = isSameDay(date, rangeStart);
                                    isSelectionEnd = isSameDay(date, rangeEnd);
                                    isSelected = isSelectionStart || isSelectionEnd;
                                    isInRange = isDateInRange(date, rangeStart, rangeEnd);
                                }

                                if (!hasCompleteRange && hasPreviewRange && rangeAnchor && previewEnd) {
                                    isSelectionStart = isSameDay(date, rangeAnchor);
                                    isSelectionEnd = isSameDay(date, previewEnd);
                                    isSelected = isSelectionStart || isSelectionEnd;
                                    isInRange = isDateInRange(date, rangeAnchor, previewEnd);
                                }

                                return (
                                    <td key={date.toString()} role="gridcell">
                                        <DayCell
                                            date={date}
                                            label={dateFormatter.format(date.toDate(timeZone))}
                                            isOutsideMonth={outside}
                                            isToday={isToday}
                                            isSelected={isSelected}
                                            isDisabled={disabled}
                                            isUnavailable={unavailable}
                                            isSelectionStart={isSelectionStart}
                                            isSelectionEnd={isSelectionEnd}
                                            isInRange={isInRange}
                                            isHovered={hoveredDate != null && isSameDay(date, hoveredDate)}
                                            isFocused={isRovingTarget}
                                            onSelect={onSelect}
                                            onHoverChange={onHoverChange}
                                            onFocusDate={onFocusDate}
                                            onKeyDown={onDayKeyDown}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

MonthView.displayName = 'MonthView';
