## Пример

```tsx
<ActiveFilters onClear={reset}>
    <ActiveFilters.Item onRemove={clearName}>Название: молоко</ActiveFilters.Item>
    <ActiveFilters.Group label="Категории" count={categories.length} onRemove={clearCategories}>
        <SuggestChecklist
            aria-label="Категории"
            useSuggest={useCategorySuggest}
            value={categories}
            onChange={setCategories}
        />
    </ActiveFilters.Group>
</ActiveFilters>
```
