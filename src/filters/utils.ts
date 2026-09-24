/** Column span for a filter cell. Unknown kinds use `default`, then 1. Clamped to `1…columns`. */
export const resolveSpan = (kind: string | undefined, span: Record<string, number> | undefined, columns: number) => {
    const safeColumns = Number.isFinite(columns) && columns >= 1 ? Math.floor(columns) : 1;
    const map = span ?? {};
    const raw = kind != null && Object.prototype.hasOwnProperty.call(map, kind) ? map[kind] : map.default;
    const value = typeof raw === 'number' && Number.isFinite(raw) ? Math.floor(raw) : 1;

    return Math.min(Math.max(value, 1), safeColumns);
};

/** Grid column count. Invalid values become 4; zero and fractions collapse to at least 1. */
export const resolveColumns = (columns: number | undefined) => {
    if (typeof columns !== 'number' || !Number.isFinite(columns)) {
        return 4;
    }

    return Math.max(1, Math.floor(columns));
};
