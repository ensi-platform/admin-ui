## Example

```tsx
<VerticalTabs value={section} onChange={setSection}>
    <VerticalTabs.List>
        <VerticalTabs.Item id="person">
            Person
            <Badge size="sm" variant="danger" aria-label="2 errors">
                2
            </Badge>
        </VerticalTabs.Item>
        <VerticalTabs.Item id="signin">Sign in</VerticalTabs.Item>
    </VerticalTabs.List>
    <VerticalTabs.Panels>
        <VerticalTabs.Panel id="person">…</VerticalTabs.Panel>
        <VerticalTabs.Panel id="signin">…</VerticalTabs.Panel>
    </VerticalTabs.Panels>
</VerticalTabs>
```
