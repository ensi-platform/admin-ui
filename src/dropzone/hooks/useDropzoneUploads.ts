import { type MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import {
    type IDropzoneControlProps,
    type IDropzoneFile,
    type IDropzoneUploadResult,
    type IPendingDropzoneFile,
} from '../types';
import { DROPZONE_REJECT, type IFileRefusal, occupiedFrom, uploadError } from '../utils';

interface IUploadLimits {
    maxFiles?: number;
    maxTotalSize?: number;
}

export interface IUseDropzoneUploadsOptions {
    commit: (next: IDropzoneFile[]) => void;
    filesRef: MutableRefObject<IDropzoneFile[]>;
    limitsRef: MutableRefObject<IUploadLimits>;
    uploadRef: MutableRefObject<IDropzoneControlProps['upload']>;
    onRemoveRef: MutableRefObject<((file: IDropzoneFile) => void) | undefined>;
    setRejection: (message: string) => void;
    sentence: (item: IFileRefusal) => string;
}

/** In-flight and failed uploads. Refs update in the same turn as state. */
export const useDropzoneUploads = ({
    commit,
    filesRef,
    limitsRef,
    uploadRef,
    onRemoveRef,
    setRejection,
    sentence,
}: IUseDropzoneUploadsOptions) => {
    const [pending, setPending] = useState<IPendingDropzoneFile[]>([]);
    const pendingRef = useRef(pending);
    const attempts = useRef<Record<string, number>>({});
    const controllers = useRef<Record<string, AbortController>>({});

    const updatePending = useCallback((next: IPendingDropzoneFile[]) => {
        pendingRef.current = next;
        setPending(next);
    }, []);

    const settle = useCallback(
        (id: string, server: IDropzoneFile, replace: boolean) => {
            updatePending(pendingRef.current.filter(item => item.id !== id));
            const previous = filesRef.current;

            if (replace) {
                const old = previous[0];

                commit([server]);

                if (old) {
                    onRemoveRef.current?.(old);
                }

                return;
            }

            const next = [...previous.filter(file => file.id !== server.id), server];

            filesRef.current = next;
            commit(next);
        },
        [commit, filesRef, onRemoveRef, updatePending]
    );

    const runUpload = useCallback(
        (entry: IPendingDropzoneFile) => {
            const send = uploadRef.current;

            if (!send) {
                return;
            }

            const attempt = (attempts.current[entry.id] ?? 0) + 1;

            attempts.current[entry.id] = attempt;
            const controller = new AbortController();

            controllers.current[entry.id] = controller;

            Promise.resolve()
                .then(() =>
                    send(entry.file, {
                        signal: controller.signal,
                        onProgress: percent => {
                            if (attempts.current[entry.id] !== attempt) {
                                return;
                            }

                            updatePending(
                                pendingRef.current.map(item =>
                                    item.id === entry.id ? { ...item, progress: percent } : item
                                )
                            );
                        },
                    })
                )
                .then(
                    (result: IDropzoneUploadResult) => {
                        if (attempts.current[entry.id] !== attempt || controller.signal.aborted) {
                            return;
                        }

                        delete attempts.current[entry.id];
                        delete controllers.current[entry.id];
                        settle(
                            entry.id,
                            {
                                id: result.id,
                                url: result.url,
                                name: entry.name,
                                size: entry.size,
                                type: entry.type,
                            },
                            entry.replacing
                        );
                    },
                    (reason: unknown) => {
                        if (attempts.current[entry.id] !== attempt || controller.signal.aborted) {
                            return;
                        }

                        delete controllers.current[entry.id];
                        const error = uploadError(reason);

                        updatePending(
                            pendingRef.current.map(item =>
                                item.id === entry.id ? { ...item, status: 'error', error } : item
                            )
                        );
                    }
                );
        },
        [settle, updatePending, uploadRef]
    );

    const cancel = useCallback(
        (id: string) => {
            attempts.current[id] = (attempts.current[id] ?? 0) + 1;
            controllers.current[id]?.abort();
            delete controllers.current[id];
            delete attempts.current[id];
            updatePending(pendingRef.current.filter(item => item.id !== id));
        },
        [updatePending]
    );

    const retryRefusal = useCallback(
        (entry: IPendingDropzoneFile): IFileRefusal | null => {
            const { maxFiles: countLimit, maxTotalSize: totalLimit } = limitsRef.current;
            const waiting = pendingRef.current.filter(item => item.status === 'uploading' && item.id !== entry.id);

            if (entry.replacing) {
                if (totalLimit != null && entry.size > totalLimit) {
                    return { name: entry.name, code: DROPZONE_REJECT.totalSize, left: totalLimit };
                }

                return null;
            }

            const occupied = occupiedFrom(filesRef.current, waiting);

            if (countLimit != null && countLimit >= 1 && occupied.length >= countLimit) {
                return { name: entry.name, code: DROPZONE_REJECT.tooMany };
            }

            if (totalLimit != null) {
                const used = occupied.reduce((sum, file) => sum + file.size, 0);

                if (used + entry.size > totalLimit) {
                    return {
                        name: entry.name,
                        code: DROPZONE_REJECT.totalSize,
                        left: Math.max(0, totalLimit - used),
                    };
                }
            }

            return null;
        },
        [filesRef, limitsRef]
    );

    const retry = useCallback(
        (id: string) => {
            const entry = pendingRef.current.find(item => item.id === id);

            if (!entry) {
                return;
            }

            const refusal = retryRefusal(entry);

            if (refusal) {
                setRejection(sentence(refusal));
                return;
            }

            updatePending(
                pendingRef.current.map(item =>
                    item.id === id ? { ...item, status: 'uploading', progress: null, error: undefined } : item
                )
            );
            runUpload({ ...entry, status: 'uploading', progress: null, error: undefined });
        },
        [retryRefusal, runUpload, sentence, setRejection, updatePending]
    );

    useEffect(() => {
        const running = controllers.current;
        const rounds = attempts.current;

        return () => {
            Object.entries(running).forEach(([id, controller]) => {
                rounds[id] = (rounds[id] ?? 0) + 1;
                controller.abort();
            });
        };
    }, []);

    return { pending, pendingRef, updatePending, runUpload, cancel, retry };
};
