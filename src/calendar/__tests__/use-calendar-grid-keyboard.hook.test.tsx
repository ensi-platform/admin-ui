import { useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';

import { CalendarDate } from '@internationalized/date';
import { act, render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
    getInitialFocusedDate,
    getSkipDayDelta,
    moveFocusedDate,
    stepFocusedDate,
    useCalendarGridKeyboard,
    type TCalendarGridNavKey,
} from '../hooks/useCalendarGridKeyboard';

describe('calendar-grid-keyboard helpers edges', () => {
    it('stepFocusedDate default returns same date for unknown key', () => {
        const date = new CalendarDate(2024, 6, 15);
        expect(stepFocusedDate(date, 'Tab' as TCalendarGridNavKey).toString()).toBe('2024-06-15');
    });

    it('getSkipDayDelta returns -1 for backward keys and 1 otherwise', () => {
        expect(getSkipDayDelta('ArrowLeft')).toBe(-1);
        expect(getSkipDayDelta('ArrowUp')).toBe(-1);
        expect(getSkipDayDelta('Home')).toBe(-1);
        expect(getSkipDayDelta('PageUp')).toBe(-1);
        expect(getSkipDayDelta('ArrowRight')).toBe(1);
        expect(getSkipDayDelta('End')).toBe(1);
    });

    it('moveFocusedDate stays when blocked target equals current after clamp', () => {
        const date = new CalendarDate(2024, 6, 15);
        const next = moveFocusedDate(date, 'ArrowRight', {
            maxValue: date,
            isDateUnavailable: d => d.compare(date) === 0,
        });
        expect(next.toString()).toBe('2024-06-15');
    });

    it('moveFocusedDate returns current when skip hits bounds', () => {
        const date = new CalendarDate(2024, 6, 15);
        const next = moveFocusedDate(date, 'ArrowRight', {
            maxValue: new CalendarDate(2024, 6, 16),
            isDateUnavailable: () => true,
        });
        expect(next.toString()).toBe('2024-06-15');
    });

    it('getInitialFocusedDate walks backward when forward hits max', () => {
        const preferred = new CalendarDate(2024, 6, 30);
        const next = getInitialFocusedDate(preferred, {
            minValue: new CalendarDate(2024, 6, 1),
            maxValue: new CalendarDate(2024, 6, 30),
            isDateUnavailable: d => d.day >= 28,
        });
        expect(next.day).toBeLessThan(28);
    });

    it('getInitialFocusedDate falls back to min when all days blocked', () => {
        const min = new CalendarDate(2024, 6, 10);
        const next = getInitialFocusedDate(new CalendarDate(2024, 6, 15), {
            minValue: min,
            maxValue: new CalendarDate(2024, 6, 12),
            isDateUnavailable: () => true,
        });
        expect(next.toString()).toBe(min.toString());
    });

    it('getInitialFocusedDate clamps preferred below minValue', () => {
        const min = new CalendarDate(2024, 6, 10);
        const next = getInitialFocusedDate(new CalendarDate(2024, 6, 1), {
            minValue: min,
            maxValue: new CalendarDate(2024, 6, 30),
        });
        expect(next.toString()).toBe(min.toString());
    });

    it('getInitialFocusedDate falls back to today when preferred is null', () => {
        const next = getInitialFocusedDate(null);
        expect(next.toString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('getInitialFocusedDate falls back to today when all days blocked without min', () => {
        const next = getInitialFocusedDate(new CalendarDate(2024, 6, 15), {
            maxValue: new CalendarDate(2024, 6, 16),
            isDateUnavailable: () => true,
        });
        expect(next.toString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('moveFocusedDate returns current when skip loop stays blocked', () => {
        const date = new CalendarDate(2024, 6, 15);
        const next = moveFocusedDate(date, 'ArrowRight', {
            minValue: new CalendarDate(2024, 1, 1),
            maxValue: new CalendarDate(2025, 12, 31),
            isDateUnavailable: () => true,
        });
        expect(next.toString()).toBe('2024-06-15');
    });
});

describe('useCalendarGridKeyboard', () => {
    it('autoFocusDay focuses the day button', async () => {
        const frames: FrameRequestCallback[] = [];
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            frames.push(cb);
            return frames.length;
        });
        vi.stubGlobal('cancelAnimationFrame', vi.fn());

        const ensureMonthVisible = vi.fn();
        const Harness = () => {
            const viewportRef = useRef<HTMLDivElement>(null);
            useCalendarGridKeyboard({
                viewportRef,
                ensureMonthVisible,
                preferredDate: new CalendarDate(2024, 6, 15),
                autoFocusDay: true,
            });
            return (
                <div ref={viewportRef}>
                    <button type="button" data-date="2024-06-15">
                        15
                    </button>
                </div>
            );
        };

        const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
        render(<Harness />);
        await act(async () => {
            frames.splice(0).forEach(cb => cb(0));
        });
        expect(focusSpy).toHaveBeenCalled();
        focusSpy.mockRestore();
        vi.unstubAllGlobals();
    });

    it('retries focus until day button exists', async () => {
        const frames: FrameRequestCallback[] = [];
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            frames.push(cb);
            return frames.length;
        });
        vi.stubGlobal('cancelAnimationFrame', vi.fn());

        const ensureMonthVisible = vi.fn();
        const Harness = () => {
            const viewportRef = useRef<HTMLDivElement>(null);
            const [visible, setVisible] = useState(false);
            useCalendarGridKeyboard({
                viewportRef,
                ensureMonthVisible,
                preferredDate: new CalendarDate(2024, 6, 15),
                autoFocusDay: true,
            });
            return (
                <div ref={viewportRef}>
                    <button type="button" data-test-id="reveal" onClick={() => setVisible(true)}>
                        reveal
                    </button>
                    {visible ? (
                        <button type="button" data-date="2024-06-15">
                            15
                        </button>
                    ) : null}
                </div>
            );
        };

        const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
        const { getByTestId } = render(<Harness />);
        await act(async () => {
            frames.splice(0).forEach(cb => cb(0));
        });
        expect(focusSpy).not.toHaveBeenCalled();

        await act(async () => {
            getByTestId('reveal').click();
        });
        await act(async () => {
            for (let i = 0; i < 12; i += 1) {
                frames.splice(0).forEach(cb => cb(0));
            }
        });
        expect(focusSpy).toHaveBeenCalled();
        focusSpy.mockRestore();
        vi.unstubAllGlobals();
    });

    it('handles Enter/Space, non-nav keys, focus move and bounds', () => {
        const ensureMonthVisible = vi.fn();
        const onSelect = vi.fn();
        const viewport = document.createElement('div');
        ['2024-06-15', '2024-06-16', '2024-07-15', '2024-08-15'].forEach(iso => {
            const button = document.createElement('button');
            button.setAttribute('data-date', iso);
            viewport.appendChild(button);
        });
        document.body.appendChild(viewport);

        const frames: FrameRequestCallback[] = [];
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            frames.push(cb);
            return frames.length;
        });

        const { result } = renderHook(() => {
            const viewportRef = useRef<HTMLElement | null>(viewport);
            return useCalendarGridKeyboard({
                viewportRef,
                ensureMonthVisible,
                preferredDate: new CalendarDate(2024, 6, 15),
                onSelect,
            });
        });

        const key = (name: string) =>
            ({ key: name, preventDefault: vi.fn() }) as unknown as KeyboardEvent<HTMLButtonElement>;

        act(() => {
            result.current.onDayKeyDown(key('Enter'));
        });
        expect(onSelect).toHaveBeenCalled();

        act(() => {
            result.current.onDayKeyDown(key(' '));
        });

        act(() => {
            result.current.onDayKeyDown(key('a'));
        });

        act(() => {
            result.current.onDayFocus(new CalendarDate(2024, 6, 20));
        });
        expect(result.current.focusedDate.toString()).toBe('2024-06-20');

        act(() => {
            result.current.setFocusedDateFromParts(2024, 7);
        });
        expect(result.current.focusedDate.month).toBe(7);

        act(() => {
            result.current.onDayKeyDown(key('PageDown'));
            frames.splice(0).forEach(cb => cb(0));
        });
        expect(result.current.focusedDate.toString()).toBe('2024-08-20');
        expect(ensureMonthVisible).toHaveBeenCalled();

        ensureMonthVisible.mockClear();
        act(() => {
            result.current.onDayFocus(new CalendarDate(2024, 8, 20));
            result.current.onDayKeyDown(key('ArrowDown'));
            frames.splice(0).forEach(cb => cb(0));
        });
        // Same-month move still syncs center (desync recovery).
        expect(result.current.focusedDate.toString()).toBe('2024-08-27');
        expect(ensureMonthVisible).toHaveBeenCalledWith(expect.objectContaining({ month: 8, day: 27 }));

        const { result: bounded } = renderHook(() => {
            const viewportRef = useRef<HTMLElement | null>(viewport);
            return useCalendarGridKeyboard({
                viewportRef,
                ensureMonthVisible,
                preferredDate: new CalendarDate(2024, 6, 15),
                maxValue: new CalendarDate(2024, 6, 15),
                onSelect,
            });
        });
        act(() => {
            bounded.current.onDayKeyDown(key('ArrowRight'));
        });
        expect(bounded.current.focusedDate.toString()).toBe('2024-06-15');

        document.body.removeChild(viewport);
        vi.unstubAllGlobals();
    });

    it('focuses in-month day when outside-month duplicate exists', () => {
        const ensureMonthVisible = vi.fn();
        const viewport = document.createElement('div');
        const outside = document.createElement('button');
        outside.setAttribute('data-date', '2024-07-01');
        outside.setAttribute('data-outside-month', 'true');
        const inMonth = document.createElement('button');
        inMonth.setAttribute('data-date', '2024-07-01');
        viewport.append(outside, inMonth);
        // Also need June 30 for ArrowRight from preferred
        const june30 = document.createElement('button');
        june30.setAttribute('data-date', '2024-06-30');
        viewport.prepend(june30);
        document.body.appendChild(viewport);

        const frames: FrameRequestCallback[] = [];
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            frames.push(cb);
            return frames.length;
        });

        const { result } = renderHook(() => {
            const viewportRef = useRef<HTMLElement | null>(viewport);
            return useCalendarGridKeyboard({
                viewportRef,
                ensureMonthVisible,
                preferredDate: new CalendarDate(2024, 6, 30),
            });
        });

        const key = (name: string) =>
            ({ key: name, preventDefault: vi.fn() }) as unknown as KeyboardEvent<HTMLButtonElement>;

        const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
        act(() => {
            result.current.onDayKeyDown(key('ArrowRight'));
            frames.splice(0).forEach(cb => cb(0));
        });

        expect(result.current.focusedDate.toString()).toBe('2024-07-01');
        expect(ensureMonthVisible).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
        expect(focusSpy.mock.instances[0]).toBe(inMonth);
        expect(focusSpy.mock.calls[0]?.[0]).toEqual({ preventScroll: true });

        focusSpy.mockRestore();
        document.body.removeChild(viewport);
        vi.unstubAllGlobals();
    });

    it('disengages grid on blur when focus leaves day cells', () => {
        const ensureMonthVisible = vi.fn();
        const viewport = document.createElement('div');
        const day = document.createElement('button');
        day.setAttribute('data-date', '2024-06-15');
        const other = document.createElement('button');
        viewport.append(day, other);
        document.body.appendChild(viewport);

        const { result } = renderHook(() => {
            const viewportRef = useRef<HTMLElement | null>(viewport);
            return useCalendarGridKeyboard({
                viewportRef,
                ensureMonthVisible,
                preferredDate: new CalendarDate(2024, 6, 15),
                autoFocusDay: true,
            });
        });

        expect(result.current.isGridEngaged).toBe(true);

        act(() => {
            result.current.onDayBlur({
                relatedTarget: other,
            } as FocusEvent<HTMLButtonElement>);
        });
        expect(result.current.isGridEngaged).toBe(false);

        act(() => {
            result.current.onDayFocus(new CalendarDate(2024, 6, 15));
        });
        expect(result.current.isGridEngaged).toBe(true);

        act(() => {
            result.current.onDayBlur({
                relatedTarget: day,
            } as FocusEvent<HTMLButtonElement>);
        });
        expect(result.current.isGridEngaged).toBe(true);

        document.body.removeChild(viewport);
    });
});
