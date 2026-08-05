## Пример

```tsx
const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

<div
    onContextMenu={event => {
        event.preventDefault();
        setMenu({ x: event.clientX, y: event.clientY });
    }}
>
    ПКМ здесь
    {menu ? (
        <ContextMenu open x={menu.x} y={menu.y} onClose={() => setMenu(null)}>
            <ContextMenu.Item onClick={() => setMenu(null)}>Закрепить</ContextMenu.Item>
            <ContextMenu.Item onClick={() => setMenu(null)}>Открыть в новой вкладке</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item disabled>Удалить</ContextMenu.Item>
        </ContextMenu>
    ) : null}
</div>;
```
