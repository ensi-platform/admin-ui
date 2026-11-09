import styles from '../../styles.module.css';

/** Count and byte meter above the file list. */
export const Quota = ({
    text,
    ratio,
    now,
    max,
    full,
}: {
    text: string;
    ratio: number;
    now: number;
    max: number;
    full: boolean;
}) => {
    if (!text) {
        return null;
    }

    return (
        <div className={styles.quota} data-full={full || undefined}>
            <p className={styles.quotaText}>{text}</p>
            <div
                className={styles.meter}
                data-full={full || undefined}
                role="meter"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={now}
                aria-valuetext={text}
                aria-label={text}
            >
                <span style={{ width: `${ratio * 100}%` }} />
            </div>
        </div>
    );
};
