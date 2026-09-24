import { describe, expect, it } from 'vitest';

import {
    CASCADE_MENU_SEARCH_LIMIT,
    filterCascadeMenuItems,
    findActiveCodeByPath,
    findAncestorCodes,
    isNodeInsideCascadeChrome,
    searchCascadeMenu,
    type ICascadeMenuItem,
} from '../utils';

const sample: ICascadeMenuItem[] = [
    {
        text: 'Products',
        code: 'products',
        children: [
            { text: 'Catalog', code: 'products_catalog', link: '/products/catalog' },
            { text: 'Import', code: 'products_import', link: '/products/import' },
        ],
    },
    {
        text: 'Customers',
        code: 'customers',
        children: [
            { text: 'List', code: 'customers_list', link: '/customers/list' },
            {
                text: 'Entities',
                code: 'customers_entities',
                children: [
                    {
                        text: 'Delete request',
                        code: 'customers_delete',
                        link: '/customers/entities/deleting',
                    },
                ],
            },
        ],
    },
    { text: 'Feeds', code: 'feeds', link: '/feeds' },
];

describe('cascade-menu utils', () => {
    it('filters leaves by allowedCodes and drops empty branches', () => {
        const filtered = filterCascadeMenuItems(sample, ['products_catalog', 'feeds']);

        expect(filtered).toHaveLength(2);
        expect(filtered[0].children).toHaveLength(1);
        expect(filtered[0].children?.[0].code).toBe('products_catalog');
        expect(filtered[1].code).toBe('feeds');
    });

    it('finds active code by path', () => {
        expect(findActiveCodeByPath(sample, '/products/catalog')).toBe('products_catalog');
        expect(findActiveCodeByPath(sample, '/feeds')).toBe('feeds');
    });

    it('searches linked leaves by title and ancestor path', () => {
        expect(searchCascadeMenu(sample, '   ')).toEqual([]);
        expect(searchCascadeMenu(sample, 'catalog')).toEqual([
            { code: 'products_catalog', text: 'Catalog', link: '/products/catalog', path: ['Products'] },
        ]);
        expect(searchCascadeMenu(sample, 'PRODUCTS').map(hit => hit.code)).toEqual([
            'products_catalog',
            'products_import',
        ]);
        expect(searchCascadeMenu(sample, 'entities')).toEqual([
            {
                code: 'customers_delete',
                text: 'Delete request',
                link: '/customers/entities/deleting',
                path: ['Customers', 'Entities'],
            },
        ]);
        expect(searchCascadeMenu(sample, 'feeds')).toEqual([
            { code: 'feeds', text: 'Feeds', link: '/feeds', path: [] },
        ]);
        expect(searchCascadeMenu(sample, 'missing')).toEqual([]);
    });

    it('caps search hits', () => {
        const many: ICascadeMenuItem[] = [
            {
                text: 'Root',
                code: 'root',
                children: Array.from({ length: CASCADE_MENU_SEARCH_LIMIT + 3 }, (_, index) => ({
                    text: `Item ${index}`,
                    code: `item_${index}`,
                    link: `/item/${index}`,
                })),
            },
        ];

        expect(searchCascadeMenu(many, 'item')).toHaveLength(CASCADE_MENU_SEARCH_LIMIT);

        const gated: ICascadeMenuItem[] = [
            ...Array.from({ length: CASCADE_MENU_SEARCH_LIMIT - 1 }, (_, index) => ({
                text: `Item ${index}`,
                code: `item_${index}`,
                link: `/item/${index}`,
            })),
            {
                text: 'Item gate',
                code: 'item_gate',
                link: '/item/gate',
                children: [{ text: 'Item nested', code: 'item_nested', link: '/item/nested' }],
            },
        ];

        expect(searchCascadeMenu(gated, 'item').map(hit => hit.code)).not.toContain('item_nested');
    });

    it('finds ancestor codes for a nested leaf', () => {
        expect(findAncestorCodes(sample, 'customers_delete')).toEqual(['customers', 'customers_entities']);
        expect(findAncestorCodes(sample, 'products_catalog')).toEqual(['products']);
        expect(findAncestorCodes(sample, 'feeds')).toEqual([]);
        expect(findAncestorCodes(sample, 'missing')).toEqual([]);
    });

    describe('isNodeInsideCascadeChrome', () => {
        it('returns false for null or undefined node', () => {
            const root = document.createElement('aside');

            expect(isNodeInsideCascadeChrome(null, { root })).toBe(false);
            expect(isNodeInsideCascadeChrome(undefined, { root })).toBe(false);
        });

        it('returns true when node is inside root', () => {
            const root = document.createElement('aside');
            const child = document.createElement('button');
            root.append(child);

            expect(isNodeInsideCascadeChrome(child, { root })).toBe(true);
            expect(isNodeInsideCascadeChrome(root, { root })).toBe(true);
        });

        it('returns true when node is inside context menu', () => {
            const root = document.createElement('aside');
            const contextMenu = document.createElement('div');
            const item = document.createElement('button');
            contextMenu.append(item);

            expect(isNodeInsideCascadeChrome(item, { root, contextMenu })).toBe(true);
        });

        it('returns true when node is inside a flyout', () => {
            const root = document.createElement('aside');
            const flyout = document.createElement('div');
            const item = document.createElement('a');
            flyout.append(item);

            expect(isNodeInsideCascadeChrome(item, { root, flyouts: [null, flyout] })).toBe(true);
        });

        it('returns false when node is outside chrome', () => {
            const root = document.createElement('aside');
            const flyout = document.createElement('div');
            const contextMenu = document.createElement('div');
            const outside = document.createElement('button');

            expect(
                isNodeInsideCascadeChrome(outside, {
                    root,
                    flyouts: [flyout, null],
                    contextMenu,
                })
            ).toBe(false);
        });
    });
});
