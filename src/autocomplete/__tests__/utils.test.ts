import { describe, expect, it } from 'vitest';

import { isInteractiveTarget, toSelectedKey } from '../utils';

describe('autocomplete utils', () => {
    it('toSelectedKey maps empty to null', () => {
        expect(toSelectedKey(undefined)).toBeUndefined();
        expect(toSelectedKey(null)).toBeNull();
        expect(toSelectedKey('')).toBeNull();
        expect(toSelectedKey('msk')).toBe('msk');
        expect(toSelectedKey(1)).toBe(1);
    });

    it('isInteractiveTarget detects button chrome', () => {
        expect(isInteractiveTarget(null)).toBe(false);
        expect(isInteractiveTarget(document.createTextNode('x'))).toBe(false);

        const button = document.createElement('button');
        const span = document.createElement('span');

        button.append(span);
        document.body.append(button);

        expect(isInteractiveTarget(span)).toBe(true);
        expect(isInteractiveTarget(document.createElement('div'))).toBe(false);

        button.remove();
    });
});
