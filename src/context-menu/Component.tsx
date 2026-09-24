import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import cn from 'classnames';
import { useUNSAFE_PortalContext } from 'react-aria';

import { ContextMenuItem } from './components/Item';
import { ContextMenuSeparator } from './components/Separator';
import { ContextMenuContext } from './context';
import { contextMenuVariants } from './theme';
import { type IContextMenuProps } from './types';
import { placeContextMenu } from './utils';

const ContextMenuRoot = ({
    ref,
    open = false,
    x,
    y,
    onClose,
    onMouseEnter,
    size = 'md',
    variant = 'primary',
    children,
    className,
    dataTestId,
    style,
    ...props
}: IContextMenuProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const { getContainer } = useUNSAFE_PortalContext();
    const [placed, setPlaced] = useState<{ x: number; y: number; left: number; top: number } | null>(null);
    const position = placed?.x === x && placed.y === y ? placed : { left: x, top: y };

    useLayoutEffect(() => {
        const node = rootRef.current;

        if (!open || !node) return;

        const rect = node.getBoundingClientRect();
        const next = placeContextMenu(x, y, rect.width, rect.height, {
            width: window.innerWidth,
            height: window.innerHeight,
        });

        setPlaced(current =>
            current?.x === x && current.y === y && current.left === next.left && current.top === next.top
                ? current
                : { x, y, ...next }
        );
    }, [open, x, y, children]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onPointerDown = (event: MouseEvent) => {
            if (rootRef.current?.contains(event.target as Node)) {
                return;
            }

            onClose();
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, onClose]);

    const contextValue = useMemo(() => ({ size }), [size]);

    if (!open || typeof document === 'undefined') {
        return null;
    }

    const setRef = (node: HTMLDivElement | null) => {
        rootRef.current = node;

        if (typeof ref === 'function') {
            ref(node);
            return;
        }

        if (ref) {
            ref.current = node;
        }
    };

    return createPortal(
        <ContextMenuContext.Provider value={contextValue}>
            <div
                {...props}
                ref={setRef}
                className={cn(contextMenuVariants({ size, variant }), className)}
                style={{ ...style, top: position.top, left: position.left }}
                role="menu"
                tabIndex={-1}
                data-test-id={dataTestId}
                onMouseEnter={onMouseEnter}
            >
                {children}
            </div>
        </ContextMenuContext.Provider>,
        getContainer?.() ?? document.body
    );
};

ContextMenuRoot.displayName = 'ContextMenu';

export const ContextMenu = Object.assign(ContextMenuRoot, {
    Item: ContextMenuItem,
    Separator: ContextMenuSeparator,
});
