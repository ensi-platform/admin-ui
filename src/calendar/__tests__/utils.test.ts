import { CalendarDate } from '@internationalized/date';
import { describe, expect, it } from 'vitest';

import { CALENDAR_WINDOW_MONTHS, DEFAULT_YEAR_MAX, DEFAULT_YEAR_MIN } from '../constants';
import {
    DEFAULT_MONTH_HEIGHT_METRICS,
    createEstimateGetHeight,
    estimateMonthHeight,
    getCenterIndex,
    getCenteredMonthKeys,
    getMonthLabels,
    getMonthRangeForYear,
    getMonthWeekCount,
    getMonthWeeks,
    getRecenterAnchor,
    getRecenterOffset,
    getToday,
    getTripleMonthKeys,
    getWeekdayLabels,
    getWindowAnchor,
    getWindowMonthKeys,
    getYearRange,
    isDateInRange,
    isDateOutOfBounds,
    isSameDay,
    isSameMonth,
    monthEnd,
    monthIndexDelta,
    parseMonthKey,
    toMonthKey,
} from '../utils/date';
import {
    MAX_SCROLL_MONTHS,
    WEEK_SNAP_THRESHOLD,
    applyScrollDelta,
    buildScrollPathKeys,
    getLinearMonthPositions,
    getMonthPositions,
    getNearTopSnapScrollPosition,
    isMonthVisible,
    linearScrollOffsetForMonthKey,
    wheelDeltaToPixels,
} from '../utils/scroll';
import { HEADING_INTERACTIVE_TOP, getStickyHeadingOffset, isMonthHeadingInteractive } from '../utils/sticky';

describe('calendar utils', () => {
    it('toMonthKey formats yyyy-mm', () => {
        expect(toMonthKey(new CalendarDate(2024, 3, 15))).toBe('2024-03');
    });

    it('parseMonthKey restores first day of month', () => {
        expect(parseMonthKey('2024-03')?.toString()).toBe('2024-03-01');
        expect(parseMonthKey('bad')).toBeNull();
        expect(parseMonthKey('2024-13')).toBeNull();
    });

    it('isSameMonth compares year and month', () => {
        expect(isSameMonth(new CalendarDate(2024, 3, 1), new CalendarDate(2024, 3, 31))).toBe(true);
        expect(isSameMonth(new CalendarDate(2024, 3, 1), new CalendarDate(2024, 4, 1))).toBe(false);
    });

    it('isSameDay / isDateInRange / isDateOutOfBounds', () => {
        const a = new CalendarDate(2024, 6, 10);
        const b = new CalendarDate(2024, 6, 20);
        expect(isSameDay(a, new CalendarDate(2024, 6, 10))).toBe(true);
        expect(isSameDay(a, b)).toBe(false);
        expect(isDateInRange(new CalendarDate(2024, 6, 15), a, b)).toBe(true);
        expect(isDateInRange(new CalendarDate(2024, 6, 9), a, b)).toBe(false);
        expect(isDateInRange(new CalendarDate(2024, 6, 15), b, a)).toBe(true);
        expect(isDateOutOfBounds(a, new CalendarDate(2024, 6, 11), null)).toBe(true);
        expect(isDateOutOfBounds(a, null, new CalendarDate(2024, 6, 9))).toBe(true);
        expect(isDateOutOfBounds(a, new CalendarDate(2024, 6, 1), new CalendarDate(2024, 6, 30))).toBe(false);
    });

    it('getWindowAnchor places center in the middle of the window', () => {
        const center = new CalendarDate(2024, 6, 10);
        const anchor = getRecenterAnchor(center);
        expect(CALENDAR_WINDOW_MONTHS).toBe(3);
        expect(getCenterIndex()).toBe(1);
        expect(getRecenterOffset(CALENDAR_WINDOW_MONTHS)).toBe(1);
        expect(anchor.toString()).toBe('2024-05-01');
        expect(getWindowAnchor(center).toString()).toBe(anchor.toString());
        expect(getWindowAnchor(null).toString()).toBe(getRecenterAnchor(getToday()).toString());
        expect(getCenteredMonthKeys(center)).toEqual(['2024-05', '2024-06', '2024-07']);
    });

    it('getWindowMonthKeys lists months from anchor', () => {
        expect(getWindowMonthKeys(new CalendarDate(2024, 1, 1), 3)).toEqual(['2024-01', '2024-02', '2024-03']);
    });

    it('getMonthWeekCount covers 4–6 week months (Monday start)', () => {
        expect(getMonthWeekCount(new CalendarDate(2021, 2, 1), 1)).toBe(4);
        expect(getMonthWeekCount(new CalendarDate(2024, 1, 1), 1)).toBe(5);
        expect(getMonthWeekCount(new CalendarDate(2024, 12, 1), 1)).toBe(6);
    });

    it('getMonthWeeks pads outside-month days', () => {
        const weeks = getMonthWeeks(new CalendarDate(2024, 6, 1), 1);
        expect(weeks).toHaveLength(5);
        expect(weeks[0]).toHaveLength(7);
        expect(weeks[0]?.[0]?.toString()).toBe('2024-05-27');
        expect(weeks[0]?.[4]?.toString()).toBe('2024-05-31');
        expect(weeks[0]?.[5]?.toString()).toBe('2024-06-01');
        expect(weeks[4]?.[6]?.toString()).toBe('2024-06-30');
    });

    it('getWeekdayLabels starts on Monday by default', () => {
        const labels = getWeekdayLabels('en-US', 1, 'short');
        expect(labels).toHaveLength(7);
        expect(labels[0]?.toLowerCase()).toBe('mo');
        expect(labels[6]?.toLowerCase()).toBe('su');
    });

    it('getWeekdayLabels keeps two characters across locales', () => {
        expect(getWeekdayLabels('en-US', 1).every(label => Array.from(label).length === 2)).toBe(true);
        expect(getWeekdayLabels('ru-RU', 1).every(label => Array.from(label).length === 2)).toBe(true);
    });

    it('estimateMonthHeight scales with week rows', () => {
        const { cellSize, headingHeight, monthGap, weekdayRowHeight, monthBottomGap } = DEFAULT_MONTH_HEIGHT_METRICS;
        const base = headingHeight + monthGap + weekdayRowHeight + monthBottomGap;

        expect(estimateMonthHeight('2021-02')).toBe(base + 4 * cellSize);
        expect(estimateMonthHeight('2024-01')).toBe(base + 5 * cellSize);
        expect(estimateMonthHeight('2024-12')).toBe(base + 6 * cellSize);
        expect(estimateMonthHeight('bad-key')).toBe(base + 5 * cellSize);
        expect(createEstimateGetHeight()('2024-01')).toBe(estimateMonthHeight('2024-01'));
    });

    it('getToday / monthEnd / getTripleMonthKeys', () => {
        expect(getToday().toString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(monthEnd(new CalendarDate(2024, 2, 1)).toString()).toBe('2024-02-29');
        expect(getTripleMonthKeys(new CalendarDate(2024, 6, 15))).toEqual(
            getCenteredMonthKeys(new CalendarDate(2024, 6, 15))
        );
    });

    it('getMonthPositions pins center at top when scrollPosition is 0', () => {
        const keys = getCenteredMonthKeys(new CalendarDate(2024, 6, 1));
        const heights: Record<string, number> = {
            '2024-05': 100,
            '2024-06': 200,
            '2024-07': 150,
        };
        const getHeight = (key: string) => heights[key] ?? 0;
        const positions = getMonthPositions(keys, 0, getHeight);
        expect(positions[1]).toBe(0);
        expect(positions[0]).toBe(-100);
        expect(positions[2]).toBe(200);
    });

    it('isMonthVisible detects intersection with viewport', () => {
        expect(isMonthVisible(0, 200, 320)).toBe(true);
        expect(isMonthVisible(-199, 200, 320)).toBe(true);
        expect(isMonthVisible(-200, 200, 320)).toBe(false);
        expect(isMonthVisible(320, 200, 320)).toBe(false);
    });

    it('applyScrollDelta shifts window backward when scrolling up', () => {
        const keys = getCenteredMonthKeys(new CalendarDate(2024, 6, 1));
        const heights: Record<string, number> = {
            '2024-04': 90,
            '2024-05': 100,
            '2024-06': 200,
            '2024-07': 150,
        };
        const getHeight = (key: string) => heights[key] ?? 0;
        // centerIndex=1; shift when S >= h(keys[0]) = h(2024-05)=100
        const next = applyScrollDelta(keys, 100, -0.5, getHeight);
        expect(next.monthKeys).toEqual(['2024-04', '2024-05', '2024-06']);
        expect(next.centerMonth.toString()).toBe('2024-05-01');
        expect(next.scrollPosition).toBe(0.5);
    });

    it('applyScrollDelta shifts window forward when scrolling down', () => {
        const keys = getCenteredMonthKeys(new CalendarDate(2024, 6, 1));
        const heights: Record<string, number> = {
            '2024-05': 100,
            '2024-06': 200,
            '2024-07': 150,
            '2024-08': 120,
        };
        const getHeight = (key: string) => heights[key] ?? 0;
        const next = applyScrollDelta(keys, 0, 0.5, getHeight);
        expect(next.monthKeys).toEqual(['2024-06', '2024-07', '2024-08']);
        expect(next.centerMonth.toString()).toBe('2024-07-01');
        expect(next.scrollPosition).toBe(199.5);
    });

    it('getStickyHeadingOffset sticks heading while month scrolls under viewport top', () => {
        expect(getStickyHeadingOffset(10, 200, 36)).toBe(0);
        expect(getStickyHeadingOffset(0, 200, 36)).toBe(0);
        expect(getStickyHeadingOffset(-20, 200, 36)).toBe(20);
        expect(getStickyHeadingOffset(-180, 200, 36)).toBe(164);
        expect(getStickyHeadingOffset(-200, 200, 36)).toBe(164);
        expect(getStickyHeadingOffset(-50, 0, 36)).toBe(0);
    });

    it('isMonthHeadingInteractive only near sticky/active zone', () => {
        expect(isMonthHeadingInteractive(0, 200, 36)).toBe(true);
        expect(isMonthHeadingInteractive(HEADING_INTERACTIVE_TOP, 200, 36)).toBe(true);
        expect(isMonthHeadingInteractive(HEADING_INTERACTIVE_TOP + 1, 200, 36)).toBe(false);
        expect(isMonthHeadingInteractive(-20, 200, 36)).toBe(true);
        expect(isMonthHeadingInteractive(-180, 200, 36)).toBe(false);
        expect(isMonthHeadingInteractive(0, 0, 36)).toBe(false);
    });

    it('monthIndexDelta / buildScrollPathKeys cap and pad path', () => {
        expect(monthIndexDelta(new CalendarDate(2024, 1, 1), new CalendarDate(2024, 3, 1))).toBe(2);
        expect(monthIndexDelta(new CalendarDate(2024, 3, 1), new CalendarDate(2024, 1, 1))).toBe(-2);

        const short = buildScrollPathKeys(new CalendarDate(2024, 6, 1), new CalendarDate(2024, 8, 1));
        expect(short.fromKey).toBe('2024-06');
        expect(short.toKey).toBe('2024-08');
        expect(short.keys).toEqual(['2024-05', '2024-06', '2024-07', '2024-08', '2024-09']);

        const backward = buildScrollPathKeys(new CalendarDate(2024, 8, 1), new CalendarDate(2024, 6, 1));
        expect(backward.fromKey).toBe('2024-08');
        expect(backward.toKey).toBe('2024-06');
        expect(backward.keys).toEqual(['2024-05', '2024-06', '2024-07', '2024-08', '2024-09']);

        const capped = buildScrollPathKeys(new CalendarDate(2024, 1, 1), new CalendarDate(2025, 1, 1));
        expect(Math.abs(monthIndexDelta(new CalendarDate(2024, 1, 1), parseMonthKey(capped.toKey)!))).toBe(
            MAX_SCROLL_MONTHS
        );
        expect(capped.toKey).toBe('2024-07');
    });

    it('linear layout offsets put month key at top', () => {
        const keys = ['2024-05', '2024-06', '2024-07'];
        const getHeight = () => 100;
        expect(linearScrollOffsetForMonthKey(keys, '2024-05', getHeight)).toBe(0);
        expect(linearScrollOffsetForMonthKey(keys, '2024-07', getHeight)).toBe(-200);
        const positions = getLinearMonthPositions(keys, -200, getHeight);
        expect(positions[2]).toBe(0);
        expect(getMonthPositions([], 0)).toEqual([]);
        expect(getLinearMonthPositions([], 0)).toEqual([]);
    });

    it('getNearTopSnapScrollPosition snaps only near top', () => {
        const keys = getCenteredMonthKeys(new CalendarDate(2024, 6, 1));
        const getHeight = () => 200;
        expect(getNearTopSnapScrollPosition([], 42, getHeight)).toBe(42);
        expect(getNearTopSnapScrollPosition(keys, 0, getHeight)).toBe(0);
        expect(getNearTopSnapScrollPosition(keys, 10, getHeight)).toBe(0);
        expect(getNearTopSnapScrollPosition(keys, WEEK_SNAP_THRESHOLD + 20, getHeight)).toBe(WEEK_SNAP_THRESHOLD + 20);

        const short = () => 100;
        // Positive S → nearest month is previous (bestIndex < centerIndex).
        expect(getNearTopSnapScrollPosition(keys, 50, short)).toBe(100);
        // Negative S → nearest is next month (bestIndex > centerIndex).
        expect(getNearTopSnapScrollPosition(keys, -60, short)).toBe(-100);
        // scrollDirection > 0 near top prefers one week below title.
        expect(getNearTopSnapScrollPosition(keys, 50, short, WEEK_SNAP_THRESHOLD, 1)).toBe(
            100 - DEFAULT_MONTH_HEIGHT_METRICS.cellSize
        );
        // scrollDirection > 0 but alt is farther → keep target.
        expect(getNearTopSnapScrollPosition(keys, 90, short, WEEK_SNAP_THRESHOLD, 1)).toBe(100);
    });

    it('applyScrollDelta breaks on invalid center keys', () => {
        const getHeight = () => 100;
        const badKeys = ['bad', 'bad', 'bad'];
        expect(applyScrollDelta(badKeys, 150, -1, getHeight).monthKeys).toEqual(badKeys);
        expect(applyScrollDelta(badKeys, -50, 1, getHeight).monthKeys).toEqual(badKeys);
        const fallbackCenter = applyScrollDelta(badKeys, 0, 0, getHeight).centerMonth;
        expect(fallbackCenter.day).toBe(1);
        expect(fallbackCenter.year).toBe(getToday().year);
        expect(fallbackCenter.month).toBe(getToday().month);
        expect(applyScrollDelta([], 0, 10, getHeight).monthKeys).toHaveLength(CALENDAR_WINDOW_MONTHS);
    });

    it('getYearRange / getMonthRangeForYear respect min/max', () => {
        expect(getYearRange(null, null)).toEqual({ minYear: DEFAULT_YEAR_MIN, maxYear: DEFAULT_YEAR_MAX });
        expect(getYearRange(new CalendarDate(2020, 5, 1), new CalendarDate(2022, 8, 1))).toEqual({
            minYear: 2020,
            maxYear: 2022,
        });
        expect(getYearRange(new CalendarDate(2025, 1, 1), new CalendarDate(2020, 1, 1))).toEqual({
            minYear: 2020,
            maxYear: 2025,
        });
        expect(getMonthRangeForYear(2020, new CalendarDate(2020, 5, 1), new CalendarDate(2022, 8, 1))).toEqual({
            minMonth: 5,
            maxMonth: 12,
        });
        expect(getMonthRangeForYear(2022, new CalendarDate(2020, 5, 1), new CalendarDate(2022, 8, 1))).toEqual({
            minMonth: 1,
            maxMonth: 8,
        });
        expect(getMonthRangeForYear(2021, new CalendarDate(2020, 5, 1), new CalendarDate(2022, 8, 1))).toEqual({
            minMonth: 1,
            maxMonth: 12,
        });
        expect(getMonthRangeForYear(2019, new CalendarDate(2020, 5, 1), new CalendarDate(2022, 8, 1))).toEqual({
            minMonth: 1,
            maxMonth: 0,
        });
        expect(getMonthRangeForYear(2023, new CalendarDate(2020, 5, 1), new CalendarDate(2022, 8, 1))).toEqual({
            minMonth: 1,
            maxMonth: 0,
        });
        expect(getMonthRangeForYear(2020, new CalendarDate(2020, 10, 1), new CalendarDate(2020, 3, 1))).toEqual({
            minMonth: 10,
            maxMonth: 9,
        });
    });

    it('getMonthLabels returns 12 localized names', () => {
        const labels = getMonthLabels('en-US');
        expect(labels).toHaveLength(12);
        expect(labels[0]?.toLowerCase().startsWith('jan')).toBe(true);
        expect(labels[5]?.toLowerCase().startsWith('jun')).toBe(true);
    });

    it('wheelDeltaToPixels respects deltaMode', () => {
        expect(wheelDeltaToPixels({ deltaY: 10, deltaMode: 0 })).toBe(10);
        expect(wheelDeltaToPixels({ deltaY: 2, deltaMode: 1 })).toBe(32);
        expect(wheelDeltaToPixels({ deltaY: 1, deltaMode: 2 })).toBe(320);
    });
});
