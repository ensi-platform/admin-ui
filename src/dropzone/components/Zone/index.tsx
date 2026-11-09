import { type ComponentType, type InputHTMLAttributes, type ReactNode } from 'react';

import cn from 'classnames';
import { type DropzoneInputProps, type DropzoneRootProps } from 'react-dropzone';

import { Upload } from '@/icons';

import { type IDropzoneItem, type IFileListProps, type TDropzoneSize, type TDropzoneVariant } from '../../types';
import { ZoneSkeleton } from '../ZoneSkeleton';

import styles from './styles.module.css';

export interface IZoneProps {
    size: TDropzoneSize;
    variant: TDropzoneVariant;
    disabled?: boolean;
    invalid?: boolean;
    dropTarget?: boolean;
    /** Full list: the zone stays, but it does not take files. */
    blocked?: boolean;
    /** Placeholder instead of the icon and the prompt. */
    loading?: boolean;
    label: string;
    rootProps: DropzoneRootProps;
    inputProps: DropzoneInputProps;
    limits?: ReactNode;
    /** File list implementation. */
    list: ComponentType<IFileListProps>;
    /** File element implementation. Passed into `list`. */
    item: ComponentType<IDropzoneItem>;
    /** Settled and pending files. Absent while the list is replaced by `placeholder`. */
    fileList?: Omit<IFileListProps, 'item'>;
    /** Quota and other nodes between the drop box and the files. */
    between?: ReactNode;
    /** Shown instead of the file list. */
    placeholder?: ReactNode;
    filesClassName?: string;
}

export const Zone = ({
    size,
    variant,
    disabled,
    invalid,
    dropTarget,
    blocked,
    loading = false,
    label,
    rootProps,
    inputProps,
    limits,
    list: ListView,
    item: ItemView,
    fileList,
    between,
    placeholder,
    filesClassName,
}: IZoneProps) => {
    const { className: rootClassName, ...root } = rootProps;
    const { className: inputClassName, ...input } = inputProps;

    return (
        <>
            <div
                {...root}
                className={cn(styles.zone, styles[size], styles[variant], rootClassName)}
                data-disabled={disabled || undefined}
                data-blocked={blocked || undefined}
                data-invalid={invalid || undefined}
                data-drop-target={dropTarget || undefined}
            >
                <input {...(input as InputHTMLAttributes<HTMLInputElement>)} className={inputClassName} />
                {loading ? (
                    <ZoneSkeleton />
                ) : (
                    <>
                        <Upload className={styles.mark} />
                        <p className={styles.prompt}>{label}</p>
                        {limits ? <p className={styles.limits}>{limits}</p> : null}
                    </>
                )}
            </div>
            {between}
            {placeholder}
            {fileList ? (
                <div className={filesClassName} data-dropzone-list="">
                    <ListView item={ItemView} {...fileList} />
                </div>
            ) : null}
        </>
    );
};

Zone.displayName = 'Dropzone.Zone';
