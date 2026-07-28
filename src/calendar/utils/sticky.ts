import { DEFAULT_MONTH_HEIGHT_METRICS } from './date';

/**
 * Offset for month heading to stick to the viewport top while the month scrolls under it.
 * Kontur-style (absolute months → not CSS `position: sticky`).
 */
export const getStickyHeadingOffset = (
    monthTop: number,
    monthHeight: number,
    headingHeight: number = DEFAULT_MONTH_HEIGHT_METRICS.headingHeight
): number => {
    if (monthTop >= 0 || monthHeight <= 0 || headingHeight <= 0) {
        return 0;
    }

    return Math.min(-monthTop, Math.max(0, monthHeight - headingHeight));
};

/** Max month `top` still treated as near the viewport top (Kontur ~52). */
export const HEADING_INTERACTIVE_TOP = 52;

/**
 * Whether month/year selects should be interactive (Kontur sticky/active heading).
 */
export const isMonthHeadingInteractive = (
    monthTop: number,
    monthHeight: number,
    headingHeight: number = DEFAULT_MONTH_HEIGHT_METRICS.headingHeight
): boolean => {
    if (monthHeight <= 0) {
        return false;
    }

    const headingOffset = getStickyHeadingOffset(monthTop, monthHeight, headingHeight);
    if (monthTop > HEADING_INTERACTIVE_TOP) {
        return false;
    }
    if (headingOffset >= monthHeight - headingHeight) {
        return false;
    }

    return true;
};
