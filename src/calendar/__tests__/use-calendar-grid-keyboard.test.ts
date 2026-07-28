import { CalendarDate } from '@internationalized/date';
import { describe, expect, it } from 'vitest';

import {
    focusedDateInMonth,
    getInitialFocusedDate,
    getWeekdayOffset,
    moveFocusedDate,
    shouldScrollToMonth,
    stepFocusedDate,
} from '../hooks/useCalendarGridKeyboard';

describe('calendar-grid-keyboard', () => {
    it('moves by one day and one week', () => {
        const date = new CalendarDate(2024, 6, 15);
        expect(stepFocusedDate(date, 'ArrowRight').toString()).toBe('2024-06-16');
        expect(stepFocusedDate(date, 'ArrowLeft').toString()).toBe('2024-06-14');
        expect(stepFocusedDate(date, 'ArrowDown').toString()).toBe('2024-06-22');
        expect(stepFocusedDate(date, 'ArrowUp').toString()).toBe('2024-06-08');
    });

    it('Home/End snap to Monday–Sunday week', () => {
        // 2024-06-15 is Saturday
        const saturday = new CalendarDate(2024, 6, 15);
        expect(getWeekdayOffset(saturday)).toBe(5);
        expect(stepFocusedDate(saturday, 'Home').toString()).toBe('2024-06-10');
        expect(stepFocusedDate(saturday, 'End').toString()).toBe('2024-06-16');
    });

    it('PageUp/PageDown move by month', () => {
        const date = new CalendarDate(2024, 6, 15);
        expect(stepFocusedDate(date, 'PageUp').toString()).toBe('2024-05-15');
        expect(stepFocusedDate(date, 'PageDown').toString()).toBe('2024-07-15');
    });

    it('skips unavailable days in the same direction', () => {
        const date = new CalendarDate(2024, 6, 15);
        const unavailable = new Set(['2024-06-16', '2024-06-17']);
        const next = moveFocusedDate(date, 'ArrowRight', {
            isDateUnavailable: d => unavailable.has(d.toString()),
        });
        expect(next.toString()).toBe('2024-06-18');
    });

    it('clamps to max and does not leave bounds', () => {
        const max = new CalendarDate(2024, 6, 15);
        const next = moveFocusedDate(new CalendarDate(2024, 6, 15), 'ArrowRight', { maxValue: max });
        expect(next.toString()).toBe('2024-06-15');
    });

    it('clamps to min on ArrowLeft past bound', () => {
        const min = new CalendarDate(2024, 6, 10);
        const next = moveFocusedDate(new CalendarDate(2024, 6, 10), 'ArrowLeft', { minValue: min });
        expect(next.toString()).toBe('2024-06-10');
    });

    it('getInitialFocusedDate prefers preferred when available', () => {
        const preferred = new CalendarDate(2024, 6, 15);
        expect(getInitialFocusedDate(preferred).toString()).toBe('2024-06-15');
    });

    it('getInitialFocusedDate skips unavailable preferred', () => {
        const preferred = new CalendarDate(2024, 6, 15);
        const next = getInitialFocusedDate(preferred, {
            minValue: new CalendarDate(2024, 6, 1),
            maxValue: new CalendarDate(2024, 6, 30),
            isDateUnavailable: d => d.toString() === '2024-06-15',
        });
        expect(next.toString()).toBe('2024-06-16');
    });

    it('shouldScrollToMonth is false when month is already in the window', () => {
        const keys = ['2024-05', '2024-06', '2024-07'];
        expect(shouldScrollToMonth(keys, new CalendarDate(2024, 7, 1))).toBe(false);
        expect(shouldScrollToMonth(keys, new CalendarDate(2024, 8, 1))).toBe(true);
    });

    it('focusedDateInMonth keeps day when possible', () => {
        const focused = new CalendarDate(2024, 6, 15);
        expect(focusedDateInMonth(focused, 2024, 7).toString()).toBe('2024-07-15');
    });
});
