import { describe, expect, it } from 'vitest';

import { toSelectedKey } from '../utils';

describe('autocomplete utils', () => {
    it('toSelectedKey maps empty to null', () => {
        expect(toSelectedKey(undefined)).toBeUndefined();
        expect(toSelectedKey(null)).toBeNull();
        expect(toSelectedKey('')).toBeNull();
        expect(toSelectedKey('msk')).toBe('msk');
        expect(toSelectedKey(1)).toBe(1);
    });
});
