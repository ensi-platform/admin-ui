import { type ButtonHTMLAttributes, type ReactNode } from 'react';

import cn from 'classnames';

import { type TSVGRIcon } from '@ds/common';

import styles from './styles.module.css';

/** File-row button. `hidden` keeps only the icon; otherwise the label is visible. */
export const DropzoneAction = ({
    children,
    className,
    hidden = false,
    icon: Icon,
    ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    children: ReactNode;
    /** Hide the text. The accessible name stays the children. */
    hidden?: boolean;
    /** Icon shown beside the text, or alone when `hidden`. */
    icon?: TSVGRIcon;
}) => (
    <button className={cn(styles.action, !hidden && styles.text, className)} {...props} type="button">
        {Icon ? <Icon className={styles.actionIcon} focusable={false} /> : null}
        {hidden ? <span className={styles.actionLabel}>{children}</span> : children}
    </button>
);

DropzoneAction.displayName = 'Dropzone.Action';
