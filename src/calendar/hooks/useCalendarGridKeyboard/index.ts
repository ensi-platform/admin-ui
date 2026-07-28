import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

import { type CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

import { isDateOutOfBounds, isSameMonth, toMonthKey } from '../../utils/date';

/** Week starts Monday (aligned with MonthView). */
export const CALENDAR_GRID_FIRST_DAY_OF_WEEK = 1;

export type TCalendarGridNavKey =
    'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End' | 'PageUp' | 'PageDown';

const NAV_KEYS = new Set<string>([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'PageUp',
    'PageDown',
]);

/** Options for grid keyboard movement. */
export interface IMoveFocusedDateOptions {
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    isDateUnavailable?: (date: CalendarDate) => boolean;
    firstDayOfWeek?: number;
}

const isBlocked = (date: CalendarDate, options: IMoveFocusedDateOptions) =>
    isDateOutOfBounds(date, options.minValue, options.maxValue) || Boolean(options.isDateUnavailable?.(date));

/** Day-of-week index relative to `firstDayOfWeek` (0 = start of week). */
export const getWeekdayOffset = (date: CalendarDate, firstDayOfWeek = CALENDAR_GRID_FIRST_DAY_OF_WEEK) => {
    const jsDay = date.toDate('UTC').getDay();

    return (jsDay - firstDayOfWeek + 7) % 7;
};

/** One navigation step before skipping blocked days. */
export const stepFocusedDate = (
    date: CalendarDate,
    key: TCalendarGridNavKey,
    firstDayOfWeek = CALENDAR_GRID_FIRST_DAY_OF_WEEK
): CalendarDate => {
    switch (key) {
        case 'ArrowLeft':
            return date.subtract({ days: 1 });
        case 'ArrowRight':
            return date.add({ days: 1 });
        case 'ArrowUp':
            return date.subtract({ days: 7 });
        case 'ArrowDown':
            return date.add({ days: 7 });
        case 'Home': {
            const offset = getWeekdayOffset(date, firstDayOfWeek);

            return date.subtract({ days: offset });
        }
        case 'End': {
            const offset = getWeekdayOffset(date, firstDayOfWeek);

            return date.add({ days: 6 - offset });
        }
        case 'PageUp':
            return date.subtract({ months: 1 });
        case 'PageDown':
            return date.add({ months: 1 });
        default:
            return date;
    }
};

/** Direction used when skipping blocked days after a step. */
export const getSkipDayDelta = (key: TCalendarGridNavKey): 1 | -1 => {
    switch (key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'Home':
        case 'PageUp':
            return -1;
        default:
            return 1;
    }
};

/**
 * Move focus by key; skip unavailable / out-of-bounds days in the same direction.
 * Returns `date` unchanged when no valid target exists.
 */
export const moveFocusedDate = (
    date: CalendarDate,
    key: TCalendarGridNavKey,
    options: IMoveFocusedDateOptions = {}
): CalendarDate => {
    const firstDayOfWeek = options.firstDayOfWeek ?? CALENDAR_GRID_FIRST_DAY_OF_WEEK;
    let next = stepFocusedDate(date, key, firstDayOfWeek);

    if (isDateOutOfBounds(next, options.minValue, options.maxValue)) {
        if (options.minValue != null && next.compare(options.minValue) < 0) {
            next = options.minValue;
        }
        if (options.maxValue != null && next.compare(options.maxValue) > 0) {
            next = options.maxValue;
        }
    }

    if (isBlocked(next, options) && next.compare(date) === 0) {
        return date;
    }

    const delta = getSkipDayDelta(key);

    for (let guard = 0; guard < 366 && isBlocked(next, options); guard += 1) {
        const candidate = next.add({ days: delta });
        if (isDateOutOfBounds(candidate, options.minValue, options.maxValue)) {
            return date;
        }
        next = candidate;
    }

    return isBlocked(next, options) ? date : next;
};

const clampIntoBounds = (date: CalendarDate, options: IMoveFocusedDateOptions): CalendarDate => {
    if (options.minValue != null && date.compare(options.minValue) < 0) {
        return options.minValue;
    }
    if (options.maxValue != null && date.compare(options.maxValue) > 0) {
        return options.maxValue;
    }

    return date;
};

/** Initial focus: preferred (clamped) → today → walk to first available. */
export const getInitialFocusedDate = (
    preferred: CalendarDate | null | undefined,
    options: IMoveFocusedDateOptions = {}
): CalendarDate => {
    const timeZone = getLocalTimeZone();
    const todayDate = today(timeZone);
    const start = clampIntoBounds(preferred ?? todayDate, options);

    let cursor = start;
    for (let guard = 0; guard < 366 * 3; guard += 1) {
        if (!isBlocked(cursor, options)) {
            return cursor;
        }
        const next = cursor.add({ days: 1 });
        if (options.maxValue != null && next.compare(options.maxValue) > 0) {
            break;
        }
        cursor = next;
    }

    cursor = start;
    for (let guard = 0; guard < 366 * 3; guard += 1) {
        if (!isBlocked(cursor, options)) {
            return cursor;
        }
        const prev = cursor.subtract({ days: 1 });
        if (options.minValue != null && prev.compare(options.minValue) < 0) {
            break;
        }
        cursor = prev;
    }

    return options.minValue ?? todayDate;
};

/** Whether `date`'s month is already rendered in the scroll window. */
export const shouldScrollToMonth = (monthKeys: readonly string[], date: CalendarDate) =>
    !monthKeys.includes(toMonthKey(date));

/** Move focused day into `year`/`month`, clamping day to month length / bounds. */
export const focusedDateInMonth = (
    focusedDate: CalendarDate,
    year: number,
    month: number,
    options: IMoveFocusedDateOptions = {}
): CalendarDate => {
    const next = focusedDate.set({ year, month });
    const available = getInitialFocusedDate(next, options);

    return available;
};

const focusDateButton = (viewport: HTMLElement | null, date: CalendarDate) => {
    const button = viewport?.querySelector(`[data-date="${date.toString()}"]`);
    if (button instanceof HTMLElement) {
        button.focus();

        return true;
    }

    return false;
};

const focusDateButtonWhenReady = (viewport: HTMLElement | null, date: CalendarDate, attempts = 12) => {
    if (focusDateButton(viewport, date) || attempts <= 0) {
        return;
    }
    requestAnimationFrame(() => focusDateButtonWhenReady(viewport, date, attempts - 1));
};

/** Options for calendar grid keyboard hook. */
export interface IUseCalendarGridKeyboardOptions {
    viewportRef: RefObject<HTMLElement | null>;
    /** Soft scroll: only when month is outside the current window. */
    ensureMonthVisible: (date: CalendarDate) => void;
    preferredDate?: CalendarDate | null;
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    isDateUnavailable?: (date: CalendarDate) => boolean;
    onSelect?: (date: CalendarDate) => void;
    /** Focus the day cell on mount (keyboard open only). */
    autoFocusDay?: boolean;
}

/** Roving focus + arrow navigation for the scroll calendar grid. */
export const useCalendarGridKeyboard = ({
    viewportRef,
    ensureMonthVisible,
    preferredDate = null,
    minValue = null,
    maxValue = null,
    isDateUnavailable,
    onSelect,
    autoFocusDay = false,
}: IUseCalendarGridKeyboardOptions) => {
    const moveOptions: IMoveFocusedDateOptions = { minValue, maxValue, isDateUnavailable };
    const [focusedDate, setFocusedDate] = useState(() => getInitialFocusedDate(preferredDate, moveOptions));
    const focusedDateRef = useRef(focusedDate);
    focusedDateRef.current = focusedDate;
    const didInitialFocusRef = useRef(false);
    const [isGridEngaged, setGridEngaged] = useState(autoFocusDay);

    useEffect(() => {
        if (didInitialFocusRef.current) {
            return;
        }
        didInitialFocusRef.current = true;
        if (!autoFocusDay) {
            return;
        }
        setGridEngaged(true);
        const frame = requestAnimationFrame(() => {
            focusDateButtonWhenReady(viewportRef.current, focusedDateRef.current);
        });

        return () => cancelAnimationFrame(frame);
    }, [autoFocusDay, viewportRef]);

    const moveFocusTo = useCallback(
        (next: CalendarDate) => {
            const prev = focusedDateRef.current;
            setGridEngaged(true);
            setFocusedDate(next);
            focusedDateRef.current = next;
            if (!isSameMonth(next, prev)) {
                ensureMonthVisible(next);
            }
            focusDateButtonWhenReady(viewportRef.current, next);
        },
        [ensureMonthVisible, viewportRef]
    );

    const onDayFocus = useCallback((date: CalendarDate) => {
        setGridEngaged(true);
        setFocusedDate(date);
        focusedDateRef.current = date;
    }, []);

    const setFocusedDateFromParts = useCallback(
        (year: number, month: number) => {
            const next = focusedDateInMonth(focusedDateRef.current, year, month, moveOptions);
            setGridEngaged(true);
            setFocusedDate(next);
            focusedDateRef.current = next;
            // Do not focus the day cell here — steals focus from MonthYearSelect and drops its popover.
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isDateUnavailable, maxValue, minValue]
    );

    const onDayKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect?.(focusedDateRef.current);

                return;
            }

            if (!NAV_KEYS.has(event.key)) {
                return;
            }

            event.preventDefault();
            const next = moveFocusedDate(focusedDateRef.current, event.key as TCalendarGridNavKey, moveOptions);
            if (next.compare(focusedDateRef.current) === 0) {
                return;
            }
            moveFocusTo(next);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isDateUnavailable, maxValue, minValue, moveFocusTo, onSelect]
    );

    return { focusedDate, onDayFocus, onDayKeyDown, setFocusedDateFromParts, isGridEngaged };
};
