import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePrevious } from '../usePrevious';

describe('usePrevious', () => {
    it('returns the initial value, then the value from the previous render', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value, 'init'), {
            initialProps: { value: 'a' },
        });

        expect(result.current).toBe('init');

        rerender({ value: 'b' });
        expect(result.current).toBe('a');

        rerender({ value: 'c' });
        expect(result.current).toBe('b');
    });

    it('keeps 0 and null instead of treating them as missing', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: 0 as number | null },
        });

        expect(result.current).toBeUndefined();

        rerender({ value: null });
        expect(result.current).toBe(0);

        rerender({ value: 1 });
        expect(result.current).toBeNull();
    });
});
