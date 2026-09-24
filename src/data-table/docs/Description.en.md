List table: sort and the column filter are wired in. The action menu is a `ContextMenu` beside the table, opened by the screen. Chrome comes from `Table`.

```tsx
import { ContextMenu } from '@ensi-platform/admin-ui/context-menu';
import { DataTable } from '@ensi-platform/admin-ui/data-table';
```

## When to use

- an entity list whose sort and column filter live in the header
- a row action menu
- bare chrome without that wiring — `Table`

## API (short)

| Prop           | Values                  | Default | Description                                  |
| -------------- | ----------------------- | ------- | -------------------------------------------- |
| `size`         | `sm` \| `md` \| `lg`    | `md`    | row density                                  |
| `block`        | `boolean`               | `true`  | stretch to 100% of the parent width          |
| `hasChecked`   | `boolean`               | `false` | reserve layout for a leading checkbox column |
| `zebra`        | `boolean`               | `false` | subtle even-row background                   |
| `sort`         | `{ column, direction }` | —       | one active column                            |
| `onSortChange` | function                | —       | next sort, or `undefined` when cleared       |
| `dataTestId`   | `string`                | —       | `data-test-id` for tests                     |

Slots: `Header` / `Body` / `Footer` / `Row` / `Cell` / `HeaderCell` / `CheckboxCell` / `HeaderCheckboxCell` / `Filter` / `Actions` / `Pagination` / `PageSize`.

- The root renders the scroll area and `<table>`. `Header` and `Body` sit inside the table, `Footer` sits outside
- `HeaderCell`: `column` and `sortable`. Without `Filter`, sorting is a header click (`none` → `asc` → `desc` → `none`). Switching column clears the previous one
- `Filter` is the drop body inside `HeaderCell`. `active` colors the icon. No slot — no drop. When the column is `sortable`, sort actions sit under the filter
- `Row` `onContextMenu` is the right click, the same prop as on a `Table` row. The row does not open a menu
- `Actions` is a quiet “⋯” button with `onClick`. It stays visible, with no fill. The row assembly decides what the click opens
- `Pagination` and `PageSize` match `Table` and usually live in `Footer`
