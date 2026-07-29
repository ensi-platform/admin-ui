Многострочный текстовый контрол на React Aria `TextArea`.

```tsx
import { TextArea, FormTextArea } from '@ensi-platform/admin-ui';
```

## Когда использовать

- свободный многострочный текст (комментарий, описание, адрес)
- одна строка — см. `Input`

## API (кратко)

### TextArea

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | размер; внутри Field наследует `Field.size` |
| `invalid` | `boolean` | `false` | ошибка |
| `disabled` | `boolean` | `false` | недоступен |
| `clear` | `boolean` | `false` | кнопка очистки → `onChange` с `''` |
| `placeholder` | `string` | — | плейсхолдер |
| `rows` | `number` | — | число строк |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Без `as` / `variant` сверх `primary`.

### FormTextArea

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `name` | `string` | — | имя поля в `Form` |
| `label` | `ReactNode` | — | подпись (`Field.Label`) |
| `hint` | `ReactNode` | — | подсказка |
| `clear` | `boolean` | — | кнопка очистки |
| `size` | `sm` \| `md` \| `lg` | `md` | размер (на Field) |
| `disabled` | `boolean` | — | недоступен |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

value / onChange / onBlur / валидность — из `Form`.
