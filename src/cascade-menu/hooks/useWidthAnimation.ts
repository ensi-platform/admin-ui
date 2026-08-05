import { type TransitionEvent as ReactTransitionEvent, useCallback, useEffect, useRef, useState } from 'react';

import { WIDTH_TRANSITION_MS } from '../constants';

export interface IUseWidthAnimationResult {
    layoutCollapsed: boolean;
    widthAnimating: boolean;
    handleWidthTransitionEnd: (event: ReactTransitionEvent<HTMLElement>) => void;
}

/** Deferred layout sync for L0 width collapse/expand animation. */
export const useWidthAnimation = (collapsed: boolean, collapse: () => void): IUseWidthAnimationResult => {
    const [widthAnimating, setWidthAnimating] = useState(false);
    const [layoutCollapsed, setLayoutCollapsed] = useState(collapsed);
    const prevCollapsedRef = useRef(collapsed);
    const widthAnimTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const collapseRef = useRef(collapse);
    collapseRef.current = collapse;

    const endWidthAnimating = useCallback(() => {
        if (widthAnimTimeoutRef.current) {
            clearTimeout(widthAnimTimeoutRef.current);
            widthAnimTimeoutRef.current = null;
        }

        setWidthAnimating(false);
    }, []);

    useEffect(() => {
        const wasCollapsed = prevCollapsedRef.current;
        prevCollapsedRef.current = collapsed;

        if (wasCollapsed === collapsed) {
            return;
        }

        const reduceMotion =
            typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        setLayoutCollapsed(collapsed);
        collapseRef.current();

        if (reduceMotion) {
            return;
        }

        setWidthAnimating(true);

        widthAnimTimeoutRef.current = setTimeout(() => {
            endWidthAnimating();
        }, WIDTH_TRANSITION_MS);

        return () => {
            if (widthAnimTimeoutRef.current) {
                clearTimeout(widthAnimTimeoutRef.current);
                widthAnimTimeoutRef.current = null;
            }
        };
    }, [collapsed, endWidthAnimating]);

    const handleWidthTransitionEnd = useCallback(
        (event: ReactTransitionEvent<HTMLElement>) => {
            if (event.target !== event.currentTarget || event.propertyName !== 'width') {
                return;
            }

            endWidthAnimating();
        },
        [endWidthAnimating]
    );

    return { layoutCollapsed, widthAnimating, handleWidthTransitionEnd };
};
