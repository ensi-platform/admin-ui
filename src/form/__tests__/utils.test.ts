import { describe, expect, it } from 'vitest';

import { resolveFieldFlag } from '../utils';

describe('resolveFieldFlag', () => {
    it('returns a boolean flag as-is', () => {
        expect(resolveFieldFlag(true, 'email')).toBe(true);
        expect(resolveFieldFlag(false, 'email')).toBe(false);
    });

    it('reads an exact field name from a map', () => {
        expect(resolveFieldFlag({ email: true }, 'email')).toBe(true);
        expect(resolveFieldFlag({ email: false }, 'email')).toBe(false);
        expect(resolveFieldFlag({ 'address.city': true }, 'address.city')).toBe(true);
    });

    it('treats a missing key and an empty flag as false', () => {
        expect(resolveFieldFlag({ email: true }, 'name')).toBe(false);
        expect(resolveFieldFlag(undefined, 'email')).toBe(false);
    });

    it('does not match a name by prefix', () => {
        expect(resolveFieldFlag({ address: true }, 'address.city')).toBe(false);
    });
});
