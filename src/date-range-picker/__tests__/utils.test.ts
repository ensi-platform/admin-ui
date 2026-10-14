import { CalendarDate } from '@internationalized/date';
import { type DateRange } from 'react-aria-components';
import { describe, expect, it } from 'vitest';

import {
    DEFAULT_RANGE_MAX_VALUE,
    DEFAULT_RANGE_MIN_VALUE,
    hasRangeValue,
    isPublishableRange,
    orderRange,
    rangesEqual,
    resolveCommittedRange,
} from '../utils';

const min = new CalendarDate(2000, 1, 1);
const max = new CalendarDate(2030, 12, 31);

const range = (start: CalendarDate, end: CalendarDate): DateRange => ({ start, end });

/** RAC keeps a null endpoint while a segment is incomplete. */
const partial = (start: CalendarDate) => ({ start, end: null });

describe('date range utils', () => {
    it('treats a range with either endpoint as filled', () => {
        expect(hasRangeValue(null)).toBe(false);
        expect(hasRangeValue(undefined)).toBe(false);
        expect(hasRangeValue(partial(new CalendarDate(2024, 6, 1)))).toBe(true);
        expect(hasRangeValue(range(new CalendarDate(2024, 6, 1), new CalendarDate(2024, 6, 15)))).toBe(true);
    });

    it.each([
        ['empty', null, true],
        ['single day', range(new CalendarDate(2024, 6, 1), new CalendarDate(2024, 6, 1)), true],
        ['ordered', range(new CalendarDate(2024, 6, 1), new CalendarDate(2024, 6, 15)), true],
        ['reversed', range(new CalendarDate(2024, 6, 15), new CalendarDate(2024, 6, 1)), false],
        ['partial', partial(new CalendarDate(2024, 6, 1)), false],
        ['before min', range(new CalendarDate(1999, 12, 31), new CalendarDate(2024, 6, 1)), false],
        ['after max', range(new CalendarDate(2024, 6, 1), new CalendarDate(2031, 1, 1)), false],
        ['on min and max', range(min, max), true],
    ] as const)('publishable: %s', (_label, value, expected) => {
        expect(isPublishableRange(value, min, max)).toBe(expected);
    });

    it('swaps a complete reversed range and leaves a partial range', () => {
        const swapped = orderRange(range(new CalendarDate(2000, 11, 11), new CalendarDate(2000, 11, 1)));

        expect(swapped.start).toEqual(new CalendarDate(2000, 11, 1));
        expect(swapped.end).toEqual(new CalendarDate(2000, 11, 11));

        const incomplete = partial(new CalendarDate(2024, 6, 20));

        expect(orderRange(incomplete)).toBe(incomplete);
        expect(orderRange(range(new CalendarDate(2024, 6, 1), new CalendarDate(2024, 6, 1))).start).toEqual(
            new CalendarDate(2024, 6, 1)
        );
    });

    it('matches ranges by endpoints, including a missing end', () => {
        const start = new CalendarDate(2024, 6, 1);
        const end = new CalendarDate(2024, 6, 15);
        const incomplete = partial(start);

        expect(rangesEqual(null, null)).toBe(true);
        expect(rangesEqual(null, range(start, end))).toBe(false);
        expect(rangesEqual(range(start, end), range(new CalendarDate(2024, 6, 1), new CalendarDate(2024, 6, 15)))).toBe(
            true
        );
        expect(rangesEqual(incomplete, partial(new CalendarDate(2024, 6, 1)))).toBe(true);
        expect(rangesEqual(incomplete, range(start, end))).toBe(false);
        expect(rangesEqual(range(end, start), range(start, end))).toBe(false);
    });

    it('commits an ordered range and restores the last valid one otherwise', () => {
        const lastValid = range(new CalendarDate(2024, 6, 1), new CalendarDate(2024, 6, 15));

        expect(
            resolveCommittedRange(
                range(new CalendarDate(2000, 11, 11), new CalendarDate(2000, 11, 1)),
                lastValid,
                DEFAULT_RANGE_MIN_VALUE,
                DEFAULT_RANGE_MAX_VALUE
            )
        ).toEqual(range(new CalendarDate(2000, 11, 1), new CalendarDate(2000, 11, 11)));

        expect(resolveCommittedRange(null, lastValid, min, max)).toBeNull();
        expect(
            resolveCommittedRange(
                range(new CalendarDate(1990, 1, 1), new CalendarDate(1990, 1, 2)),
                lastValid,
                min,
                max
            )
        ).toBe(lastValid);
        expect(resolveCommittedRange(partial(new CalendarDate(2024, 6, 20)), lastValid, min, max)).toBe(lastValid);
        expect(resolveCommittedRange(range(min, min), null, min, max)).toEqual(range(min, min));
    });
});
