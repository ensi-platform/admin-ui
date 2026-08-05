import { useCallback, useRef, useState, type RefObject } from 'react';

import { type IItemContextMenuState } from '../components/ItemContextMenu';
import { type IItemContextMenuRequest } from '../components/NavList';
import { type ICascadeMenuItem, isCascadeRootCode } from '../utils';

export interface IUseItemContextMenuOptions {
    roots: ICascadeMenuItem[];
    openPath: string[];
    isPinned: (code: string) => boolean;
    canPin: (code: string) => boolean;
    togglePin: (code: string) => void;
    /** Freeze open-source / abort leave before menu opens. */
    onBeforeOpen: () => void;
}

export interface IUseItemContextMenuResult {
    menu: IItemContextMenuState | null;
    menuRef: RefObject<HTMLDivElement | null>;
    open: boolean;
    onItemContextMenu: (payload: IItemContextMenuRequest) => void;
    close: () => void;
    onTogglePin: (code: string) => void;
}

/** RMB pin / new-tab menu state for CascadeMenu. */
export const useItemContextMenu = ({
    roots,
    openPath,
    isPinned,
    canPin,
    togglePin,
    onBeforeOpen,
}: IUseItemContextMenuOptions): IUseItemContextMenuResult => {
    const [menu, setMenu] = useState<IItemContextMenuState | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const pathAtOpenRef = useRef<string | null>(null);
    const onBeforeOpenRef = useRef(onBeforeOpen);
    onBeforeOpenRef.current = onBeforeOpen;

    const openPathKey = openPath.join('\0');

    if (menu !== null && pathAtOpenRef.current !== openPathKey) {
        pathAtOpenRef.current = null;
        setMenu(null);
    }

    const close = useCallback(() => {
        pathAtOpenRef.current = null;
        setMenu(null);
    }, []);

    const onItemContextMenu = useCallback(
        ({ code, x, y, link, pinEnabled }: IItemContextMenuRequest) => {
            onBeforeOpenRef.current();
            pathAtOpenRef.current = openPathKey;
            setMenu({
                code,
                x,
                y,
                link,
                pinEnabled,
                pinned: isPinned(code),
                canTogglePin: pinEnabled && canPin(code),
            });
        },
        [canPin, isPinned, openPathKey]
    );

    const onTogglePin = useCallback(
        (code: string) => {
            if (isCascadeRootCode(roots, code) && !isPinned(code)) {
                return;
            }

            togglePin(code);
        },
        [isPinned, roots, togglePin]
    );

    return {
        menu,
        menuRef,
        open: menu !== null,
        onItemContextMenu,
        close,
        onTogglePin,
    };
};
