import { type TransitionEvent as ReactTransitionEvent } from 'react';

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WIDTH_TRANSITION_MS } from '../constants';
import { useWidthAnimation } from '../hooks/useWidthAnimation';

describe('useWidthAnimation', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal(
            'matchMedia',
            (query: string) =>
                ({
                    matches: false,
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                }) as MediaQueryList
        );
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('sets widthAnimating and clears it after transition timeout', () => {
        const collapse = vi.fn();
        const { result, rerender } = renderHook(({ collapsed }) => useWidthAnimation(collapsed, collapse), {
            initialProps: { collapsed: false },
        });

        expect(result.current.widthAnimating).toBe(false);

        rerender({ collapsed: true });

        expect(collapse).toHaveBeenCalledTimes(1);
        expect(result.current.layoutCollapsed).toBe(true);
        expect(result.current.widthAnimating).toBe(true);

        act(() => {
            vi.advanceTimersByTime(WIDTH_TRANSITION_MS);
        });

        expect(result.current.widthAnimating).toBe(false);
    });

    it('keeps animating when collapsed toggles again before timeout', () => {
        const collapse = vi.fn();
        const { result, rerender } = renderHook(({ collapsed }) => useWidthAnimation(collapsed, collapse), {
            initialProps: { collapsed: false },
        });

        rerender({ collapsed: true });
        expect(result.current.widthAnimating).toBe(true);

        rerender({ collapsed: false });

        expect(result.current.widthAnimating).toBe(true);
        expect(result.current.layoutCollapsed).toBe(false);
        expect(collapse).toHaveBeenCalledTimes(2);
    });

    it('skips widthAnimating when prefers-reduced-motion is reduce', () => {
        vi.stubGlobal(
            'matchMedia',
            (query: string) =>
                ({
                    matches: query.includes('prefers-reduced-motion: reduce'),
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                }) as MediaQueryList
        );

        const collapse = vi.fn();
        const { result, rerender } = renderHook(({ collapsed }) => useWidthAnimation(collapsed, collapse), {
            initialProps: { collapsed: false },
        });

        rerender({ collapsed: true });

        expect(collapse).toHaveBeenCalledTimes(1);
        expect(result.current.layoutCollapsed).toBe(true);
        expect(result.current.widthAnimating).toBe(false);
    });

    it('ends animating on width transition end of the root element', () => {
        const collapse = vi.fn();
        const { result, rerender } = renderHook(({ collapsed }) => useWidthAnimation(collapsed, collapse), {
            initialProps: { collapsed: false },
        });

        rerender({ collapsed: true });
        expect(result.current.widthAnimating).toBe(true);

        const target = document.createElement('aside');

        act(() => {
            result.current.handleWidthTransitionEnd({
                target,
                currentTarget: target,
                propertyName: 'opacity',
            } as unknown as ReactTransitionEvent<HTMLElement>);
        });

        expect(result.current.widthAnimating).toBe(true);

        act(() => {
            result.current.handleWidthTransitionEnd({
                target,
                currentTarget: target,
                propertyName: 'width',
            } as unknown as ReactTransitionEvent<HTMLElement>);
        });

        expect(result.current.widthAnimating).toBe(false);

        act(() => {
            result.current.handleWidthTransitionEnd({
                target,
                currentTarget: target,
                propertyName: 'width',
            } as unknown as ReactTransitionEvent<HTMLElement>);
        });

        expect(result.current.widthAnimating).toBe(false);
    });
});
