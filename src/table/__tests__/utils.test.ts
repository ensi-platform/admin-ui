import { describe, expect, it } from 'vitest';

import { getNextSortDirection, getPageItems, isNestedOverlayTarget } from '../utils';

describe('getNextSortDirection', () => {
    it('cycles none → asc → desc → none', () => {
        expect(getNextSortDirection(undefined)).toBe('asc');
        expect(getNextSortDirection('asc')).toBe('desc');
        expect(getNextSortDirection('desc')).toBeUndefined();
    });
});

describe('getPageItems', () => {
    it('returns empty when pageCount is below 1', () => {
        expect(getPageItems(1, 0)).toEqual([]);
    });

    it('lists all pages when count fits the window', () => {
        expect(getPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('shows start window with trailing ellipsis', () => {
        expect(getPageItems(1, 20)).toEqual([1, 2, 3, 4, 'ellipsis', 20]);
    });

    it('shows center window with ellipsis on both sides', () => {
        expect(getPageItems(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
    });

    it('shows end window with leading ellipsis', () => {
        expect(getPageItems(20, 20)).toEqual([1, 'ellipsis', 17, 18, 19, 20]);
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
