Одиночный автокомплит на React Aria `ComboBox`.

```tsx
import { Autocomplete, FormAutocomplete } from '@ensi-platform/admin-ui/autocomplete';
```

## Когда использовать

- одно значение с фильтрацией по локальному списку
- подсказки с бэкенда — см. `AutocompleteAsync`
- несколько значений — см. `MultiAutocomplete`

## API (кратко)

### Autocomplete

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `options` | `{ value, label, disabled? }[]` | — | список опций |
| `value` | `string \| number \| null` | — | управляемое значение; `null` после clear |
| `defaultValue` | `string \| number \| null` | — | начальное значение |
| `onChange` | `(value: string \| number \| null) => void` | — | смена выбора; `null` при clear |
| `inputValue` | `string` | — | управляемый текст ввода |
| `defaultInputValue` | `string` | — | начальный текст ввода |
| `onInputChange` | `(value: string) => void` | — | смена текста ввода |
| `clientFilter` | `boolean` | `true` | локальный contains-filter; `false` для controlled items |
| `isLoading` | `boolean` | — | статус загрузки списка |
| `isError` | `boolean` | — | статус ошибки списка |
| `placeholder` | `string` | — | плейсхолдер |
| `clear` | `boolean` | `false` | кнопка очистки |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `invalid` | `boolean` | `false` | ошибка |
| `disabled` | `boolean` | `false` | недоступен |
| `block` | `boolean` | — | на всю ширину |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

### FormAutocomplete

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `name` | `string` | — | имя поля в `Form` |
| `label` | `ReactNode` | — | подпись `Field.Label` |
| `hint` | `ReactNode` | — | подсказка под контролом |
| `options` | `{ value, label, disabled? }[]` | — | список опций |
| `placeholder` | `string` | — | плейсхолдер |
| `clear` | `boolean` | `false` | кнопка очистки; в RHF пишет `''` |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `disabled` | `boolean` | — | недоступен |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Value / onChange / onBlur / валидность — из `Form`.
