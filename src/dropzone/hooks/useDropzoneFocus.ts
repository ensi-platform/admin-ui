import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { type IDropzoneFile } from '../types';

export interface IUseDropzoneFocusOptions {
    files: readonly IDropzoneFile[];
    maxFiles?: number;
}

/** Focus after a removal, the replace flash, and the live announcement. */
export const useDropzoneFocus = ({ files, maxFiles }: IUseDropzoneFocusOptions) => {
    const [announcement, setAnnouncement] = useState({ text: '', tick: 0 });
    const [focusId, setFocusId] = useState<string | null>(null);
    const [flashId, setFlashId] = useState<string | null>(null);
    const filesRef = useRef(files);
    const previousSlotId = useRef<string | undefined>(undefined);

    useLayoutEffect(() => {
        filesRef.current = files;
    }, [files]);

    const announce = useCallback((text: string) => {
        setAnnouncement(previous => ({ text, tick: previous.tick + 1 }));
    }, []);

    const neighbourOf = useCallback((removedIds: ReadonlySet<string>) => {
        const currentFiles = filesRef.current;
        const firstIndex = currentFiles.findIndex(file => removedIds.has(file.id));
        const remaining = currentFiles.filter(file => !removedIds.has(file.id));

        return remaining[Math.min(Math.max(firstIndex, 0), Math.max(remaining.length - 1, 0))];
    }, []);

    useEffect(() => {
        if (focusId) {
            setFocusId(null);
        }
    }, [focusId]);

    useEffect(() => {
        if (maxFiles !== 1) {
            previousSlotId.current = undefined;
            return undefined;
        }

        const slotId = files[0]?.id;
        const previous = previousSlotId.current;

        previousSlotId.current = slotId;

        if (!previous || !slotId || previous === slotId) {
            return undefined;
        }

        setFlashId(slotId);
        const timer = window.setTimeout(() => {
            setFlashId(null);
        }, 700);

        return () => {
            window.clearTimeout(timer);
        };
    }, [files, maxFiles]);

    return { announcement, focusId, setFocusId, flashId, announce, neighbourOf };
};
