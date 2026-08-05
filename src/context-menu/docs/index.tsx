import { type MouseEvent, useState } from 'react';

import { ExternalLink, Pin, Trash } from '@/icons';

import { ContextMenu } from '../Component';

interface IContextMenuDemoProps {
    withSeparator?: boolean;
}

/** Interactive RMB demo for stories. */
export const ContextMenuDemo = ({ withSeparator = false }: IContextMenuDemoProps) => {
    const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

    const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        setMenu({ x: event.clientX, y: event.clientY });
    };

    const close = () => {
        setMenu(null);
    };

    return (
        <div
            onContextMenu={onContextMenu}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 160,
                border: '1px dashed var(--aui-surface-border-primary)',
                borderRadius: 8,
                color: 'var(--aui-page-fg-muted)',
            }}
        >
            Right-click here
            {menu ? (
                <ContextMenu open x={menu.x} y={menu.y} onClose={close}>
                    <ContextMenu.Item icon={Pin} onClick={close}>
                        Pin
                    </ContextMenu.Item>
                    <ContextMenu.Item icon={ExternalLink} onClick={close}>
                        Open in new tab
                    </ContextMenu.Item>
                    {withSeparator ? <ContextMenu.Separator /> : null}
                    {withSeparator ? (
                        <ContextMenu.Item icon={Trash} disabled>
                            Delete
                        </ContextMenu.Item>
                    ) : null}
                </ContextMenu>
            ) : null}
        </div>
    );
};

ContextMenuDemo.displayName = 'ContextMenu';

/** Story wrapper for react-docgen-typescript. */
export const ContextMenuStoryComponent = () => <ContextMenuDemo />;

ContextMenuStoryComponent.displayName = 'ContextMenu';
