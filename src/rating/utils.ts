const ROUND = 1000;

const roundToStep = (value: number, step: number) => Math.round(value / step) * step;

const tidy = (value: number) => Math.round(value * ROUND) / ROUND;

/** How many stars span `minValue`..`maxValue` (one star per unit). */
export const ratingStarCount = (minValue: number, maxValue: number) => Math.max(0, Math.round(maxValue - minValue));

/** Step values that land on star `starIndex` (1-based), excluding the star's start. */
export const starZoneValues = (starIndex: number, minValue: number, step: number): number[] => {
    const safeStep = step > 0 ? step : 1;
    const start = minValue + (starIndex - 1);
    const end = start + 1;
    const values: number[] = [];

    for (let value = tidy(start + safeStep); value <= end + safeStep / ROUND; value = tidy(value + safeStep)) {
        const rounded = tidy(roundToStep(value, safeStep));

        if (rounded > start && rounded <= end) values.push(rounded);
    }

    return values;
};

/** Fill of one star for a display value: 0, 0.5, or 1. */
export const starFill = (starIndex: number, minValue: number, displayValue: number) => {
    const amount = displayValue - (minValue + (starIndex - 1));

    if (amount >= 1) return 1;
    if (amount <= 0) return 0;

    return Math.round(amount * 2) / 2;
};

/** Click on the current zone returns `minValue`. A drag keeps the zone. */
export const nextRatingValue = (current: number, zone: number, dragged: boolean, minValue: number) =>
    !dragged && Math.abs(current - zone) < 1e-6 ? minValue : zone;

/** `{value}` and `{max}` in `template`, formatted for `locale`. */
export const formatRatingValue = (template: string, value: number, max: number, locale: string) => {
    const format = (next: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(next);

    return template.replaceAll('{value}', format(value)).replaceAll('{max}', format(max));
};
