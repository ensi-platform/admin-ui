import cn from 'classnames';

import styles from './styles.module.css';

/** Upload bar. Placement (`className`) belongs to the item. */
export const Progress = ({ name, value, className }: { name: string; value: number | null; className?: string }) => (
    <div
        className={cn(styles.progress, value == null && styles.indeterminate, className)}
        role="progressbar"
        aria-valuemin={value == null ? undefined : 0}
        aria-valuemax={value == null ? undefined : 100}
        aria-valuenow={value ?? undefined}
        aria-label={name}
    >
        {value == null ? <span /> : <span style={{ width: `${value}%` }} />}
    </div>
);
