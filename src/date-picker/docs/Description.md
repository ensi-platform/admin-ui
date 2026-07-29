# DatePicker

Поле выбора даты на React Aria `DatePicker` + вертикальный календарь. Импорт: `import { DatePicker, FormDatePicker } from '@ensi-platform/admin-ui'`.

## Когда использовать

- одна дата (или datetime через `granularity`)
- с `Field` — через `useField().controlProps`
- `FormDatePicker` — Field + RHF

## API (кратко)

### DatePicker

- `size`: sm | md | lg
- `variant`: primary
- `value` / `onChange`: `DateValue | null` (`@internationalized/date`)
- `granularity`, `minValue`, `maxValue`, `clear`, `invalid`, `disabled`
- `dataTestId`

### FormDatePicker

- `name`, `label`, `hint`, `size`, `clear`, …

## Пример

```tsx
import { parseDate } from '@internationalized/date';

<DatePicker aria-label="Дата" clear />

<Form
  initialValues={{ date: null }}
  validationSchema={schema}
  onSubmit={save}
>
  <FormDatePicker name="date" label="Дата" clear />
</Form>
```

## Не делать

- не экспортировать Calendar отдельно
- не хранить ISO-строки в value без адаптера снаружи
- не копировать стили в АП
