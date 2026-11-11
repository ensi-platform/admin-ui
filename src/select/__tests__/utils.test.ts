import { describe, expect, it } from 'vitest';

import { toSelectedKey } from '../utils';

describe('select utils', () => {
    it('toSelectedKey', () => {
        expect(toSelectedKey(undefined)).toBeUndefined();
        expect(toSelectedKey(null)).toBeNull();
        expect(toSelectedKey('')).toBeNull();
        expect(toSelectedKey('draft')).toBe('draft');
    });
});
