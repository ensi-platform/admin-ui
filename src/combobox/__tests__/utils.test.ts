import { type Key } from 'react-aria-components';
import { describe, expect, it } from 'vitest';

import { type IComboboxOption, type TComboboxValue } from '../types';
import { isInteractiveTarget, resolveSelectedOptions, toKeyList } from '../utils';

describe('combobox utils', () => {
    it('resolveSelectedOptions keeps key order and falls back', () => {
        const map = new Map<TComboboxValue, IComboboxOption>([
            ['a', { value: 'a', label: 'A' }],
            ['b', { value: 'b', label: 'B' }],
        ]);

        expect(resolveSelectedOptions(['a', 'missing', 'b'] as Key[], map)).toEqual([
            { value: 'a', label: 'A' },
            { value: 'missing', label: 'missing' },
            { value: 'b', label: 'B' },
        ]);
    });

    it('isInteractiveTarget', () => {
        expect(isInteractiveTarget(null)).toBe(false);
        expect(isInteractiveTarget(document.createTextNode('x'))).toBe(false);

        const button = document.createElement('button');
        const span = document.createElement('span');

        button.append(span);
        document.body.append(button);

        expect(isInteractiveTarget(span)).toBe(true);
        expect(isInteractiveTarget(document.createElement('div'))).toBe(false);

        button.remove();
    });

    it('toKeyList', () => {
        expect(toKeyList(['a', 'b'])).toEqual(['a', 'b']);
        expect(toKeyList(null)).toEqual([]);
        expect(toKeyList('vip')).toEqual([]);
    });
});
