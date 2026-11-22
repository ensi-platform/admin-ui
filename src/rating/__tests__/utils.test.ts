import { describe, expect, it } from 'vitest';

import { formatRatingValue, nextRatingValue, ratingStarCount, starFill, starZoneValues } from '../utils';

describe('rating utils', () => {
    it('counts one star per unit', () => {
        expect(ratingStarCount(0, 5)).toBe(5);
        expect(ratingStarCount(0, 10)).toBe(10);
        expect(ratingStarCount(5, 5)).toBe(0);
    });

    it('splits a star into step zones', () => {
        expect(starZoneValues(1, 0, 0.5)).toEqual([0.5, 1]);
        expect(starZoneValues(3, 0, 0.5)).toEqual([2.5, 3]);
        expect(starZoneValues(1, 0, 1)).toEqual([1]);
    });

    it('fills a star from the display value', () => {
        expect(starFill(1, 0, 0)).toBe(0);
        expect(starFill(1, 0, 0.5)).toBe(0.5);
        expect(starFill(1, 0, 1)).toBe(1);
        expect(starFill(2, 0, 0.5)).toBe(0);
        expect(starFill(2, 0, 1.5)).toBe(0.5);
        expect(starFill(3, 0, 2.5)).toBe(0.5);
    });

    it('clears on a click of the current zone and keeps a dragged zone', () => {
        expect(nextRatingValue(1.5, 1.5, false, 0)).toBe(0);
        expect(nextRatingValue(1, 1.5, false, 0)).toBe(1.5);
        expect(nextRatingValue(1.5, 1.5, true, 0)).toBe(1.5);
        expect(nextRatingValue(0, 2, true, 0)).toBe(2);
    });

    it('formats the value template for the locale', () => {
        expect(formatRatingValue('{value} из {max}', 3.5, 5, 'ru-RU')).toBe('3,5 из 5');
        expect(formatRatingValue('{value}/{max}', 3.5, 5, 'en-US')).toBe('3.5/5');
    });
});
