Поле пароля на `Input` с кнопкой показа.

```tsx
import { Password, FormPassword } from '@ensi-platform/admin-ui/password';
```

## Когда использовать

- секрет, который пользователь может временно показать
- обычный текст — см. `Input`

## API (кратко)

### Password

| Prop           | Значения    | По умолчанию       | Описание                                     |
| -------------- | ----------- | ------------------ | -------------------------------------------- |
| `leftAddon`    | `ReactNode` | —                  | слот слева                                   |
| `rightAddon`   | `ReactNode` | —                  | слот справа, левее кнопки показа             |
| `clear`        | `boolean`   | `false`            | кнопка очистки перед правым слотом           |
| `disabled`     | `boolean`   | `false`            | недоступен; кнопки показа нет                |
| `readOnly`     | `boolean`   | `false`            | видно и можно скопировать; кнопки показа нет |
| `autoComplete` | `string`    | `current-password` | можно переопределить                         |
| `dataTestId`   | `string`    | —                  | атрибут `data-test-id` для тестов            |

Показ хранится внутри компонента. Своего `type` нет.

### FormPassword

| Prop       | Значения    | По умолчанию | Описание                |
| ---------- | ----------- | ------------ | ----------------------- |
| `name`     | `string`    | —            | имя поля в `Form`       |
| `label`    | `ReactNode` | —            | подпись (`Field.Label`) |
| `hint`     | `ReactNode` | —            | подсказка               |
| `clear`    | `boolean`   | —            | кнопка очистки          |
| `disabled` | `boolean`   | —            | недоступен              |
| `readOnly` | `boolean`   | —            | только чтение           |

value / onChange / onBlur / валидность — из `Form`.
