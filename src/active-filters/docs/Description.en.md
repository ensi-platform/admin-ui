Applied filters above a list: chips and a clear link.

```tsx
import { ActiveFilters } from '@ensi-platform/admin-ui/active-filters';
```

## When to use

- the list shows which filters are already applied
- one value is its own chip and can be removed
- several values of one field collapse into a count chip with the same list as the column filter
- not the filter form — see `Filters`
- not an entity status — see `Badge`

## API (short)

### ActiveFilters

| Prop         | Values       | Default | Description                         |
| ------------ | ------------ | ------- | ----------------------------------- |
| `children`   | `ReactNode`  | —       | chips; an empty row is not rendered |
| `onClear`    | `() => void` | —       | clear link; omitted — no link       |
| `dataTestId` | `string`     | —       | `data-test-id` attribute for tests  |

Link text comes from `clearFilters` in `AdminUiProvider`.

### Item

| Prop         | Values       | Default | Description                         |
| ------------ | ------------ | ------- | ----------------------------------- |
| `children`   | `ReactNode`  | —       | label, for example `Category: meat` |
| `onRemove`   | `() => void` | —       | remove control                      |
| `disabled`   | `boolean`    | `false` | disables the chip and remove        |
| `dataTestId` | `string`     | —       | `data-test-id` attribute for tests  |

The chip is a `Tag` at size `md`.

### Group

| Prop         | Values      | Default | Description                                  |
| ------------ | ----------- | ------- | -------------------------------------------- |
| `label`      | `string`    | —       | field name before the count                  |
| `count`      | `number`    | —       | how many values are selected                 |
| `children`   | `ReactNode` | —       | drop list, the same one as the column filter |
| `onRemove`   | `() => void` | —      | clear control on the right; removes the group |
| `scroll`     | `auto` \| `virtual` | `auto` | `auto` scrolls the drop; `virtual` leaves scrolling to the inner list (`SuggestChecklist`) |
| `dataTestId` | `string`    | —       | `data-test-id` attribute for tests           |

The chip reads `Categories: 5` and opens a `Popover`. Column sort actions are not part of this drop. The page decides grouping: no setting, or a single value, means several `Item`s.
