import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { COLLAPSED_STORAGE_PREFIX, WIDTH_STORAGE_PREFIX, useCascadeMenuChrome } from '../hooks/useCascadeMenuChrome';

describe('useCascadeMenuChrome', () => {
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

    it('hydrates width and collapsed from localStorage', () => {
        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u1`, JSON.stringify(320));
        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u1`, '1');

        const { result } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u1',
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(result.current.width).toBe(320);
        expect(result.current.collapsed).toBe(true);
    });

    it('persists width on setWidth and clamps', () => {
        const { result } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u1',
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        act(() => {
            result.current.setWidth(340);
        });

        expect(result.current.width).toBe(340);
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('340');

        act(() => {
            result.current.setWidth(100);
        });

        expect(result.current.width).toBe(200);
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('200');
    });

    it('persists collapsed without changing stored width', () => {
        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u1`, JSON.stringify(320));

        const { result } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u1',
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        act(() => {
            result.current.setCollapsed(true);
        });

        expect(result.current.collapsed).toBe(true);
        expect(window.localStorage.getItem(`${COLLAPSED_STORAGE_PREFIX}u1`)).toBe('true');
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBe('320');
    });

    it('does not write localStorage without pinUserId', () => {
        const { result } = renderHook(() =>
            useCascadeMenuChrome({
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        act(() => {
            result.current.setWidth(300);
            result.current.setCollapsed(true);
        });

        expect(result.current.width).toBe(300);
        expect(result.current.collapsed).toBe(true);
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}__none__`)).toBeNull();
        expect(window.localStorage.getItem(`${COLLAPSED_STORAGE_PREFIX}__none__`)).toBeNull();
    });

    it('ignores state writes when controlled but still notifies', () => {
        const onWidthChange = vi.fn();
        const onCollapsedChange = vi.fn();

        const { result } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u1',
                width: 280,
                collapsed: false,
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
                onWidthChange,
                onCollapsedChange,
            })
        );

        act(() => {
            result.current.setWidth(340);
            result.current.setCollapsed(true);
        });

        expect(result.current.width).toBe(280);
        expect(result.current.collapsed).toBe(false);
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBeNull();
        expect(window.localStorage.getItem(`${COLLAPSED_STORAGE_PREFIX}u1`)).toBeNull();
        expect(onWidthChange).toHaveBeenCalledWith(340);
        expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it('keeps controlled draft width when persist is false then discards', () => {
        const onWidthChange = vi.fn();

        const { result } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u1',
                width: 280,
                collapsed: false,
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
                onWidthChange,
            })
        );

        act(() => {
            result.current.setWidth(340, { persist: false });
        });

        expect(result.current.width).toBe(340);
        expect(window.localStorage.getItem(`${WIDTH_STORAGE_PREFIX}u1`)).toBeNull();
        expect(onWidthChange).toHaveBeenCalledWith(340);

        act(() => {
            result.current.discardWidthDraft();
        });

        expect(result.current.width).toBe(280);
    });

    it('notifies onWidthChange / onCollapsedChange when uncontrolled', () => {
        const onWidthChange = vi.fn();
        const onCollapsedChange = vi.fn();

        const { result } = renderHook(() =>
            useCascadeMenuChrome({
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
                onWidthChange,
                onCollapsedChange,
            })
        );

        act(() => {
            result.current.setWidth(300);
            result.current.setCollapsed(true);
        });

        expect(onWidthChange).toHaveBeenCalledWith(300);
        expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it('falls back to defaultWidth on invalid localStorage width', () => {
        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u1`, 'oops');

        const { result: invalidRaw } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u1',
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(invalidRaw.current.width).toBe(280);

        window.localStorage.setItem(`${WIDTH_STORAGE_PREFIX}u2`, 'null');

        const { result: nullRaw } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u2',
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(nullRaw.current.width).toBe(280);
    });

    it('hydrates collapsed from true/false strings and falls back on garbage', () => {
        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u1`, 'true');

        const { result: fromTrue } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u1',
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(fromTrue.current.collapsed).toBe(true);

        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u2`, 'false');

        const { result: fromFalse } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u2',
                defaultWidth: 280,
                defaultCollapsed: true,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(fromFalse.current.collapsed).toBe(false);

        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u3`, 'nope');

        const { result: fromGarbage } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u3',
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(fromGarbage.current.collapsed).toBe(false);

        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u4`, '{}');

        const { result: fromObject } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u4',
                defaultWidth: 280,
                defaultCollapsed: true,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(fromObject.current.collapsed).toBe(true);
    });

    it('hydrates collapsed from padded JSON booleans', () => {
        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u1`, ' true');

        const { result: fromTrue } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u1',
                defaultWidth: 280,
                defaultCollapsed: false,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(fromTrue.current.collapsed).toBe(true);

        window.localStorage.setItem(`${COLLAPSED_STORAGE_PREFIX}u2`, ' false');

        const { result: fromFalse } = renderHook(() =>
            useCascadeMenuChrome({
                pinUserId: 'u2',
                defaultWidth: 280,
                defaultCollapsed: true,
                minWidth: 200,
                maxWidth: 400,
            })
        );

        expect(fromFalse.current.collapsed).toBe(false);
    });
});
