import { type MouseEvent as ReactMouseEvent } from 'react';

import cn from 'classnames';

import { MenuList } from '@/menu-list';

import { type IHoverLeafEnter, type IHoverPendingItem } from '../../hooks/useHoverMenu';
import { type ICascadeMenuItem } from '../../utils';
import { NavListItem, type IItemContextMenuRequest } from '../NavListItem';

import styles from './styles.module.css';

export type { IItemContextMenuRequest };

export interface INavListProps {
    items: ICascadeMenuItem[];
    level: number;
    activeId?: string;
    openCodes: Set<string>;
    collapsed?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary';
    className?: string;
    onChange?: (value: string) => void;
    onFolderEnter: (payload: IHoverPendingItem) => void;
    onLeafEnter: (payload: IHoverLeafEnter) => void;
    onFolderLeave: (event: ReactMouseEvent) => void;
    onLeafActivate: () => void;
    /** Live outermost flyout (read at enter time, like Auchan). */
    getAimSubmenu?: () => HTMLElement | null;
    /** Live L0 / menu height for aim triangle. */
    getAimMenuHeight?: () => number | undefined;
    onMouseMove?: (event: ReactMouseEvent) => void;
    /** Enable RMB context actions for pins. */
    enablePins?: boolean;
    /** Allow Pin/Unpin in context (flyout / pinned; not L0 tree). */
    allowPin?: boolean;
    onItemContextMenu?: (payload: IItemContextMenuRequest) => void;
    dataTestId?: string;
}

/** Shared L0 / list chrome forwarded from CascadeMenu. */
export type TNavListChrome = Pick<
    INavListProps,
    | 'activeId'
    | 'size'
    | 'variant'
    | 'onChange'
    | 'onFolderLeave'
    | 'onLeafActivate'
    | 'getAimSubmenu'
    | 'getAimMenuHeight'
    | 'onMouseMove'
    | 'onItemContextMenu'
>;

export const NavList = ({
    items,
    level,
    activeId,
    openCodes,
    collapsed = false,
    size = 'md',
    variant = 'primary',
    className,
    onChange,
    onFolderEnter,
    onLeafEnter,
    onFolderLeave,
    onLeafActivate,
    getAimSubmenu,
    getAimMenuHeight,
    onMouseMove,
    enablePins = false,
    allowPin = false,
    onItemContextMenu,
    dataTestId,
}: INavListProps) => {
    const getAim = (): IHoverLeafEnter => ({
        level,
        submenu: getAimSubmenu?.() ?? null,
        menuHeight: getAimMenuHeight?.(),
    });

    const handleColumnMouseMove = (event: ReactMouseEvent) => {
        onMouseMove?.(event);

        const { target } = event;

        if (!(target instanceof Element) || target.closest('[data-menu-list-item]')) {
            return;
        }

        onLeafEnter(getAim());
    };

    return (
        <div className={cn(styles.column, className)} onMouseMove={handleColumnMouseMove}>
            <MenuList
                size={size}
                variant={variant}
                value={activeId}
                onChange={id => {
                    onChange?.(id);
                    onLeafActivate();
                }}
                collapsed={collapsed}
                dataTestId={dataTestId}
            >
                {items.map(item => (
                    <NavListItem
                        key={item.code}
                        item={item}
                        open={openCodes.has(item.code)}
                        onFolderEnter={onFolderEnter}
                        onLeafEnter={onLeafEnter}
                        onFolderLeave={onFolderLeave}
                        getAim={getAim}
                        enablePins={enablePins}
                        allowPin={allowPin}
                        onItemContextMenu={onItemContextMenu}
                    />
                ))}
            </MenuList>
        </div>
    );
};

NavList.displayName = 'CascadeMenu.NavList';
