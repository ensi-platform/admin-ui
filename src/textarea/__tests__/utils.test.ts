import { describe, expect, it } from 'vitest';

import { clearTextAreaElementValue, toEmptyTextAreaChangeEvent } from '../utils';

describe('textarea utils', () => {
    it('toEmptyTextAreaChangeEvent falls back when element is null', () => {
        const event = toEmptyTextAreaChangeEvent(null);

        expect(event.target).toEqual({ value: '' });
        expect(event.currentTarget).toEqual({ value: '' });
    });

    it('toEmptyTextAreaChangeEvent uses element when present', () => {
        const el = document.createElement('textarea');
        el.value = 'x';

        const event = toEmptyTextAreaChangeEvent(el);

        expect(event.target).toBe(el);
        expect(event.currentTarget).toBe(el);
    });

    it('clearTextAreaElementValue is a no-op for null', () => {
        expect(() => clearTextAreaElementValue(null)).not.toThrow();
    });

    it('clearTextAreaElementValue clears native value', () => {
        const el = document.createElement('textarea');
        el.value = 'hello';

        clearTextAreaElementValue(el);

        expect(el.value).toBe('');
    });
});
