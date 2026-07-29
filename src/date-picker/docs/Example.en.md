## Example

```tsx
import { parseDate } from '@internationalized/date';

<DatePicker aria-label="Date" clear />

<Form
  initialValues={{ date: null }}
  validationSchema={schema}
  onSubmit={save}
>
  <FormDatePicker name="date" label="Date" clear />
</Form>
```
