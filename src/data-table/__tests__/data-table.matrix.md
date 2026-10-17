# DataTable

| Scenario                                                         | Proof                                                                |
| ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| Header click cycles sort and replaces the column                 | `it('cycles sort on a header click and replaces the active column')` |
| `onSortChange` receives `{ column, direction }` then `undefined` | `it('reports direction for the sorted column')`                      |
| Same cycle from Enter                                            | `it('reports direction when sort is committed from the keyboard')`   |
| Filter sort rows set `direction`                                 | `it('sets direction from the filter sort rows')`                     |
| Sort ignored without `column` or `onSortChange`                  | `it('ignores sort when the column id or the handler is missing')`    |
| Plain header has no sort button                                  | `it('renders a plain header when the column has no filter')`         |
| `Filter` is a marker, not rendered content                       | `it('renders an empty filter marker')`                               |
| Filter drop opens; `active` marks the icon                       | `it('opens the column filter drop and marks it active')`             |
| Empty `Filter` still opens the drop                              | `it('opens a filter drop that has no children')`                     |
| `Actions` default name opens the caller menu                     | `it('opens the menu from the kebab click wired by the caller')`      |
| `label` overrides the actions name                               | `it('uses the actions label as the accessible name')`                |
| Row checkbox, select-all, actions click does not select          | `it('selects a row from the cell and skips the actions button')`     |
| `onContextMenu` is forwarded; the row does not open a menu       | `it('forwards onContextMenu from the row')`                          |
| `Footer` is outside the table                                    | `it('opens the menu from the kebab click wired by the caller')`      |
| `size` / `block` / `zebra` / `align` / `noWrap` / `width`        | n/a — same chrome as `Table`; proof lives in `table.test.tsx`        |
| `PageSize` / `Pagination`                                        | n/a — re-exported `Table` parts; proof lives in `table/__tests__`    |
| axe default                                                      | `it('has no axe violations in the default state')`                   |
| `invalid`                                                        | n/a — not in the contract                                            |
| Sticky columns, menu geometry                                    | n/a — needs browser                                                  |
| Form                                                             | n/a — no `FormX`                                                     |
