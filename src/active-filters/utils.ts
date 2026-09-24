const NESTED_OVERLAY_SELECTOR = '[role="listbox"], [role="dialog"]';

/** True when an outside click landed in a nested overlay (select list, checklist). */
export const isNestedOverlayTarget = (element: Element): boolean => Boolean(element.closest(NESTED_OVERLAY_SELECTOR));
