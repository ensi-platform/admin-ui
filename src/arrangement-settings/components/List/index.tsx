import { createContext, type PointerEvent, useContext, useRef } from 'react';

import cn from 'classnames';
import { DropIndicator, GridList, GridListItem, Button as RacButton, useDragAndDrop } from 'react-aria-components';

import { Checkbox } from '@/checkbox';
import { GripVertical } from '@/icons';

import { type IArrangementSettingsItem } from '../../types';
import { reorderItemIds, toggleItemVisibility } from '../../utils';

import styles from './styles.module.css';

const dragItemId = 'arrangement-item-id';

const stopRowPress = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
};

/** GridList caches row elements, so visibility is read here instead of the row closure. */
const VisibleContext = createContext<readonly string[]>([]);

const Row = ({
    item,
    onVisibleChange,
}: {
    item: IArrangementSettingsItem;
    onVisibleChange: (next: string[]) => void;
}) => {
    const visible = useContext(VisibleContext);

    return (
        <GridListItem id={item.id} textValue={item.label} className={styles.item} data-arrangement-id={item.id}>
            <div className={styles.check} onPointerDown={stopRowPress}>
                <Checkbox
                    aria-label={item.label}
                    checked={visible.includes(item.id)}
                    onChange={checked => {
                        onVisibleChange(toggleItemVisibility(visible, item.id, checked));
                    }}
                />
            </div>
            <span className={styles.label}>{item.label}</span>
            <RacButton slot="drag" className={styles.drag}>
                <GripVertical className={styles.grip} />
            </RacButton>
        </GridListItem>
    );
};

/** Copies the painted row. The drag bitmap otherwise drops the checkbox selected styles. */
const rowPreviewHtml = (source: HTMLElement) => {
    const clone = source.cloneNode(true) as HTMLElement;
    const sourceBox = source.querySelector<HTMLElement>('label > span');
    const cloneBox = clone.querySelector<HTMLElement>('label > span');

    if (sourceBox && cloneBox) {
        const boxStyle = getComputedStyle(sourceBox);

        cloneBox.style.backgroundColor = boxStyle.backgroundColor;
        cloneBox.style.borderColor = boxStyle.borderColor;
        cloneBox.style.color = boxStyle.color;
    }

    const sourceIcon = source.querySelector<SVGElement>('label svg');
    const cloneIcon = clone.querySelector<SVGElement>('label svg');

    if (sourceIcon && cloneIcon) {
        const iconStyle = getComputedStyle(sourceIcon);

        cloneIcon.style.visibility = iconStyle.visibility;
        cloneIcon.style.color = iconStyle.color;
    }

    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));

    return clone.innerHTML;
};

export const List = ({
    items,
    visible,
    label,
    onVisibleChange,
    onReorder,
}: {
    items: readonly IArrangementSettingsItem[];
    visible: readonly string[];
    label: string;
    onVisibleChange: (next: string[]) => void;
    onReorder: (next: string[]) => void;
}) => {
    const listRef = useRef<HTMLDivElement>(null);
    const { dragAndDropHooks } = useDragAndDrop({
        getItems: keys =>
            [...keys].map(key => {
                const id = String(key);

                return {
                    'text/plain': items.find(item => item.id === id)?.label ?? id,
                    [dragItemId]: id,
                };
            }),
        renderDropIndicator: target => <DropIndicator target={target} className={styles.indicator} />,
        renderDragPreview: dragged => {
            const id = dragged[0]?.[dragItemId] ?? '';
            const source = listRef.current?.querySelector<HTMLElement>(`[data-arrangement-id="${CSS.escape(id)}"]`);

            if (!source) {
                return <div />;
            }

            const html = rowPreviewHtml(source);

            return (
                <div
                    className={cn(styles.item, styles.preview)}
                    style={{ width: source.offsetWidth || undefined }}
                    ref={node => {
                        if (node) {
                            node.innerHTML = html;
                        }
                    }}
                />
            );
        },
        onReorder: event => {
            if (event.target.type !== 'item' || event.target.dropPosition === 'on') {
                return;
            }

            onReorder(
                reorderItemIds(
                    items.map(item => item.id),
                    [...event.keys].map(String),
                    String(event.target.key),
                    event.target.dropPosition
                )
            );
        },
    });

    return (
        <VisibleContext.Provider value={visible}>
            <GridList
                ref={listRef}
                aria-label={label}
                className={styles.list}
                items={items}
                dragAndDropHooks={dragAndDropHooks}
            >
                {item => <Row item={item} onVisibleChange={onVisibleChange} />}
            </GridList>
        </VisibleContext.Provider>
    );
};

List.displayName = 'ArrangementSettings.List';
