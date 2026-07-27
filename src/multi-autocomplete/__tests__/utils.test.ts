import { describe, expect, it } from 'vitest';

import { fromMultiValue, isInteractiveTarget, resolveSelectedOptions, toKeyList, toMultiValue } from '../utils';

describe('multi-autocomplete utils', () => {
    it('maps multi values', () => {
        expect(toMultiValue(undefined)).toBeUndefined();
        expect(toMultiValue(['a', 1])).toEqual(['a', 1]);
        expect(fromMultiValue(['a', 1])).toEqual(['a', 1]);
        expect(toKeyList(['a'])).toEqual(['a']);
        expect(toKeyList(null)).toEqual([]);
    });

    it('isInteractiveTarget detects remove/button chrome, not tag body', () => {
        const button = document.createElement('button');
        const remove = document.createElement('span');
        remove.setAttribute('slot', 'remove');
        const row = document.createElement('div');
        row.setAttribute('role', 'row');

        expect(isInteractiveTarget(button)).toBe(true);
        expect(isInteractiveTarget(remove)).toBe(true);
        expect(isInteractiveTarget(row)).toBe(false);
        expect(isInteractiveTarget(document.createElement('div'))).toBe(false);
    });

    it('resolveSelectedOptions keeps key order and falls back', () => {
        const map = new Map([
            ['b', { value: 'b', label: 'Beta' }],
            ['a', { value: 'a', label: 'Alpha' }],
        ]);

        expect(resolveSelectedOptions(['a', 'missing', 'b'], map)).toEqual([
            { value: 'a', label: 'Alpha' },
            { value: 'missing', label: 'missing' },
            { value: 'b', label: 'Beta' },
        ]);
    });
});
