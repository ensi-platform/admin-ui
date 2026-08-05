import { useCallback, useMemo, useRef, useState } from 'react';

import cn from 'classnames';

import { Pin } from '@/icons';
import { useAuiLabels } from '@/provider';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ItemContextMenu } from './components/ItemContextMenu';
import { NavList, type TNavListChrome } from './components/NavList';
import { PinnedSection } from './components/PinnedSection';
import { Submenus } from './components/Submenus';
import { COLLAPSED_WIDTH, DEFAULT_MAX_WIDTH, DEFAULT_MIN_WIDTH, DEFAULT_WIDTH, PINNED_ROOT_CODE } from './constants';
import { useCascadeDismiss } from './hooks/useCascadeDismiss';
import { useCascadeMenuChrome } from './hooks/useCascadeMenuChrome';
import { useCascadeOpenSource } from './hooks/useCascadeOpenSource';
import { useCascadeResize } from './hooks/useCascadeResize';
import { useHoverMenu } from './hooks/useHoverMenu';
import { useItemContextMenu } from './hooks/useItemContextMenu';
import { usePinnedCodes } from './hooks/usePinnedCodes';
import { useWidthAnimation } from './hooks/useWidthAnimation';
import { type ICascadeMenuProps } from './types';
import {
    DEFAULT_MAX_PINNED,
    filterCascadeMenuItems,
    findActiveCodeByPath,
    resolvePinnedItems,
    type ICascadeMenuItem,
} from './utils';

import styles from './styles.module.css';

export const CascadeMenu = ({
    ref,
    header,
    items,
    allowedCodes,
    activePath,
    value,
    defaultValue,
    onChange,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    width: widthProp,
    defaultWidth = DEFAULT_WIDTH,
    onWidthChange,
    minWidth = DEFAULT_MIN_WIDTH,
    maxWidth = DEFAULT_MAX_WIDTH,
    footer,
    pinUserId,
    pinnedCodes: pinnedCodesProp,
    defaultPinnedCodes,
    onPinnedChange,
    maxPinned = DEFAULT_MAX_PINNED,
    size = 'md',
    variant = 'primary',
    className,
    dataTestId,
    style,
    ...props
}: ICascadeMenuProps) => {
    // Labels / hover / pins
    const { collapseSidebar, expandSidebar, resizeSidebar, pinnedSection, pinnedSectionHint } = useAuiLabels();
    const { layers, openPath, onMouseMove, onFolderEnter, onLeafEnter, onFolderLeave, cancelLeave, collapse } =
        useHoverMenu();
    const { pinnedCodes, isPinned, togglePin, canPin } = usePinnedCodes({
        pinUserId,
        pinnedCodes: pinnedCodesProp,
        defaultPinnedCodes,
        onPinnedChange,
        maxPinned,
    });

    // Refs
    const rootRef = useRef<HTMLElement | null>(null);
    const flyoutRefs = useRef<(HTMLDivElement | null)[]>([]);
    const onBeforeContextOpenRef = useRef<() => void>(() => undefined);

    const setRootRef = useCallback(
        (node: HTMLElement | null) => {
            rootRef.current = node;

            if (typeof ref === 'function') {
                ref(node);
                return;
            }

            if (ref) {
                ref.current = node;
            }
        },
        [ref]
    );

    // Chrome / active / width animation
    const { width, setWidth, discardWidthDraft, collapsed, setCollapsed } = useCascadeMenuChrome({
        pinUserId,
        width: widthProp,
        defaultWidth,
        collapsed: collapsedProp,
        defaultCollapsed,
        minWidth,
        maxWidth,
        onWidthChange,
        onCollapsedChange,
    });
    const [uncontrolledActive, setUncontrolledActive] = useState(defaultValue);
    const { layoutCollapsed, widthAnimating, handleWidthTransitionEnd } = useWidthAnimation(collapsed, collapse);

    // Derived items
    const roots = useMemo(() => filterCascadeMenuItems(items, allowedCodes), [allowedCodes, items]);
    const pathActive = findActiveCodeByPath(roots, activePath);
    const activeId = value !== undefined ? value : (pathActive ?? uncontrolledActive);
    const pinnedItems = useMemo(() => resolvePinnedItems(roots, pinnedCodes), [pinnedCodes, roots]);
    const pinnedRootItem = useMemo((): ICascadeMenuItem | null => {
        if (pinnedItems.length === 0) {
            return null;
        }

        return {
            code: PINNED_ROOT_CODE,
            text: pinnedSection,
            icon: Pin,
            children: pinnedItems,
        };
    }, [pinnedItems, pinnedSection]);
    const pinsEnabled = Boolean(pinUserId || pinnedCodesProp !== undefined || defaultPinnedCodes !== undefined);

    // Active change
    const setActiveId = useCallback(
        (id: string) => {
            if (value === undefined) {
                setUncontrolledActive(id);
            }

            onChange?.(id);
        },
        [onChange, value]
    );

    // Context menu / dismiss / resize / open source
    const {
        menu: contextMenu,
        menuRef: contextMenuRef,
        open: contextMenuOpen,
        onItemContextMenu: handleItemContextMenu,
        close: closeContextMenu,
        onTogglePin: handleTogglePin,
    } = useItemContextMenu({
        roots,
        openPath,
        isPinned,
        canPin,
        togglePin,
        onBeforeOpen: () => onBeforeContextOpenRef.current(),
    });

    useCascadeDismiss({
        roots,
        openPathLength: openPath.length,
        collapse,
        rootRef,
        flyoutRefs,
        contextMenuRef,
    });

    const { resizing, onResizePointerDown, onResizePointerMove, endResize } = useCascadeResize({
        collapsed,
        width,
        setCollapsed,
        setWidth,
        discardWidthDraft,
    });

    const {
        openCodes,
        pinnedOpenCodes,
        treeOpenCodes,
        activeFolderEnter,
        activeLeafEnter,
        enterFromPinnedFolder,
        enterFromPinnedLeaf,
        enterFromTreeFolder,
        enterFromTreeLeaf,
        trimL0Chrome,
        handleFolderLeave,
        handleFlyoutChromeMove,
        getAimSubmenu,
        getAimMenuHeight,
    } = useCascadeOpenSource({
        openPath,
        layersLength: layers.length,
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
    });

    // Bridge
    onBeforeContextOpenRef.current = cancelLeave;

    // Render helpers
    const columnWidth = collapsed ? COLLAPSED_WIDTH : width;
    const flyoutsVisible = layers.length > 0;
    const l0Chrome: TNavListChrome = {
        activeId,
        size,
        variant,
        onChange: setActiveId,
        onFolderLeave: handleFolderLeave,
        onLeafActivate: collapse,
        getAimSubmenu,
        getAimMenuHeight,
        onMouseMove,
        onItemContextMenu: handleItemContextMenu,
    };

    return (
        <aside
            {...props}
            ref={setRootRef}
            className={cn(styles.root, layoutCollapsed && styles.collapsed, className)}
            data-collapsed={collapsed || undefined}
            data-resizing={resizing || undefined}
            data-animating={widthAnimating || undefined}
            data-test-id={dataTestId}
            style={{ ...style, width: columnWidth }}
            onMouseEnter={cancelLeave}
            onMouseLeave={handleFolderLeave}
            onTransitionEnd={handleWidthTransitionEnd}
        >
            <Header
                layoutCollapsed={layoutCollapsed}
                collapsed={collapsed}
                expandSidebar={expandSidebar}
                collapseSidebar={collapseSidebar}
                dataTestId={dataTestId}
                onToggleCollapsed={() => setCollapsed(!collapsed)}
                onTrimChrome={trimL0Chrome}
            >
                {header}
            </Header>

            <div className={styles.body}>
                <PinnedSection
                    {...l0Chrome}
                    pinsEnabled={pinsEnabled}
                    pinnedRootItem={pinnedRootItem}
                    layoutCollapsed={layoutCollapsed}
                    pinnedSection={pinnedSection}
                    pinnedSectionHint={pinnedSectionHint}
                    openCodes={pinnedOpenCodes}
                    dataTestId={dataTestId}
                    onFolderEnter={enterFromPinnedFolder}
                    onLeafEnter={enterFromPinnedLeaf}
                    onTrimChrome={trimL0Chrome}
                />
                <NavList
                    {...l0Chrome}
                    items={roots}
                    level={0}
                    openCodes={treeOpenCodes}
                    collapsed={layoutCollapsed}
                    onFolderEnter={enterFromTreeFolder}
                    onLeafEnter={enterFromTreeLeaf}
                    enablePins={pinsEnabled}
                    allowPin={false}
                    dataTestId={dataTestId ? `${dataTestId}-col-0` : undefined}
                />
            </div>

            {footer ? <Footer onTrimChrome={trimL0Chrome}>{footer}</Footer> : null}

            {flyoutsVisible ? null : (
                <button
                    type="button"
                    className={styles.resizeHandle}
                    aria-label={resizeSidebar}
                    onPointerDown={onResizePointerDown}
                    onPointerMove={onResizePointerMove}
                    onPointerUp={endResize}
                    onPointerCancel={endResize}
                    onLostPointerCapture={endResize}
                    data-test-id={dataTestId ? `${dataTestId}-resize` : undefined}
                />
            )}

            <Submenus
                layers={layers}
                roots={roots}
                pinnedRootItem={pinnedRootItem}
                rootRef={rootRef}
                flyoutRefs={flyoutRefs}
                activeId={activeId}
                openCodes={openCodes}
                size={size}
                variant={variant}
                pinsEnabled={pinsEnabled}
                dataTestId={dataTestId}
                onChange={setActiveId}
                onFolderEnter={activeFolderEnter}
                onLeafEnter={activeLeafEnter}
                onFolderLeave={handleFolderLeave}
                onLeafActivate={collapse}
                getAimSubmenu={getAimSubmenu}
                getAimMenuHeight={getAimMenuHeight}
                onMouseMove={onMouseMove}
                onItemContextMenu={handleItemContextMenu}
                onCancelLeave={cancelLeave}
                onFlyoutChromeMove={handleFlyoutChromeMove}
            />

            {contextMenu ? (
                <ItemContextMenu
                    menu={contextMenu}
                    dataTestId={dataTestId}
                    menuRef={contextMenuRef}
                    onClose={closeContextMenu}
                    onTogglePin={handleTogglePin}
                    onMouseEnter={cancelLeave}
                />
            ) : null}
        </aside>
    );
};

CascadeMenu.displayName = 'CascadeMenu';
