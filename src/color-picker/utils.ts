import { type Color, parseColor } from 'react-aria-components';

/** Draft shown in the panel when the value is empty. Never emitted. */
export const IDLE_DRAFT = '#808080';

/** HSB color for the RAC picker, so hue survives gray values. */
export const toDraftColor = (hex: string): Color => parseColor(hex).toFormat('hsb');

export const hexOf = (color: Color) => color.toString('hex').toLowerCase();

/**
 * Gray hex has no hue. Keep a hue the field stored across a remount.
 * Chromatic colors already encode hue, so the stored value is ignored.
 */
export const withStoredHue = (color: Color, hue: number | undefined): Color => {
    if (hue == null || color.getChannelValue('saturation') !== 0) return color;

    if (color.getChannelValue('hue') === hue) return color;

    return color.withChannelValue('hue', hue);
};

const HEX_BODY = /^[0-9a-fA-F]+$/;

const readHex = (candidate: string): string | null => {
    try {
        return parseColor(candidate).toString('hex').toLowerCase();
    } catch {
        return null;
    }
};

/** Canonical `#rrggbb`, or `null` when the string is not a color. */
export const toHexColor = (value: string): string | null => {
    const trimmed = value.trim();

    if (!trimmed) return null;

    if (HEX_BODY.test(trimmed)) return readHex(`#${trimmed}`);

    return readHex(trimmed);
};

/** Preset list as unique `#rrggbb`. Drops values that are not colors. */
export const validPresetHexes = (presets: readonly string[] | undefined): string[] => {
    if (!presets?.length) return [];

    const seen = new Set<string>();

    return presets.flatMap(preset => {
        const hex = toHexColor(preset);

        if (!hex || seen.has(hex)) return [];

        seen.add(hex);

        return [hex];
    });
};
