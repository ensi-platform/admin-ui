Текстовый контрол на React Aria `Input`.

```tsx
import { Input, FormInput } from '@ensi-platform/admin-ui';
```

## Когда использовать

- свободный однострочный текст (email, имя, поиск)
- многострочный текст — см. `TextArea`
- число — см. `NumberInput`

## API (кратко)

### Input

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | размер; внутри Field наследует `Field.size` |
| `invalid` | `boolean` | `false` | ошибка |
| `disabled` | `boolean` | `false` | недоступен |
| `clear` | `boolean` | `false` | кнопка очистки → `onChange` с `''` |
| `placeholder` | `string` | — | плейсхолдер |
| `type` | HTML `type` | — | тип input |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Без `as` / prefix/suffix.

### FormInput

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
