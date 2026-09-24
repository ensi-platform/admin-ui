import { describe, expect, it } from 'vitest';

import { getNextSortDirection, isNestedOverlayTarget } from '../utils';

describe('getNextSortDirection', () => {
    it('cycles none → asc → desc → none', () => {
        expect(getNextSortDirection(undefined)).toBe('asc');
        expect(getNextSortDirection('asc')).toBe('desc');
        expect(getNextSortDirection('desc')).toBeUndefined();
    });
});

describe('isNestedOverlayTarget', () => {
    it('treats a click inside listbox or dialog as a nested overlay', () => {
        const listbox = document.createElement('div');
        listbox.setAttribute('role', 'listbox');
        const option = document.createElement('div');
        listbox.append(option);
        document.body.append(listbox);

        const dialog = document.createElement('div');
        dialog.setAttribute('role', 'dialog');
        const calendar = document.createElement('button');
        dialog.append(calendar);
        document.body.append(dialog);

        const page = document.createElement('div');
        document.body.append(page);

        expect(isNestedOverlayTarget(option)).toBe(true);
        expect(isNestedOverlayTarget(calendar)).toBe(true);
        expect(isNestedOverlayTarget(page)).toBe(false);

        listbox.remove();
        dialog.remove();
        page.remove();
    });
});
