Compound data-table chrome for admin lists.

```tsx
import { Table, useTableRowSelection } from '@ensi-platform/admin-ui/table';
```

## When to use

- entity lists (orders, products, …)

## API (short)

| Prop         | Values               | Default | Description                                                                                        |
| ------------ | -------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `size`       | `sm` \| `md` \| `lg` | `md`    | row density                                                                                        |
| `block`      | `boolean`            | `true`  | stretch to 100% of parent width                                                                    |
| `hasChecked` | `boolean`            | `false` | reserve layout for a leading checkbox column                                                       |
| `zebra`      | `boolean`            | `false` | subtle even-row background (checked / hover win; a checked row hovers with `--aui-table-bg-hover`) |
| `dataTestId` | `string`             | —       | `data-test-id` for tests                                                                           |

Slots: `Scroll` / `Table` / `Header` / `Body` / `Footer` / `Row` / `Cell` / `HeaderCell` / `CheckboxCell` / `HeaderCheckboxCell` / `ActionBar` / `SortIndicator` / `Pagination` / `PageSize`.

- `Scroll` — scroll area; `Footer` is a sibling (not inside `Table.Table` / `<table>`)
- `Table` — native `<table>`: only `Header` / `Body` / `Row` / cells
- `Header`: `sticky?`; `Footer`: `sticky?` (default `true`); left `PageSize`, right `Pagination`
- `Cell` / `HeaderCell`: `numeric?`, `align?`, `utility?`, `noWrap?`, `width?`, `pin?` (`start` | `end`); `HeaderCell` also has `sortable?`, `sortDirection?`, `onSort?`, `filter?`, `filterActive?`
- the same `pin` goes on every cell of that column, including the header. Several columns on one edge stack their offsets. Checkbox cells are always `start`. The edge seam shows only while that edge is stuck to the scroll area
- `Row`: `pin?` (`top` | `bottom`) for body rows. Several rows on one edge stack under the sticky header or up from the bottom of the scroll area. `active` keeps `--aui-table-bg-hover`, including on a checked row; the row does not open a menu
- `filter` is the drop body in the column header. The trigger is a floating pill. When the column is `sortable`, sort actions sit under the filter. Without `filter`, sorting stays a click on the header. `filterActive` colors the filter icon
- `Pagination`: controlled `page` + `pageCount` + `onPageChange` + `from` + `to` + `total`; numbered pages (window, first and last always present); optional `rangeLabel?`, `prevLabel?` / `nextLabel?`, `disabled?`
- `PageSize`: controlled `value` + `onChange`; `options?` (default `[5, 10, 25, 50, 100]`); `label?`; `disabled?`
- `ActionBar`: `items`, `visibleCount?`
- Package `Loader` — external composition (often wrap `Table.Table` inside `Scroll`); `Table` has no built-in loading
- `useTableRowSelection(pageRowIds)` — select the **current** page (`setAllOnPage`); call `clearAll` when page / pageSize changes. A cell click toggles that row's checkbox; a click on a button, link, or header does not
