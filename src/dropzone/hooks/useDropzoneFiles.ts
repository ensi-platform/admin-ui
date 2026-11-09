import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { type FileRejection, useDropzone } from 'react-dropzone';

import { useAuiLabels } from '@/provider';

import { type IDropzoneControlProps, type IDropzoneFile } from '../types';
import {
    DROPZONE_REJECT,
    type IFileRefusal,
    fillLabel,
    fileSizeUnitsFrom,
    formatFileSize,
    occupiedFrom,
    rejectionCodes,
    takeIncomingFiles,
    uploadError,
} from '../utils';

import { useDropzoneUploads } from './useDropzoneUploads';

export interface IUseDropzoneFilesOptions extends Omit<IDropzoneControlProps, 'disabled'> {
    /** Zone refuses new files. */
    addDisabled?: boolean;
    /** Rows cannot be reordered. */
    reorderDisabled?: boolean;
    /** Show a loader instead of the file list. */
    loading?: boolean;
    onRejectionChange?: (message: string) => void;
}

const nameLengthError = (file: File, maxFileNameLength?: number) => {
    if (maxFileNameLength == null || file.name.length <= maxFileNameLength) {
        return null;
    }

    return { code: DROPZONE_REJECT.nameLength, message: '' };
};

const refusalReason = (
    code: string,
    copy: ReturnType<typeof useAuiLabels>,
    sizeLimit: number | undefined,
    countLimit: number | undefined,
    nameLimit: number | undefined
) => {
    const units = fileSizeUnitsFrom(copy);

    if (code === DROPZONE_REJECT.tooBig) {
        return fillLabel(copy.dropzoneTooBig, { size: formatFileSize(sizeLimit ?? 0, units) });
    }

    if (code === DROPZONE_REJECT.badType) {
        return copy.dropzoneBadType;
    }

    if (code === DROPZONE_REJECT.tooMany) {
        return fillLabel(copy.dropzoneTooMany, { count: countLimit ?? '' });
    }

    if (code === DROPZONE_REJECT.nameLength) {
        return fillLabel(copy.dropzoneNameLength, { count: nameLimit ?? '' });
    }

    if (code === DROPZONE_REJECT.duplicate) {
        return copy.dropzoneDuplicate;
    }

    return copy.dropzoneRejected;
};

export const useDropzoneFiles = ({
    value,
    defaultValue,
    onChange,
    onRemove,
    accept,
    maxSize,
    maxTotalSize,
    maxFiles,
    maxFileNameLength,
    paste = false,
    upload,
    validate,
    addDisabled = false,
    reorderDisabled = false,
    loading = false,
    onRejectionChange,
    onPendingChange,
}: IUseDropzoneFilesOptions) => {
    const labels = useAuiLabels();
    const [uncontrolled, setUncontrolled] = useState<IDropzoneFile[]>(defaultValue ?? []);
    const [rejection, setRejection] = useState('');
    const files = value ?? uncontrolled;
    const filesRef = useRef(files);
    const onChangeRef = useRef(onChange);
    const onRemoveRef = useRef(onRemove);
    const uploadRef = useRef(upload);
    const validateRef = useRef(validate);
    const dropChain = useRef(Promise.resolve());
    const limitsRef = useRef({ value, maxSize, maxTotalSize, maxFiles, maxFileNameLength });
    const labelsRef = useRef(labels);
    const onPendingChangeRef = useRef(onPendingChange);

    useLayoutEffect(() => {
        filesRef.current = files;
        onChangeRef.current = onChange;
        onRemoveRef.current = onRemove;
        uploadRef.current = upload;
        validateRef.current = validate;
        limitsRef.current = { value, maxSize, maxTotalSize, maxFiles, maxFileNameLength };
        labelsRef.current = labels;
        onPendingChangeRef.current = onPendingChange;
    }, [
        files,
        onChange,
        onRemove,
        upload,
        validate,
        value,
        maxSize,
        maxTotalSize,
        maxFiles,
        maxFileNameLength,
        labels,
        onPendingChange,
    ]);

    const commit = useCallback((next: IDropzoneFile[]) => {
        filesRef.current = next;

        if (limitsRef.current.value === undefined) {
            setUncontrolled(next);
        }

        onChangeRef.current?.(next);
    }, []);

    const sentence = useCallback((item: IFileRefusal) => {
        const { maxSize: sizeLimit, maxFiles: countLimit, maxFileNameLength: nameLimit } = limitsRef.current;
        const copy = labelsRef.current;

        if (item.message) {
            return `${item.name}: ${item.message}`;
        }

        if (item.code === DROPZONE_REJECT.totalSize) {
            return fillLabel(copy.dropzoneTotalTooBig, {
                name: item.name,
                size: formatFileSize(item.left ?? 0, fileSizeUnitsFrom(copy)),
            });
        }

        const reason = refusalReason(item.code, copy, sizeLimit, countLimit, nameLimit);

        return `${item.name}: ${reason}`;
    }, []);

    const { pending, pendingRef, updatePending, runUpload, cancel, retry } = useDropzoneUploads({
        commit,
        filesRef,
        limitsRef,
        uploadRef,
        onRemoveRef,
        setRejection,
        sentence,
    });
    const inFlight = pending.filter(item => item.status === 'uploading');
    const uploading = inFlight.length > 0;
    const count = files.length + inFlight.length;
    const bytes = occupiedFrom(files, inFlight).reduce((sum, file) => sum + file.size, 0);
    const singleOpen = maxFiles === 1 && !uploading;
    const countFull = maxFiles != null && maxFiles >= 1 && count >= maxFiles && !singleOpen;
    const bytesFull = maxTotalSize != null && bytes >= maxTotalSize && !singleOpen;
    const hasRoom = !countFull && !bytesFull;

    const acceptDrop = useCallback(
        async <T extends File>(accepted: T[], fileRejections: FileRejection[]) => {
            const { maxFiles: countLimit, maxTotalSize: totalLimit } = limitsRef.current;
            const names = new Set(accepted.map(file => file.name));
            const stale = pendingRef.current.filter(
                item => item.status === 'error' && (countLimit === 1 || names.has(item.name))
            );

            stale.forEach(item => {
                cancel(item.id);
            });

            const checked = await Promise.all(
                accepted.map(async (file): Promise<File | IFileRefusal> => {
                    try {
                        const message = await validateRef.current?.(file);

                        if (message) {
                            return { name: file.name, code: DROPZONE_REJECT.custom, message } satisfies IFileRefusal;
                        }

                        return file;
                    } catch (reason) {
                        return {
                            name: file.name,
                            code: DROPZONE_REJECT.custom,
                            message: uploadError(reason) ?? labelsRef.current.dropzoneRejected,
                        } satisfies IFileRefusal;
                    }
                })
            );
            const custom = checked.filter((item): item is IFileRefusal => !(item instanceof File));
            const kept = checked.filter((item): item is File => item instanceof File);
            const { current } = filesRef;
            const waiting = pendingRef.current.filter(item => item.status === 'uploading');
            const replacing = countLimit === 1 && current.length >= 1 && waiting.length === 0;

            const result = takeIncomingFiles(
                replacing ? [] : occupiedFrom(current, waiting),
                kept,
                rejectionCodes(fileRejections),
                {
                    maxFiles: replacing ? 1 : countLimit,
                    maxTotalSize: totalLimit,
                }
            );

            result.rejections.push(...custom);
            const copy = labelsRef.current;

            if (result.added.length > 0 && uploadRef.current) {
                const added = result.added.flatMap(file => {
                    if (!file.file) {
                        return [];
                    }

                    return [
                        {
                            id: file.id,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            file: file.file,
                            status: 'uploading' as const,
                            progress: null,
                            replacing,
                        },
                    ];
                });

                updatePending([...pendingRef.current, ...added]);
                added.forEach(runUpload);
            }

            if (result.added.length > 0 && !uploadRef.current && replacing) {
                const [old] = current;

                commit(result.added);

                if (old) {
                    onRemoveRef.current?.(old);
                }
            }

            if (result.added.length > 0 && !uploadRef.current && !replacing) {
                commit([...current, ...result.added]);
            }

            if (result.rejections.length === 0) {
                setRejection('');
                return;
            }

            const reason = result.rejections.map(item => sentence(item)).join(' ');

            setRejection(replacing ? fillLabel(copy.dropzoneNotReplaced, { reason }) : reason);
        },
        [cancel, commit, pendingRef, runUpload, sentence, updatePending]
    );

    const onDrop = useCallback(
        <T extends File>(accepted: T[], fileRejections: FileRejection[]) => {
            const job = dropChain.current.then(() => acceptDrop(accepted, fileRejections));

            dropChain.current = job.then(
                () => undefined,
                () => undefined
            );

            return job;
        },
        [acceptDrop]
    );

    const validator = useCallback(
        <T extends File>(file: T) => nameLengthError(file, limitsRef.current.maxFileNameLength),
        []
    );

    const dropzone = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: maxFiles !== 1,
        disabled: addDisabled || loading || !hasRoom,
        noPaste: !paste,
        validator,
    });

    const remove = useCallback(
        (file: IDropzoneFile) => {
            const next = filesRef.current.filter(item => item.id !== file.id);

            commit(next);
            onRemoveRef.current?.(file);
        },
        [commit]
    );

    const removeMany = useCallback(
        (ids: ReadonlySet<string>) => {
            const { current } = filesRef;
            const removed = current.filter(file => ids.has(file.id));
            const next = current.filter(file => !ids.has(file.id));

            commit(next);
            removed.forEach(file => {
                onRemoveRef.current?.(file);
            });

            return removed.length;
        },
        [commit]
    );

    useEffect(() => {
        onRejectionChange?.(rejection);
    }, [onRejectionChange, rejection]);

    const uploadingNow = pending.some(item => item.status === 'uploading');
    const failedNow = pending.some(item => item.status === 'error');

    useEffect(() => {
        onPendingChangeRef.current?.({ uploading: uploadingNow, failed: failedNow });
    }, [uploadingNow, failedNow]);

    return {
        files,
        pending,
        rejection,
        hasRoom,
        countFull,
        isDragActive: dropzone.isDragActive,
        canReorder: !reorderDisabled && !loading && maxFiles !== 1 && files.length > 1 && !uploading,
        getRootProps: dropzone.getRootProps,
        getInputProps: dropzone.getInputProps,
        remove,
        removeMany,
        retry,
        cancel,
        setFiles: commit,
        count,
        bytes,
        uploading,
    };
};
