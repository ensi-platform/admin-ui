import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { type DropTarget } from 'react-aria';
import { type Selection, useDragAndDrop } from 'react-aria-components';

import { DragPreview, DropSlot } from '../../components/FileListDrag';
import { type IDropzoneFile, type IFileListProps, type IRowAction } from '../../types';
import { dropTargetRowKey, moveDropzoneFiles, reorderDropzoneFiles } from '../../utils';

const dragItemId = 'dropzone-file-id';

const interactiveSelector = 'button, a, input, [role="menuitem"]';
const actionSelector = 'button:not([data-dropzone-grip]), a, input, [role="menuitem"]';

interface IShift {
    x: number;
    y: number;
}

type TRowTarget = { kind: 'file'; file: IDropzoneFile } | { kind: 'pending'; id: string };

export const useFileList = ({
    files,
    pending,
    canReorder,
    removable,
    removeDisabled = false,
    selectable = false,
    selectedKeys,
    onSelectionChange: changeSelection,
    focusId = null,
    removeLabel,
    retryLabel,
    cancelLabel,
    onRemove,
    onRetry,
    onDismiss,
    onCancel,
    onReorder,
}: IFileListProps) => {
    const listRef = useRef<HTMLDivElement>(null);
    const filesRef = useRef(files);
    const activeDragId = useRef<string | null>(null);
    const blockDrag = useRef(false);
    const draggingIdsRef = useRef<string[]>([]);
    const anchorId = useRef<string | null>(null);
    const selectionBeforePress = useRef<Set<string>>(new Set());
    const pointerOwned = useRef(false);
    const selectedRef = useRef(selectedKeys);
    const onSelectionChangeRef = useRef(changeSelection);

    selectedRef.current = selectedKeys;
    onSelectionChangeRef.current = changeSelection;
    const [draggingIds, setDraggingIds] = useState<string[]>([]);
    const [shifts, setShifts] = useState<Record<string, IShift>>({});
    const [flipping, setFlipping] = useState(false);
    const shiftsRef = useRef(shifts);
    const flipFrom = useRef<Record<string, IShift> | null>(null);

    filesRef.current = files;
    shiftsRef.current = shifts;

    const dropTargetDelegate = useMemo(
        () => ({
            getDropTargetFromPoint(x: number, y: number, isValidDropTarget: (target: DropTarget) => boolean) {
                const root = listRef.current;

                if (!root) {
                    return { type: 'root' as const };
                }

                const origin = root.getBoundingClientRect();
                const rows = [...root.querySelectorAll<HTMLElement>('[data-file-id]')].flatMap(node => {
                    const key = node.getAttribute('data-key') ?? node.getAttribute('data-file-id');

                    if (!key) {
                        return [];
                    }

                    const box = node.getBoundingClientRect();

                    return [{ key, top: box.top, right: box.right, bottom: box.bottom, left: box.left }];
                });
                const key = dropTargetRowKey(rows, x + origin.left, y + origin.top);

                if (!key) {
                    return { type: 'root' as const };
                }

                const target: DropTarget = { type: 'item', key, dropPosition: 'on' };

                return isValidDropTarget(target) ? target : null;
            },
        }),
        []
    );

    const rememberFlip = () => {
        const list = listRef.current;

        if (!list) {
            return;
        }

        const points: Record<string, IShift> = {};

        filesRef.current.forEach(file => {
            const node = list.querySelector<HTMLElement>(`[data-file-id="${CSS.escape(file.id)}"]`);

            if (!node) {
                return;
            }

            const shift = shiftsRef.current[file.id];

            points[file.id] = {
                x: node.offsetLeft + (shift?.x ?? 0),
                y: node.offsetTop + (shift?.y ?? 0),
            };
        });
        flipFrom.current = points;
    };

    const { dragAndDropHooks } = useDragAndDrop({
        isDisabled: !canReorder,
        getItems: keys =>
            [...keys].map(key => {
                const id = String(key);
                const file = filesRef.current.find(item => item.id === id);

                return {
                    'text/plain': file?.name ?? id,
                    [dragItemId]: id,
                };
            }),
        renderDragPreview: dragged => (
            <DragPreview id={String(dragged[0]?.[dragItemId] ?? '')} list={listRef.current} />
        ),
        renderDropIndicator: target => <DropSlot target={target} />,
        dropTargetDelegate,
        shouldAcceptItemDrop: (_target, types) => types.has(dragItemId),
        getDropOperation: (target, types) => (target.type === 'item' && types.has(dragItemId) ? 'move' : 'cancel'),
        onDragStart: event => {
            const keys = [...event.keys].map(String);

            draggingIdsRef.current = keys;
            setDraggingIds(keys);
        },
        onDragEnd: () => {
            draggingIdsRef.current = [];
            setDraggingIds([]);
        },
        onItemDrop: event => {
            if (event.target.dropPosition !== 'on') {
                return;
            }

            let keys = draggingIdsRef.current;

            if (keys.length === 0 && activeDragId.current) {
                keys = [activeDragId.current];
            }

            if (keys.length === 0) {
                return;
            }

            rememberFlip();
            activeDragId.current = null;
            onReorder(moveDropzoneFiles(filesRef.current, keys, String(event.target.key)));
        },
        onReorder: event => {
            if (event.target.dropPosition === 'on') {
                return;
            }

            const dragged = draggingIdsRef.current.length > 0 ? draggingIdsRef.current : [...event.keys].map(String);

            rememberFlip();
            activeDragId.current = null;
            onReorder(
                reorderDropzoneFiles(filesRef.current, dragged, String(event.target.key), event.target.dropPosition)
            );
        },
    });

    useEffect(() => {
        const list = listRef.current;

        if (!list) {
            return undefined;
        }

        const rowId = (event: Event) =>
            (event.target as HTMLElement | null)?.closest('[data-file-id]')?.getAttribute('data-file-id') ?? null;
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as HTMLElement | null;
            const row = target?.closest<HTMLElement>('[data-file-id]');
            const action = Boolean(target?.closest(actionSelector));

            blockDrag.current = action;
            activeDragId.current = action ? null : (row?.getAttribute('data-file-id') ?? null);
            selectionBeforePress.current = new Set(selectedRef.current);
            pointerOwned.current = Boolean(rowId(event)) && !target?.closest(interactiveSelector);
        };
        const onDragStart = (event: DragEvent) => {
            if (!blockDrag.current) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
        };
        const onKeyDown = () => {
            pointerOwned.current = false;
        };
        const onClick = (event: MouseEvent) => {
            const id = rowId(event);
            const change = onSelectionChangeRef.current;

            window.setTimeout(() => {
                pointerOwned.current = false;
            }, 0);

            if (!selectable || !pointerOwned.current || !id || !change) {
                return;
            }

            const ids = filesRef.current.map(file => file.id);
            const before = selectionBeforePress.current;
            const from = anchorId.current ? ids.indexOf(anchorId.current) : -1;
            const to = ids.indexOf(id);

            if (event.shiftKey && from >= 0 && to >= 0) {
                change(new Set(ids.slice(Math.min(from, to), Math.max(from, to) + 1)));
                return;
            }

            anchorId.current = id;

            const next = new Set(before);

            if (!next.delete(id)) {
                next.add(id);
            }

            if (next.size === 0) {
                anchorId.current = null;
            }

            change(next);
        };

        list.addEventListener('pointerdown', onPointerDown);
        list.addEventListener('dragstart', onDragStart, true);
        list.addEventListener('keydown', onKeyDown);
        list.addEventListener('click', onClick);

        return () => {
            list.removeEventListener('pointerdown', onPointerDown);
            list.removeEventListener('dragstart', onDragStart, true);
            list.removeEventListener('keydown', onKeyDown);
            list.removeEventListener('click', onClick);
        };
    }, [selectable, files.length]);

    useEffect(() => {
        const list = listRef.current;

        if (!list || !canReorder) {
            return undefined;
        }

        const enableGrips = () => {
            list.querySelectorAll<HTMLElement>('[data-dropzone-grip]').forEach(grip => {
                if (grip.style.pointerEvents !== 'auto') {
                    grip.style.pointerEvents = 'auto';
                }
            });
        };

        enableGrips();

        const observer = new MutationObserver(enableGrips);

        observer.observe(list, { subtree: true, attributes: true, attributeFilter: ['style'] });

        return () => {
            observer.disconnect();
        };
    }, [canReorder, files.length]);

    useEffect(() => {
        if (!selectedKeys || selectedKeys.size === 0) {
            anchorId.current = null;
        }
    }, [selectedKeys]);

    useEffect(() => {
        if (!focusId || !listRef.current) {
            return;
        }

        listRef.current.querySelector<HTMLElement>(`[data-file-id="${CSS.escape(focusId)}"]`)?.focus();
    }, [focusId, files]);

    useLayoutEffect(() => {
        const list = listRef.current;
        const from = flipFrom.current;

        if (from && list && draggingIds.length === 0) {
            flipFrom.current = null;
            const invert: Record<string, IShift> = {};

            files.forEach(file => {
                const node = list.querySelector<HTMLElement>(`[data-file-id="${CSS.escape(file.id)}"]`);
                const origin = from[file.id];

                if (!node || !origin) {
                    return;
                }

                const x = origin.x - node.offsetLeft;
                const y = origin.y - node.offsetTop;

                if (x !== 0 || y !== 0) {
                    invert[file.id] = { x, y };
                }
            });
            if (Object.keys(invert).length === 0) {
                setShifts(current => (Object.keys(current).length === 0 ? current : {}));
                return;
            }

            setFlipping(true);
            setShifts(invert);
            return;
        }

        if (flipping) {
            return;
        }

        setShifts(current => (Object.keys(current).length === 0 ? current : {}));
    }, [draggingIds, files, flipping]);

    useLayoutEffect(() => {
        if (!flipping) {
            return undefined;
        }

        let playFrame = 0;
        const paintFrame = requestAnimationFrame(() => {
            playFrame = requestAnimationFrame(() => {
                setFlipping(false);
                setShifts({});
            });
        });

        return () => {
            cancelAnimationFrame(paintFrame);
            cancelAnimationFrame(playFrame);
        };
    }, [flipping]);

    const actionsFor = (target: TRowTarget): IRowAction[] => {
        if (target.kind === 'pending') {
            const item = pending.find(entry => entry.id === target.id);

            if (!item) {
                return [];
            }

            if (item.status === 'uploading') {
                return [{ key: 'cancel', label: cancelLabel, run: () => onCancel(item.id) }];
            }

            if (item.status !== 'error') {
                return [];
            }

            const actions: IRowAction[] = [{ key: 'retry', label: retryLabel, run: () => onRetry(item.id) }];

            if (removable && !removeDisabled) {
                actions.push({ key: 'dismiss', label: removeLabel, run: () => onDismiss(item.id) });
            }

            return actions;
        }

        return [
            {
                key: 'remove',
                label: removeLabel,
                disabled: removeDisabled || !removable,
                run: () => onRemove(target.file),
            },
        ];
    };

    const onSelectionChange = (keys: Selection) => {
        if (!changeSelection || pointerOwned.current) {
            return;
        }

        if (keys === 'all') {
            changeSelection(new Set(filesRef.current.map(file => file.id)));
            return;
        }

        const next = new Set([...keys].map(String));

        anchorId.current = next.size === 1 ? ([...next][0] ?? null) : anchorId.current;
        changeSelection(next);
    };

    return {
        listRef,
        dragAndDropHooks,
        shifts,
        flipping,
        actionsFor,
        onSelectionChange: selectable ? onSelectionChange : undefined,
    };
};
