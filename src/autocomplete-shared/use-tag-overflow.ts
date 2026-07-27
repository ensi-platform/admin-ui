import { type RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface ITagOverflowResult {
    /** How many leading tags fit when collapsed. */
    visibleCount: number;
    /** Measure container for tags + overflow chip. */
    containerRef: RefObject<HTMLDivElement | null>;
    /** Hidden measure row (offscreen). */
    measureRef: RefObject<HTMLDivElement | null>;
    /** Overflow chip measure node. */
    overflowMeasureRef: RefObject<HTMLButtonElement | null>;
}

/**
 * Computes how many tags fit in one row, reserving space for a +N chip when needed.
 * `itemCount` is the total number of selected tags.
 */
export const useTagOverflow = (itemCount: number, expanded: boolean): ITagOverflowResult => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const measureRef = useRef<HTMLDivElement | null>(null);
    const overflowMeasureRef = useRef<HTMLButtonElement | null>(null);
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

        const available = container.clientWidth;
        const children = Array.from(measure.children) as HTMLElement[];
        const gap = Number.parseFloat(getComputedStyle(measure).columnGap || getComputedStyle(measure).gap || '0') || 0;
        const overflowWidth = overflowMeasureRef.current?.offsetWidth ?? 0;

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

        setVisibleCount(itemCount > 0 ? 1 : 0);
    }, [expanded, itemCount]);

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

        return () => {
            observer.disconnect();
        };
    }, [recalculate, itemCount]);

    return { visibleCount, containerRef, measureRef, overflowMeasureRef };
};
