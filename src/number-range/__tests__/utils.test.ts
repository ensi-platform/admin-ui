import { describe, expect, it } from 'vitest';

import { alignNumberRange } from '../utils';

describe('alignNumberRange', () => {
    it('does not touch the other side when one side is empty', () => {
        expect(alignNumberRange({ from: null, to: 10 }, 'from', 4)).toEqual({ from: 4, to: 10 });
        expect(alignNumberRange({ from: 10, to: null }, 'from', 4)).toEqual({ from: 4, to: null });
        expect(alignNumberRange({ from: null, to: 10 }, 'to', 4)).toEqual({ from: null, to: 4 });
        expect(alignNumberRange({ from: 1, to: 10 }, 'from', 4)).toEqual({ from: 4, to: 10 });
        expect(alignNumberRange({ from: 1, to: 10 }, 'to', 6)).toEqual({ from: 1, to: 6 });
    });

    it('pulls to when from is greater than to', () => {
        expect(alignNumberRange({ from: 1, to: 5 }, 'from', 8)).toEqual({ from: 8, to: 8 });
    });

    it('pulls from when to is less than from', () => {
        expect(alignNumberRange({ from: 8, to: 10 }, 'to', 3)).toEqual({ from: 3, to: 3 });
        expect(alignNumberRange({ from: 10, to: null }, 'to', 4)).toEqual({ from: 4, to: 4 });
    });

    it('sets null only on the changed side when cleared', () => {
        expect(alignNumberRange({ from: 1, to: 5 }, 'from', null)).toEqual({ from: null, to: 5 });
        expect(alignNumberRange({ from: 1, to: 5 }, 'to', null)).toEqual({ from: 1, to: null });
    });
});
