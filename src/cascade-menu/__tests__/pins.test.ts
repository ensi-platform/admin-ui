import { describe, expect, it } from 'vitest';

import { DEFAULT_MAX_PINNED, type ICascadeMenuItem, resolvePinnedItems, togglePinnedCode } from '../utils';

const sample: ICascadeMenuItem[] = [
    {
        text: 'Products',
        code: 'products',
        children: [
            { text: 'Catalog', code: 'products_catalog', link: '/products/catalog' },
            {
                text: 'Empty branch',
                code: 'products_empty',
                children: [],
            },
        ],
    },
    { text: 'Feeds', code: 'feeds', link: '/feeds' },
];

describe('cascade-menu pins', () => {
    it('resolvePinnedItems keeps order and drops missing / empty folders / L0 roots', () => {
        const resolved = resolvePinnedItems(sample, [
            'missing',
            'feeds',
            'products_empty',
            'products',
            'products_catalog',
        ]);

        expect(resolved.map(item => item.code)).toEqual(['products_catalog']);
    });

    it('togglePinnedCode pins, ignores dupes, respects max, unpins', () => {
        expect(togglePinnedCode([], 'feeds', DEFAULT_MAX_PINNED)).toEqual(['feeds']);
        expect(togglePinnedCode(['feeds'], 'feeds', DEFAULT_MAX_PINNED)).toEqual([]);

        const full = Array.from({ length: DEFAULT_MAX_PINNED }, (_, i) => `c${i}`);
        expect(togglePinnedCode(full, 'extra', DEFAULT_MAX_PINNED)).toEqual(full);
        expect(togglePinnedCode(['a'], 'b', 1)).toEqual(['a']);
    });
});
