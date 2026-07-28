import { useEffect, useState } from 'react';

import { CalendarDate, type DateValue } from '@internationalized/date';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WEEK_SNAP_IDLE_MS } from '../constants';
import { useFakeScrollCalendar, toCal } from '../hooks/useFakeScrollCalendar';

interface IResizeObserverMock {
    observed: Set<Element>;
    observe: (target: Element) => void;
    disconnect: () => void;
    unobserve: (target: Element) => void;
    trigger: () => void;
}

const observers: IResizeObserverMock[] = [];

class ResizeObserverMock implements IResizeObserverMock {
    observed = new Set<Element>();

    private readonly callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        observers.push(this);
    }

    observe(target: Element) {
        this.observed.add(target);
    }

    disconnect() {
        this.observed.clear();
    }

    unobserve(target: Element) {
        this.observed.delete(target);
    }

    trigger() {
        this.callback(
            Array.from(this.observed).map(
                target =>
                    ({
                        target,
                        contentRect: target.getBoundingClientRect(),
                    }) as ResizeObserverEntry
            ),
            this as unknown as ResizeObserver
        );
    }
}

const stubOffsetHeight = (el: HTMLElement, height: number | (() => number)) => {
    Object.defineProperty(el, 'offsetHeight', {
        configurable: true,
        get: () => (typeof height === 'function' ? height() : height),
    });
};

type TApi = ReturnType<typeof useFakeScrollCalendar>;

const monthHeightRef = { current: 200 };

const Harness = ({
    scrollToDate,
    attachViewport = true,
    onReady,
}: {
    scrollToDate: DateValue | null | undefined;
    attachViewport?: boolean;
    onReady?: (api: TApi) => void;
}) => {
    const api = useFakeScrollCalendar(scrollToDate);
    const { months, viewportRef, setMonthEl } = api;

    useEffect(() => {
        onReady?.(api);
    });

    return (
        <div
            ref={attachViewport ? viewportRef : undefined}
            data-test-id="viewport"
            style={{ height: 320, overflow: 'hidden' }}
        >
            {months.map(month => (
                <div
                    key={month.monthKey}
                    ref={node => {
                        if (node) {
                            stubOffsetHeight(node, () => monthHeightRef.current);
                        }
                        setMonthEl(month.monthKey, node);
                    }}
                    data-month-key={month.monthKey}
                    data-test-id={`month-${month.monthKey}`}
                    style={{ height: 200 }}
                />
            ))}
        </div>
    );
};

describe('useFakeScrollCalendar', () => {
    beforeEach(() => {
        monthHeightRef.current = 200;
        observers.length = 0;
        vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it('toCal converts and nulls', () => {
        expect(toCal(null)).toBeNull();
        expect(toCal(new CalendarDate(2024, 6, 15))?.toString()).toBe('2024-06-15');
    });

    it('measures month heights and cleans orphan month els', async () => {
        let api: TApi | null = null;
        const { rerender } = render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('month-2024-06')).toBeInTheDocument();
        });

        const orphan = document.createElement('div');
        stubOffsetHeight(orphan, 180);
        act(() => {
            api!.setMonthEl('2099-01', orphan);
        });

        rerender(
            <Harness
                scrollToDate={new CalendarDate(2025, 1, 10)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('month-2025-01')).toBeInTheDocument();
        });
        expect(screen.queryByTestId('month-2099-01')).not.toBeInTheDocument();
    });

    it('skips wheel listeners when viewport is missing', () => {
        render(<Harness scrollToDate={new CalendarDate(2024, 6, 15)} attachViewport={false} />);
        expect(screen.getByTestId('viewport')).toBeInTheDocument();
    });

    it('handles wheel, touch and week snap', async () => {
        vi.useFakeTimers();
        let api: TApi | null = null;
        render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        const viewport = screen.getByTestId('viewport');
        await act(async () => {
            fireEvent.wheel(viewport, { deltaY: 40, deltaMode: 0 });
            await Promise.resolve();
            vi.runOnlyPendingTimers();
        });

        expect(api!.months.some(m => m.monthKey === '2024-06' || m.monthKey === '2024-07')).toBe(true);

        await act(async () => {
            fireEvent.touchStart(viewport, { targetTouches: [{ clientY: 120 }] });
            fireEvent.touchMove(viewport, { changedTouches: [{ clientY: 80 }] });
            fireEvent.touchEnd(viewport);
            vi.advanceTimersByTime(WEEK_SNAP_IDLE_MS + 20);
            vi.runOnlyPendingTimers();
        });

        await act(async () => {
            fireEvent.touchMove(viewport, { changedTouches: [{ clientY: 40 }] });
            fireEvent.touchStart(viewport, { targetTouches: [] });
            fireEvent.touchCancel(viewport);
        });
    });

    it('resets linear layout on wheel after scrollToMonth', async () => {
        vi.useFakeTimers();
        let api: TApi | null = null;
        render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        await act(async () => {
            api!.scrollToMonth(new CalendarDate(2024, 9, 1));
        });
        expect(api!.months.length).toBeGreaterThan(3);

        const viewport = screen.getByTestId('viewport');
        await act(async () => {
            fireEvent.wheel(viewport, { deltaY: 30, deltaMode: 0 });
            vi.runOnlyPendingTimers();
        });

        expect(api!.months).toHaveLength(3);
    });

    it('scrollToMonth same month resets when scrollPosition is not 0', async () => {
        vi.useFakeTimers();
        let api: TApi | null = null;
        render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        const viewport = screen.getByTestId('viewport');
        await act(async () => {
            fireEvent.wheel(viewport, { deltaY: -5, deltaMode: 0 });
            vi.runOnlyPendingTimers();
        });

        await act(async () => {
            api!.scrollToMonth(new CalendarDate(2024, 6, 1));
        });

        expect(api!.months.map(m => m.monthKey)).toEqual(['2024-05', '2024-06', '2024-07']);
    });

    it('animates scrollToMonth to completion', async () => {
        vi.useFakeTimers({
            toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
        });
        let api: TApi | null = null;
        render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        await act(async () => {
            api!.scrollToMonth(new CalendarDate(2024, 10, 1));
            for (let i = 0; i < 30; i += 1) {
                vi.advanceTimersByTime(20);
            }
            vi.runOnlyPendingTimers();
        });

        expect(api!.months.map(m => m.monthKey)).toEqual(['2024-09', '2024-10', '2024-11']);
    });

    it('ensureMonthVisible scrolls only when month is outside window', async () => {
        vi.useFakeTimers();
        let api: TApi | null = null;
        render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        await act(async () => {
            api!.ensureMonthVisible(new CalendarDate(2024, 6, 20));
        });
        expect(api!.months.map(m => m.monthKey)).toEqual(['2024-05', '2024-06', '2024-07']);

        await act(async () => {
            api!.ensureMonthVisible(new CalendarDate(2024, 9, 1));
            for (let i = 0; i < 30; i += 1) {
                vi.advanceTimersByTime(20);
            }
            vi.runOnlyPendingTimers();
        });

        expect(api!.months.some(m => m.monthKey === '2024-09')).toBe(true);
    });

    it('ignores null and partial-year scrollToDate', async () => {
        const Controlled = () => {
            const [value, setValue] = useState<DateValue | null>(new CalendarDate(2024, 6, 15));
            const api = useFakeScrollCalendar(value);

            return (
                <>
                    <div ref={api.viewportRef} data-test-id="viewport">
                        {api.months.map(month => (
                            <div
                                key={month.monthKey}
                                ref={node => {
                                    if (node) {
                                        stubOffsetHeight(node, 200);
                                    }
                                    api.setMonthEl(month.monthKey, node);
                                }}
                                data-month-key={month.monthKey}
                            />
                        ))}
                    </div>
                    <button type="button" onClick={() => setValue(null)}>
                        null
                    </button>
                    <button type="button" onClick={() => setValue(new CalendarDate(2, 6, 15))}>
                        partial
                    </button>
                    <span data-test-id="keys">{api.months.map(m => m.monthKey).join(',')}</span>
                </>
            );
        };

        render(<Controlled />);
        expect(screen.getByTestId('keys').textContent).toContain('2024-06');

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'null' }));
        });
        expect(screen.getByTestId('keys').textContent).toContain('2024-06');

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'partial' }));
        });
        expect(screen.getByTestId('keys').textContent).toContain('2024-06');
    });

    it('ResizeObserver commits new heights and setMonthEl(null) disconnects', async () => {
        let api: TApi | null = null;
        const { unmount, rerender } = render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        await waitFor(() => {
            expect(observers.length).toBeGreaterThan(0);
        });

        const el = screen.getByTestId('month-2024-06') as HTMLDivElement;
        stubOffsetHeight(el, 240);
        act(() => {
            observers.forEach(ro => {
                ro.trigger();
            });
        });

        // Same node → early return; new node → disconnect existing observer.
        act(() => {
            api!.setMonthEl('2024-06', el);
            const other = document.createElement('div');
            stubOffsetHeight(other, 220);
            api!.setMonthEl('2024-06', other);
            api!.setMonthEl('2024-06', null);
        });

        // Remeasure when monthKeys refresh and offsetHeight changed.
        stubOffsetHeight(el, 260);
        rerender(
            <Harness
                scrollToDate={new CalendarDate(2024, 7, 1)}
                onReady={next => {
                    api = next;
                }}
            />
        );
        await waitFor(() => {
            expect(screen.getByTestId('month-2024-07')).toBeInTheDocument();
        });

        unmount();
    });

    it('covers wheel delta 0 flush and cancels pending wheel RAF on unmount', async () => {
        const { unmount } = render(<Harness scrollToDate={new CalendarDate(2024, 6, 15)} />);
        const viewport = screen.getByTestId('viewport');

        await act(async () => {
            fireEvent.wheel(viewport, { deltaY: 0, deltaMode: 0 });
            await new Promise<void>(resolve => {
                requestAnimationFrame(() => resolve());
            });
        });

        await act(async () => {
            fireEvent.wheel(viewport, { deltaY: 40, deltaMode: 0 });
            unmount();
        });
    });

    it('skips ResizeObserver when unsupported', () => {
        // Non-constructable stub: typeof !== 'undefined', but hook must not crash.
        vi.stubGlobal('ResizeObserver', undefined as unknown as typeof ResizeObserver);

        let api: TApi | null = null;
        const { unmount } = render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );
        expect(screen.getByTestId('month-2024-06')).toBeInTheDocument();

        const orphan = document.createElement('div');
        stubOffsetHeight(orphan, 180);
        act(() => {
            api!.setMonthEl('orphan-no-ro', orphan);
        });
        act(() => {
            api!.scrollToMonth(new CalendarDate(2024, 9, 1));
        });
        expect(api!.months.some(m => m.monthKey === '2024-09')).toBe(true);
        unmount();
        vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    });

    it('drops orphan month el with zero height without committing measure', async () => {
        let api: TApi | null = null;
        render(
            <Harness
                scrollToDate={new CalendarDate(2024, 6, 15)}
                onReady={next => {
                    api = next;
                }}
            />
        );

        const orphan = document.createElement('div');
        stubOffsetHeight(orphan, 0);
        act(() => {
            api!.setMonthEl('orphan-key', orphan);
        });
        act(() => {
            api!.scrollToMonth(new CalendarDate(2024, 8, 1));
        });
        expect(api!.months.some(m => m.monthKey === '2024-08')).toBe(true);
    });

    it('coalesces multiple wheel events into one RAF flush', async () => {
        const frames: FrameRequestCallback[] = [];
        const originalRaf = globalThis.requestAnimationFrame;
        const originalCancel = globalThis.cancelAnimationFrame;
        globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
            frames.push(cb);
            return frames.length;
        }) as typeof requestAnimationFrame;
        globalThis.cancelAnimationFrame = vi.fn() as typeof cancelAnimationFrame;

        try {
            render(<Harness scrollToDate={new CalendarDate(2024, 6, 15)} />);
            const viewport = screen.getByTestId('viewport');

            await act(async () => {
                fireEvent.wheel(viewport, { deltaY: 20, deltaMode: 0 });
                fireEvent.wheel(viewport, { deltaY: 30, deltaMode: 0 });
                expect(frames).toHaveLength(1);
                frames.splice(0).forEach(cb => cb(0));
            });
        } finally {
            globalThis.requestAnimationFrame = originalRaf;
            globalThis.cancelAnimationFrame = originalCancel;
        }
    });
});
