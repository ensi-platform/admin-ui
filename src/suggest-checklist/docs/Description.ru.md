Поиск и чекбоксы по подсказкам с бэкенда, список сразу на панели.

```tsx
import { SuggestChecklist } from '@ensi-platform/admin-ui/suggest-checklist';
```

## Когда использовать

- несколько значений в уже открытой панели, например фильтр шапки таблицы
- закрытый список с тегами — см. `MultiAutocompleteAsync`

## API (кратко)

| Prop           | Значения                                | По умолчанию | Описание                                                               |
| -------------- | --------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| `useSuggest`   | `IUseAutocompleteSuggest`               | —            | хук подсказок (`page`, `hasMore`), тот же контракт, что у autocomplete |
| `minLength`    | `number`                                | `0`          | мин. длина запроса                                                     |
| `debounceMs`   | `number`                                | `300`        | debounce ввода                                                         |
| `value`        | `(string \| number)[]`                  | —            | выбранные значения                                                     |
| `defaultValue` | `(string \| number)[]`                  | —            | начальный выбор                                                        |
| `onChange`     | `(value: (string \| number)[]) => void` | —            | смена выбора                                                           |
| `placeholder`  | `string`                                | —            | плейсхолдер поиска                                                     |
| `disabled`     | `boolean`                               | `false`      | недоступен                                                             |
| `dataTestId`   | `string`                                | —            | атрибут `data-test-id`                                                 |

Уже выбранные пункты остаются сверху, пока приходит новый ответ. Хук отдаёт одну страницу; следующие подгружаются в конце списка, пока `hasMore` истинно.
