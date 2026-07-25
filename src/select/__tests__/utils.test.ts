import { describe, expect, it } from 'vitest';

import { isInteractiveTarget, toSelectedKey } from '../utils';

describe('select utils', () => {
    it('toSelectedKey', () => {
        expect(toSelectedKey(undefined)).toBeUndefined();
        expect(toSelectedKey(null)).toBeNull();
        expect(toSelectedKey('')).toBeNull();
        expect(toSelectedKey('draft')).toBe('draft');
    });

    it('isInteractiveTarget', () => {
        expect(isInteractiveTarget(null)).toBe(false);
        expect(isInteractiveTarget(document.createTextNode('x'))).toBe(false);

        const button = document.createElement('button');
        const child = document.createElement('span');
        button.appendChild(child);
        document.body.appendChild(button);

        expect(isInteractiveTarget(child)).toBe(true);
        expect(isInteractiveTarget(document.createElement('div'))).toBe(false);

        button.remove();
    });
});
