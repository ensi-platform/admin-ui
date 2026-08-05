import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePinnedCodes } from '../hooks/usePinnedCodes';
import { PIN_STORAGE_PREFIX } from '../utils';

describe('usePinnedCodes', () => {
    beforeEach(() => {
        const store = new Map<string, string>();

        vi.stubGlobal('localStorage', {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => {
                store.set(key, value);
            },
            removeItem: (key: string) => {
                store.delete(key);
            },
            clear: () => store.clear(),
            key: () => null,
            length: 0,
        });
    });

    it('uses in-memory defaultPinnedCodes without pinUserId', () => {
        const { result } = renderHook(() => usePinnedCodes({ defaultPinnedCodes: ['feeds'], maxPinned: 8 }));

        expect(result.current.pinnedCodes).toEqual(['feeds']);
        expect(result.current.isPinned('feeds')).toBe(true);

        act(() => {
            result.current.togglePin('products');
        });

        expect(result.current.pinnedCodes).toEqual(['feeds', 'products']);
        expect(window.localStorage.getItem(`${PIN_STORAGE_PREFIX}x`)).toBeNull();
    });

    it('hydrates and persists when pinUserId is set', () => {
        window.localStorage.setItem(`${PIN_STORAGE_PREFIX}u1`, JSON.stringify(['feeds']));

        const onPinnedChange = vi.fn();
        const { result } = renderHook(() => usePinnedCodes({ pinUserId: 'u1', maxPinned: 8, onPinnedChange }));

        expect(result.current.pinnedCodes).toEqual(['feeds']);

        act(() => {
            result.current.togglePin('products');
        });

        expect(result.current.pinnedCodes).toEqual(['feeds', 'products']);
        expect(JSON.parse(window.localStorage.getItem(`${PIN_STORAGE_PREFIX}u1`)!)).toEqual(['feeds', 'products']);
        expect(onPinnedChange).toHaveBeenCalledWith(['feeds', 'products']);
    });

    it('ignores invalid localStorage and filters non-strings', () => {
        window.localStorage.setItem(`${PIN_STORAGE_PREFIX}u1`, '{');

        const { result, unmount } = renderHook(() =>
            usePinnedCodes({ pinUserId: 'u1', defaultPinnedCodes: ['feeds'], maxPinned: 8 })
        );

        expect(result.current.pinnedCodes).toEqual(['feeds']);
        unmount();

        window.localStorage.setItem(`${PIN_STORAGE_PREFIX}u1`, JSON.stringify(['a', 1, null]));

        const { result: result2 } = renderHook(() =>
            usePinnedCodes({ pinUserId: 'u1', defaultPinnedCodes: [], maxPinned: 8 })
        );

        expect(result2.current.pinnedCodes).toEqual(['a']);
    });

    it('falls back when localStorage value is not an array', () => {
        window.localStorage.setItem(`${PIN_STORAGE_PREFIX}u1`, '{}');

        const { result, unmount } = renderHook(() =>
            usePinnedCodes({ pinUserId: 'u1', defaultPinnedCodes: ['feeds'], maxPinned: 8 })
        );

        expect(result.current.pinnedCodes).toEqual(['feeds']);
        unmount();

        window.localStorage.setItem(`${PIN_STORAGE_PREFIX}u2`, '123');

        const { result: result2 } = renderHook(() =>
            usePinnedCodes({ pinUserId: 'u2', defaultPinnedCodes: ['feeds'], maxPinned: 8 })
        );

        expect(result2.current.pinnedCodes).toEqual(['feeds']);
    });

    it('controlled pinnedCodes does not write localStorage', () => {
        const onPinnedChange = vi.fn();
        const { result, rerender } = renderHook(
            ({ pinnedCodes }: { pinnedCodes: string[] }) =>
                usePinnedCodes({
                    pinUserId: 'u1',
                    pinnedCodes,
                    onPinnedChange,
                    maxPinned: 8,
                }),
            { initialProps: { pinnedCodes: ['feeds'] } }
        );

        expect(result.current.pinnedCodes).toEqual(['feeds']);

        act(() => {
            result.current.togglePin('products');
        });

        expect(onPinnedChange).toHaveBeenCalledWith(['feeds', 'products']);
        expect(window.localStorage.getItem(`${PIN_STORAGE_PREFIX}u1`)).toBeNull();

        rerender({ pinnedCodes: ['feeds', 'products'] });
        expect(result.current.pinnedCodes).toEqual(['feeds', 'products']);
    });

    it('canPin is false at max for unpinned code', () => {
        const full = Array.from({ length: 2 }, (_, i) => `c${i}`);
        const { result } = renderHook(() => usePinnedCodes({ defaultPinnedCodes: full, maxPinned: 2 }));

        expect(result.current.canPin('extra')).toBe(false);
        expect(result.current.canPin('c0')).toBe(true);

        act(() => {
            result.current.togglePin('extra');
        });

        expect(result.current.pinnedCodes).toEqual(full);
    });
});
