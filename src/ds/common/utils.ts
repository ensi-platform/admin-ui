export const toCssSize = (value: number | string | undefined): string | undefined => {
    if (value === undefined) {
        return undefined;
    }

    return typeof value === 'number' ? `${value}px` : value;
};
