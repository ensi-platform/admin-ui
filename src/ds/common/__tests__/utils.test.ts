import { describe, expect, it } from 'vitest';

import { toCssSize } from '../utils';

describe('toCssSize', () => {
    it('returns undefined for undefined', () => {
        expect(toCssSize(undefined)).toBeUndefined();
    });

    it('appends px for numbers', () => {
        expect(toCssSize(16)).toBe('16px');
    });

    it('passes strings through', () => {
        expect(toCssSize('1.5rem')).toBe('1.5rem');
    });
});
