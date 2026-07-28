import { describe, expect, it } from 'vitest';

import { buildMonthYearSelectItems } from '../components/MonthYearSelect';

describe('buildMonthYearSelectItems', () => {
    it('does not expand year list for out-of-range value', () => {
        const items = buildMonthYearSelectItems('year', 1900, 2100);
        expect(items[0]?.id).toBe('1900');
        expect(items.at(-1)?.id).toBe('2100');
        expect(items).toHaveLength(2100 - 1900 + 1);
        expect(items.some(item => item.id === '2')).toBe(false);
        expect(items.some(item => item.id === '1800')).toBe(false);
    });

    it('keeps in-range years', () => {
        const items = buildMonthYearSelectItems('year', 1900, 2100);
        expect(items.find(item => item.id === '2000')?.label).toBe('2000');
    });

    it('returns empty list when constrained range is empty', () => {
        expect(buildMonthYearSelectItems('year', 2025, 2020)).toEqual([]);
    });

    it('builds month list strictly within min/max', () => {
        const labels = Array.from({ length: 12 }, (_, i) => `m${i + 1}`);
        const items = buildMonthYearSelectItems('month', 5, 8, labels);
        expect(items[0]).toEqual({ id: '5', label: 'm5' });
        expect(items.at(-1)).toEqual({ id: '8', label: 'm8' });
        expect(items).toHaveLength(4);
    });

    it('falls back to numeric month label when labels missing', () => {
        expect(buildMonthYearSelectItems('month', 1, 2, [])).toEqual([
            { id: '1', label: '1' },
            { id: '2', label: '2' },
        ]);
    });
});
