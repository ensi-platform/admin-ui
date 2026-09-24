import { describe, expect, it } from 'vitest';

import { resolveColumns, resolveSpan } from '../utils';

describe('resolveSpan', () => {
    it('uses the span for the field kind', () => {
        expect(resolveSpan('date', { text: 1, date: 2 }, 4)).toBe(2);
    });

    it('falls back to default and then to 1', () => {
        expect(resolveSpan('price', { default: 2 }, 4)).toBe(2);
        expect(resolveSpan('price', { text: 1 }, 4)).toBe(1);
        expect(resolveSpan(undefined, undefined, 4)).toBe(1);
    });

    it('clamps the span to the column count', () => {
        expect(resolveSpan('date', { date: 6 }, 4)).toBe(4);
        expect(resolveSpan('date', { date: 0 }, 4)).toBe(1);
        expect(resolveSpan('date', { date: 2.8 }, 4)).toBe(2);
        expect(resolveSpan('date', { date: 3 }, 0)).toBe(1);
        expect(resolveSpan('date', { date: 3 }, Number.NaN)).toBe(1);
    });
});

describe('resolveColumns', () => {
    it('falls back to 4 for a missing or invalid count', () => {
        expect(resolveColumns(undefined)).toBe(4);
        expect(resolveColumns(Number.NaN)).toBe(4);
    });

    it('floors a positive count and keeps at least one column', () => {
        expect(resolveColumns(2.8)).toBe(2);
        expect(resolveColumns(0)).toBe(1);
    });
});
