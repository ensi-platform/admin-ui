import { type MouseEvent as ReactMouseEvent, type MutableRefObject, type RefObject } from 'react';

import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { type TMenuListSize, type TMenuListVariant } from '@/menu-list';

import { FLYOUT_WIDTH, PINNED_ROOT_CODE } from '../../constants';
import { type IHoverLayer, type IHoverLeafEnter, type IHoverPendingItem } from '../../hooks/useHoverMenu';
import { findCascadeMenuItem, type ICascadeMenuItem } from '../../utils';
import { NavList, type IItemContextMenuRequest } from '../NavList';

import styles from './styles.module.css';

export interface ISubmenusProps {
    layers: IHoverLayer[];
    roots: ICascadeMenuItem[];
    pinnedRootItem: ICascadeMenuItem | null;
    rootRef: RefObject<HTMLElement | null>;
    flyoutRefs: MutableRefObject<(HTMLDivElement | null)[]>;
    activeId?: string;
    openCodes: Set<string>;
    size: TMenuListSize;
    variant: TMenuListVariant;
    pinsEnabled: boolean;
    dataTestId?: string;
    onChange: (id: string) => void;
    onFolderEnter: (payload: IHoverPendingItem) => void;
    onLeafEnter: (payload: IHoverLeafEnter) => void;
    onFolderLeave: (event: ReactMouseEvent) => void;
    onLeafActivate: () => void;
    getAimSubmenu: () => HTMLElement | null;
    getAimMenuHeight: () => number | undefined;
    onMouseMove: (event: ReactMouseEvent) => void;
    onItemContextMenu: (payload: IItemContextMenuRequest) => void;
    onCancelLeave: () => void;
    onFlyoutChromeMove: (level: number) => (event: ReactMouseEvent) => void;
}

/** Fixed submenu panels for openPath layers. */
export const Submenus = ({
    layers,
    roots,
    pinnedRootItem,
    rootRef,
    flyoutRefs,
    activeId,
    openCodes,
    size,
    variant,
    pinsEnabled,
    dataTestId,
    onChange,
    onFolderEnter,
    onLeafEnter,
    onFolderLeave,
    onLeafActivate,
    getAimSubmenu,
    getAimMenuHeight,
    onMouseMove,
    onItemContextMenu,
    onCancelLeave,
    onFlyoutChromeMove,
}: ISubmenusProps) => {
    if (layers.length === 0) {
        return null;
    }

    const l0Rect = rootRef.current?.getBoundingClientRect();

    return (
        <>
            {layers.map((layer, index) => {
                const parent =
                    layer.code === PINNED_ROOT_CODE ? pinnedRootItem : findCascadeMenuItem(roots, layer.code);
                const flyoutItems = parent?.children ?? [];
                const level = index + 1;
                const parentEl = index === 0 ? rootRef.current : flyoutRefs.current[index - 1];
                const left = parentEl?.getBoundingClientRect().right ?? layer.anchor.left;
                const top = l0Rect?.top ?? 0;
                const height = l0Rect?.height;

                if (flyoutItems.length === 0) {
                    return null;
                }

                return (
                    <div
                        key={layer.code}
                        ref={node => {
                            flyoutRefs.current[index] = node;
                        }}
                        className={styles.flyout}
                        style={{
                            top,
                            left,
                            height,
                            width: FLYOUT_WIDTH,
                        }}
                        data-test-id={dataTestId ? `${dataTestId}-col-${level}` : undefined}
                        onMouseEnter={onCancelLeave}
                        onMouseLeave={onFolderLeave}
                        onMouseMove={onFlyoutChromeMove(level)}
                    >
                        {parent?.text ? (
                            <div
                                className={cn(styles.flyoutHeader, typographyStyles.bodyS)}
                                data-test-id={dataTestId ? `${dataTestId}-col-${level}-header` : undefined}
                            >
                                {parent.text}
                            </div>
                        ) : null}
                        <NavList
                            items={flyoutItems}
                            level={level}
                            activeId={activeId}
                            openCodes={openCodes}
                            size={size}
                            variant={variant}
                            onChange={onChange}
                            onFolderEnter={onFolderEnter}
                            onLeafEnter={onLeafEnter}
                            onFolderLeave={onFolderLeave}
                            onLeafActivate={onLeafActivate}
                            getAimSubmenu={getAimSubmenu}
                            getAimMenuHeight={getAimMenuHeight}
                            onMouseMove={onMouseMove}
                            enablePins={pinsEnabled}
                            allowPin
                            onItemContextMenu={onItemContextMenu}
                            dataTestId={dataTestId ? `${dataTestId}-col-${level}-list` : undefined}
                        />
                    </div>
                );
            })}
        </>
    );
};

Submenus.displayName = 'CascadeMenu.Submenus';
