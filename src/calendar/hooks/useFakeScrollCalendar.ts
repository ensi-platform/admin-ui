import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { type CalendarDate, type DateValue, getLocalTimeZone, toCalendarDate } from '@internationalized/date';

import { SCROLL_TO_MONTH_MS, WEEK_SNAP_DURATION_MS, WEEK_SNAP_IDLE_MS } from '../constants';
import { estimateMonthHeight, getCenterMonth, getCenteredMonthKeys, parseMonthKey, toMonthKey } from '../utils/date';
import {
    applyScrollDelta,
    buildScrollPathKeys,
    getLinearMonthPositions,
    getMonthPositions,
    getNearTopSnapScrollPosition,
    linearScrollOffsetForMonthKey,
    wheelDeltaToPixels,
} from '../utils/scroll';

type TScrollLayout = 'centered' | 'linear';

interface IFakeScrollState {
    centerMonth: CalendarDate;
    monthKeys: string[];
    scrollPosition: number;
    layout: TScrollLayout;
}

export const toCal = (value: DateValue | null | undefined): CalendarDate | null =>
    value != null ? toCalendarDate(value) : null;

const createScrollState = (scrollToDate: DateValue | null | undefined, timeZone: string): IFakeScrollState => {
    const centerMonth = getCenterMonth(scrollToDate, timeZone);

    return {
        centerMonth,
        monthKeys: getCenteredMonthKeys(centerMonth),
        scrollPosition: 0,
        layout: 'centered',
    };
};

export const useFakeScrollCalendar = (scrollToDate: DateValue | null | undefined) => {
    const timeZone = getLocalTimeZone();
    const [state, setState] = useState<IFakeScrollState>(() => createScrollState(scrollToDate, timeZone));
    const [measuredHeights, setMeasuredHeights] = useState<ReadonlyMap<string, number>>(() => new Map());
    const viewportRef = useRef<HTMLDivElement>(null);
    const monthElsRef = useRef(new Map<string, HTMLElement>());
    const heightsRef = useRef(new Map<string, number>());
    const observersRef = useRef(new Map<string, ResizeObserver>());
    const touchStartYRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const animRafRef = useRef<number | null>(null);
    const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingDeltaRef = useRef(0);
    const lastDeltaSignRef = useRef(0);
    const stateRef = useRef(state);
    stateRef.current = state;
    const scrollToMonthKeyDep = scrollToDate ? toMonthKey(scrollToDate) : null;

    const getHeight = (monthKey: string) => heightsRef.current.get(monthKey) ?? estimateMonthHeight(monthKey);

    const commitHeight = (monthKey: string, height: number) => {
        if (height <= 0 || heightsRef.current.get(monthKey) === height) {
            return;
        }
        heightsRef.current.set(monthKey, height);
        setMeasuredHeights(new Map(heightsRef.current));
    };

    const cancelAnimation = () => {
        if (animRafRef.current != null) {
            cancelAnimationFrame(animRafRef.current);
            animRafRef.current = null;
        }
    };

    const cancelSnap = () => {
        if (snapTimeoutRef.current != null) {
            clearTimeout(snapTimeoutRef.current);
            snapTimeoutRef.current = null;
        }
    };

    const animateScrollPosition = (from: number, to: number, durationMs: number, onEnd?: () => void) => {
        cancelAnimation();
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - (1 - t) ** 3;
            const value = from + (to - from) * eased;
            setState(prev => ({ ...prev, scrollPosition: value }));
            if (t >= 1) {
                animRafRef.current = null;
                onEnd?.();
                return;
            }
            animRafRef.current = requestAnimationFrame(tick);
        };
        animRafRef.current = requestAnimationFrame(tick);
    };

    const scheduleWeekSnapRef = useRef<() => void>(null as unknown as () => void);
    scheduleWeekSnapRef.current = () => {
        cancelSnap();
        snapTimeoutRef.current = setTimeout(() => {
            snapTimeoutRef.current = null;
            const prev = stateRef.current;
            if (prev.layout !== 'centered') {
                return;
            }
            const target = getNearTopSnapScrollPosition(
                prev.monthKeys,
                prev.scrollPosition,
                getHeight,
                undefined,
                lastDeltaSignRef.current
            );
            if (Math.abs(target - prev.scrollPosition) < 0.5) {
                return;
            }
            animateScrollPosition(prev.scrollPosition, target, WEEK_SNAP_DURATION_MS);
        }, WEEK_SNAP_IDLE_MS);
    };

    useEffect(
        () => () => {
            cancelAnimation();
            cancelSnap();
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
            }
            // Month refs call setMonthEl(null) on unmount and disconnect observers there.
            observersRef.current.clear();
        },
        []
    );

    useLayoutEffect(() => {
        let changed = false;
        Array.from(monthElsRef.current.entries()).forEach(([key]) => {
            if (!state.monthKeys.includes(key)) {
                monthElsRef.current.delete(key);
                if (heightsRef.current.delete(key)) {
                    changed = true;
                }
                const ro = observersRef.current.get(key);
                if (ro) {
                    ro.disconnect();
                    observersRef.current.delete(key);
                }
            }
        });
        if (changed) {
            setMeasuredHeights(new Map(heightsRef.current));
        }
    }, [state.monthKeys]);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) {
            return;
        }

        const flushDelta = () => {
            rafRef.current = null;
            const deltaY = pendingDeltaRef.current;
            pendingDeltaRef.current = 0;
            if (deltaY === 0) {
                return;
            }

            lastDeltaSignRef.current = deltaY > 0 ? 1 : -1;

            setState(prev => {
                let { monthKeys } = prev;
                let { scrollPosition } = prev;

                if (prev.layout === 'linear') {
                    const positions = getLinearMonthPositions(prev.monthKeys, prev.scrollPosition, getHeight);
                    let bestIndex = 0;
                    let bestDist = Math.abs(positions[0]);
                    for (let index = 1; index < positions.length; index += 1) {
                        const dist = Math.abs(positions[index]);
                        if (dist < bestDist) {
                            bestDist = dist;
                            bestIndex = index;
                        }
                    }
                    const nearest = parseMonthKey(prev.monthKeys[bestIndex])!;
                    const reset = createScrollState(nearest, timeZone);
                    monthKeys = reset.monthKeys;
                    scrollPosition = reset.scrollPosition;
                }

                const next = applyScrollDelta(monthKeys, scrollPosition, deltaY, getHeight);

                return {
                    centerMonth: next.centerMonth,
                    monthKeys: next.monthKeys,
                    scrollPosition: next.scrollPosition,
                    layout: 'centered',
                };
            });
        };

        const queueDelta = (deltaY: number) => {
            cancelAnimation();
            cancelSnap();
            pendingDeltaRef.current += deltaY;
            if (rafRef.current == null) {
                rafRef.current = requestAnimationFrame(flushDelta);
            }
            scheduleWeekSnapRef.current();
        };

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            queueDelta(wheelDeltaToPixels(event));
        };

        const handleTouchStart = (event: TouchEvent) => {
            cancelAnimation();
            cancelSnap();
            touchStartYRef.current = event.targetTouches[0]?.clientY ?? null;
        };

        const handleTouchMove = (event: TouchEvent) => {
            const clientY = event.changedTouches[0]?.clientY;
            if (clientY == null || touchStartYRef.current == null) {
                return;
            }

            event.preventDefault();
            const deltaY = touchStartYRef.current - clientY;
            touchStartYRef.current = clientY;
            queueDelta(deltaY);
        };

        const handleTouchEnd = () => {
            touchStartYRef.current = null;
            scheduleWeekSnapRef.current();
        };

        viewport.addEventListener('wheel', handleWheel, { passive: false });
        viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
        viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
        viewport.addEventListener('touchend', handleTouchEnd);
        viewport.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            viewport.removeEventListener('wheel', handleWheel);
            viewport.removeEventListener('touchstart', handleTouchStart);
            viewport.removeEventListener('touchmove', handleTouchMove);
            viewport.removeEventListener('touchend', handleTouchEnd);
            viewport.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [timeZone]);

    const months = useMemo(() => {
        const getMeasuredHeight = (monthKey: string) => measuredHeights.get(monthKey) ?? estimateMonthHeight(monthKey);
        const positions =
            state.layout === 'linear'
                ? getLinearMonthPositions(state.monthKeys, state.scrollPosition, getMeasuredHeight)
                : getMonthPositions(state.monthKeys, state.scrollPosition, getMeasuredHeight);

        return state.monthKeys.map((monthKey, index) => ({
            monthKey,
            index,
            top: positions[index],
            height: getMeasuredHeight(monthKey),
        }));
    }, [state.monthKeys, state.scrollPosition, state.layout, measuredHeights]);

    const setMonthEl = (monthKey: string, node: HTMLElement | null) => {
        if (!node) {
            monthElsRef.current.delete(monthKey);
            const ro = observersRef.current.get(monthKey);
            if (ro) {
                ro.disconnect();
                observersRef.current.delete(monthKey);
            }
            return;
        }

        const prev = monthElsRef.current.get(monthKey);
        monthElsRef.current.set(monthKey, node);
        commitHeight(monthKey, node.offsetHeight);

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        if (prev === node && observersRef.current.has(monthKey)) {
            return;
        }

        const existing = observersRef.current.get(monthKey);
        if (existing) {
            existing.disconnect();
        }

        const ro = new ResizeObserver(() => {
            commitHeight(monthKey, node.offsetHeight);
        });
        ro.observe(node);
        observersRef.current.set(monthKey, ro);
    };

    const scrollToMonth = (date: DateValue) => {
        cancelSnap();
        cancelAnimation();

        const target = getCenterMonth(date, timeZone);
        const prev = stateRef.current;
        if (
            toMonthKey(prev.centerMonth) === toMonthKey(target) &&
            prev.scrollPosition === 0 &&
            prev.layout === 'centered'
        ) {
            return;
        }

        const { keys, fromKey, toKey } = buildScrollPathKeys(prev.centerMonth, target);
        if (fromKey === toKey) {
            setState(createScrollState(target, timeZone));
            return;
        }

        const fromOffset = linearScrollOffsetForMonthKey(keys, fromKey, getHeight);
        const toOffset = linearScrollOffsetForMonthKey(keys, toKey, getHeight);

        setState({
            centerMonth: target,
            monthKeys: keys,
            scrollPosition: fromOffset,
            layout: 'linear',
        });

        requestAnimationFrame(() => {
            animateScrollPosition(fromOffset, toOffset, SCROLL_TO_MONTH_MS, () => {
                setState(createScrollState(target, timeZone));
            });
        });
    };

    const scrollToMonthRef = useRef(scrollToMonth);
    scrollToMonthRef.current = scrollToMonth;

    const ensureMonthVisible = (date: DateValue) => {
        const targetKey = toMonthKey(getCenterMonth(date, timeZone));
        if (stateRef.current.monthKeys.includes(targetKey)) {
            return;
        }
        scrollToMonth(date);
    };

    useEffect(() => {
        if (!scrollToMonthKeyDep || scrollToDate == null) {
            return;
        }

        // Skip partial year commits while typing (e.g. 2 / 20 / 202).
        if (toCalendarDate(scrollToDate).year < 1000) {
            return;
        }

        scrollToMonthRef.current(scrollToDate);
    }, [scrollToDate, scrollToMonthKeyDep]);

    return { months, viewportRef, setMonthEl, scrollToMonth, ensureMonthVisible };
};
