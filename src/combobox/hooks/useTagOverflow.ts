import { type RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface ITagOverflowOptions {
    /** Element whose width is reserved at the end of the row (e.g. input content sizer). */
    trailingReserveRef?: RefObject<HTMLElement | null>;
    /** Bumps recalculation when trailing content changes (e.g. inputValue). */
    trailingContentKey?: string;
}

export interface ITagOverflowResult {
    /** How many leading tags fit when collapsed. */
    visibleCount: number;
    /** Measure container for tags + overflow chip + trailing reserve. */
    containerRef: RefObject<HTMLDivElement | null>;
    /** Hidden measure row (offscreen). */
    measureRef: RefObject<HTMLDivElement | null>;
    /** Overflow chip measure node. */
    overflowMeasureRef: RefObject<HTMLButtonElement | null>;
}

const readTrailingWidth = (trailingEl: HTMLElement | null | undefined): number => {
    if (!trailingEl) {
        return 0;
    }

    const minWidthPx = Number.parseFloat(getComputedStyle(trailingEl).minWidth);
    const measured = trailingEl.offsetWidth;

    if (Number.isFinite(minWidthPx) && minWidthPx > 0) {
        return Math.max(minWidthPx, measured);
    }

    return measured;
};

/**
 * Computes how many tags fit in one row, reserving space for a +N chip when needed
 * and optionally for a trailing element (filter input content width).
 * `itemCount` is the total number of selected tags.
 */
export const useTagOverflow = (
    itemCount: number,
    expanded: boolean,
    options?: ITagOverflowOptions
): ITagOverflowResult => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const measureRef = useRef<HTMLDivElement | null>(null);
    const overflowMeasureRef = useRef<HTMLButtonElement | null>(null);
    const trailingReserveRef = options?.trailingReserveRef;
    const trailingContentKey = options?.trailingContentKey;
    const [visibleCount, setVisibleCount] = useState(itemCount);

    const recalculate = useCallback(() => {
        if (expanded || itemCount === 0) {
            setVisibleCount(itemCount);

            return;
        }

        const container = containerRef.current;
        const measure = measureRef.current;

        if (!container || !measure) {
            setVisibleCount(itemCount);

            return;
        }

        const children = Array.from(measure.children) as HTMLElement[];
        const gap = Number.parseFloat(getComputedStyle(measure).columnGap || getComputedStyle(measure).gap || '0') || 0;
        const overflowWidth = overflowMeasureRef.current?.offsetWidth ?? 0;
        const trailingWidth = readTrailingWidth(trailingReserveRef?.current);
        const available = container.clientWidth - (trailingWidth > 0 ? trailingWidth + gap : 0);

        let used = 0;
        let fit = 0;

        for (let index = 0; index < children.length; index += 1) {
            const width = children[index].offsetWidth;
            const next = used + (fit > 0 ? gap : 0) + width;
            const remaining = itemCount - (index + 1);
            const needOverflow = remaining > 0;
            const withOverflow = next + (needOverflow ? gap + overflowWidth : 0);

            if (withOverflow > available) {
                break;
            }

            used = next;
            fit = index + 1;
        }

        if (fit > 0) {
            setVisibleCount(fit);

            return;
        }

        setVisibleCount(1);
    }, [expanded, itemCount, trailingReserveRef]);

    useLayoutEffect(() => {
        recalculate();

        const container = containerRef.current;

        if (!container || typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(() => {
            recalculate();
        });

        observer.observe(container);

        const trailing = trailingReserveRef?.current;

        if (trailing) {
            observer.observe(trailing);
        }

        return () => {
            observer.disconnect();
        };
    }, [recalculate, trailingContentKey, trailingReserveRef]);

    return { visibleCount, containerRef, measureRef, overflowMeasureRef };
};
