import { describe, expect, it } from 'vitest';

import { toHexColor, validPresetHexes } from '../utils';

describe('color picker color strings', () => {
    it.each([
        ['#AABBCC', '#aabbcc'],
        ['#aabbcc', '#aabbcc'],
        ['aabbcc', '#aabbcc'],
        ['#FFF', '#ffffff'],
        ['rgb(255, 0, 0)', '#ff0000'],
        ['hsl(120, 100%, 50%)', '#00ff00'],
    ])('normalizes %s to %s', (input, hex) => {
        expect(toHexColor(input)).toBe(hex);
    });

    it.each(['', '   ', 'red', '#gg0000', 'nope'])('rejects %s', input => {
        expect(toHexColor(input)).toBeNull();
    });

    it('drops presets that are not colors and keeps the first copy of a hex', () => {
        expect(validPresetHexes(undefined)).toEqual([]);
        expect(validPresetHexes(['#ff0000', 'nope', '#FF0000', 'rgb(0, 0, 255)'])).toEqual(['#ff0000', '#0000ff']);
    });
});
