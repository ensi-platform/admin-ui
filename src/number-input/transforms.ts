import { type INumberTransform } from './types';

/** Build a store ↔ view scale transform (e.g. `100` for kopecks ↔ rubles). */
export const createScaleTransform = (factor: number): INumberTransform<number> => ({
    format: store => (store == null || Number.isNaN(store) ? null : store / factor),
    parse: view => (view == null || Number.isNaN(view) ? null : Math.round(view * factor)),
});

/** Kopecks (store) ↔ rubles (view). */
export const kopecksTransform = createScaleTransform(100);
