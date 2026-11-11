import { describe, expect, it } from 'vitest';

import { fromMultiValue, toMultiValue } from '../utils';

describe('multi-select utils', () => {
    it('toMultiValue / fromMultiValue round-trip', () => {
        expect(toMultiValue(undefined)).toBeUndefined();
        expect(toMultiValue(['a', 'b'])).toEqual(['a', 'b']);
        expect(fromMultiValue(['a'])).toEqual(['a']);
    });
});
