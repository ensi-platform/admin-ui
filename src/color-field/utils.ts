import { toHexColor } from '@/color-picker';

export type TCommitMode = 'live' | 'settle';

const HEX_BODY = /^[0-9a-fA-F]+$/;
const COMPLETE_CSS = /^(rgb|rgba|hsl|hsla|hsb|hsba)\([^)]+\)$/i;

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
