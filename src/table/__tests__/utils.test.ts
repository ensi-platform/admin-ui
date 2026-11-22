import { describe, expect, it } from 'vitest';

import { getNextSortDirection, getPageItems, getPinOffsets, getPinStuckEdges, isNestedOverlayTarget } from '../utils';

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

describe('getPinOffsets', () => {
    it('sums start and end pin offsets and marks the outer seam', () => {
        expect(
            getPinOffsets({
                columns: [
                    { cellIndex: 0, pin: 'start', width: 40 },
                    { cellIndex: 1, pin: 'start', width: 120 },
                    { cellIndex: 2, width: 80 },
                    { cellIndex: 4, pin: 'end', width: 36 },
                    { cellIndex: 3, pin: 'end', width: 48 },
                ],
                rows: [],
                stickyHeaderHeight: 0,
            })
        ).toEqual({
            columns: [
                { index: 0, edge: 'start', offset: 0, seam: false },
                { index: 1, edge: 'start', offset: 40, seam: true },
                { index: 3, edge: 'end', offset: 36, seam: true },
                { index: 4, edge: 'end', offset: 0, seam: false },
            ],
            rows: [],
        });
    });

    it('places top pin rows under the sticky header', () => {
        expect(
            getPinOffsets({
                columns: [],
                rows: [
                    { pin: 'top', height: 32 },
                    { pin: 'top', height: 28 },
                    { height: 20 },
                    { pin: 'bottom', height: 24 },
                ],
                stickyHeaderHeight: 36,
            })
        ).toEqual({
            columns: [],
            rows: [
                { index: 0, edge: 'top', offset: 35, seam: false },
                { index: 1, edge: 'top', offset: 66, seam: true },
                { index: 3, edge: 'bottom', offset: 0, seam: true },
            ],
        });
    });

    it('keeps the first top pin at 0 without a sticky header', () => {
        expect(
            getPinOffsets({
                columns: [],
                rows: [
                    { pin: 'top', height: 32 },
                    { pin: 'top', height: 28 },
                ],
                stickyHeaderHeight: 0,
            })
        ).toEqual({
            columns: [],
            rows: [
                { index: 0, edge: 'top', offset: 0, seam: false },
                { index: 1, edge: 'top', offset: 32, seam: true },
            ],
        });
    });

    it('sums bottom pin offsets from the scroll end', () => {
        expect(
            getPinOffsets({
                columns: [],
                rows: [
                    { pin: 'bottom', height: 20 },
                    { pin: 'bottom', height: 30 },
                ],
                stickyHeaderHeight: 44,
            })
        ).toEqual({
            columns: [],
            rows: [
                { index: 0, edge: 'bottom', offset: 30, seam: true },
                { index: 1, edge: 'bottom', offset: 0, seam: false },
            ],
        });
    });
});

describe('getPinStuckEdges', () => {
    const scrollport = {
        scrollWidth: 300,
        scrollHeight: 300,
        clientWidth: 100,
        clientHeight: 100,
    };

    it.each([
        {
            name: 'no overflow',
            scroll: {
                scrollLeft: 0,
                scrollTop: 0,
                scrollWidth: 100,
                scrollHeight: 100,
                clientWidth: 100,
                clientHeight: 100,
            },
            expected: [],
        },
        {
            name: 'ltr at rest',
            scroll: { ...scrollport, scrollLeft: 0, scrollTop: 0, rtlScroll: 'ltr' as const },
            expected: ['end', 'bottom'],
        },
        {
            name: 'ltr inside the 1px threshold',
            scroll: { ...scrollport, scrollLeft: 1, scrollTop: 1, rtlScroll: 'ltr' as const },
            expected: ['end', 'bottom'],
        },
        {
            name: 'ltr past the threshold',
            scroll: { ...scrollport, scrollLeft: 2, scrollTop: 2, rtlScroll: 'ltr' as const },
            expected: ['start', 'end', 'top', 'bottom'],
        },
        {
            name: 'ltr one pixel short of the far edge',
            scroll: { ...scrollport, scrollLeft: 199, scrollTop: 199, rtlScroll: 'ltr' as const },
            expected: ['start', 'top'],
        },
        {
            name: 'ltr at the far edge',
            scroll: { ...scrollport, scrollLeft: 200, scrollTop: 200, rtlScroll: 'ltr' as const },
            expected: ['start', 'top'],
        },
        {
            name: 'rtl negative at the inline start',
            scroll: { ...scrollport, scrollLeft: 0, scrollTop: 0, rtlScroll: 'negative' as const },
            expected: ['start', 'bottom'],
        },
        {
            name: 'rtl negative at the physical left',
            scroll: { ...scrollport, scrollLeft: -200, scrollTop: 0, rtlScroll: 'negative' as const },
            expected: ['end', 'bottom'],
        },
        {
            name: 'rtl positive-descending at the inline start',
            scroll: { ...scrollport, scrollLeft: 0, scrollTop: 0, rtlScroll: 'positive-descending' as const },
            expected: ['start', 'bottom'],
        },
        {
            name: 'rtl positive-descending at the physical left',
            scroll: { ...scrollport, scrollLeft: 200, scrollTop: 0, rtlScroll: 'positive-descending' as const },
            expected: ['end', 'bottom'],
        },
        {
            name: 'rtl positive-ascending at the physical left',
            scroll: { ...scrollport, scrollLeft: 0, scrollTop: 0, rtlScroll: 'positive-ascending' as const },
            expected: ['end', 'bottom'],
        },
        {
            name: 'rtl positive-ascending at the physical right',
            scroll: { ...scrollport, scrollLeft: 200, scrollTop: 200, rtlScroll: 'positive-ascending' as const },
            expected: ['start', 'top'],
        },
    ])('reports a pin edge as stuck only after scroll leaves its rest position ($name)', ({ scroll, expected }) => {
        expect(getPinStuckEdges(scroll)).toEqual(expected);
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
