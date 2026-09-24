/** Visible ids first, in saved order, then hidden items in `itemIds` order. */
export const orderedItemIds = (itemIds: readonly string[], visible: readonly string[]) => {
    const known = new Set(itemIds);
    const shown = visible.filter(id => known.has(id));
    const hidden = itemIds.filter(id => !shown.includes(id));

    return [...shown, ...hidden];
};

/** Checked ids following the list order. */
export const visibleIdsInOrder = (order: readonly string[], visible: readonly string[]) => {
    const shown = new Set(visible);

    return order.filter(id => shown.has(id));
};

/** Visible ids, in order. Checking appends; unchecking removes. */
export const toggleItemVisibility = (order: readonly string[], id: string, visible: boolean) => {
    if (!visible) {
        return order.filter(item => item !== id);
    }

    if (order.includes(id)) {
        return [...order];
    }

    return [...order, id];
};

/** Moves `keys` before or after `targetKey`. A drop onto the dragged id is a no-op. */
export const reorderItemIds = (
    order: readonly string[],
    keys: readonly string[],
    targetKey: string,
    position: 'before' | 'after' | 'on'
) => {
    const moving = new Set(keys);
    const moved = order.filter(id => moving.has(id));
    const rest = order.filter(id => !moving.has(id));
    const index = rest.indexOf(targetKey);

    if (index < 0 || moved.length === 0) {
        return [...order];
    }

    const insertAt = position === 'before' ? index : index + 1;

    return [...rest.slice(0, insertAt), ...moved, ...rest.slice(insertAt)];
};
