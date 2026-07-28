import { useCallback, useMemo, useState } from 'react';

/** Row id type. */
export type TTableRowId = string | number;

export interface IUseTableRowSelectionOptions<TId extends TTableRowId = TTableRowId> {
    /** Initial selected ids. */
    initialSelected?: Iterable<TId>;
    /** Controlled selected ids. */
    selected?: Set<TId>;
    /** Controlled change handler. */
    onSelectedChange?: (selected: Set<TId>) => void;
}

export interface IUseTableRowSelectionResult<TId extends TTableRowId = TTableRowId> {
    selected: Set<TId>;
    setSelected: (next: Set<TId> | ((prev: Set<TId>) => Set<TId>)) => void;
    isAllSelected: boolean;
    hasSelected: boolean;
    isIndeterminate: boolean;
    selectAll: () => void;
    setAllOnPage: (checked: boolean) => void;
    clearAll: () => void;
    toggle: (id: TId) => void;
    isSelected: (id: TId) => boolean;
}

const addIds = <TId extends TTableRowId>(prev: Set<TId>, ids: readonly TId[]) => {
    const next = new Set(prev);
    ids.forEach(id => next.add(id));
    return next;
};

const removeIds = <TId extends TTableRowId>(prev: Set<TId>, ids: ReadonlySet<TId> | readonly TId[]) => {
    const next = new Set(prev);
    [...ids].forEach(id => next.delete(id));
    return next;
};

/**
 * Row selection state for Table checkbox columns.
 * Pass the current page/list of row ids so select-all targets visible rows.
 */
export const useTableRowSelection = <TId extends TTableRowId = TTableRowId>(
    rowIds: readonly TId[],
    options: IUseTableRowSelectionOptions<TId> = {}
): IUseTableRowSelectionResult<TId> => {
    const { initialSelected, selected: controlledSelected, onSelectedChange } = options;
    const [uncontrolled, setUncontrolled] = useState<Set<TId>>(() => new Set(initialSelected ?? []));

    const isControlled = controlledSelected != null;
    const selected = isControlled ? controlledSelected : uncontrolled;

    const setSelected = useCallback(
        (next: Set<TId> | ((prev: Set<TId>) => Set<TId>)) => {
            const resolve = (prev: Set<TId>) => (typeof next === 'function' ? next(prev) : next);

            if (isControlled) {
                onSelectedChange?.(resolve(controlledSelected));
                return;
            }

            setUncontrolled(prev => {
                const value = resolve(prev);
                onSelectedChange?.(value);
                return value;
            });
        },
        [controlledSelected, isControlled, onSelectedChange]
    );

    const rowIdSet = useMemo(() => new Set(rowIds), [rowIds]);

    const selectedOnPageCount = useMemo(
        () => rowIds.reduce((count, id) => (selected.has(id) ? count + 1 : count), 0),
        [rowIds, selected]
    );

    const isAllSelected = rowIds.length > 0 && selectedOnPageCount === rowIds.length;
    const hasSelected = selected.size > 0;
    const isIndeterminate = selectedOnPageCount > 0 && !isAllSelected;

    const selectAll = useCallback(() => {
        setSelected(prev => {
            if (isAllSelected) return removeIds(prev, rowIdSet);
            return addIds(prev, rowIds);
        });
    }, [isAllSelected, rowIdSet, rowIds, setSelected]);

    const setAllOnPage = useCallback(
        (checked: boolean) => {
            setSelected(prev => {
                if (checked) return addIds(prev, rowIds);
                return removeIds(prev, rowIdSet);
            });
        },
        [rowIdSet, rowIds, setSelected]
    );

    const clearAll = useCallback(() => {
        setSelected(new Set());
    }, [setSelected]);

    const toggle = useCallback(
        (id: TId) => {
            setSelected(prev => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                    return next;
                }
                next.add(id);
                return next;
            });
        },
        [setSelected]
    );

    const isSelected = useCallback((id: TId) => selected.has(id), [selected]);

    return {
        selected,
        setSelected,
        isAllSelected,
        hasSelected,
        isIndeterminate,
        selectAll,
        setAllOnPage,
        clearAll,
        toggle,
        isSelected,
    };
};
