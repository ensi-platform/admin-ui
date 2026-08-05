import { type PointerEvent as ReactPointerEvent, useRef, useState } from 'react';

import { COLLAPSED_WIDTH } from '../constants';

export interface IUseCascadeResizeOptions {
    collapsed: boolean;
    width: number;
    setCollapsed: (next: boolean) => void;
    setWidth: (next: number, options?: { persist?: boolean }) => void;
    discardWidthDraft: () => void;
}

export interface IUseCascadeResizeResult {
    resizing: boolean;
    onResizePointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
    onResizePointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
    endResize: (event: ReactPointerEvent<HTMLButtonElement>) => void;
}

/** L0 resize handle: snap collapse at rail width, expand at last expanded width. */
export const useCascadeResize = ({
    collapsed,
    width,
    setCollapsed,
    setWidth,
    discardWidthDraft,
}: IUseCascadeResizeOptions): IUseCascadeResizeResult => {
    const dragStartX = useRef(0);
    const dragStartWidth = useRef(0);
    const isDragging = useRef(false);
    const [resizing, setResizing] = useState(false);

    const onResizePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        isDragging.current = true;
        setResizing(true);
        dragStartX.current = event.clientX;
        dragStartWidth.current = collapsed ? COLLAPSED_WIDTH : width;
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const onResizePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (!isDragging.current) {
            return;
        }

        const raw = dragStartWidth.current + (event.clientX - dragStartX.current);

        if (!collapsed) {
            if (raw <= COLLAPSED_WIDTH) {
                discardWidthDraft();
                setCollapsed(true);
                return;
            }

            setWidth(raw, { persist: false });
            return;
        }

        if (raw >= width) {
            setCollapsed(false);
        }
    };

    const endResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (!isDragging.current) {
            return;
        }

        isDragging.current = false;

        if (!collapsed) {
            setWidth(width, { persist: true });
        }

        setResizing(false);
        event.currentTarget.releasePointerCapture?.(event.pointerId);
    };

    return { resizing, onResizePointerDown, onResizePointerMove, endResize };
};
