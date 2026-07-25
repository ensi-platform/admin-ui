import { describe, expect, it } from 'vitest';

import { clearInputElementValue, toEmptyInputChangeEvent } from '../utils';

describe('input utils', () => {
    it('toEmptyInputChangeEvent falls back when element is null', () => {
        const event = toEmptyInputChangeEvent(null);

        expect(event.target).toEqual({ value: '' });
        expect(event.currentTarget).toEqual({ value: '' });
    });

    it('toEmptyInputChangeEvent uses element when present', () => {
        const el = document.createElement('input');
        el.value = 'x';

        const event = toEmptyInputChangeEvent(el);

        expect(event.target).toBe(el);
        expect(event.currentTarget).toBe(el);
    });

    it('clearInputElementValue is a no-op for null', () => {
        expect(() => clearInputElementValue(null)).not.toThrow();
    });

    it('clearInputElementValue clears native value', () => {
        const el = document.createElement('input');
        el.value = 'hello';

        clearInputElementValue(el);

        expect(el.value).toBe('');
    });
});
