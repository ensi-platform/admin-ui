## Пример

```tsx
<VerticalTabs value={section} onChange={setSection}>
    <VerticalTabs.List>
        <VerticalTabs.Item id="person">
            Человек
            <Badge size="sm" variant="danger" aria-label="2 ошибки">
                2
            </Badge>
        </VerticalTabs.Item>
        <VerticalTabs.Item id="signin">Вход</VerticalTabs.Item>
    </VerticalTabs.List>
    <VerticalTabs.Panels>
        <VerticalTabs.Panel id="person">…</VerticalTabs.Panel>
        <VerticalTabs.Panel id="signin">…</VerticalTabs.Panel>
    </VerticalTabs.Panels>
</VerticalTabs>
```
