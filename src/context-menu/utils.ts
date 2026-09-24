const VIEWPORT_GAP = 8;

/** Keeps the menu inside the viewport. Overflow to the right shifts left; overflow below flips above the anchor. */
export const placeContextMenu = (
    x: number,
    y: number,
    width: number,
    height: number,
    viewport: { width: number; height: number }
): { left: number; top: number } => {
    let left = x;
    let top = y;

    if (left + width > viewport.width - VIEWPORT_GAP) {
        left = Math.max(VIEWPORT_GAP, viewport.width - width - VIEWPORT_GAP);
    }

    if (left < VIEWPORT_GAP) left = VIEWPORT_GAP;

    if (top + height > viewport.height - VIEWPORT_GAP) {
        top = Math.max(VIEWPORT_GAP, y - height);
    }

    if (top < VIEWPORT_GAP) top = VIEWPORT_GAP;

    return { left, top };
};
