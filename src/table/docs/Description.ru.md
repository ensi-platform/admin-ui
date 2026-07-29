Compound-хром таблицы для списков в админке.

```tsx
import { Table, useTableRowSelection } from '@ensi-platform/admin-ui';
```

## Когда использовать

- списки сущностей (заказы, товары, …)

## API (кратко)

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | плотность строк |
| `block` | `boolean` | `true` | ширина 100% родителя |
| `hasChecked` | `boolean` | `false` | резерв под колонку чекбоксов |
| `zebra` | `boolean` | `false` | слабый фон чётных строк (checked / hover перебивают) |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Слоты: `Scroll` / `Table` / `Header` / `Body` / `Footer` / `Row` / `Cell` / `HeaderCell` / `CheckboxCell` / `HeaderCheckboxCell` / `ActionBar` / `SortIndicator` / `Pagination` / `PageSize`.

- `Scroll` — область скролла; `Footer` — sibling рядом (не внутри `Table.Table` / `<table>`)
- `Table` — нативный `<table>`: только `Header` / `Body` / `Row` / ячейки
- `Header`: `sticky?`; `Footer`: `sticky?` (по умолчанию `true`); слева `PageSize`, справа `Pagination`
- `Cell` / `HeaderCell`: `numeric?`, `align?`, `utility?`, `noWrap?`, `width?`; у `HeaderCell` ещё `sortable?`, `sortDirection?`, `onSort?`
- `Pagination`: controlled `page` + `pageCount` + `onPageChange` + `from` + `to` + `total`; опционально `rangeLabel?`, `prevLabel?` / `nextLabel?`, `disabled?`
- `PageSize`: controlled `value` + `onChange`; `options?` (по умолчанию `[5, 10, 25, 50, 100]`); `label?`; `disabled?`
- `ActionBar`: `items`, `visibleCount?`
- `Loader` из пакета — внешняя композиция (часто вокруг `Table.Table` внутри `Scroll`); у `Table` нет своего loading
- `useTableRowSelection(pageRowIds)` — выбор **текущей** страницы (`setAllOnPage`); при смене page / pageSize вызывать `clearAll`
