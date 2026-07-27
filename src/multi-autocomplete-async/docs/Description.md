# MultiAutocompleteAsync

Мульти autocomplete с injected suggest hook. Импорт: `import { MultiAutocompleteAsync, FormMultiAutocompleteAsync } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- несколько значений + подсказки с бэкенда
- тот же контракт `TUseAutocompleteSuggest`, что у `AutocompleteAsync`
- merge `selected ∪ fetched` — обязанность хука
- UI `isLoading` = debounce-pending **или** fetch in flight (skeleton сразу при печати и на время поиска)

## API (кратко)

- `useSuggest`, `minLength` (0), `debounceMs` (300)
- `value` / `onChange` (`TComboboxValue[]`), `clear`
- tags + `+N` overflow как в `MultiAutocomplete`

## Пример

```tsx
<MultiAutocompleteAsync aria-label="Бренды" useSuggest={useBrandSuggest} minLength={2} clear />
```

## Не делать

- не менять `useSuggest` между рендерами
- sync — `MultiAutocomplete`
