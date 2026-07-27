import { describe, expect, it } from 'vitest';

import { fromMultiValue, isInteractiveTarget, toKeyList, toMultiValue } from '../utils';

describe('multi-autocomplete utils', () => {
    it('maps multi values', () => {
        expect(toMultiValue(undefined)).toBeUndefined();
        expect(toMultiValue(['a', 1])).toEqual(['a', 1]);
        expect(fromMultiValue(['a', 1])).toEqual(['a', 1]);
        expect(toKeyList(['a'])).toEqual(['a']);
        expect(toKeyList(null)).toEqual([]);
    });

    it('isInteractiveTarget detects nested chrome', () => {
        const button = document.createElement('button');

        expect(isInteractiveTarget(button)).toBe(true);
        expect(isInteractiveTarget(document.createElement('div'))).toBe(false);
    });
});
