import { type PointerEvent as ReactPointerEvent, type RefObject, useCallback, useRef } from 'react';

import { SPRING_BACK_DURATION, SWIPE_DELTA } from '../constants';
import { shouldCloseSheet } from '../utils';

export interface IUseBottomSheetSwipeOptions {
    /** When false, pointer handlers are no-ops. */
    enabled: boolean;
    /** Called when the swipe crosses the close threshold. */
    onClose: () => void;
    /** Panel element that receives transform during drag. */
    panelRef: RefObject<HTMLDivElement | null>;
    /** Scrollable Body element. */
    contentRef: RefObject<HTMLDivElement | null>;
}

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useBottomSheetSwipe = ({ enabled, onClose, panelRef, contentRef }: IUseBottomSheetSwipeOptions) => {
    const startYRef = useRef(0);
    const startTimeRef = useRef(0);
    const swipeStartOffsetRef = useRef(0);
    const isSwipingRef = useRef(false);
    const pointerIdRef = useRef<number | null>(null);

    const resetScrollOverflow = useCallback(() => {
        const scrollEl = contentRef.current;
        if (scrollEl) {
            scrollEl.style.overflow = '';
        }
    }, [contentRef]);

    const clearPanelDragStyles = useCallback(() => {
        const panel = panelRef.current;
        if (!panel) {
            return;
        }

        panel.style.transition = '';
        panel.style.transform = '';
    }, [panelRef]);

    const onPointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (!enabled || event.button !== 0) {
                return;
            }

            startYRef.current = event.clientY;
            startTimeRef.current = event.timeStamp;
            swipeStartOffsetRef.current = 0;
            isSwipingRef.current = false;
            pointerIdRef.current = event.pointerId;
        },
        [enabled]
    );

    const onPointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (!enabled || pointerIdRef.current !== event.pointerId) {
                return;
            }

            const panel = panelRef.current;
            if (!panel) {
                return;
            }

            const deltaY = event.clientY - startYRef.current;
            const scrollEl = contentRef.current;
            const target = event.target as Node | null;
            const isInBody = Boolean(scrollEl && target && scrollEl.contains(target));

            if (!isSwipingRef.current) {
                if (deltaY < SWIPE_DELTA) {
                    return;
                }

                const canSwipe = !isInBody || (scrollEl?.scrollTop ?? 0) === 0;
                if (!canSwipe || deltaY <= 0) {
                    pointerIdRef.current = null;
                    return;
                }

                isSwipingRef.current = true;
                swipeStartOffsetRef.current = deltaY;

                if (typeof panel.setPointerCapture === 'function') {
                    panel.setPointerCapture(event.pointerId);
                }

                if (scrollEl) {
                    scrollEl.style.overflow = 'hidden';
                }
            }

            if (prefersReducedMotion()) {
                return;
            }

            const offset = Math.max(0, deltaY - swipeStartOffsetRef.current);
            panel.style.transition = 'none';
            panel.style.transform = `translateY(${offset}px)`;
        },
        [contentRef, enabled, panelRef]
    );

    const endSwipe = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (!enabled || pointerIdRef.current !== event.pointerId) {
                return;
            }

            const panel = panelRef.current;
            const wasSwiping = isSwipingRef.current;
            const deltaY = event.clientY - startYRef.current;
            const elapsed = Math.max(1, event.timeStamp - startTimeRef.current);
            const velocity = Math.abs(deltaY) / elapsed;
            const swipeStartOffset = swipeStartOffsetRef.current;

            pointerIdRef.current = null;
            isSwipingRef.current = false;
            resetScrollOverflow();

            if (
                panel &&
                typeof panel.hasPointerCapture === 'function' &&
                panel.hasPointerCapture(event.pointerId) &&
                typeof panel.releasePointerCapture === 'function'
            ) {
                panel.releasePointerCapture(event.pointerId);
            }

            if (!wasSwiping || !panel) {
                return;
            }

            const height = panel.getBoundingClientRect().height || 0;
            const shouldClose = shouldCloseSheet({
                deltaY,
                height,
                velocity,
                swipeStartOffset,
            });

            if (shouldClose) {
                clearPanelDragStyles();
                onClose();
                return;
            }

            if (prefersReducedMotion()) {
                clearPanelDragStyles();
                return;
            }

            panel.style.transition = `transform ${SPRING_BACK_DURATION}ms ease-out`;
            panel.style.transform = 'translateY(0)';

            const onTransitionEnd = () => {
                panel.removeEventListener('transitionend', onTransitionEnd);
                clearPanelDragStyles();
            };
            panel.addEventListener('transitionend', onTransitionEnd);
        },
        [clearPanelDragStyles, enabled, onClose, panelRef, resetScrollOverflow]
    );

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp: endSwipe,
        onPointerCancel: endSwipe,
    };
};
