import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useItemContextMenu } from '../hooks/useItemContextMenu';
import { type ICascadeMenuItem } from '../utils';

const roots: ICascadeMenuItem[] = [
    { code: 'products', text: 'Products', children: [{ code: 'catalog', text: 'Catalog', link: '/catalog' }] },
];

const baseOptions = {
    roots,
    isPinned: () => false,
    canPin: () => true,
    togglePin: vi.fn(),
    onBeforeOpen: vi.fn(),
};

describe('useItemContextMenu', () => {
    it('opens menu on item context menu', () => {
        const { result } = renderHook(() =>
            useItemContextMenu({
                ...baseOptions,
                openPath: ['products'],
            })
        );

        act(() => {
            result.current.onItemContextMenu({
                code: 'catalog',
                x: 40,
                y: 80,
                link: '/catalog',
                pinEnabled: true,
            });
        });

        expect(result.current.open).toBe(true);
        expect(result.current.menu).toMatchObject({
            code: 'catalog',
            x: 40,
            y: 80,
            link: '/catalog',
            pinEnabled: true,
            pinned: false,
            canTogglePin: true,
        });
    });

    it('closes menu when openPath changes', () => {
        const { result, rerender } = renderHook(
            ({ openPath }) =>
                useItemContextMenu({
                    ...baseOptions,
                    openPath,
                }),
            { initialProps: { openPath: ['products'] } }
        );

        act(() => {
            result.current.onItemContextMenu({
                code: 'catalog',
                x: 40,
                y: 80,
                pinEnabled: true,
            });
        });

        expect(result.current.open).toBe(true);

        rerender({ openPath: ['orders'] });

        expect(result.current.open).toBe(false);
        expect(result.current.menu).toBeNull();
    });

    it('can open again after close', () => {
        const { result } = renderHook(() =>
            useItemContextMenu({
                ...baseOptions,
                openPath: ['products'],
            })
        );

        act(() => {
            result.current.onItemContextMenu({
                code: 'catalog',
                x: 40,
                y: 80,
                pinEnabled: true,
            });
        });

        act(() => {
            result.current.close();
        });

        expect(result.current.open).toBe(false);

        act(() => {
            result.current.onItemContextMenu({
                code: 'catalog',
                x: 50,
                y: 90,
                pinEnabled: true,
            });
        });

        expect(result.current.open).toBe(true);
        expect(result.current.menu?.x).toBe(50);
        expect(result.current.menu?.y).toBe(90);
    });

    it('does not toggle pin for unpinned root code', () => {
        const togglePin = vi.fn();
        const { result } = renderHook(() =>
            useItemContextMenu({
                ...baseOptions,
                togglePin,
                openPath: ['products'],
            })
        );

        act(() => {
            result.current.onTogglePin('products');
        });

        expect(togglePin).not.toHaveBeenCalled();
    });
});
