import { describe, expect, it } from 'vitest';

import { toCssSize } from '../utils';

describe('toCssSize', () => {
    it('returns undefined for undefined', () => {
        expect(toCssSize(undefined)).toBeUndefined();
    });

    it('converts numbers to rem at the 16px root', () => {
        expect(toCssSize(16)).toBe('1rem');
        expect(toCssSize(8)).toBe('0.5rem');
        expect(toCssSize(20)).toBe('1.25rem');
    });

    it('passes strings through', () => {
        expect(toCssSize('1.5rem')).toBe('1.5rem');
    });
});
