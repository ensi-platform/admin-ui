## Пример

```tsx
const useBrandSuggest: IUseAutocompleteSuggest = ({ query, enabled, page }) => {
    const { data, isFetching, isError } = useQuery({
        queryKey: ['brands', query, page],
        queryFn: () => fetchBrands(query, page),
        enabled,
    });
    return {
        options: data?.options ?? [],
        isLoading: isFetching,
        isError,
        hasMore: data?.hasMore ?? false,
    };
};

<AutocompleteAsync aria-label="Бренд" useSuggest={useBrandSuggest} minLength={2} clear />;
```
