import { createRef, type ReactNode, type RefObject } from 'react';

import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTagOverflow } from '../hooks/useTagOverflow';

interface IObserverEntry {
    callback: ResizeObserverCallback;
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
}

let observers: IObserverEntry[];

const widthMap = new WeakMap<Element, number>();

const setBox = (el: Element, width: number) => {
    widthMap.set(el, width);
};

const triggerResize = () => {
    act(() => {
        observers.at(-1)?.callback([] as unknown as ResizeObserverEntry[], {} as ResizeObserver);
    });
};

const Harness = ({
    itemCount,
    expanded,
    trailingReserveRef,
    trailingContentKey,
    trailing,
}: {
    itemCount: number;
    expanded: boolean;
    trailingReserveRef?: RefObject<HTMLElement | null>;
    trailingContentKey?: string;
    trailing?: ReactNode;
}) => {
    const { visibleCount, containerRef, measureRef, overflowMeasureRef } = useTagOverflow(itemCount, expanded, {
        trailingReserveRef,
        trailingContentKey,
    });

    return (
        <div>
            <span data-test-id="visible">{visibleCount}</span>
            <div ref={containerRef} data-test-id="container">
                <div ref={measureRef} data-test-id="measure">
                    {Array.from({ length: itemCount }, (_, index) => (
                        <span key={index} data-test-id={`tag-${index}`} />
                    ))}
                </div>
                <button
                    ref={overflowMeasureRef}
                    type="button"
                    data-test-id="overflow-measure"
                    aria-label="Overflow measure"
                />
                {trailing}
            </div>
        </div>
    );
};

describe('useTagOverflow', () => {
    beforeEach(() => {
        observers = [];
        vi.stubGlobal(
            'ResizeObserver',
            class {
                observe = vi.fn();

                unobserve = vi.fn();

                disconnect = vi.fn();

                constructor(callback: ResizeObserverCallback) {
                    observers.push({ callback, observe: this.observe, disconnect: this.disconnect });
                }
            }
        );
        vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function offsetWidth(
            this: HTMLElement
        ) {
            return widthMap.get(this) ?? 0;
        });
        vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function clientWidth(
            this: HTMLElement
        ) {
            return widthMap.get(this) ?? 0;
        });
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            minWidth: '0px',
            columnGap: '0px',
            gap: '0px',
        } as CSSStyleDeclaration);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('returns full count when expanded or empty', () => {
        const { result, rerender } = renderHook(
            ({ count, expanded }: { count: number; expanded: boolean }) => useTagOverflow(count, expanded),
            { initialProps: { count: 3, expanded: true } }
        );

        expect(result.current.visibleCount).toBe(3);

        rerender({ count: 0, expanded: false });
        expect(result.current.visibleCount).toBe(0);
    });

    it('keeps itemCount when measure nodes are empty before layout', () => {
        const { result } = renderHook(() => useTagOverflow(4, false));

        expect(result.current.visibleCount).toBe(4);
    });

    it('fits leading tags and reserves overflow chip', () => {
        render(<Harness itemCount={3} expanded={false} />);

        setBox(screen.getByTestId('container'), 100);
        setBox(screen.getByTestId('overflow-measure'), 30);
        setBox(screen.getByTestId('tag-0'), 40);
        setBox(screen.getByTestId('tag-1'), 40);
        setBox(screen.getByTestId('tag-2'), 40);

        triggerResize();

        expect(screen.getByTestId('visible')).toHaveTextContent('1');
    });

    it('falls back to one tag when nothing fits', () => {
        render(<Harness itemCount={2} expanded={false} />);

        setBox(screen.getByTestId('container'), 10);
        setBox(screen.getByTestId('overflow-measure'), 30);
        setBox(screen.getByTestId('tag-0'), 200);
        setBox(screen.getByTestId('tag-1'), 200);

        triggerResize();

        expect(screen.getByTestId('visible')).toHaveTextContent('1');
    });

    it('uses trailing minWidth and observes trailing element', () => {
        const trailingRef = createRef<HTMLElement | null>();

        render(
            <Harness
                itemCount={1}
                expanded={false}
                trailingReserveRef={trailingRef}
                trailingContentKey="abc"
                trailing={<span ref={trailingRef} data-test-id="trailing" />}
            />
        );

        const trailing = screen.getByTestId('trailing');

        setBox(trailing, 10);
        vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
            if (el === trailing) {
                return { minWidth: '40px', columnGap: '0px', gap: '0px' } as CSSStyleDeclaration;
            }

            return { minWidth: '0px', columnGap: '0px', gap: '0px' } as CSSStyleDeclaration;
        });

        setBox(screen.getByTestId('container'), 100);
        setBox(screen.getByTestId('overflow-measure'), 20);
        setBox(screen.getByTestId('tag-0'), 50);

        triggerResize();

        expect(screen.getByTestId('visible')).toHaveTextContent('1');
        expect(observers.at(-1)?.observe).toHaveBeenCalledWith(trailing);
    });

    it('falls back to gap and zero when columnGap is empty', () => {
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            minWidth: '0px',
            columnGap: '',
            gap: '8px',
        } as CSSStyleDeclaration);

        render(<Harness itemCount={2} expanded={false} />);

        setBox(screen.getByTestId('container'), 100);
        setBox(screen.getByTestId('overflow-measure'), 20);
        setBox(screen.getByTestId('tag-0'), 40);
        setBox(screen.getByTestId('tag-1'), 40);

        triggerResize();

        expect(Number(screen.getByTestId('visible').textContent)).toBeGreaterThanOrEqual(1);
    });

    it('uses zero gap when columnGap and gap are empty or invalid', () => {
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            minWidth: '0px',
            columnGap: '',
            gap: '',
        } as CSSStyleDeclaration);

        render(<Harness itemCount={1} expanded={false} />);

        setBox(screen.getByTestId('container'), 80);
        setBox(screen.getByTestId('tag-0'), 40);
        // leave overflow measure without width map entry → 0 via mock getter

        triggerResize();

        expect(screen.getByTestId('visible')).toHaveTextContent('1');
    });

    it('treats non-numeric gap as zero', () => {
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            minWidth: '0px',
            columnGap: 'nope',
            gap: 'nope',
        } as CSSStyleDeclaration);

        render(<Harness itemCount={1} expanded={false} />);

        setBox(screen.getByTestId('container'), 80);
        setBox(screen.getByTestId('tag-0'), 40);

        triggerResize();

        expect(screen.getByTestId('visible')).toHaveTextContent('1');
    });

    it('treats missing overflow measure node as zero width', () => {
        const NoOverflowHarness = ({ itemCount }: { itemCount: number }) => {
            const { visibleCount, containerRef, measureRef } = useTagOverflow(itemCount, false);

            return (
                <div>
                    <span data-test-id="visible">{visibleCount}</span>
                    <div ref={containerRef} data-test-id="container">
                        <div ref={measureRef} data-test-id="measure">
                            <span data-test-id="tag-0" />
                            <span data-test-id="tag-1" />
                        </div>
                    </div>
                </div>
            );
        };

        render(<NoOverflowHarness itemCount={2} />);

        setBox(screen.getByTestId('container'), 50);
        setBox(screen.getByTestId('tag-0'), 40);
        setBox(screen.getByTestId('tag-1'), 40);

        triggerResize();

        expect(Number(screen.getByTestId('visible').textContent)).toBeGreaterThanOrEqual(1);
    });

    it('disconnects ResizeObserver on unmount', () => {
        const { unmount } = render(<Harness itemCount={1} expanded={false} />);
        const observer = observers.at(-1);

        unmount();
        expect(observer?.disconnect).toHaveBeenCalled();
    });
});
