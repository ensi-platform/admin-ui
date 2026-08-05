import { type ReactNode } from 'react';

import cn from 'classnames';

import { PanelLeft, PanelLeftClose } from '@/icons';

import styles from './styles.module.css';

export interface IHeaderProps {
    children?: ReactNode;
    layoutCollapsed: boolean;
    collapsed: boolean;
    expandSidebar: string;
    collapseSidebar: string;
    dataTestId?: string;
    onToggleCollapsed: () => void;
    onTrimChrome: () => void;
}

/** Header chrome: brand slot + collapse control. */
export const Header = ({
    children,
    layoutCollapsed,
    collapsed,
    expandSidebar,
    collapseSidebar,
    dataTestId,
    onToggleCollapsed,
    onTrimChrome,
}: IHeaderProps) => {
    const CollapseIcon = collapsed ? PanelLeft : PanelLeftClose;

    const collapseBtn = (
        <button
            type="button"
            className={styles.collapseBtn}
            aria-label={collapsed ? expandSidebar : collapseSidebar}
            aria-expanded={!collapsed}
            onClick={onToggleCollapsed}
            data-test-id={dataTestId ? `${dataTestId}-collapse` : undefined}
        >
            <CollapseIcon className={styles.collapseIcon} />
        </button>
    );

    return (
        <div
            className={cn(styles.brand, layoutCollapsed && styles.collapsed)}
            onMouseEnter={onTrimChrome}
            onMouseMove={onTrimChrome}
        >
            <div className={styles.brandRow}>
                {children ? (
                    <div className={styles.brandLogo}>{children}</div>
                ) : (
                    <span className={styles.brandLogoSpacer} />
                )}
                {layoutCollapsed ? null : collapseBtn}
            </div>
            {layoutCollapsed ? collapseBtn : null}
        </div>
    );
};

Header.displayName = 'CascadeMenu.Header';
