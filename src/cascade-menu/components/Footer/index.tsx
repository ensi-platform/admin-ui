import { type ReactNode } from 'react';

import styles from './styles.module.css';

export interface IFooterProps {
    children: ReactNode;
    onTrimChrome: () => void;
}

/** Footer chrome: divider + padding around the app slot. */
export const Footer = ({ children, onTrimChrome }: IFooterProps) => (
    <div className={styles.footer} onMouseEnter={onTrimChrome} onMouseMove={onTrimChrome}>
        {children}
    </div>
);

Footer.displayName = 'CascadeMenu.Footer';
