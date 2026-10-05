Listing filter section: a content area and a footer for actions. The field grid is `GridLayout`.

```tsx
import { Filters } from '@ensi-platform/admin-ui/filters';
```

## When to use

- the filter form of a list page
- visibility and order belong in `ArrangementSettings`, not in this section

## API (short)

| Prop         | Values   | Default | Description    |
| ------------ | -------- | ------- | -------------- |
| `dataTestId` | `string` | —       | `data-test-id` |

Slots: `Body` / `Footer`. `Form` and controls stay outside.

### Body

The field area. The page lays the fields out with `GridLayout`.

### Footer

A row of buttons laid out with `space-between`. The page provides the buttons.
