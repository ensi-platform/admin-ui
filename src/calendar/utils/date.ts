import { CalendarDate, type DateValue, endOfMonth, startOfMonth, toCalendarDate, today } from '@internationalized/date';

import { CALENDAR_WINDOW_MONTHS, DEFAULT_YEAR_MAX, DEFAULT_YEAR_MIN } from '../constants';

/** Layout metrics for month height estimates (px, match `--aui-calendar-*`). */
export interface IMonthHeightMetrics {
    /** Day / weekday cell size. */
    cellSize: number;
    /** Month title block height (padding + line). */
    headingHeight: number;
    /** Gap between heading and grid. */
    monthGap: number;
    /** Weekday header row height. */
    weekdayRowHeight: number;
    /** Space after the month (former viewport gap). */
    monthBottomGap: number;
}

/** Defaults aligned with semantic calendar tokens (`space-8/16/32`). */
export const DEFAULT_MONTH_HEIGHT_METRICS: IMonthHeightMetrics = {
    cellSize: 32,
    headingHeight: 36,
    monthGap: 8,
    weekdayRowHeight: 32,
    monthBottomGap: 16,
};

/** Fallback viewport height (matches `--aui-calendar-max-h`). */
export const CALENDAR_VIEWPORT_HEIGHT = 320;

/** Year bounds from optional min/max date constraints. */
export const getYearRange = (
    minValue?: DateValue | null,
    maxValue?: DateValue | null
): { minYear: number; maxYear: number } => {
    const minYear = minValue != null ? toCalendarDate(minValue).year : DEFAULT_YEAR_MIN;
    const maxYear = maxValue != null ? toCalendarDate(maxValue).year : DEFAULT_YEAR_MAX;

    if (minYear > maxYear) {
        return { minYear: maxYear, maxYear: minYear };
    }

    return { minYear, maxYear };
};

/** Allowed month numbers (1–12) for `year` given optional min/max dates. */
export const getMonthRangeForYear = (
    year: number,
    minValue?: DateValue | null,
    maxValue?: DateValue | null
): { minMonth: number; maxMonth: number } => {
    let minMonth = 1;
    let maxMonth = 12;

    if (minValue != null) {
        const min = toCalendarDate(minValue);
        if (year < min.year) {
            return { minMonth: 1, maxMonth: 0 };
        }
        if (year === min.year) {
            minMonth = min.month;
        }
    }

    if (maxValue != null) {
        const max = toCalendarDate(maxValue);
        if (year > max.year) {
            return { minMonth: 1, maxMonth: 0 };
        }
        if (year === max.year) {
            maxMonth = max.month;
        }
    }

    if (minMonth > maxMonth) {
        return { minMonth, maxMonth: minMonth - 1 };
    }

    return { minMonth, maxMonth };
};

/** Localized long month names (index 0 = January). */
export const getMonthLabels = (locale: string): string[] => {
    const formatter = new Intl.DateTimeFormat(locale, { month: 'long' });

    return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(Date.UTC(2024, index, 1))));
};

/** Height resolver: measured DOM height or estimate. */
export type TGetMonthHeight = (monthKey: string) => number;

/** Month key for DOM data attributes (`yyyy-mm`). */
export const toMonthKey = (date: DateValue): string => `${date.year}-${String(date.month).padStart(2, '0')}`;

/** Parse `yyyy-mm` month key back to the first day of that month. */
export const parseMonthKey = (monthKey: string): CalendarDate | null => {
    const match = /^(\d{4})-(\d{2})$/.exec(monthKey);
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month < 1 || month > 12) {
        return null;
    }

    return new CalendarDate(year, month, 1);
};

/**
 * Week rows in a month grid.
 * `firstDayOfWeek`: 0 = Sunday … 6 = Saturday (JS `Date#getDay`).
 */
export const getMonthWeekCount = (month: DateValue, firstDayOfWeek = 1): number => {
    const start = startOfMonth(toCalendarDate(month));
    const daysInMonth = endOfMonth(start).day;
    const jsDay = start.toDate('UTC').getDay();
    const offset = (jsDay - firstDayOfWeek + 7) % 7;

    return Math.ceil((daysInMonth + offset) / 7);
};

/** Estimated pixel height of a month block (Kontur-style formula). */
export const estimateMonthHeight = (
    monthKey: string,
    metrics: IMonthHeightMetrics = DEFAULT_MONTH_HEIGHT_METRICS,
    firstDayOfWeek = 1
): number => {
    const month = parseMonthKey(monthKey);
    const weeks = month ? getMonthWeekCount(month, firstDayOfWeek) : 5;

    return (
        metrics.headingHeight +
        metrics.monthGap +
        metrics.weekdayRowHeight +
        weeks * metrics.cellSize +
        metrics.monthBottomGap
    );
};

/** Default height getter via estimate. */
export const createEstimateGetHeight =
    (metrics: IMonthHeightMetrics = DEFAULT_MONTH_HEIGHT_METRICS): TGetMonthHeight =>
    monthKey =>
        estimateMonthHeight(monthKey, metrics);

/** Calendar date for “today” in the given time zone. */
export const getToday = (timeZone = 'UTC'): CalendarDate => today(timeZone);

/** Index of the pinned month at `scrollPosition === 0`. */
export const getCenterIndex = (windowMonths = CALENDAR_WINDOW_MONTHS): number => Math.floor(windowMonths / 2);

/** Months before the center month in the window. */
export const getRecenterOffset = (windowMonths = CALENDAR_WINDOW_MONTHS): number => getCenterIndex(windowMonths);

/** First month of the window so `center` sits at `getCenterIndex()`. */
export const getRecenterAnchor = (center: DateValue, windowMonths = CALENDAR_WINDOW_MONTHS): CalendarDate =>
    startOfMonth(toCalendarDate(center)).subtract({ months: getRecenterOffset(windowMonths) });

/** First month of the window for `scrollToDate` (or today). */
export const getWindowAnchor = (scrollToDate: DateValue | null | undefined, timeZone = 'UTC'): CalendarDate =>
    getRecenterAnchor(scrollToDate ? toCalendarDate(scrollToDate) : getToday(timeZone));

/** Center month (pinned near the top at scrollPosition 0). */
export const getCenterMonth = (scrollToDate: DateValue | null | undefined, timeZone = 'UTC'): CalendarDate =>
    startOfMonth(scrollToDate ? toCalendarDate(scrollToDate) : getToday(timeZone));

/** Whether `date` falls in the same calendar month as `month`. */
export const isSameMonth = (date: DateValue, month: DateValue): boolean =>
    date.year === month.year && date.month === month.month;

/** Whether two dates are the same calendar day. */
export const isSameDay = (a: DateValue, b: DateValue): boolean =>
    a.year === b.year && a.month === b.month && a.day === b.day;

/** Inclusive range check (`start`/`end` order-insensitive). */
export const isDateInRange = (date: DateValue, start: DateValue, end: DateValue): boolean => {
    const a = toCalendarDate(start);
    const b = toCalendarDate(end);
    const d = toCalendarDate(date);
    const lo = a.compare(b) <= 0 ? a : b;
    const hi = a.compare(b) <= 0 ? b : a;

    return d.compare(lo) >= 0 && d.compare(hi) <= 0;
};

/** Whether `date` is before `min` or after `max` (when set). */
export const isDateOutOfBounds = (
    date: DateValue,
    minValue?: DateValue | null,
    maxValue?: DateValue | null
): boolean => {
    const d = toCalendarDate(date);
    if (minValue != null && d.compare(toCalendarDate(minValue)) < 0) {
        return true;
    }
    if (maxValue != null && d.compare(toCalendarDate(maxValue)) > 0) {
        return true;
    }

    return false;
};

/**
 * Week rows for a month grid (includes outside-month padding days).
 * `firstDayOfWeek`: 0 = Sunday … 6 = Saturday (JS `Date#getDay`).
 */
export const getMonthWeeks = (month: DateValue, firstDayOfWeek = 1): CalendarDate[][] => {
    const start = startOfMonth(toCalendarDate(month));
    const weekCount = getMonthWeekCount(start, firstDayOfWeek);
    const jsDay = start.toDate('UTC').getDay();
    const offset = (jsDay - firstDayOfWeek + 7) % 7;
    let cursor = start.subtract({ days: offset });
    const weeks: CalendarDate[][] = [];

    for (let week = 0; week < weekCount; week += 1) {
        const row: CalendarDate[] = [];
        for (let day = 0; day < 7; day += 1) {
            row.push(cursor);
            cursor = cursor.add({ days: 1 });
        }
        weeks.push(row);
    }

    return weeks;
};

/** Weekday labels for the header row, starting at `firstDayOfWeek`. */
export const getWeekdayLabels = (
    locale: string,
    firstDayOfWeek = 1,
    weekday: Intl.DateTimeFormatOptions['weekday'] = 'short'
): string[] => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday });
    // 2024-01-07 is Sunday — walk 7 days from firstDayOfWeek.
    const sunday = new Date(Date.UTC(2024, 0, 7));

    return Array.from({ length: 7 }, (_, index) => {
        const day = new Date(sunday);
        day.setUTCDate(sunday.getUTCDate() + ((firstDayOfWeek + index) % 7));
        // Keep 2 chars so en/ru headers share the same visual width in 32px cells.
        return Array.from(formatter.format(day)).slice(0, 2).join('');
    });
};

/** End of month for height estimates / visibility checks. */
export const monthEnd = (date: DateValue): CalendarDate => endOfMonth(toCalendarDate(date));

/** Month keys for a window starting at `anchor`. */
export const getWindowMonthKeys = (anchor: CalendarDate, count = CALENDAR_WINDOW_MONTHS): string[] =>
    Array.from({ length: count }, (_, index) => toMonthKey(startOfMonth(anchor).add({ months: index })));

/** Centered window keys around `center` (`[c-k … c … c+k]` for odd N). */
export const getCenteredMonthKeys = (center: DateValue, count = CALENDAR_WINDOW_MONTHS): string[] => {
    const month = startOfMonth(toCalendarDate(center));
    const offset = getCenterIndex(count);

    return getWindowMonthKeys(month.subtract({ months: offset }), count);
};

/** @deprecated Use `getCenteredMonthKeys`. */
export const getTripleMonthKeys = (center: DateValue): string[] => getCenteredMonthKeys(center);

/** Signed month distance `to - from` (year*12 + month). */
export const monthIndexDelta = (from: DateValue, to: DateValue): number => {
    const a = startOfMonth(toCalendarDate(from));
    const b = startOfMonth(toCalendarDate(to));

    return b.year * 12 + b.month - (a.year * 12 + a.month);
};
