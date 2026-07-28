import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useTableRowSelection } from '../hooks/useTableRowSelection';

describe('useTableRowSelection', () => {
    it('toggles a row id on and off', () => {
        const { result } = renderHook(() => useTableRowSelection([1, 2, 3]));

        act(() => {
            result.current.toggle(2);
        });

        expect(result.current.isSelected(2)).toBe(true);
        expect(result.current.hasSelected).toBe(true);
        expect(result.current.isIndeterminate).toBe(true);
        expect(result.current.isAllSelected).toBe(false);

        act(() => {
            result.current.toggle(2);
        });

        expect(result.current.isSelected(2)).toBe(false);
        expect(result.current.hasSelected).toBe(false);
    });

    it('selects and clears all on page', () => {
        const { result } = renderHook(() => useTableRowSelection(['a', 'b']));

        act(() => {
            result.current.setAllOnPage(true);
        });

        expect(result.current.isAllSelected).toBe(true);
        expect(result.current.isIndeterminate).toBe(false);

        act(() => {
            result.current.setAllOnPage(false);
        });

        expect(result.current.hasSelected).toBe(false);
    });

    it('selectAll toggles page selection', () => {
        const { result } = renderHook(() => useTableRowSelection([1, 2]));

        act(() => {
            result.current.selectAll();
        });
        expect(result.current.isAllSelected).toBe(true);

        act(() => {
            result.current.selectAll();
        });
        expect(result.current.hasSelected).toBe(false);
    });

    it('clears all selected ids', () => {
        const { result } = renderHook(() => useTableRowSelection([1, 2], { initialSelected: [1, 2] }));

        expect(result.current.isAllSelected).toBe(true);

        act(() => {
            result.current.clearAll();
        });

        expect(result.current.hasSelected).toBe(false);
        expect(result.current.selected.size).toBe(0);
    });

    it('supports controlled selection updates', () => {
        const onSelectedChange = vi.fn();
        let selected = new Set<number>([1]);

        const { result, rerender } = renderHook(
            ({ selectedIds }) =>
                useTableRowSelection([1, 2, 3], {
                    selected: selectedIds,
                    onSelectedChange: next => {
                        selected = next;
                        onSelectedChange(next);
                    },
                }),
            { initialProps: { selectedIds: selected } }
        );

        act(() => {
            result.current.toggle(2);
        });

        expect(onSelectedChange).toHaveBeenCalledTimes(1);
        expect([...onSelectedChange.mock.calls[0][0]]).toEqual([1, 2]);

        rerender({ selectedIds: selected });

        act(() => {
            result.current.clearAll();
        });

        expect(onSelectedChange).toHaveBeenCalledTimes(2);
        expect(onSelectedChange.mock.calls[1][0].size).toBe(0);

        selected = new Set([1]);
        rerender({ selectedIds: selected });

        act(() => {
            result.current.setSelected(new Set([3]));
        });

        expect(onSelectedChange).toHaveBeenCalledTimes(3);
        expect([...onSelectedChange.mock.calls[2][0]]).toEqual([3]);
    });
});
