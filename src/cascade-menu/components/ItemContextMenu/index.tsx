import { type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { ContextMenu, type IContextMenuControlProps, type IContextMenuOwnProps } from '@/context-menu';
import { ExternalLink, Pin, PinOff } from '@/icons';
import { useAuiLabels } from '@/provider';

/** Local RMB menu state for CascadeMenu. */
export interface IItemContextMenuState {
    code: string;
    x: number;
    y: number;
    link?: string;
    pinned: boolean;
    canTogglePin: boolean;
    pinEnabled: boolean;
}

export interface IItemContextMenuProps
    extends IDataTestIdProps, Pick<IContextMenuControlProps, 'onClose'>, Pick<IContextMenuOwnProps, 'onMouseEnter'> {
    menu: IItemContextMenuState;
    menuRef?: Ref<HTMLDivElement>;
    onTogglePin: (code: string) => void;
}

/** Pin / unpin / open-in-new-tab context menu. */
export const ItemContextMenu = ({
    menu,
    dataTestId,
    menuRef,
    onClose,
    onTogglePin,
    onMouseEnter,
}: IItemContextMenuProps) => {
    const { pinMenuItem, unpinMenuItem, openInNewTab } = useAuiLabels();

    return (
        <ContextMenu
            open
            x={menu.x}
            y={menu.y}
            onClose={onClose}
            onMouseEnter={onMouseEnter}
            ref={menuRef}
            dataTestId={dataTestId ? `${dataTestId}-context` : undefined}
        >
            {menu.pinEnabled ? (
                <ContextMenu.Item
                    icon={menu.pinned ? PinOff : Pin}
                    disabled={!menu.canTogglePin}
                    dataTestId={dataTestId ? `${dataTestId}-context-pin` : undefined}
                    onClick={() => {
                        onTogglePin(menu.code);
                        onClose();
                    }}
                >
                    {menu.pinned ? unpinMenuItem : pinMenuItem}
                </ContextMenu.Item>
            ) : null}
            {menu.pinEnabled && menu.link ? <ContextMenu.Separator /> : null}
            {menu.link ? (
                <ContextMenu.Item
                    icon={ExternalLink}
                    dataTestId={dataTestId ? `${dataTestId}-context-new-tab` : undefined}
                    onClick={() => {
                        window.open(menu.link, '_blank', 'noopener,noreferrer');
                        onClose();
                    }}
                >
                    {openInNewTab}
                </ContextMenu.Item>
            ) : null}
        </ContextMenu>
    );
};

ItemContextMenu.displayName = 'CascadeMenu.ItemContextMenu';
