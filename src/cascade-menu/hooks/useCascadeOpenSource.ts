import { type MouseEvent as ReactMouseEvent, type RefObject, useCallback, useMemo, useRef } from 'react';

import { PINNED_ROOT_CODE } from '../constants';
import { isNodeInsideCascadeChrome } from '../utils';

import { type IHoverLeafEnter, type IHoverPendingItem } from './useHoverMenu';

export type TOpenSource = 'pinned' | 'tree' | null;

const noopFolderEnter = (() => undefined) as (payload: IHoverPendingItem) => void;
const noopLeafEnter = (() => undefined) as (payload: IHoverLeafEnter) => void;
const EMPTY_OPEN_CODES = new Set<string>();

export interface IUseCascadeOpenSourceOptions {
    openPath: string[];
    layersLength: number;
    widthAnimating: boolean;
    resizing: boolean;
    contextMenuOpen: boolean;
    rootRef: RefObject<HTMLElement | null>;
    flyoutRefs: RefObject<(HTMLDivElement | null)[]>;
    contextMenuRef: RefObject<HTMLDivElement | null>;
    onFolderEnter: (payload: IHoverPendingItem) => void;
    onLeafEnter: (payload: IHoverLeafEnter) => void;
    onFolderLeave: () => void;
    onMouseMove: (event: ReactMouseEvent) => void;
}

export interface IUseCascadeOpenSourceResult {
    openCodes: Set<string>;
    pinnedOpenCodes: Set<string>;
    treeOpenCodes: Set<string>;
    activeFolderEnter: (payload: IHoverPendingItem) => void;
    activeLeafEnter: (payload: IHoverLeafEnter) => void;
    enterFromPinnedFolder: (payload: IHoverPendingItem) => void;
    enterFromPinnedLeaf: (payload: IHoverLeafEnter) => void;
    enterFromTreeFolder: (payload: IHoverPendingItem) => void;
    enterFromTreeLeaf: (payload: IHoverLeafEnter) => void;
    trimL0Chrome: () => void;
    handleFolderLeave: (event: ReactMouseEvent) => void;
    handleFlyoutChromeMove: (level: number) => (event: ReactMouseEvent) => void;
    getAimSubmenu: () => HTMLElement | null;
    getAimMenuHeight: () => number | undefined;
}

/** L0 open-source (pinned vs tree) + aim hover wiring. */
export const useCascadeOpenSource = ({
    openPath,
    layersLength,
    widthAnimating,
    resizing,
    contextMenuOpen,
    rootRef,
    flyoutRefs,
    contextMenuRef,
    onFolderEnter,
    onLeafEnter,
    onFolderLeave,
    onMouseMove,
}: IUseCascadeOpenSourceOptions): IUseCascadeOpenSourceResult => {
    let openSource: TOpenSource = null;

    if (openPath.length > 0) {
        openSource = openPath[0] === PINNED_ROOT_CODE ? 'pinned' : 'tree';
    }

    const openSourceRef = useRef<TOpenSource>(openSource);
    openSourceRef.current = openSource;

    const openPathKey = openPath.join('\0');
    const openCodes = useMemo(() => {
        if (!openPathKey) {
            return new Set<string>();
        }

        return new Set(openPathKey.split('\0'));
    }, [openPathKey]);
    const pinnedOpenCodes = openSource === 'pinned' ? openCodes : EMPTY_OPEN_CODES;
    const treeOpenCodes = openSource === 'tree' ? openCodes : EMPTY_OPEN_CODES;

    const getAimSubmenu = useCallback(() => flyoutRefs.current[layersLength - 1] ?? null, [flyoutRefs, layersLength]);

    const getAimMenuHeight = useCallback(() => rootRef.current?.getBoundingClientRect().height, [rootRef]);

    const isInsideMenuChrome = useCallback(
        (node: Node | null) =>
            isNodeInsideCascadeChrome(node, {
                root: rootRef.current,
                flyouts: flyoutRefs.current,
                contextMenu: contextMenuRef.current,
            }),
        [contextMenuRef, flyoutRefs, rootRef]
    );

    const handleFolderLeave = useCallback(
        (event: ReactMouseEvent) => {
            if (contextMenuOpen) {
                return;
            }

            const related = event.relatedTarget;

            if (related instanceof Node && isInsideMenuChrome(related)) {
                return;
            }

            onFolderLeave();
        },
        [contextMenuOpen, isInsideMenuChrome, onFolderLeave]
    );

    const hoverFrozen = widthAnimating || contextMenuOpen || resizing;
    const hoverFrozenRef = useRef(false);
    hoverFrozenRef.current = hoverFrozen;

    const activeFolderEnter = hoverFrozen ? noopFolderEnter : onFolderEnter;
    const activeLeafEnter = hoverFrozen ? noopLeafEnter : onLeafEnter;

    const enterFromPinnedFolder = useCallback(
        (payload: IHoverPendingItem) => {
            activeFolderEnter({
                ...payload,
                preferImmediate: openSourceRef.current !== 'pinned',
            });
        },
        [activeFolderEnter]
    );

    const enterFromTreeFolder = useCallback(
        (payload: IHoverPendingItem) => {
            activeFolderEnter({
                ...payload,
                preferImmediate: openSourceRef.current !== 'tree',
            });
        },
        [activeFolderEnter]
    );

    const trimL0Chrome = useCallback(() => {
        if (hoverFrozenRef.current) {
            return;
        }

        onLeafEnter({
            level: 0,
            submenu: getAimSubmenu(),
            menuHeight: getAimMenuHeight(),
        });
    }, [getAimMenuHeight, getAimSubmenu, onLeafEnter]);

    const handleFlyoutChromeMove = useCallback(
        (level: number) => (event: ReactMouseEvent) => {
            onMouseMove(event);

            if (hoverFrozenRef.current) {
                return;
            }

            const { target } = event;

            if (!(target instanceof Element) || target.closest('[data-menu-list-item]')) {
                return;
            }

            onLeafEnter({
                level,
                submenu: getAimSubmenu(),
                menuHeight: getAimMenuHeight(),
            });
        },
        [getAimMenuHeight, getAimSubmenu, onLeafEnter, onMouseMove]
    );

    return {
        openCodes,
        pinnedOpenCodes,
        treeOpenCodes,
        activeFolderEnter,
        activeLeafEnter,
        enterFromPinnedFolder,
        enterFromPinnedLeaf: activeLeafEnter,
        enterFromTreeFolder,
        enterFromTreeLeaf: activeLeafEnter,
        trimL0Chrome,
        handleFolderLeave,
        handleFlyoutChromeMove,
        getAimSubmenu,
        getAimMenuHeight,
    };
};
