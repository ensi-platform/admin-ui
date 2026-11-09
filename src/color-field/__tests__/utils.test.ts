import { describe, expect, it } from 'vitest';

import { commitHexInput, describeColorValue } from '../utils';

describe('color field color strings', () => {
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
});
