import { type ReactNode } from 'react';

import cn from 'classnames';

import { PanelLeft, PanelLeftClose, Search as SearchIcon } from '@/icons';

import { useSearchTrigger } from '../Search/context';

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
    const { open, searchMenu, dataTestId: searchTestId, openSearch } = useSearchTrigger();

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

    const actions = (
        <div className={styles.actions}>
            <button
                type="button"
                className={styles.collapseBtn}
                aria-label={searchMenu}
                aria-expanded={open}
                aria-haspopup="dialog"
                onClick={openSearch}
                data-test-id={searchTestId ? `${searchTestId}-search-toggle` : undefined}
            >
                <SearchIcon className={styles.collapseIcon} />
            </button>
            {collapseBtn}
        </div>
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
                {layoutCollapsed ? null : actions}
            </div>
            {layoutCollapsed ? actions : null}
        </div>
    );
};

Header.displayName = 'CascadeMenu.Header';
