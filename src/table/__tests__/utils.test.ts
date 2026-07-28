import { describe, expect, it } from 'vitest';

import { getNextSortDirection, getPageItems } from '../utils';

describe('getNextSortDirection', () => {
    it('cycles none → asc → desc → none', () => {
        expect(getNextSortDirection(undefined)).toBe('asc');
        expect(getNextSortDirection('asc')).toBe('desc');
        expect(getNextSortDirection('desc')).toBeUndefined();
    });
});

describe('getPageItems', () => {
    it('returns empty when pageCount is below 1', () => {
        expect(getPageItems(1, 0)).toEqual([]);
    });

    it('lists all pages when count fits the window', () => {
        expect(getPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('shows start window with trailing ellipsis', () => {
        expect(getPageItems(1, 20)).toEqual([1, 2, 3, 4, 'ellipsis', 20]);
    });

    it('shows center window with ellipsis on both sides', () => {
        expect(getPageItems(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
    });

    it('shows end window with leading ellipsis', () => {
        expect(getPageItems(20, 20)).toEqual([1, 'ellipsis', 17, 18, 19, 20]);
    });
});
