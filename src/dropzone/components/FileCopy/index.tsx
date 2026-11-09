import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { useAuiLabels } from '@/provider';

import { type IDropzoneItem } from '../../types';
import { fileSizeUnitsFrom, formatFileSize } from '../../utils';
import { Progress } from '../Progress';

import styles from './styles.module.css';

/** Name, size or error, and the upload bar. */
export const FileCopy = ({
    file,
    progress,
    failedLabel,
    replaceLabel,
    progressClassName,
}: Pick<IDropzoneItem, 'file' | 'progress' | 'failedLabel' | 'replaceLabel'> & {
    /** Pulls the bar out of the row padding. */
    progressClassName?: string;
}) => {
    const labels = useAuiLabels();

    return (
        <div className={styles.copy}>
            <span className={styles.name}>{file.name}</span>
            {failedLabel ? (
                <span className={cn(styles.failed, typographyStyles.bodyXs)} title={failedLabel}>
                    {failedLabel}
                </span>
            ) : (
                <span className={cn(styles.fileSize, typographyStyles.bodyXs)}>
                    {formatFileSize(file.size, fileSizeUnitsFrom(labels))}
                </span>
            )}
            {progress !== undefined ? (
                <Progress className={progressClassName} name={file.name} value={progress} />
            ) : null}
            {replaceLabel ? <span className={styles.replacing}>{replaceLabel}</span> : null}
        </div>
    );
};
