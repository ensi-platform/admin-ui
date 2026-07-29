import { describe, expect, it } from 'vitest';

import { getNextSortDirection } from '../utils';

describe('getNextSortDirection', () => {
    it('cycles none → asc → desc → none', () => {
        expect(getNextSortDirection(undefined)).toBe('asc');
        expect(getNextSortDirection('asc')).toBe('desc');
        expect(getNextSortDirection('desc')).toBeUndefined();
    });
});
