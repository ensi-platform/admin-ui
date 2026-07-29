## Пример

```tsx
const useBrandSuggest: TUseAutocompleteSuggest = ({ query, enabled }) => {
    const { data, isFetching, isError } = useQuery({
        queryKey: ['brands', query],
        queryFn: () => fetchBrands(query),
        enabled,
    });
    return { options: data ?? [], isLoading: isFetching, isError };
};

<AutocompleteAsync aria-label="Бренд" useSuggest={useBrandSuggest} minLength={2} clear />;
```
