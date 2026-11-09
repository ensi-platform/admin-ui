import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { type IDropzoneFile } from '../types';

export interface IUseDropzoneSelectionOptions {
    rootRef: RefObject<HTMLDivElement | null>;
    files: readonly IDropzoneFile[];
    selectable: boolean;
}

/** Multi-file selection, including Delete and a click outside the list. */
export const useDropzoneSelection = ({ rootRef, files, selectable }: IUseDropzoneSelectionOptions) => {
    const [selected, setSelected] = useState<Set<string>>(() => new Set());
    const selectedRef = useRef(selected);
    const deleteRef = useRef<() => void>(() => undefined);

    useLayoutEffect(() => {
        selectedRef.current = selected;
    }, [selected]);

    useEffect(() => {
        const root = rootRef.current;

        if (!root) {
            return undefined;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelected(new Set());
                return;
            }

            if (event.key !== 'Delete' && event.key !== 'Backspace') {
                return;
            }

            if (selectedRef.current.size === 0) {
                return;
            }

            const target = event.target as HTMLElement | null;

            if (target?.closest('input, textarea, [contenteditable="true"]')) {
                return;
            }

            event.preventDefault();
            deleteRef.current();
        };
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as HTMLElement | null;

            if (target && root.contains(target) && target.closest('[data-dropzone-list], [data-dropzone-toolbar]')) {
                return;
            }

            setSelected(new Set());
        };

        root.addEventListener('keydown', onKeyDown);
        document.addEventListener('pointerdown', onPointerDown);

        return () => {
            root.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerdown', onPointerDown);
        };
    }, [rootRef]);

    useEffect(() => {
        if (!selectable) {
            setSelected(currentKeys => (currentKeys.size === 0 ? currentKeys : new Set()));
        }
    }, [selectable]);

    useEffect(() => {
        const ids = new Set(files.map(file => file.id));

        setSelected(currentKeys => {
            const next = new Set([...currentKeys].filter(key => ids.has(key)));

            return next.size === currentKeys.size ? currentKeys : next;
        });
    }, [files]);

    return { selected, setSelected, selectedRef, deleteRef };
};
