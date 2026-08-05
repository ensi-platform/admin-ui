Compound data-table chrome for admin lists.

```tsx
import { Table, useTableRowSelection } from '@ensi-platform/admin-ui/table';
```

## When to use

- entity lists (orders, products, …)

## API (short)

| Prop         | Values               | Default | Description                                                |
| ------------ | -------------------- | ------- | ---------------------------------------------------------- |
| `size`       | `sm` \| `md` \| `lg` | `md`    | row density                                                |
| `block`      | `boolean`            | `true`  | stretch to 100% of parent width                            |
| `hasChecked` | `boolean`            | `false` | reserve layout for a leading checkbox column               |
| `zebra`      | `boolean`            | `false` | subtle even-row background (overridden by checked / hover) |
| `dataTestId` | `string`             | —       | `data-test-id` for tests                                   |

Slots: `Scroll` / `Table` / `Header` / `Body` / `Footer` / `Row` / `Cell` / `HeaderCell` / `CheckboxCell` / `HeaderCheckboxCell` / `ActionBar` / `SortIndicator` / `Pagination` / `PageSize`.

- `Scroll` — scroll area; `Footer` is a sibling (not inside `Table.Table` / `<table>`)
- `Table` — native `<table>`: only `Header` / `Body` / `Row` / cells
- `Header`: `sticky?`; `Footer`: `sticky?` (default `true`); left `PageSize`, right `Pagination`
- `Cell` / `HeaderCell`: `numeric?`, `align?`, `utility?`, `noWrap?`, `width?`; `HeaderCell` also has `sortable?`, `sortDirection?`, `onSort?`
- `Pagination`: controlled `page` + `pageCount` + `onPageChange` + `from` + `to` + `total`; optional `rangeLabel?`, `prevLabel?` / `nextLabel?`, `disabled?`
- `PageSize`: controlled `value` + `onChange`; `options?` (default `[5, 10, 25, 50, 100]`); `label?`; `disabled?`
- `ActionBar`: `items`, `visibleCount?`
- Package `Loader` — external composition (often wrap `Table.Table` inside `Scroll`); `Table` has no built-in loading
- `useTableRowSelection(pageRowIds)` — select the **current** page (`setAllOnPage`); call `clearAll` when page / pageSize changes
