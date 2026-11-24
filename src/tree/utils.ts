import { type Key } from 'react-aria-components';

import { type ITreeItem } from './types';

const visit = (items: readonly ITreeItem[], pick: (item: ITreeItem) => boolean, keys: Key[]) => {
    items.forEach(item => {
        if (pick(item)) keys.push(item.id);
        if (item.children?.length) visit(item.children, pick, keys);
    });

    return keys;
};

/** Every node id. */
export const collectTreeKeys = (items: readonly ITreeItem[]) => visit(items, () => true, []);

/** Ids of nodes marked `disabled`. */
export const collectDisabledKeys = (items: readonly ITreeItem[]) => visit(items, item => Boolean(item.disabled), []);
