import { type RefObject, useEffect } from 'react';

import { isNodeInsideCascadeChrome, type ICascadeMenuItem } from '../utils';

export interface IUseCascadeDismissOptions {
    roots: ICascadeMenuItem[];
    openPathLength: number;
    collapse: () => void;
    rootRef: RefObject<HTMLElement | null>;
    flyoutRefs: RefObject<(HTMLDivElement | null)[]>;
    contextMenuRef: RefObject<HTMLDivElement | null>;
}

/** Close flyouts on tree change, scroll, resize, or outside pointer. */
export const useCascadeDismiss = ({
    roots,
    openPathLength,
    collapse,
    rootRef,
    flyoutRefs,
    contextMenuRef,
}: IUseCascadeDismissOptions): void => {
    useEffect(() => {
        collapse();
    }, [roots, collapse]);

    useEffect(() => {
        const isInsideChrome = (target: Node | null) =>
            isNodeInsideCascadeChrome(target, {
                root: rootRef.current,
                flyouts: flyoutRefs.current,
                contextMenu: contextMenuRef.current,
            });

        const onScroll = (event: Event) => {
            if (openPathLength === 0) {
                return;
            }

            const { target } = event;

            if (target instanceof Node && isInsideChrome(target)) {
                return;
            }

            collapse();
        };

        const onResize = () => {
            if (openPathLength > 0) {
                collapse();
            }
        };

        const onPointerDown = (event: PointerEvent) => {
            if (openPathLength === 0) {
                return;
            }

            if (isInsideChrome(event.target as Node | null)) {
                return;
            }

            collapse();
        };

        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onResize);
        document.addEventListener('pointerdown', onPointerDown);

        return () => {
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('pointerdown', onPointerDown);
        };
    }, [collapse, contextMenuRef, flyoutRefs, openPathLength, rootRef]);
};
