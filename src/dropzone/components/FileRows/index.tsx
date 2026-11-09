import { GridList } from 'react-aria-components';

import { useFileList } from '../../hooks/useFileList';
import { type IFileListProps, type TDropzoneLayout } from '../../types';

import gridStyles from '../GridList/styles.module.css';
import listStyles from '../List/styles.module.css';

/** Settled files and rows that are still uploading. */
export const FileRows = ({ layout, ...props }: IFileListProps & { layout: TDropzoneLayout }) => {
    const {
        item: Row,
        files,
        pending,
        canReorder,
        disabled,
        selectable = false,
        selectedKeys,
        renderAction,
        replacing = false,
        replaceTarget = false,
        flashId = null,
        willReplaceLabel,
        size,
        listLabel,
        reorderLabel,
        replacingLabel,
        failedLabel,
        removable,
        removeDisabled = false,
    } = props;
    const { listRef, dragAndDropHooks, shifts, flipping, actionsFor, onSelectionChange } = useFileList(props);
    const className = layout === 'grid' ? gridStyles.grid : listStyles.list;

    if (files.length === 0 && pending.length === 0) {
        return null;
    }

    return (
        <>
            {pending.length > 0 ? (
                <div className={className} data-disabled={disabled || undefined}>
                    {pending.map(item => {
                        const failed = item.status === 'error';

                        return (
                            <Row
                                key={item.id}
                                element="div"
                                elementProps={{
                                    'data-file-id': item.id,
                                    'data-replacing': item.replacing || undefined,
                                }}
                                file={{
                                    id: item.id,
                                    name: item.name,
                                    size: item.size,
                                    type: item.type,
                                    file: item.file,
                                }}
                                selected={false}
                                size={size}
                                actions={actionsFor({ kind: 'pending', id: item.id })}
                                failedLabel={failed ? item.error || failedLabel : undefined}
                                progress={failed ? undefined : item.progress}
                            />
                        );
                    })}
                </div>
            ) : null}
            {files.length > 0 ? (
                <GridList
                    ref={listRef}
                    key={canReorder ? 'reorder' : 'static'}
                    aria-label={listLabel}
                    className={className}
                    data-disabled={disabled || undefined}
                    items={[...files]}
                    dependencies={[
                        replacing,
                        replaceTarget,
                        flashId,
                        replacingLabel,
                        willReplaceLabel,
                        renderAction,
                        removable,
                        removeDisabled,
                        canReorder,
                        shifts,
                        flipping,
                        size,
                        selectable && selectedKeys ? [...selectedKeys].sort().join('\0') : '',
                    ]}
                    selectionMode={selectable ? 'multiple' : 'none'}
                    selectionBehavior="toggle"
                    selectedKeys={selectable ? selectedKeys : undefined}
                    onSelectionChange={onSelectionChange}
                    dragAndDropHooks={canReorder ? dragAndDropHooks : undefined}
                >
                    {file => {
                        const shift = shifts[file.id];
                        const selected = Boolean(selectable && selectedKeys?.has(file.id));
                        let replaceLabel: string | undefined;

                        if (replacing) {
                            replaceLabel = replacingLabel;
                        }

                        if (!replacing && replaceTarget) {
                            replaceLabel = willReplaceLabel;
                        }

                        return (
                            <Row
                                element="row"
                                elementProps={{
                                    id: file.id,
                                    textValue: file.name,
                                    'aria-label': file.name,
                                    'data-file-id': file.id,
                                    ...(layout === 'list' ? { 'data-layout': 'stacked' as const } : {}),
                                    'data-replacing': replacing || replaceTarget || undefined,
                                    'data-flash': flashId === file.id || undefined,
                                    'data-flip': flipping || undefined,
                                    style:
                                        shift && (shift.x !== 0 || shift.y !== 0)
                                            ? { transform: `translate(${shift.x}px, ${shift.y}px)` }
                                            : undefined,
                                }}
                                file={file}
                                selected={selected}
                                size={size}
                                gripLabel={canReorder ? reorderLabel : undefined}
                                actions={actionsFor({ kind: 'file', file })}
                                action={renderAction?.(file)}
                                replaceLabel={replaceLabel}
                            />
                        );
                    }}
                </GridList>
            ) : null}
        </>
    );
};

FileRows.displayName = 'Dropzone.FileRows';
