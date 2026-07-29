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
