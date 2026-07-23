import { type INumberTransform } from './types.js';

/** Масштаб store ↔ view (например 100: копейки ↔ рубли). */
export const createScaleTransform = (factor: number): INumberTransform<number> => ({
    format: store => (store == null || Number.isNaN(store) ? null : store / factor),
    parse: view => (view == null || Number.isNaN(view) ? null : Math.round(view * factor)),
});

/** Копейки (store) ↔ рубли (view). */
export const kopecksTransform = createScaleTransform(100);
