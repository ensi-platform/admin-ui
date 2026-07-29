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
