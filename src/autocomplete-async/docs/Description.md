# AutocompleteAsync

Single autocomplete with injected suggest hook. Импорт: `import { AutocompleteAsync, FormAutocompleteAsync } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- подсказки с бэкенда (RQ / fetch живут в АП)
- `useSuggest` — стабильная ссылка на хук модуля
- sync-список — обычный `Autocomplete`

## Контракт `useSuggest`

```ts
type TUseAutocompleteSuggest = (input: { query: string; enabled?: boolean }) => {
    options: IComboboxOption[];
    isLoading: boolean;
    isError?: boolean;
    error?: Error | null;
};
```

- debounce / `minLength` — в `AutocompleteAsync`; UI `isLoading` = debounce-pending **или** `isLoading` из хука
- merge `selected ∪ fetched` — обязанность хука (иначе label выбранного пропадёт)
- не менять `useSuggest` между рендерами одного инстанса
- в хуке `isLoading` — на весь активный запрос (RQ: `isFetching`)

## API (кратко)

- `useSuggest` (обязателен)
- `minLength` (default `0`), `debounceMs` (default `300`)
- `value` / `defaultValue` / `onChange`, `clear`, `placeholder`
- `size`, `variant`, `invalid`, `disabled`, `block`, `dataTestId`
- без `options` / `isLoading` снаружи

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

## Не делать

- не передавать inline `() => useX()` / условный хук
- не дублировать debounce в хуке, если уже задан `debounceMs`
