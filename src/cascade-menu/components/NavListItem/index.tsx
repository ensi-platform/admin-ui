import { type MouseEvent as ReactMouseEvent } from 'react';

import { MenuList } from '@/menu-list';

import { type IHoverLeafEnter, type IHoverPendingItem } from '../../hooks/useHoverMenu';
import { type ICascadeMenuItem } from '../../utils';

export interface IItemContextMenuRequest {
    code: string;
    x: number;
    y: number;
    link?: string;
    /** Show Pin/Unpin (false on L0 tree). */
    pinEnabled: boolean;
}

export interface INavListItemProps {
    item: ICascadeMenuItem;
    open: boolean;
    onFolderEnter: (payload: IHoverPendingItem) => void;
    onLeafEnter: (payload: IHoverLeafEnter) => void;
    onFolderLeave: (event: ReactMouseEvent) => void;
    getAim: () => IHoverLeafEnter;
    enablePins: boolean;
    allowPin: boolean;
    onItemContextMenu?: (payload: IItemContextMenuRequest) => void;
}

export const NavListItem = ({
    item,
    open,
    onFolderEnter,
    onLeafEnter,
    onFolderLeave,
    getAim,
    enablePins,
    allowPin,
    onItemContextMenu,
}: INavListItemProps) => {
    const hasChildren = Boolean(item.children?.length);

    const openFolder = (anchorEl: HTMLElement) => {
        onFolderEnter({
            code: item.code,
            anchorEl,
            ...getAim(),
        });
    };

    const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
        if (!hasChildren) {
            return;
        }

        event.preventDefault();
        openFolder(event.currentTarget);
    };

    const handleEnter = (event: ReactMouseEvent<HTMLElement>) => {
        if (!hasChildren) {
            onLeafEnter(getAim());
            return;
        }

        openFolder(event.currentTarget);
    };

    const handleContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
        if (!enablePins || !onItemContextMenu) {
            return;
        }

        const link = hasChildren ? undefined : item.link;

        if (!allowPin && !link) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        onItemContextMenu({
            code: item.code,
            x: event.clientX,
            y: event.clientY,
            link,
            pinEnabled: allowPin,
        });
    };

    return (
        <MenuList.Item
            id={item.code}
            icon={item.icon}
            hasChildren={hasChildren}
            open={open}
            href={hasChildren ? undefined : item.link}
            onClick={handleClick}
            onMouseEnter={handleEnter}
            onContextMenu={handleContextMenu}
            onMouseLeave={hasChildren ? onFolderLeave : undefined}
        >
            {item.text}
        </MenuList.Item>
    );
};

NavListItem.displayName = 'CascadeMenu.NavListItem';
