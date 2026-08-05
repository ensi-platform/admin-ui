import { useEffect, useMemo, useRef } from 'react';

import { createPortal } from 'react-dom';

import cn from 'classnames';

import { ContextMenuItem } from './components/Item';
import { ContextMenuSeparator } from './components/Separator';
import { ContextMenuContext } from './context';
import { contextMenuVariants } from './theme';
import { type IContextMenuProps } from './types';

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
                style={{ ...style, top: y, left: x }}
                role="menu"
                tabIndex={-1}
                data-test-id={dataTestId}
                onMouseEnter={onMouseEnter}
            >
                {children}
            </div>
        </ContextMenuContext.Provider>,
        document.body
    );
};

ContextMenuRoot.displayName = 'ContextMenu';

export const ContextMenu = Object.assign(ContextMenuRoot, {
    Item: ContextMenuItem,
    Separator: ContextMenuSeparator,
});
