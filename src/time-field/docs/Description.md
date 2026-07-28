# TimeField

Поле времени на React Aria `TimeField`. Импорт: `import { TimeField, FormTimeField } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- только время (без календаря)
- `FormTimeField` — Field + RHF

## API (кратко)

- `value` / `onChange`: `TimeValue | null`
- `size`, `hourCycle`, `clear`, `invalid`, `disabled`, `dataTestId`
- Form*: `name`, `label`, `hint`

## Пример

```tsx
import { Time } from '@internationalized/date';

<TimeField aria-label="Время" clear />

<FormTimeField name="time" label="Время" clear />
```

## Не делать

- не добавлять clock dial в v1
- не копировать стили в АП
