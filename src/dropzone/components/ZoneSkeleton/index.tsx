import styles from './styles.module.css';

/** Placeholder for the drop box while the zone is loading. */
export const ZoneSkeleton = () => (
    <>
        <span className={styles.mark} data-dropzone-zone-skeleton="" />
        <span className={styles.line} data-dropzone-zone-skeleton="" />
        <span className={styles.line} data-dropzone-zone-skeleton="" data-short="" />
    </>
);
