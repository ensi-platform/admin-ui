import { useEffect, useState } from 'react';

import { type IDropzoneFile } from '../../types';
import { TypeMark } from '../TypeMark';

import styles from './styles.module.css';

const showsImage = (file: { type: string; url?: string; file?: unknown }) =>
    file.type.startsWith('image/') && Boolean(file.file || file.url);

const TypeBox = ({ type }: { type: string }) => (
    <div className={styles.preview}>
        <TypeMark type={type} />
    </div>
);

/** Picture, or the file type when there is no picture. */
export const Preview = ({ file }: { file: IDropzoneFile }) => {
    const picture = showsImage(file);
    const [made, setMade] = useState<{ source: File; url: string } | null>(null);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const objectUrl = made && made.source === file.file ? made.url : null;
    const src = (picture && file.file ? objectUrl : file.url) ?? null;
    const failed = failedSrc != null && failedSrc === src;

    useEffect(() => {
        if (!picture || !file.file) {
            return undefined;
        }

        const url = URL.createObjectURL(file.file);

        setMade({ source: file.file, url });

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file.file, picture]);

    if (!picture || failed || !src) {
        return <TypeBox type={file.type} />;
    }

    return <img className={styles.preview} src={src} alt={file.name} onError={() => setFailedSrc(src)} />;
};
