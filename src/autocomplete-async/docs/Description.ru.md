Одиночный автокомплит с подсказками через переданный хук `useSuggest`.

```tsx
import { AutocompleteAsync, FormAutocompleteAsync } from '@ensi-platform/admin-ui';
```

## Когда использовать

- подсказки с бэкенда (запрос живёт в приложении: React Query / `fetch`)
- локальный список без запроса — см. `Autocomplete`

## API (кратко)

### Контракт `useSuggest`

```ts
type TUseAutocompleteSuggest = (input: { query: string; enabled?: boolean }) => {
    options: IComboboxOption[];
    isLoading: boolean;
    isError?: boolean;
    error?: Error | null;
};
```

Передавайте стабильную ссылку на хук модуля (не inline и не условную).

- `debounceMs` / `minLength` — в `AutocompleteAsync`; индикатор загрузки в UI — ожидание debounce **или** `isLoading` из хука
- объединение выбранного значения с ответом сервера — обязанность хука (иначе пропадёт подпись выбранного)
- в хуке `isLoading` — на весь активный запрос (в React Query: `isFetching`); debounce в хуке не дублировать, если задан `debounceMs`

### AutocompleteAsync

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `useSuggest` | `TUseAutocompleteSuggest` | — | хук подсказок (обязателен) |
| `minLength` | `number` | `0` | мин. длина запроса перед запросом |
| `debounceMs` | `number` | `300` | задержка ввода |
| `value` | `string \| number \| null` | — | управляемое значение |
| `defaultValue` | `string \| number \| null` | — | начальное значение |
| `onChange` | `(value: string \| number \| null) => void` | — | смена выбора; `null` при очистке |
| `placeholder` | `string` | — | плейсхолдер |
| `clear` | `boolean` | `false` | кнопка очистки |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `invalid` | `boolean` | `false` | ошибка |
| `disabled` | `boolean` | `false` | недоступен |
| `block` | `boolean` | — | на всю ширину |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Без внешних `options` / `isLoading`.

### FormAutocompleteAsync

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `name` | `string` | — | имя поля в `Form` |
| `label` | `ReactNode` | — | подпись `Field.Label` |
| `hint` | `ReactNode` | — | подсказка под контролом |
| `useSuggest` | `TUseAutocompleteSuggest` | — | хук подсказок |
| `minLength` | `number` | `0` | мин. длина запроса |
| `debounceMs` | `number` | `300` | задержка ввода |
| `placeholder` | `string` | — | плейсхолдер |
| `clear` | `boolean` | `false` | кнопка очистки; в форму пишет `''` |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `disabled` | `boolean` | — | недоступен |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

value / onChange / onBlur / валидность — из `Form`.
