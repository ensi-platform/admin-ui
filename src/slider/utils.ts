export const sliderTicks = (min: number, max: number, step: number) => {
    if (!(step > 0) || max < min) return [];

    if (max === min) return [{ value: min, offset: '0%' }];

    const count = Math.round((max - min) / step) + 1;

    if (count > 49) return [];

    return Array.from({ length: count }, (_, index) => {
        const value = min + index * step;
        const offset = ((value - min) / (max - min)) * 100;

        return { value, offset: `${offset}%` };
    });
};
