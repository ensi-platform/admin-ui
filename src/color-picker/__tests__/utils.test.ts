import { describe, expect, it } from 'vitest';

import { commitHexInput, describeColorValue, toHexColor, validPresetHexes } from '../utils';

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

    it('commits six digits while typing and expands three digits only when the edit settles', () => {
        expect(commitHexInput('#abc', 'live')).toBeNull();
        expect(commitHexInput('#ab', 'live')).toBeNull();
        expect(commitHexInput('abcdef', 'live')).toBe('#abcdef');
        expect(commitHexInput('#ABCDEF', 'live')).toBe('#abcdef');
        expect(commitHexInput('#abc', 'settle')).toBe('#aabbcc');
        expect(commitHexInput('', 'live')).toBeNull();
        expect(commitHexInput('', 'settle')).toBe('');
        expect(commitHexInput('rgb(0, 128, 0)', 'live')).toBe('#008000');
        expect(commitHexInput('red', 'settle')).toBeNull();
    });

    it('shows a normalizable stored value and treats an unknown string as empty', () => {
        expect(describeColorValue('#FFF')).toEqual({ text: '#ffffff', hex: '#ffffff', unrecognized: false });
        expect(describeColorValue('')).toEqual({ text: '', hex: null, unrecognized: false });
        expect(describeColorValue('red')).toEqual({ text: '', hex: null, unrecognized: true });
    });

    it('drops presets that are not colors and keeps the first copy of a hex', () => {
        expect(validPresetHexes(undefined)).toEqual([]);
        expect(validPresetHexes(['#ff0000', 'nope', '#FF0000', 'rgb(0, 0, 255)'])).toEqual(['#ff0000', '#0000ff']);
    });
});
