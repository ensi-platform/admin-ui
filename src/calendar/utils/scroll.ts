import { type CalendarDate, type DateValue, startOfMonth, toCalendarDate } from '@internationalized/date';

import { CALENDAR_WINDOW_MONTHS } from '../constants';

import {
    CALENDAR_VIEWPORT_HEIGHT,
    DEFAULT_MONTH_HEIGHT_METRICS,
    createEstimateGetHeight,
    getCenterIndex,
    getCenterMonth,
    getCenteredMonthKeys,
    getToday,
    monthIndexDelta,
    parseMonthKey,
    toMonthKey,
    type TGetMonthHeight,
} from './date';

/** Max months to animate across in `scrollToMonth`. */
export const MAX_SCROLL_MONTHS = 6;

/**
 * Contiguous month keys from `from` to `to` (inclusive), direction-aware order.
 * Caps distance to `maxMonths`.
 */
export const buildScrollPathKeys = (
    from: DateValue,
    to: DateValue,
    maxMonths = MAX_SCROLL_MONTHS
): { keys: string[]; fromKey: string; toKey: string } => {
    const start = startOfMonth(toCalendarDate(from));
    let delta = monthIndexDelta(start, to);
    let sign = 0;
    if (delta > 0) {
        sign = 1;
    }
    if (delta < 0) {
        sign = -1;
    }
    if (Math.abs(delta) > maxMonths) {
        delta = sign * maxMonths;
    }
    const end = start.add({ months: delta });
    const fromKey = toMonthKey(start);
    const toKey = toMonthKey(end);
    const count = Math.abs(delta) + 1;
    const first = delta >= 0 ? start : end;
    let keys = Array.from({ length: count }, (_, index) => toMonthKey(first.add({ months: index })));

    // Padding so the path covers a center-sized window while animating.
    const pad = getCenterIndex(CALENDAR_WINDOW_MONTHS);
    const pathFirst = parseMonthKey(keys[0])!;
    const pathLast = parseMonthKey(keys[keys.length - 1])!;
    const before = Array.from({ length: pad }, (_, index) => toMonthKey(pathFirst.subtract({ months: pad - index })));
    const after = Array.from({ length: pad }, (_, index) => toMonthKey(pathLast.add({ months: index + 1 })));
    keys = [...before, ...keys, ...after];

    return { keys, fromKey, toKey };
};

/**
 * Absolute `top` for each month given Kontur scrollPosition.
 * At `scrollPosition === 0`, the center month (`getCenterIndex`) sits at the viewport top.
 */
export const getMonthPositions = (
    monthKeys: readonly string[],
    scrollPosition: number,
    getHeight: TGetMonthHeight = createEstimateGetHeight()
): number[] => {
    if (monthKeys.length === 0) {
        return [];
    }

    const centerIndex = getCenterIndex(monthKeys.length);
    const positions = Array.from({ length: monthKeys.length }, () => 0);
    positions[centerIndex] = scrollPosition;

    for (let index = centerIndex - 1; index >= 0; index -= 1) {
        positions[index] = positions[index + 1] - getHeight(monthKeys[index]);
    }

    for (let index = centerIndex + 1; index < monthKeys.length; index += 1) {
        positions[index] = positions[index - 1] + getHeight(monthKeys[index - 1]);
    }

    return positions;
};

/** Whether a month block intersects the viewport. */
export const isMonthVisible = (top: number, height: number, viewportHeight: number): boolean =>
    top < viewportHeight && top > -height;

/**
 * Linear tops: `positions[0] = scrollOffset`, then stack downward.
 * Used during animated `scrollToMonth` (not the centered pin model).
 */
export const getLinearMonthPositions = (
    monthKeys: readonly string[],
    scrollOffset: number,
    getHeight: TGetMonthHeight = createEstimateGetHeight()
): number[] => {
    if (monthKeys.length === 0) {
        return [];
    }

    const positions = Array.from({ length: monthKeys.length }, () => 0);
    positions[0] = scrollOffset;
    for (let index = 1; index < monthKeys.length; index += 1) {
        positions[index] = positions[index - 1] + getHeight(monthKeys[index - 1]);
    }

    return positions;
};

/** Scroll offset that puts `monthKey` at the viewport top in linear layout. */
export const linearScrollOffsetForMonthKey = (
    monthKeys: readonly string[],
    monthKey: string,
    getHeight: TGetMonthHeight = createEstimateGetHeight()
): number => {
    const index = monthKeys.indexOf(monthKey);
    if (index <= 0) {
        return 0;
    }

    let sum = 0;
    for (let i = 0; i < index; i += 1) {
        sum += getHeight(monthKeys[i]);
    }

    return -sum;
};

/** Week-row threshold for Kontur-like near-top snap. */
export const WEEK_SNAP_THRESHOLD = DEFAULT_MONTH_HEIGHT_METRICS.headingHeight + DEFAULT_MONTH_HEIGHT_METRICS.cellSize;

/**
 * Soft snap only when a month top is within `threshold` of the viewport top.
 * `scrollDirection`: last wheel sign (<0 up / later content, >0 down / earlier) — Kontur uses
 * negative direction to prefer one week below the title.
 */
export const getNearTopSnapScrollPosition = (
    monthKeys: readonly string[],
    scrollPosition: number,
    getHeight: TGetMonthHeight = createEstimateGetHeight(),
    threshold: number = WEEK_SNAP_THRESHOLD,
    scrollDirection = 0
): number => {
    if (monthKeys.length === 0) {
        return scrollPosition;
    }

    const positions = getMonthPositions(monthKeys, scrollPosition, getHeight);
    let bestIndex = 0;
    let bestDist = Math.abs(positions[0]);

    for (let index = 1; index < positions.length; index += 1) {
        const dist = Math.abs(positions[index]);
        if (dist < bestDist) {
            bestDist = dist;
            bestIndex = index;
        }
    }

    if (bestDist > threshold) {
        return scrollPosition;
    }

    const centerIndex = getCenterIndex(monthKeys.length);
    // ScrollPosition that puts bestIndex at top (same math as former scrollPositionForIndex).
    let target = 0;
    if (bestIndex < centerIndex) {
        for (let i = bestIndex; i < centerIndex; i += 1) {
            target += getHeight(monthKeys[i]);
        }
    }
    if (bestIndex > centerIndex) {
        for (let i = centerIndex; i < bestIndex; i += 1) {
            target -= getHeight(monthKeys[i]);
        }
    }

    // Kontur: when scrolling toward earlier months near top, prefer one week below title.
    if (scrollDirection > 0 && bestDist > 0.5 && Math.abs(target - scrollPosition) < threshold) {
        const week = DEFAULT_MONTH_HEIGHT_METRICS.cellSize;
        const alt = target - week;
        if (Math.abs(alt - scrollPosition) < Math.abs(target - scrollPosition)) {
            return alt;
        }
    }

    return target;
};

/**
 * Apply wheel/touch delta (Kontur `calculateScrollPosition`).
 * Positive `deltaY` scrolls content up (later months).
 */
export const applyScrollDelta = (
    monthKeys: readonly string[],
    scrollPosition: number,
    deltaY: number,
    getHeight: TGetMonthHeight = createEstimateGetHeight()
): { monthKeys: string[]; scrollPosition: number; centerMonth: CalendarDate } => {
    let nextKeys = monthKeys.length > 0 ? [...monthKeys] : getCenteredMonthKeys(getToday());
    let nextPos = scrollPosition - deltaY;
    const maxShifts = 24;
    const centerIndex = getCenterIndex(nextKeys.length);

    if (deltaY < 0) {
        for (let shift = 0; shift < maxShifts; shift += 1) {
            const prevKey = nextKeys[centerIndex - 1];
            if (!prevKey || nextPos < getHeight(prevKey)) {
                break;
            }
            nextPos -= getHeight(prevKey);
            const center = parseMonthKey(nextKeys[centerIndex]);
            if (!center) {
                break;
            }
            nextKeys = getCenteredMonthKeys(center.subtract({ months: 1 }));
        }
    }

    if (deltaY > 0) {
        for (let shift = 0; shift < maxShifts; shift += 1) {
            const centerKey = nextKeys[centerIndex];
            if (!centerKey || nextPos >= 0) {
                break;
            }
            nextPos += getHeight(centerKey);
            const center = parseMonthKey(centerKey);
            if (!center) {
                break;
            }
            nextKeys = getCenteredMonthKeys(center.add({ months: 1 }));
        }
    }

    const centerMonth = parseMonthKey(nextKeys[getCenterIndex(nextKeys.length)]) ?? getCenterMonth(null);

    return { monthKeys: nextKeys, scrollPosition: nextPos, centerMonth };
};

/** Normalize WheelEvent delta to CSS pixels. */
export const wheelDeltaToPixels = (event: Pick<WheelEvent, 'deltaY' | 'deltaMode'>): number => {
    const { deltaY, deltaMode } = event;
    if (deltaMode === 1) {
        return deltaY * 16;
    }
    if (deltaMode === 2) {
        return deltaY * CALENDAR_VIEWPORT_HEIGHT;
    }

    return deltaY;
};
