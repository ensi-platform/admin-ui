import { type Color, parseColor } from 'react-aria-components';

/** Draft shown in the panel when the field is empty. Never emitted. */
export const IDLE_DRAFT = '#808080';

/** HSB color for the RAC picker, so hue survives gray values. */
export const toDraftColor = (hex: string): Color => parseColor(hex).toFormat('hsb');

const HEX_BODY = /^[0-9a-fA-F]+$/;
const COMPLETE_CSS = /^(rgb|rgba|hsl|hsla|hsb|hsba)\([^)]+\)$/i;

export type TCommitMode = 'live' | 'settle';

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

/**
 * Hex to publish.
 * `''` clears on settle. `null` means "keep typing" or "not a color".
 * Three-digit hex expands only on settle, so `#abcdef` can be typed.
 */
export const commitHexInput = (raw: string, mode: TCommitMode): string | null => {
    const trimmed = raw.trim();

    if (!trimmed) return mode === 'settle' ? '' : null;

    const body = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;

    if (HEX_BODY.test(body)) {
        if (body.length === 6) return `#${body.toLowerCase()}`;

        if (mode === 'settle' && body.length === 3) {
            const [red, green, blue] = body.toLowerCase();

            return `#${red}${red}${green}${green}${blue}${blue}`;
        }

        return null;
    }

    const parsed = toHexColor(trimmed);

    if (!parsed) return null;

    if (mode === 'live' && !COMPLETE_CSS.test(trimmed)) return null;

    return parsed;
};

/** How a stored string should look in the field before the user edits it. */
export const describeColorValue = (
    value: string | null | undefined
): { text: string; hex: string | null; unrecognized: boolean } => {
    if (value == null || value.trim() === '') {
        return { text: '', hex: null, unrecognized: false };
    }

    const hex = toHexColor(value);

    if (!hex) return { text: '', hex: null, unrecognized: true };

    return { text: hex, hex, unrecognized: false };
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
