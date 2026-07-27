import { describe, expect, it } from 'vitest';
import { type Key } from 'react-aria-components';

import { resolveSelectedOptions } from '../utils';
import { type IComboboxOption, type TComboboxValue } from '../types';

describe('resolveSelectedOptions', () => {
    it('keeps key order and falls back', () => {
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
});
