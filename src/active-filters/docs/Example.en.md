## Example

```tsx
<ActiveFilters onClear={reset}>
    <ActiveFilters.Item onRemove={clearName}>Name: milk</ActiveFilters.Item>
    <ActiveFilters.Group label="Categories" count={categories.length} onRemove={clearCategories}>
        <SuggestChecklist
            aria-label="Categories"
            useSuggest={useCategorySuggest}
            value={categories}
            onChange={setCategories}
        />
    </ActiveFilters.Group>
</ActiveFilters>
```
