import { type MouseEvent as ReactMouseEvent, useCallback, useRef, useState } from 'react';

import {
    getMousePosition,
    getRectangle,
    isInsideRectangle,
    isInsideTriangle,
    type ICoordinates,
    type ITriangle,
} from './hoverAim';

export interface IHoverAnchor {
    top: number;
    left: number;
}

/** Open flyout layer (folder code + fixed position at chevron). */
export interface IHoverLayer {
    code: string;
    anchor: IHoverAnchor;
}

/** Pending expand / collapse / trim payload. */
export interface IHoverPendingItem {
    /** Folder code; omit to collapse (unless trimTo set). */
    code?: string;
    /** Depth in openPath (0 = L0). */
    level?: number;
    /** Trim layers to this length (leaf enter). */
    trimTo?: number;
    /** Anchor element for positioning. */
    anchorEl?: HTMLElement | null;
    /** Current outermost submenu (aim target). */
    submenu?: HTMLElement | null;
    /** Height used for aim triangle. */
    menuHeight?: number;
    /** Skip dwell on same-level switch when not aiming (cross-source). */
    preferImmediate?: boolean;
}

/** Leaf hover payload. */
export interface IHoverLeafEnter {
    level: number;
    submenu?: HTMLElement | null;
    menuHeight?: number;
}

export const HOVER_DELAY_MS = 200;
/** Short dwell for sibling skim without aim — anti-flicker, still snappy. */
export const HOVER_DWELL_MS = 75;
/** Grace period after leave to re-enter menu before flyouts collapse. */
export const LEAVE_CLOSE_MS = 400;
const MOUSE_HISTORY_SIZE = 3;

const anchorFromEl = (el: HTMLElement): IHoverAnchor => {
    const rect = el.getBoundingClientRect();

    return { top: rect.top, left: rect.right };
};

/** Amazon-style aim hover for cascade flyouts. */
export const useHoverMenu = () => {
    const [layers, setLayers] = useState<IHoverLayer[]>([]);

    const mouseHistoryRef = useRef<ICoordinates[]>([]);
    const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingItemRef = useRef<IHoverPendingItem | null>(null);
    const layersRef = useRef(layers);
    layersRef.current = layers;

    const clearPending = useCallback(() => {
        if (pendingTimerRef.current) {
            clearTimeout(pendingTimerRef.current);
        }

        pendingTimerRef.current = null;
        pendingItemRef.current = null;
    }, []);

    const applyPending = useCallback(() => {
        const pending = pendingItemRef.current!;

        if (pending.trimTo !== undefined) {
            setLayers(prev => prev.slice(0, pending.trimTo));
            mouseHistoryRef.current = [];
            clearPending();
            return;
        }

        if (!pending.code) {
            setLayers([]);
            mouseHistoryRef.current = [];
            clearPending();
            return;
        }

        if (pending.level === undefined || !pending.anchorEl) {
            clearPending();
            return;
        }

        const layer: IHoverLayer = {
            code: pending.code,
            anchor: anchorFromEl(pending.anchorEl),
        };

        setLayers(prev => [...prev.slice(0, pending.level), layer]);
        mouseHistoryRef.current = [];
        clearPending();
    }, [clearPending]);

    const checkAim = useCallback((submenu?: HTMLElement | null, menuHeight?: number) => {
        if (mouseHistoryRef.current.length < 2 || !submenu || !menuHeight) {
            return false;
        }

        const currentPosition = mouseHistoryRef.current[mouseHistoryRef.current.length - 1];
        const prevPosition = mouseHistoryRef.current[0];
        const submenuBox = getRectangle(submenu);

        if (!submenuBox) {
            return false;
        }

        if (isInsideRectangle(submenuBox, prevPosition)) {
            return false;
        }

        const triangle: ITriangle = {
            A: prevPosition,
            B: submenuBox.topLeft,
            C: { x: submenuBox.topLeft.x, y: submenuBox.topLeft.y + menuHeight },
        };

        return isInsideTriangle(triangle, currentPosition);
    }, []);

    const onFolderEnter = useCallback(
        (payload: IHoverPendingItem) => {
            const { current } = layersRef;

            if (payload.level !== undefined && current[payload.level]?.code === payload.code) {
                clearPending();
                return;
            }

            clearPending();
            pendingItemRef.current = payload;

            const isSameLevelSwitch = payload.level !== undefined && payload.level < current.length;

            // First open or expand deeper — immediate; sibling skim — dwell / aim.
            if (!isSameLevelSwitch) {
                applyPending();
                return;
            }

            const aiming = checkAim(payload.submenu, payload.menuHeight);

            if (!aiming && payload.preferImmediate) {
                applyPending();
                return;
            }

            const delayMs = aiming ? HOVER_DELAY_MS : HOVER_DWELL_MS;
            pendingTimerRef.current = setTimeout(() => applyPending(), delayMs);
        },
        [applyPending, checkAim, clearPending]
    );

    const onLeafEnter = useCallback(
        ({ level, submenu, menuHeight }: IHoverLeafEnter) => {
            if (layersRef.current.length <= level) {
                return;
            }

            clearPending();
            pendingItemRef.current = { trimTo: level, submenu, menuHeight };

            if (!checkAim(submenu, menuHeight)) {
                applyPending();
                return;
            }

            pendingTimerRef.current = setTimeout(() => applyPending(), HOVER_DELAY_MS);
        },
        [applyPending, checkAim, clearPending]
    );

    const onFolderLeave = useCallback(() => {
        clearPending();
        pendingItemRef.current = {};
        pendingTimerRef.current = setTimeout(() => applyPending(), LEAVE_CLOSE_MS);
    }, [applyPending, clearPending]);

    const cancelLeave = useCallback(() => {
        clearPending();
    }, [clearPending]);

    const collapse = useCallback(() => {
        clearPending();
        layersRef.current = [];
        setLayers([]);
        mouseHistoryRef.current = [];
    }, [clearPending]);

    const onMouseMove = useCallback((event: ReactMouseEvent) => {
        if (layersRef.current.length === 0) {
            return;
        }

        const pos = getMousePosition(event.nativeEvent);
        mouseHistoryRef.current.push(pos);

        if (mouseHistoryRef.current.length > MOUSE_HISTORY_SIZE) {
            mouseHistoryRef.current.shift();
        }
    }, []);

    const openPath = layers.map(layer => layer.code);

    return {
        layers,
        openPath,
        onMouseMove,
        onFolderEnter,
        onLeafEnter,
        onFolderLeave,
        cancelLeave,
        collapse,
    };
};
