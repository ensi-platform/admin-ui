# DateRangePicker

Поле диапазона дат на React Aria `DateRangePicker` + вертикальный календарь. Импорт: `import { DateRangePicker, FormDateRangePicker } from '@ensi-platform/admin-ui'`.

## Когда использовать

- период дат (фильтры, отчёты)
- `FormDateRangePicker` — Field + RHF (`{ start, end }`)

## API (кратко)

- `value` / `onChange`: `DateRange | null`
- `size`, `clear`, `invalid`, `disabled`, `dataTestId`
- Form*: `name`, `label`, `hint`

## Пример

```tsx
<DateRangePicker aria-label="Период" clear />

<FormDateRangePicker name="period" label="Период" clear />
```

Полный период в zod (partial `{ start, end: null }` невалиден):

```ts
import { type DateRange } from 'react-aria-components';
import { z } from 'zod';

period: z.custom<DateRange>(
    v => v != null && v.start != null && v.end != null,
    'Укажите период'
),
```

## Не делать

- не экспортировать RangeCalendar
- не копировать Kontur string API
