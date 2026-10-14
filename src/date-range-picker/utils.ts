import { CalendarDate, type DateValue } from '@internationalized/date';
import { type DateRange } from 'react-aria-components';

import { DEFAULT_YEAR_MAX, DEFAULT_YEAR_MIN } from '@/calendar';

/** Incomplete segment input. RAC types both ends as `DateValue`, but a cleared segment is `null`. */
interface IEditableRange {
    start: DateValue | null;
    end: DateValue | null;
}

export const DEFAULT_RANGE_MIN_VALUE = new CalendarDate(DEFAULT_YEAR_MIN, 1, 1);
export const DEFAULT_RANGE_MAX_VALUE = new CalendarDate(DEFAULT_YEAR_MAX, 12, 31);

/** True when either endpoint is set. */
export const hasRangeValue = (value: IEditableRange | null | undefined) => value?.start != null || value?.end != null;

const sameEndpoint = (left: DateValue | null | undefined, right: DateValue | null | undefined) => {
    if (left == null || right == null) {
        return left == null && right == null;
    }

    return left.compare(right) === 0;
};

const isDateInBounds = (value: DateValue, minValue: DateValue, maxValue: DateValue) =>
    value.compare(minValue) >= 0 && value.compare(maxValue) <= 0;

/**
 * Empty range is publishable (clear). A range is publishable only when both
 * ends exist, end is not before start, and both ends sit inside bounds.
 */
export const isPublishableRange = (
    value: IEditableRange | null | undefined,
    minValue: DateValue,
    maxValue: DateValue
) => {
    if (value == null) {
        return true;
    }
    if (value.start == null || value.end == null) {
        return false;
    }
    if (value.end.compare(value.start) < 0) {
        return false;
    }

    return isDateInBounds(value.start, minValue, maxValue) && isDateInBounds(value.end, minValue, maxValue);
};

/** Swap only a complete reversed range. Partial ranges stay partial. */
export const orderRange = (value: IEditableRange): IEditableRange => {
    if (value.start != null && value.end != null && value.end.compare(value.start) < 0) {
        return { start: value.end, end: value.start };
    }

    return value;
};

/** Compare endpoints. A missing end matches only another missing end. */
export const rangesEqual = (left: IEditableRange | null | undefined, right: IEditableRange | null | undefined) => {
    if (left == null || right == null) {
        return left == null && right == null;
    }

    return sameEndpoint(left.start, right.start) && sameEndpoint(left.end, right.end);
};

/** Value committed on blur, Enter, or calendar close. Invalid input falls back to the last publishable range. */
export const resolveCommittedRange = (
    raw: IEditableRange | null | undefined,
    lastValid: DateRange | null,
    minValue: DateValue,
    maxValue: DateValue
): DateRange | null => {
    if (raw?.start != null && raw.end != null) {
        const ordered = orderRange(raw);

        if (ordered.start != null && ordered.end != null && isPublishableRange(ordered, minValue, maxValue)) {
            return { start: ordered.start, end: ordered.end };
        }

        return lastValid;
    }

    return raw == null ? null : lastValid;
};
