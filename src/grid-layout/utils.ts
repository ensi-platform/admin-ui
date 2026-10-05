import { type TGridLayoutCol, type TGridLayoutTrack } from './types';

/** Equal tracks, or an explicit list (`2` → two `1fr`, `2` inside a list → `2fr`). */
export const toGridLayoutTemplate = (cols: number | TGridLayoutTrack[]): string => {
    if (typeof cols === 'number') {
        return `repeat(${cols}, minmax(0, 1fr))`;
    }

    return cols.map(track => (typeof track === 'number' ? `${track}fr` : track)).join(' ');
};

/** Item span. `full` crosses every column. */
export const toGridLayoutColumn = (col?: TGridLayoutCol): string => {
    if (col === 'full') {
        return '1 / -1';
    }

    if (typeof col === 'number') {
        return `span ${col}`;
    }

    return 'auto';
};
