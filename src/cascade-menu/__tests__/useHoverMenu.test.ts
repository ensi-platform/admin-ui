import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HOVER_DELAY_MS, HOVER_DWELL_MS, LEAVE_CLOSE_MS, useHoverMenu } from '../hooks/useHoverMenu';

const mockAnchor = (top: number, right: number) =>
    ({
        getBoundingClientRect: () => ({
            top,
            right,
            left: right - 100,
            bottom: top + 40,
            width: 100,
            height: 40,
            x: right - 100,
            y: top,
            toJSON: () => ({}),
        }),
    }) as HTMLElement;

describe('useHoverMenu', () => {
    it('opens a layer immediately when nothing is expanded', () => {
        const { result } = renderHook(() => useHoverMenu());
        const anchor = mockAnchor(80, 200);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchor });
        });

        expect(result.current.openPath).toEqual(['products']);
        expect(result.current.layers[0].anchor).toEqual({ top: 80, left: 200 });
    });

    it('delays switching L0 while aiming at submenu', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorA = mockAnchor(80, 200);
        const anchorB = mockAnchor(140, 200);
        const submenu = mockAnchor(80, 440);

        Object.defineProperty(submenu, 'getBoundingClientRect', {
            value: () => ({
                top: 80,
                left: 200,
                right: 440,
                bottom: 400,
                width: 240,
                height: 320,
                x: 200,
                y: 80,
                toJSON: () => ({}),
            }),
        });

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorA });
        });

        expect(result.current.openPath).toEqual(['products']);

        // Move toward submenu (aim triangle)
        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 150, clientY: 100 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 180, clientY: 120 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 190, clientY: 130 },
            } as never);
        });

        act(() => {
            result.current.onFolderEnter({
                code: 'orders',
                level: 0,
                anchorEl: anchorB,
                submenu,
                menuHeight: 320,
            });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            vi.advanceTimersByTime(HOVER_DELAY_MS);
        });

        expect(result.current.openPath).toEqual(['orders']);
        vi.useRealTimers();
    });

    it('delays switching L0 without aim (dwell)', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorA = mockAnchor(80, 200);
        const anchorB = mockAnchor(140, 200);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorA });
        });

        act(() => {
            result.current.onFolderEnter({ code: 'orders', level: 0, anchorEl: anchorB });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            vi.advanceTimersByTime(HOVER_DWELL_MS);
        });

        expect(result.current.openPath).toEqual(['orders']);
        vi.useRealTimers();
    });

    it('preferImmediate switches L0 immediately without aim', () => {
        const { result } = renderHook(() => useHoverMenu());
        const anchorA = mockAnchor(80, 200);
        const anchorB = mockAnchor(140, 200);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorA });
        });

        act(() => {
            result.current.onFolderEnter({
                code: 'orders',
                level: 0,
                anchorEl: anchorB,
                preferImmediate: true,
            });
        });

        expect(result.current.openPath).toEqual(['orders']);
    });

    it('preferImmediate still delays L0 switch while aiming', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorA = mockAnchor(80, 200);
        const anchorB = mockAnchor(140, 200);
        const submenu = mockAnchor(80, 440);

        Object.defineProperty(submenu, 'getBoundingClientRect', {
            value: () => ({
                top: 80,
                left: 200,
                right: 440,
                bottom: 400,
                width: 240,
                height: 320,
                x: 200,
                y: 80,
                toJSON: () => ({}),
            }),
        });

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorA });
        });

        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 150, clientY: 100 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 180, clientY: 120 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 190, clientY: 130 },
            } as never);
        });

        act(() => {
            result.current.onFolderEnter({
                code: 'orders',
                level: 0,
                anchorEl: anchorB,
                submenu,
                menuHeight: 320,
                preferImmediate: true,
            });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            vi.advanceTimersByTime(HOVER_DELAY_MS);
        });

        expect(result.current.openPath).toEqual(['orders']);
        vi.useRealTimers();
    });

    it('skim over folders keeps first open until dwell settles on last', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorA = mockAnchor(80, 200);
        const anchorB = mockAnchor(140, 200);
        const anchorC = mockAnchor(200, 200);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorA });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'orders', level: 0, anchorEl: anchorB });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'customers', level: 0, anchorEl: anchorC });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            vi.advanceTimersByTime(HOVER_DWELL_MS);
        });

        expect(result.current.openPath).toEqual(['customers']);
        vi.useRealTimers();
    });

    it('collapses after leave delay', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchor = mockAnchor(80, 200);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchor });
        });

        act(() => {
            result.current.onFolderLeave();
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            vi.advanceTimersByTime(LEAVE_CLOSE_MS);
        });

        expect(result.current.openPath).toEqual([]);
        vi.useRealTimers();
    });

    it('cancelLeave prevents collapse', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchor = mockAnchor(80, 200);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchor });
            result.current.onFolderLeave();
            result.current.cancelLeave();
            vi.advanceTimersByTime(LEAVE_CLOSE_MS);
        });

        expect(result.current.openPath).toEqual(['products']);
        vi.useRealTimers();
    });

    it('cancelLeave cancels pending chrome trim after aim', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchor = mockAnchor(80, 200);
        const submenu = mockAnchor(80, 440);

        Object.defineProperty(submenu, 'getBoundingClientRect', {
            value: () => ({
                top: 80,
                left: 200,
                right: 440,
                bottom: 400,
                width: 240,
                height: 320,
                x: 200,
                y: 80,
                toJSON: () => ({}),
            }),
        });

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchor });
        });

        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 150, clientY: 100 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 180, clientY: 120 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 190, clientY: 130 },
            } as never);
        });

        act(() => {
            result.current.onLeafEnter({ level: 0, submenu, menuHeight: 320 });
            result.current.cancelLeave();
            vi.advanceTimersByTime(HOVER_DELAY_MS);
        });

        expect(result.current.openPath).toEqual(['products']);
        vi.useRealTimers();
    });

    it('cancelLeave aborts delayed folder switch', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorA = mockAnchor(80, 200);
        const anchorB = mockAnchor(140, 200);
        const submenu = mockAnchor(80, 440);

        Object.defineProperty(submenu, 'getBoundingClientRect', {
            value: () => ({
                top: 80,
                left: 200,
                right: 440,
                bottom: 400,
                width: 240,
                height: 320,
                x: 200,
                y: 80,
                toJSON: () => ({}),
            }),
        });

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorA });
        });

        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 150, clientY: 100 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 180, clientY: 120 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 190, clientY: 130 },
            } as never);
        });

        act(() => {
            result.current.onFolderEnter({
                code: 'orders',
                level: 0,
                anchorEl: anchorB,
                submenu,
                menuHeight: 320,
            });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            result.current.cancelLeave();
            vi.advanceTimersByTime(HOVER_DELAY_MS);
        });

        expect(result.current.openPath).toEqual(['products']);
        vi.useRealTimers();
    });

    it('onLeafEnter trims deeper layers immediately without aim', () => {
        const { result } = renderHook(() => useHoverMenu());
        const anchorL0 = mockAnchor(80, 200);
        const anchorL1 = mockAnchor(100, 440);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorL0 });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'directories', level: 1, anchorEl: anchorL1 });
        });

        expect(result.current.openPath).toEqual(['products', 'directories']);

        act(() => {
            result.current.onLeafEnter({ level: 1 });
        });

        expect(result.current.openPath).toEqual(['products']);
    });

    it('onLeafEnter delays trim while aiming at submenu', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorL0 = mockAnchor(80, 200);
        const anchorL1 = mockAnchor(100, 440);
        const submenu = mockAnchor(80, 440);

        Object.defineProperty(submenu, 'getBoundingClientRect', {
            value: () => ({
                top: 80,
                left: 200,
                right: 440,
                bottom: 400,
                width: 240,
                height: 320,
                x: 200,
                y: 80,
                toJSON: () => ({}),
            }),
        });

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorL0 });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'directories', level: 1, anchorEl: anchorL1 });
        });

        expect(result.current.openPath).toEqual(['products', 'directories']);

        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 150, clientY: 100 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 180, clientY: 120 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 190, clientY: 130 },
            } as never);
        });

        act(() => {
            result.current.onLeafEnter({ level: 1, submenu, menuHeight: 320 });
        });

        expect(result.current.openPath).toEqual(['products', 'directories']);

        act(() => {
            vi.advanceTimersByTime(HOVER_DELAY_MS);
        });

        expect(result.current.openPath).toEqual(['products']);
        vi.useRealTimers();
    });

    it('re-entering the same open folder keeps deeper layers', () => {
        const { result } = renderHook(() => useHoverMenu());
        const anchorL0 = mockAnchor(80, 200);
        const anchorL1 = mockAnchor(100, 440);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorL0 });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'directories', level: 1, anchorEl: anchorL1 });
        });

        expect(result.current.openPath).toEqual(['products', 'directories']);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorL0 });
        });

        expect(result.current.openPath).toEqual(['products', 'directories']);
    });

    it('chrome trim at level 0 closes all flyouts without aim', () => {
        const { result } = renderHook(() => useHoverMenu());
        const anchorL0 = mockAnchor(80, 200);
        const anchorL1 = mockAnchor(100, 440);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorL0 });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'directories', level: 1, anchorEl: anchorL1 });
        });

        act(() => {
            result.current.onLeafEnter({ level: 0 });
        });

        expect(result.current.openPath).toEqual([]);
    });

    it('chrome trim at level 1 keeps L0 only', () => {
        const { result } = renderHook(() => useHoverMenu());
        const anchorL0 = mockAnchor(80, 200);
        const anchorL1 = mockAnchor(100, 440);
        const anchorL2 = mockAnchor(120, 680);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorL0 });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'directories', level: 1, anchorEl: anchorL1 });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'attributes', level: 2, anchorEl: anchorL2 });
        });

        expect(result.current.openPath).toEqual(['products', 'directories', 'attributes']);

        act(() => {
            result.current.onLeafEnter({ level: 1 });
        });

        expect(result.current.openPath).toEqual(['products']);
    });

    it('opens deeper folder immediately when parent path is open', () => {
        const { result } = renderHook(() => useHoverMenu());
        const anchorL0 = mockAnchor(80, 200);
        const anchorL1 = mockAnchor(100, 440);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorL0 });
        });
        act(() => {
            result.current.onFolderEnter({ code: 'directories', level: 1, anchorEl: anchorL1 });
        });

        expect(result.current.openPath).toEqual(['products', 'directories']);
    });

    it('chrome trim at level 0 delays while aiming', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorL0 = mockAnchor(80, 200);
        const submenu = mockAnchor(80, 440);

        Object.defineProperty(submenu, 'getBoundingClientRect', {
            value: () => ({
                top: 80,
                left: 200,
                right: 440,
                bottom: 400,
                width: 240,
                height: 320,
                x: 200,
                y: 80,
                toJSON: () => ({}),
            }),
        });

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorL0 });
        });

        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 150, clientY: 100 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 180, clientY: 120 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 190, clientY: 130 },
            } as never);
        });

        act(() => {
            result.current.onLeafEnter({ level: 0, submenu, menuHeight: 320 });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            vi.advanceTimersByTime(HOVER_DELAY_MS);
        });

        expect(result.current.openPath).toEqual([]);
        vi.useRealTimers();
    });

    it('onMouseMove is a no-op when layers are empty', () => {
        const { result } = renderHook(() => useHoverMenu());

        expect(result.current.openPath).toEqual([]);

        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 10, clientY: 20 },
            } as never);
        });

        expect(result.current.openPath).toEqual([]);
    });

    it('ignores folder enter without level or anchorEl', () => {
        const { result } = renderHook(() => useHoverMenu());

        act(() => {
            result.current.onFolderEnter({ code: 'products' });
        });

        expect(result.current.openPath).toEqual([]);
    });

    it('uses dwell when submenu getBoundingClientRect is falsy', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorA = mockAnchor(80, 200);
        const anchorB = mockAnchor(140, 200);
        const submenu = {
            getBoundingClientRect: () => null,
        } as unknown as HTMLElement;

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorA });
        });

        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 150, clientY: 100 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 180, clientY: 120 },
            } as never);
        });

        act(() => {
            result.current.onFolderEnter({
                code: 'orders',
                level: 0,
                anchorEl: anchorB,
                submenu,
                menuHeight: 320,
            });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            vi.advanceTimersByTime(HOVER_DWELL_MS);
        });

        expect(result.current.openPath).toEqual(['orders']);
        vi.useRealTimers();
    });

    it('uses dwell when previous mouse position is inside submenu', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchorA = mockAnchor(80, 200);
        const anchorB = mockAnchor(140, 200);
        const submenu = mockAnchor(80, 440);

        Object.defineProperty(submenu, 'getBoundingClientRect', {
            value: () => ({
                top: 80,
                left: 200,
                right: 440,
                bottom: 400,
                width: 240,
                height: 320,
                x: 200,
                y: 80,
                toJSON: () => ({}),
            }),
        });

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchorA });
        });

        // history[0] inside submenu box (left 200–440, top 80–400)
        act(() => {
            result.current.onMouseMove({
                nativeEvent: { clientX: 250, clientY: 100 },
            } as never);
            result.current.onMouseMove({
                nativeEvent: { clientX: 260, clientY: 110 },
            } as never);
        });

        act(() => {
            result.current.onFolderEnter({
                code: 'orders',
                level: 0,
                anchorEl: anchorB,
                submenu,
                menuHeight: 320,
            });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            vi.advanceTimersByTime(HOVER_DWELL_MS);
        });

        expect(result.current.openPath).toEqual(['orders']);
        vi.useRealTimers();
    });

    it('onLeafEnter is a no-op when level is beyond open layers', () => {
        const { result } = renderHook(() => useHoverMenu());

        act(() => {
            result.current.onLeafEnter({ level: 0 });
        });

        expect(result.current.openPath).toEqual([]);
    });

    it('collapse clears layers and pending', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useHoverMenu());
        const anchor = mockAnchor(80, 200);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchor });
        });

        expect(result.current.openPath).toEqual(['products']);

        act(() => {
            result.current.onFolderLeave();
            result.current.collapse();
        });

        expect(result.current.openPath).toEqual([]);

        act(() => {
            vi.advanceTimersByTime(LEAVE_CLOSE_MS);
        });

        expect(result.current.openPath).toEqual([]);
        vi.useRealTimers();
    });

    it('trims mouse history beyond the max size', () => {
        const { result } = renderHook(() => useHoverMenu());
        const anchor = mockAnchor(80, 200);

        act(() => {
            result.current.onFolderEnter({ code: 'products', level: 0, anchorEl: anchor });
        });

        act(() => {
            for (let i = 0; i < 5; i += 1) {
                result.current.onMouseMove({
                    nativeEvent: { clientX: 100 + i, clientY: 50 + i },
                } as never);
            }
        });

        // History is internal; assert hook still works after overflow (aim uses last points).
        expect(result.current.openPath).toEqual(['products']);
    });
});
