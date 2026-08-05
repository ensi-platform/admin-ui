## Example

```tsx
const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

<div
    onContextMenu={event => {
        event.preventDefault();
        setMenu({ x: event.clientX, y: event.clientY });
    }}
>
    Right-click here
    {menu ? (
        <ContextMenu open x={menu.x} y={menu.y} onClose={() => setMenu(null)}>
            <ContextMenu.Item onClick={() => setMenu(null)}>Pin</ContextMenu.Item>
            <ContextMenu.Item onClick={() => setMenu(null)}>Open in new tab</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item disabled>Delete</ContextMenu.Item>
        </ContextMenu>
    ) : null}
</div>;
```
