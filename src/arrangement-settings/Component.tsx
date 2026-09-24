import { useState } from 'react';

import { Button } from '@/button';
import { Drawer } from '@/drawer';
import { useAuiLabels } from '@/provider';

import { List } from './components/List';
import { type IArrangementSettingsProps } from './types';
import { orderedItemIds, visibleIdsInOrder } from './utils';

const draftFromValue = (items: IArrangementSettingsProps['items'], value: readonly string[]) => {
    const ids = items.map(item => item.id);

    return {
        order: orderedItemIds(ids, value),
        visible: value.filter(id => ids.includes(id)),
    };
};

export const ArrangementSettings = ({
    open,
    onOpenChange,
    title,
    items,
    value,
    onSave,
    dataTestId,
    placement = 'left',
}: IArrangementSettingsProps) => {
    const { cancel, save, arrangementList } = useAuiLabels();
    const [seenOpen, setSeenOpen] = useState(open);
    const [draft, setDraft] = useState(() => draftFromValue(items, value));

    if (open !== seenOpen) {
        setSeenOpen(open);

        if (open) {
            setDraft(draftFromValue(items, value));
        }
    }

    const rows = draft.order.flatMap(id => {
        const entry = items.find(item => item.id === id);

        return entry ? [entry] : [];
    });

    const close = () => {
        onOpenChange?.(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} placement={placement} dataTestId={dataTestId}>
            <Drawer.Header>
                <Drawer.Title>{title}</Drawer.Title>
                <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body>
                <List
                    items={rows}
                    visible={draft.visible}
                    label={arrangementList}
                    onVisibleChange={next => {
                        setDraft(current => ({ ...current, visible: next }));
                    }}
                    onReorder={order => {
                        setDraft(current => ({ ...current, order }));
                    }}
                />
            </Drawer.Body>
            <Drawer.Footer>
                <Button type="button" variant="secondary" onClick={close}>
                    {cancel}
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        onSave(visibleIdsInOrder(draft.order, draft.visible));
                        close();
                    }}
                >
                    {save}
                </Button>
            </Drawer.Footer>
        </Drawer>
    );
};

ArrangementSettings.displayName = 'ArrangementSettings';
