import { type INumberRangeValue } from './types';

export type TNumberRangeSide = 'from' | 'to';

const toNumber = (value: number | null): number | null => (value == null || Number.isNaN(value) ? null : value);

/** Align `{ from, to }` from the side that just changed. An empty side stays empty. */
export const alignNumberRange = (
    current: INumberRangeValue,
    side: TNumberRangeSide,
    next: number | null
): INumberRangeValue => {
    const from = toNumber(current.from);
    const to = toNumber(current.to);
    const nextValue = toNumber(next);

    if (nextValue == null) {
        return side === 'from' ? { from: null, to } : { from, to: null };
    }

    if (side === 'from') {
        return { from: nextValue, to: to != null && nextValue > to ? nextValue : to };
    }

    return { from: from != null && nextValue < from ? nextValue : from, to: nextValue };
};
