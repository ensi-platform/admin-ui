import { type MutableRefObject, useCallback, useLayoutEffect, useRef } from 'react';

import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';
import { typographyStyles } from '@ds/typography';

import { Button } from '@/button';
import { ListChecks, Trash } from '@/icons';
import { useAuiLabels } from '@/provider';

import { DropzoneAction } from './components/Action';
import { FileSkeletons } from './components/FileSkeletons';
import { GridItem } from './components/GridItem';
import { GridList } from './components/GridList';
import { Item } from './components/Item';
import { List } from './components/List';
import { Quota } from './components/Quota';
import { Zone } from './components/Zone';
import { useDropzoneFiles } from './hooks/useDropzoneFiles';
import { useDropzoneFocus } from './hooks/useDropzoneFocus';
import { useDropzoneSelection } from './hooks/useDropzoneSelection';
import { dropzoneVariants } from './theme';
import { type IDropzoneFile, type IDropzoneProps } from './types';
import {
    dropzoneBlocks,
    dropzoneQuota,
    dropzoneZoneText,
    fileSizeUnitsFrom,
    fillLabel,
    formatDropzoneLimits,
    formatFileSize,
} from './utils';

import styles from './styles.module.css';

const toolbarIcon = { size: 'calc(var(--aui-dropzone-hit) - var(--aui-dropzone-gap))' };

const skeletonCountFor = (fileCount: number) => (fileCount === 0 ? 2 : Math.min(fileCount, 3));

const DropzoneRoot = supportRef(
    ({
        ref,
        value,
        defaultValue,
        onChange,
        onRemove,
        renderAction,
        accept,
        maxSize,
        maxTotalSize,
        maxFiles,
        maxFileNameLength,
        paste = false,
        loading = false,
        layout = 'list',
        list,
        item,
        upload,
        validate,
        onPendingChange,
        title,
        description,
        hint,
        onRejectionChange,
        size = 'md',
        variant = 'primary',
        invalid = false,
        disabled = false,
        block = true,
        className,
        dataTestId,
        id,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        'aria-invalid': ariaInvalid,
        ...props
    }: IDropzoneProps) => {
        const labels = useAuiLabels();
        const blocks = dropzoneBlocks(disabled);
        const dropzone = useDropzoneFiles({
            value,
            defaultValue,
            onChange,
            onRemove,
            accept,
            maxSize,
            maxTotalSize,
            maxFiles,
            maxFileNameLength,
            paste,
            upload,
            validate,
            addDisabled: blocks.add,
            reorderDisabled: blocks.reorder,
            loading,
            onRejectionChange,
            onPendingChange,
        });
        const rootRef = useRef<HTMLDivElement | null>(null);
        const setRoot = useCallback(
            (node: HTMLDivElement | null) => {
                rootRef.current = node;

                if (typeof ref === 'function') {
                    ref(node);
                    return;
                }

                if (ref) {
                    (ref as MutableRefObject<HTMLDivElement | null>).current = node;
                }
            },
            [ref]
        );
        const selectable = !blocks.remove && !loading && dropzone.files.length > 1;
        const { selected, setSelected, selectedRef, deleteRef } = useDropzoneSelection({
            rootRef,
            files: dropzone.files,
            selectable,
        });
        const { announcement, focusId, setFocusId, flashId, announce, neighbourOf } = useDropzoneFocus({
            files: dropzone.files,
            maxFiles,
        });
        const occupied = dropzone.count;
        const { bytes } = dropzone;
        const showInvalid = invalid || Boolean(dropzone.rejection);
        const current = dropzone.files[0];
        const replacingSlot = maxFiles === 1 && dropzone.files.length > 0 && !dropzone.uploading;
        const replaceTarget = maxFiles === 1 && dropzone.isDragActive && dropzone.files.length > 0;
        const limitReached = !dropzone.hasRoom && !blocks.add && !loading;
        const zoneLabel = dropzoneZoneText({
            dragging: dropzone.isDragActive,
            maxFiles,
            currentName: current?.name,
            limitReached,
            occupied,
            replacingSlot,
            prompt: labels.dropzonePrompt,
            replace: labels.dropzoneReplace,
            replaceDrop: labels.dropzoneReplaceDrop,
            limit: labels.dropzoneLimitReached,
        });
        const types = formatDropzoneLimits(accept);
        const perFile =
            maxSize != null
                ? fillLabel(labels.dropzonePerFile, { size: formatFileSize(maxSize, fileSizeUnitsFrom(labels)) })
                : '';
        const autoLimits = [types, perFile].filter(Boolean).join(' · ');
        const showHint = hint != null && hint !== '';
        const zoneLimits =
            autoLimits || showHint ? (
                <>
                    {autoLimits}
                    {autoLimits && showHint ? ' · ' : null}
                    {showHint ? hint : null}
                </>
            ) : undefined;
        const quota = dropzoneQuota({
            maxFiles,
            maxTotalSize,
            count: occupied,
            bytes,
            countTemplate: labels.dropzoneQuotaCount,
            bytesTemplate: labels.dropzoneQuotaBytes,
            units: fileSizeUnitsFrom(labels),
        });
        const zoneClosed = blocks.add || loading || !dropzone.hasRoom;
        const skeletonCount = skeletonCountFor(dropzone.files.length);

        const { removeMany } = dropzone;
        const removeSelection = useCallback(() => {
            const ids = selectedRef.current;

            if (ids.size === 0) {
                return;
            }

            const neighbour = neighbourOf(ids);
            const count = removeMany(ids);

            setSelected(new Set());
            setFocusId(neighbour?.id ?? null);
            announce(fillLabel(labels.dropzoneDeleted, { count }));
        }, [announce, labels.dropzoneDeleted, neighbourOf, removeMany, selectedRef, setFocusId, setSelected]);

        const removeOne = (file: IDropzoneFile) => {
            const neighbour = neighbourOf(new Set([file.id]));

            dropzone.remove(file);
            setFocusId(neighbour?.id ?? null);
            announce(fillLabel(labels.dropzoneDeleted, { count: 1 }));
        };

        useLayoutEffect(() => {
            deleteRef.current = removeSelection;
        }, [deleteRef, removeSelection]);

        const FileListView = list ?? (layout === 'grid' ? GridList : List);
        const FileItemView = item ?? (layout === 'grid' ? GridItem : Item);

        return (
            <div
                {...props}
                ref={setRoot}
                className={cn(dropzoneVariants({ size, variant, block }), className)}
                data-invalid={showInvalid || undefined}
                data-disabled={blocks.all || undefined}
                data-test-id={dataTestId}
                aria-busy={loading || undefined}
            >
                {title ? <p className={cn(typographyStyles.bodyM, styles.heading)}>{title}</p> : null}
                {description ? <p className={cn(typographyStyles.bodyS, styles.description)}>{description}</p> : null}
                <Zone
                    size={size}
                    variant={variant}
                    disabled={blocks.all}
                    blocked={zoneClosed}
                    loading={loading}
                    invalid={showInvalid}
                    dropTarget={dropzone.isDragActive}
                    limits={zoneLimits}
                    label={zoneLabel}
                    list={FileListView}
                    item={FileItemView}
                    filesClassName={styles.files}
                    rootProps={dropzone.getRootProps()}
                    inputProps={dropzone.getInputProps({
                        id,
                        disabled: zoneClosed,
                        'aria-label': ariaLabelledby ? undefined : zoneLabel,
                        'aria-labelledby': ariaLabelledby,
                        'aria-describedby': ariaDescribedby,
                        'aria-invalid': ariaInvalid ?? (showInvalid || undefined),
                    })}
                    between={
                        <Quota
                            text={quota.text}
                            ratio={quota.ratio}
                            now={quota.now}
                            max={quota.max}
                            full={limitReached}
                        />
                    }
                    placeholder={loading ? <FileSkeletons count={skeletonCount} layout={layout} size={size} /> : null}
                    fileList={
                        loading
                            ? undefined
                            : {
                                  files: dropzone.files,
                                  pending: dropzone.pending,
                                  canReorder: dropzone.canReorder,
                                  removable: !blocks.remove,
                                  removeDisabled: blocks.remove,
                                  disabled: blocks.all,
                                  selectable,
                                  selectedKeys: selected,
                                  onSelectionChange: setSelected,
                                  renderAction,
                                  replacing: dropzone.pending.some(entry => entry.replacing),
                                  focusId,
                                  size,
                                  listLabel: labels.dropzoneList,
                                  removeLabel: labels.dropzoneRemove,
                                  reorderLabel: labels.dropzoneReorder,
                                  retryLabel: labels.dropzoneRetry,
                                  cancelLabel: labels.dropzoneCancel,
                                  replacingLabel: labels.dropzoneReplacing,
                                  failedLabel: labels.dropzoneUploadFailed,
                                  onRemove: removeOne,
                                  onRetry: dropzone.retry,
                                  onDismiss: dropzone.cancel,
                                  onCancel: dropzone.cancel,
                                  onReorder: dropzone.setFiles,
                                  replaceTarget,
                                  flashId,
                                  willReplaceLabel: labels.dropzoneWillReplace,
                              }
                    }
                />
                {selectable && selected.size === 0 ? (
                    <p className={cn(styles.hint, typographyStyles.bodyXs)}>{labels.dropzoneSelectHint}</p>
                ) : null}
                {selectable && selected.size > 0 ? (
                    <div className={styles.toolbar} data-dropzone-toolbar="">
                        <p className={styles.quotaText}>
                            {fillLabel(labels.dropzoneSelected, { count: selected.size, total: dropzone.files.length })}
                        </p>
                        <div className={styles.toolbarActions}>
                            {selected.size < dropzone.files.length ? (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    hidden
                                    icon={{ Component: ListChecks, ...toolbarIcon }}
                                    aria-label={labels.dropzoneSelectAll}
                                    onClick={() => {
                                        setSelected(new Set(dropzone.files.map(file => file.id)));
                                    }}
                                >
                                    {labels.dropzoneSelectAll}
                                </Button>
                            ) : null}
                            <Button
                                type="button"
                                size="sm"
                                variant="danger"
                                hidden
                                icon={{ Component: Trash, ...toolbarIcon }}
                                aria-label={labels.dropzoneDeleteSelected}
                                onClick={removeSelection}
                            >
                                {labels.dropzoneDeleteSelected}
                            </Button>
                        </div>
                    </div>
                ) : null}
                {announcement.text ? (
                    <span key={announcement.tick} role="status" className={styles.live}>
                        {announcement.text}
                    </span>
                ) : null}
                {!onRejectionChange && dropzone.rejection ? (
                    <span role="alert" className={styles.rejection}>
                        {dropzone.rejection}
                    </span>
                ) : null}
            </div>
        );
    }
);

DropzoneRoot.displayName = 'Dropzone';

export const Dropzone = Object.assign(DropzoneRoot, {
    Action: DropzoneAction,
});
