Listing filter section: a field grid with per-kind column spans and a footer for actions.

```tsx
import { Filters } from '@ensi-platform/admin-ui/filters';
```

## When to use

- the filter form of a list page
- a date or a range needs more columns than a short field
- visibility and order belong in `ArrangementSettings`, not in this section

## API (short)

| Prop         | Values   | Default | Description    |
| ------------ | -------- | ------- | -------------- |
| `dataTestId` | `string` | —       | `data-test-id` |

Slots: `Grid` / `Cell` / `Footer`. `Form` and controls stay outside.

### Grid

| Prop         | Values                   | Default | Description                                                         |
| ------------ | ------------------------ | ------- | ------------------------------------------------------------------- |
| `columns`    | `number`                 | `4`     | equal tracks; the page sets this, there are no built-in breakpoints |
| `span`       | `Record<string, number>` | —       | field kind → columns; an unknown kind uses `default`, otherwise `1` |
| `dataTestId` | `string`                 | —       | `data-test-id`                                                      |

The cell span is clamped to `1…columns`.

### Cell

| Prop         | Values   | Default | Description    |
| ------------ | -------- | ------- | -------------- |
| `kind`       | `string` | —       | key in `span`  |
| `dataTestId` | `string` | —       | `data-test-id` |

### Footer

A row of buttons laid out with `space-between`. The page provides the buttons.
