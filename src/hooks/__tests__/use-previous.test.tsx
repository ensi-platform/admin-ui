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
});
