import { describe, expect, it } from 'vitest';

import { isNestedOverlayTarget } from '../utils';

describe('isNestedOverlayTarget', () => {
    it('is true for a listbox inside the target', () => {
        const listbox = document.createElement('div');
        listbox.setAttribute('role', 'listbox');
        const option = document.createElement('div');
        listbox.append(option);

        expect(isNestedOverlayTarget(option)).toBe(true);
    });

    it('is false outside overlays', () => {
        const node = document.createElement('div');

        expect(isNestedOverlayTarget(node)).toBe(false);
    });
});
