import { File, Image } from '@/icons';

import styles from './styles.module.css';

/** File type icon. Images use the image mark, everything else the file mark. */
export const TypeMark = ({ type }: { type: string }) => {
    const Icon = type.startsWith('image/') ? Image : File;

    return <Icon className={styles.typeIcon} />;
};
