import { describe, expect, it } from 'vitest';

import { sliderTicks } from '../utils';

describe('sliderTicks', () => {
    it('places a mark on every step', () => {
        expect(sliderTicks(0, 100, 25)).toEqual([
            { value: 0, offset: '0%' },
            { value: 25, offset: '25%' },
            { value: 50, offset: '50%' },
            { value: 75, offset: '75%' },
            { value: 100, offset: '100%' },
        ]);
    });

    it('returns no marks for a step that would flood the track', () => {
        expect(sliderTicks(0, 100, 1)).toEqual([]);
    });

    it('returns no marks for a non-positive step or inverted range', () => {
        expect(sliderTicks(0, 10, 0)).toEqual([]);
        expect(sliderTicks(0, 10, -1)).toEqual([]);
        expect(sliderTicks(10, 0, 1)).toEqual([]);
    });

    it('returns a single mark when min equals max', () => {
        expect(sliderTicks(5, 5, 1)).toEqual([{ value: 5, offset: '0%' }]);
    });
});
