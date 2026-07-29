## Example

```tsx
<DateRangePicker aria-label="Period" clear />

<FormDateRangePicker name="period" label="Period" clear />
```

Full period in zod (partial `{ start, end: null }` is invalid):

```ts
import { type DateRange } from 'react-aria-components';
import { z } from 'zod';

period: z.custom<DateRange>(
    v => v != null && v.start != null && v.end != null,
    'Select a period'
),
```
