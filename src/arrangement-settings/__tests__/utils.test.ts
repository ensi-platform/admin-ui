import { describe, expect, it } from 'vitest';

import { orderedItemIds, reorderItemIds, toggleItemVisibility, visibleIdsInOrder } from '../utils';

describe('toggleItemVisibility', () => {
    it('appends a field when it becomes visible', () => {
        expect(toggleItemVisibility(['name'], 'date', true)).toEqual(['name', 'date']);
    });

    it('keeps the order when the field is already visible', () => {
        expect(toggleItemVisibility(['date', 'name'], 'date', true)).toEqual(['date', 'name']);
    });

    it('removes a field when it is hidden', () => {
        expect(toggleItemVisibility(['name', 'date', 'price'], 'date', false)).toEqual(['name', 'price']);
    });
});

describe('orderedItemIds', () => {
    it('puts hidden fields after the visible ones', () => {
        expect(orderedItemIds(['name', 'status', 'date'], ['date', 'name'])).toEqual(['date', 'name', 'status']);
    });
});

describe('visibleIdsInOrder', () => {
    it('keeps checked fields in list order', () => {
        expect(visibleIdsInOrder(['price', 'name', 'date'], ['name', 'date'])).toEqual(['name', 'date']);
    });
});

describe('reorderItemIds', () => {
    it('moves a field before the drop target', () => {
        expect(reorderItemIds(['name', 'date', 'price'], ['price'], 'name', 'before')).toEqual([
            'price',
            'name',
            'date',
        ]);
    });

    it('moves a field after the drop target', () => {
        expect(reorderItemIds(['name', 'date', 'price'], ['name'], 'price', 'after')).toEqual([
            'date',
            'price',
            'name',
        ]);
    });

    it('leaves the order unchanged when the target is the dragged field', () => {
        expect(reorderItemIds(['name', 'date'], ['name'], 'name', 'before')).toEqual(['name', 'date']);
    });
});
