# Table

Compound data-table chrome for admin lists. Import: `import { Table, useTableRowSelection } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- списки сущностей в админке (orders, products, …)
- нужен sticky header/footer, selection, sort affordance, row actions, page chrome
- **не** сюда: AutoFilters, URL pagination, meta-columns, column settings — это app-слой

## API (кратко)

Layout (`Table`): `size` (density) + `block` + `hasChecked` + `zebra`.

- `size`: sm | md | lg
- `block`: default true
- `hasChecked`: резерв под колонку чекбоксов
- `zebra`: еле заметный even-row bg (default false); checked / active / hover перебивают
- compound: `Header` / `Body` / `Footer` / `Row` / `Cell` / `HeaderCell` / `CheckboxCell` / `HeaderCheckboxCell` / `ActionBar` / `SortIndicator` / `Pagination` / `PageSize`
- `Header`: `sticky?`
- `Loader` (из пакета): слот-ребёнок `<Loader active />` — вуаль над scroll/`<table>`; Footer не накрывает
- `Footer`: бар под `<table>` (не `tfoot`); `sticky?` (default true) — верхняя граница; status слева, справа кластер `PageSize` + `Pagination` (обёртка-div), без `Row`/`Cell`/`colSpan`
- `Pagination`: controlled `page` + `pageCount` + `onPageChange`; `nextLabel?` (override поверх `labels.paginationNext`); `disabled?`; без prev / URL
- `PageSize`: controlled `value` + `onChange`; `options?` (default `[10, 25, 50, 100]`); `label?` (override поверх `labels.pageSize`); `disabled?`; сброс `page → 1` — app
- `Cell` / `HeaderCell`: `numeric?`, `align?`, `utility?`, `noWrap?`, `width?`
- `HeaderCell`: `sortable?`, `sortDirection?`, `onSort?` (controlled, данные снаружи)
- `ActionBar`: `items`, `visibleCount?` (лишнее в kebab/Popover)
- hook: `useTableRowSelection(pageRowIds)` → header = select **текущей страницы** (`setAllOnPage`); при смене страницы в `onPageChange` вызывать `clearAll` (выбор не переносится)

## Пример

```tsx
const ids = pageRows.map(r => r.id);
const { isSelected, toggle, isAllSelected, isIndeterminate, setAllOnPage, clearAll, selected } =
  useTableRowSelection(ids);

const onPageChange = (next: number) => {
  clearAll();
  setPage(next);
};

const onPageSizeChange = (size: number) => {
  clearAll();
  setPageSize(size);
  setPage(1);
};

<Table size="md" hasChecked>
  <Table.Header sticky>
    <Table.Row>
      <Table.HeaderCheckboxCell
        checked={isAllSelected}
        indeterminate={isIndeterminate}
        onChange={setAllOnPage}
        aria-label="Select all"
      />
      <Table.HeaderCell sortable sortDirection={sort} onSort={setSort}>
        Name
      </Table.HeaderCell>
      <Table.HeaderCell numeric>Amount</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {pageRows.map(row => (
      <Table.Row key={row.id} checked={isSelected(row.id)}>
        <Table.CheckboxCell
          checked={isSelected(row.id)}
          onChange={() => toggle(row.id)}
          aria-label={`Select ${row.name}`}
        />
        <Table.Cell>{row.name}</Table.Cell>
        <Table.Cell numeric>{row.amount}</Table.Cell>
        <Table.Cell utility>
          <Table.ActionBar
            visibleCount={0}
            items={[{ text: 'Edit', onClick: () => {} }]}
          />
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
  <Table.Footer>
    <span>Показано {from}–{to} из {total}. Выбрано {selected.size} из {total}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Table.PageSize value={pageSize} onChange={onPageSizeChange} />
      <Table.Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
    </div>
  </Table.Footer>
</Table>
```

## Не делать

- не тащить TanStack / meta / filters / URL page sync внутрь DS
- не класть column settings persist в Table
- сильную zebra не включать по умолчанию — только `zebra` (слабый mix surface)
- не переносить selection между страницами — `clearAll` на смене page / pageSize
- не вшивать pageSize в `Pagination` — отдельный chrome
