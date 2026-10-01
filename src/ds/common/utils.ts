/** Pixels in 1rem at the html root. */
const REM_PX = 16;

export const toCssSize = (value: number | string | undefined): string | undefined => {
    if (value === undefined) {
        return undefined;
    }

    return typeof value === 'number' ? `${value / REM_PX}rem` : value;
};
