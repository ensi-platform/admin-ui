import { describe, expect, it } from 'vitest';

import { fromMultiValue, isInteractiveTarget, toKeyList, toMultiValue } from '../utils';

describe('multi-select utils', () => {
    it('toMultiValue / fromMultiValue round-trip', () => {
        expect(toMultiValue(undefined)).toBeUndefined();
        expect(toMultiValue(['a', 'b'])).toEqual(['a', 'b']);
        expect(fromMultiValue(['a'])).toEqual(['a']);
    });

    it('isInteractiveTarget', () => {
        expect(isInteractiveTarget(null)).toBe(false);
        expect(isInteractiveTarget(document.createTextNode('x'))).toBe(false);

        const row = document.createElement('div');
        row.setAttribute('role', 'row');
        const child = document.createElement('span');
        row.appendChild(child);
        document.body.appendChild(row);

        expect(isInteractiveTarget(child)).toBe(true);
        expect(isInteractiveTarget(document.createElement('div'))).toBe(false);

        row.remove();
    });

    it('toKeyList', () => {
        expect(toKeyList(['a', 'b'])).toEqual(['a', 'b']);
        expect(toKeyList(null)).toEqual([]);
        expect(toKeyList('vip')).toEqual([]);
    });
});
