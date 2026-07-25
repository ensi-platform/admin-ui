import { type RefObject, useEffect, useRef } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SPRING_BACK_DURATION } from '../constants';
import { useBottomSheetSwipe } from '../hooks/useBottomSheetSwipe';

const POINTER_ID = 1;

type THandlers = ReturnType<typeof useBottomSheetSwipe>;

interface ISwipeReady {
    handlers: THandlers;
    panelRef: RefObject<HTMLDivElement | null>;
    contentRef: RefObject<HTMLDivElement | null>;
}

interface ISwipeHarnessProps {
    enabled?: boolean;
    onClose?: () => void;
    onReady?: (ctx: ISwipeReady) => void;
}

const SwipeHarness = ({ enabled = true, onClose = () => undefined, onReady }: ISwipeHarnessProps) => {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const handlers = useBottomSheetSwipe({ enabled, onClose, panelRef, contentRef });

    useEffect(() => {
        onReady?.({ handlers, panelRef, contentRef });
    }, [handlers, onReady, panelRef, contentRef]);

    return (
        <div ref={panelRef} data-test-id="panel">
            <div data-test-id="chrome">chrome</div>
            <div ref={contentRef} data-test-id="body">
                body
            </div>
        </div>
    );
};

const pointerEvent = (
    target: Element,
    overrides: {
        clientY: number;
        timeStamp: number;
        pointerId?: number;
        button?: number;
    }
) =>
    ({
        pointerId: overrides.pointerId ?? POINTER_ID,
        button: overrides.button ?? 0,
        clientY: overrides.clientY,
        timeStamp: overrides.timeStamp,
        target,
        currentTarget: target,
    }) as unknown as Parameters<THandlers['onPointerDown']>[0];

const stubPanelApis = (panel: HTMLElement) => {
    panel.setPointerCapture = vi.fn();
    panel.releasePointerCapture = vi.fn();
    panel.hasPointerCapture = vi.fn(() => true);
};

const mockMatchMedia = (matches: boolean | ((query: string) => boolean)) => {
    const resolve = typeof matches === 'function' ? matches : () => matches;
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn((query: string) => ({
            matches: resolve(query),
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
};

const renderSwipe = (props: Omit<ISwipeHarnessProps, 'onReady'> = {}) => {
    let ctx!: ISwipeReady;
    render(
        <SwipeHarness
            {...props}
            onReady={next => {
                ctx = next;
            }}
        />
    );
    const panel = screen.getByTestId('panel');
    const chrome = screen.getByTestId('chrome');
    const body = screen.getByTestId('body');
    stubPanelApis(panel);

    return { ...ctx, panel, chrome, body };
};

/** Start swipe (cross SWIPE_DELTA), then drag to endY with controlled timestamps. */
const swipeTo = (
    handlers: THandlers,
    target: Element,
    endY: number,
    options?: { endTime?: number; cancel?: boolean }
) => {
    const endTime = options?.endTime ?? 2000;
    handlers.onPointerDown(pointerEvent(target, { clientY: 0, timeStamp: 0 }));
    handlers.onPointerMove(pointerEvent(target, { clientY: 10, timeStamp: 50 }));
    handlers.onPointerMove(pointerEvent(target, { clientY: endY, timeStamp: endTime / 2 }));
    const end = pointerEvent(target, { clientY: endY, timeStamp: endTime });
    if (options?.cancel) {
        handlers.onPointerCancel(end);

        return;
    }

    handlers.onPointerUp(end);
};

describe('useBottomSheetSwipe', () => {
    beforeEach(() => {
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 400,
            right: 300,
            width: 300,
            height: 400,
            toJSON: () => ({}),
        });
        mockMatchMedia(false);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('does nothing when enabled is false', () => {
        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ enabled: false, onClose });

        swipeTo(handlers, chrome, 200);

        expect(panel.style.transform).toBe('');
        expect(onClose).not.toHaveBeenCalled();
    });

    it('ignores non-primary button', () => {
        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ onClose });

        handlers.onPointerDown(pointerEvent(chrome, { clientY: 0, timeStamp: 0, button: 1 }));
        handlers.onPointerMove(pointerEvent(chrome, { clientY: 200, timeStamp: 100 }));
        handlers.onPointerUp(pointerEvent(chrome, { clientY: 200, timeStamp: 200 }));

        expect(panel.style.transform).toBe('');
        expect(onClose).not.toHaveBeenCalled();
    });

    it('applies translateY while swiping from chrome', () => {
        const { handlers, panel, chrome } = renderSwipe();

        handlers.onPointerDown(pointerEvent(chrome, { clientY: 0, timeStamp: 0 }));
        handlers.onPointerMove(pointerEvent(chrome, { clientY: 10, timeStamp: 50 }));

        expect(panel.style.transform).toBe('translateY(0px)');
        expect(panel.style.transition).toBe('none');

        handlers.onPointerMove(pointerEvent(chrome, { clientY: 40, timeStamp: 80 }));

        expect(panel.style.transform).toBe('translateY(30px)');
    });

    it('ignores moves below SWIPE_DELTA before swipe starts', () => {
        const { handlers, panel, chrome } = renderSwipe();

        handlers.onPointerDown(pointerEvent(chrome, { clientY: 0, timeStamp: 0 }));
        handlers.onPointerMove(pointerEvent(chrome, { clientY: 3, timeStamp: 20 }));

        expect(panel.style.transform).toBe('');

        handlers.onPointerMove(pointerEvent(chrome, { clientY: 10, timeStamp: 50 }));

        expect(panel.style.transform).toBe('translateY(0px)');
    });

    it('calls onClose when drag past distance threshold', () => {
        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ onClose });

        swipeTo(handlers, chrome, 200);

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(panel.style.transform).toBe('');
    });

    it('springs back on short drag and clears styles on transitionend', () => {
        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ onClose });

        swipeTo(handlers, chrome, 40);

        expect(onClose).not.toHaveBeenCalled();
        expect(panel.style.transform).toBe('translateY(0)');
        expect(panel.style.transition).toBe(`transform ${SPRING_BACK_DURATION}ms ease-out`);

        fireEvent.transitionEnd(panel);

        expect(panel.style.transform).toBe('');
        expect(panel.style.transition).toBe('');
    });

    it('does not start swipe from body when scrollTop > 0', () => {
        const onClose = vi.fn();
        const { handlers, panel, body } = renderSwipe({ onClose });
        Object.defineProperty(body, 'scrollTop', { configurable: true, value: 20 });

        swipeTo(handlers, body, 200);

        expect(panel.style.transform).toBe('');
        expect(onClose).not.toHaveBeenCalled();
    });

    it('starts swipe from body when scrollTop is 0', () => {
        const onClose = vi.fn();
        const { handlers, panel, body } = renderSwipe({ onClose });
        Object.defineProperty(body, 'scrollTop', { configurable: true, value: 0 });

        handlers.onPointerDown(pointerEvent(body, { clientY: 0, timeStamp: 0 }));
        handlers.onPointerMove(pointerEvent(body, { clientY: 10, timeStamp: 50 }));

        expect(body.style.overflow).toBe('hidden');
        expect(panel.style.transform).toMatch(/translateY/);

        handlers.onPointerMove(pointerEvent(body, { clientY: 200, timeStamp: 1000 }));
        handlers.onPointerUp(pointerEvent(body, { clientY: 200, timeStamp: 2000 }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(body.style.overflow).toBe('');
    });

    it('treats nullish scrollTop as 0 when starting swipe from body', () => {
        const { handlers, panel, body } = renderSwipe();
        Object.defineProperty(body, 'scrollTop', {
            configurable: true,
            get: () => undefined,
        });

        handlers.onPointerDown(pointerEvent(body, { clientY: 0, timeStamp: 0 }));
        handlers.onPointerMove(pointerEvent(body, { clientY: 10, timeStamp: 50 }));

        expect(panel.style.transform).toMatch(/translateY/);
    });

    it('skips transform during move when prefers-reduced-motion, still closes on threshold', () => {
        mockMatchMedia(query => query === '(prefers-reduced-motion: reduce)');

        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ onClose });

        handlers.onPointerDown(pointerEvent(chrome, { clientY: 0, timeStamp: 0 }));
        handlers.onPointerMove(pointerEvent(chrome, { clientY: 10, timeStamp: 50 }));
        handlers.onPointerMove(pointerEvent(chrome, { clientY: 200, timeStamp: 1000 }));

        expect(panel.style.transform).toBe('');

        handlers.onPointerUp(pointerEvent(chrome, { clientY: 200, timeStamp: 2000 }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('clears styles without spring transition when reduced motion and short drag', () => {
        mockMatchMedia(query => query === '(prefers-reduced-motion: reduce)');

        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ onClose });

        swipeTo(handlers, chrome, 40);

        expect(onClose).not.toHaveBeenCalled();
        expect(panel.style.transform).toBe('');
        expect(panel.style.transition).toBe('');
    });

    it('ends swipe on pointerCancel', () => {
        const onClose = vi.fn();
        const { handlers, chrome } = renderSwipe({ onClose });

        swipeTo(handlers, chrome, 200, { cancel: true });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('ignores move and up from a different pointerId', () => {
        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ onClose });

        handlers.onPointerDown(pointerEvent(chrome, { clientY: 0, timeStamp: 0 }));
        handlers.onPointerMove(pointerEvent(chrome, { clientY: 200, timeStamp: 100, pointerId: 99 }));
        handlers.onPointerUp(pointerEvent(chrome, { clientY: 200, timeStamp: 200, pointerId: 99 }));

        expect(panel.style.transform).toBe('');
        expect(onClose).not.toHaveBeenCalled();
    });

    it('ignores move when panelRef is null', () => {
        const onClose = vi.fn();
        const { handlers, panelRef, chrome } = renderSwipe({ onClose });

        handlers.onPointerDown(pointerEvent(chrome, { clientY: 0, timeStamp: 0 }));
        panelRef.current = null;
        handlers.onPointerMove(pointerEvent(chrome, { clientY: 200, timeStamp: 100 }));
        handlers.onPointerUp(pointerEvent(chrome, { clientY: 200, timeStamp: 200 }));

        expect(onClose).not.toHaveBeenCalled();
    });

    it('no-ops clearPanelDragStyles when panelRef becomes null mid-end', () => {
        const onClose = vi.fn();
        const { handlers, panelRef, panel, chrome } = renderSwipe({ onClose });

        panel.getBoundingClientRect = () => {
            panelRef.current = null;

            return {
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                bottom: 400,
                right: 300,
                width: 300,
                height: 400,
                toJSON: () => ({}),
            };
        };

        swipeTo(handlers, chrome, 200);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('swipes from chrome when contentRef is null', () => {
        const onClose = vi.fn();
        const { handlers, contentRef, panel, chrome } = renderSwipe({ onClose });

        contentRef.current = null;

        swipeTo(handlers, chrome, 200);

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(panel.style.transform).toBe('');
    });

    it('starts swipe when setPointerCapture is absent', () => {
        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ onClose });
        // @ts-expect-error — cover typeof !== 'function' branch
        panel.setPointerCapture = undefined;

        handlers.onPointerDown(pointerEvent(chrome, { clientY: 0, timeStamp: 0 }));
        handlers.onPointerMove(pointerEvent(chrome, { clientY: 10, timeStamp: 50 }));

        expect(panel.style.transform).toBe('translateY(0px)');

        handlers.onPointerMove(pointerEvent(chrome, { clientY: 200, timeStamp: 1000 }));
        handlers.onPointerUp(pointerEvent(chrome, { clientY: 200, timeStamp: 2000 }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('uses zero height fallback from getBoundingClientRect', () => {
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 0,
            right: 300,
            width: 300,
            height: 0,
            toJSON: () => ({}),
        });

        const onClose = vi.fn();
        const { handlers, panel, chrome } = renderSwipe({ onClose });

        // Fast swipe: velocity closes even with height 0 (distance threshold is 0).
        swipeTo(handlers, chrome, 200, { endTime: 100 });

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(panel.style.transform).toBe('');
    });
});
