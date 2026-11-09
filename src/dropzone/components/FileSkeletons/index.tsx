import { type TDropzoneLayout, type TDropzoneSize } from '../../types';

import styles from './styles.module.css';

/** Placeholder rows or cards while the file list is loading. */
export const FileSkeletons = ({
    count,
    layout,
    size,
}: {
    count: number;
    layout: TDropzoneLayout;
    size: TDropzoneSize;
}) => (
    <div
        className={styles.skeletons}
        data-dropzone-skeletons=""
        data-layout={layout}
        style={{ ['--aui-dropzone-skeleton-h' as string]: `var(--aui-dropzone-row-h-${size})` }}
        aria-hidden="true"
    >
        {Array.from({ length: count }, (_, index) => (
            <div key={index} className={styles.skeleton} data-dropzone-skeleton="">
                <span className={styles.tile} data-dropzone-skeleton-tile="" />
                <span className={styles.copy}>
                    <span className={styles.line} data-dropzone-skeleton-line="" />
                    <span className={styles.line} data-dropzone-skeleton-line="" data-short="" />
                </span>
            </div>
        ))}
    </div>
);
