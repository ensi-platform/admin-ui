# Table

| Scenario                                                          | Proof                                                                       |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Header and body text                                              | `it('renders header and body cells')`                                       |
| `numeric` (class is the proof)                                    | `it('renders header and body cells')`                                       |
| Sticky header attribute                                           | `it('marks sticky header')`                                                 |
| `checked` row                                                     | `it('applies checked state on row')`                                        |
| `zebra`                                                           | `it('marks zebra on shell')`                                                |
| Disabled row is not clickable                                     | `it('applies disabled state on row')`                                       |
| Sort click: none → asc → desc → none                              | `it('cycles sort direction from HeaderCell')`                               |
| Sort keyboard: Enter and Space, same cycle                        | `it('cycles sort direction from the keyboard')`                             |
| Parent ignores `onSort`                                           | `it('keeps aria-sort when the parent ignores onSort')`                      |
| ActionBar overflow and danger item                                | `it('collapses ActionBar overflow into kebab popover')`                     |
| ActionBar without overflow                                        | `it('renders ActionBar without overflow when all items are visible')`       |
| `size="lg"` still activates an overflow item                      | `it('maps ActionBar buttons to md size when Table size is lg')`             |
| Checkbox select, partial, select-all                              | `it('wires checkbox selection with useTableRowSelection')`                  |
| Cell click toggles; button and header do not                      | `it('toggles row selection on a single cell click')`                        |
| `onClick` + `preventDefault` skips the checkbox                   | `it('honors row onClick, preventDefault, and non-body rows for selection')` |
| Link click does not select                                        | `it('skips selection when the click target is interactive')`                |
| Checkbox cell click does not fire the row `onClick`               | `it('stops row click when checkbox cells are clicked')`                     |
| Footer stays outside an external `Loader`                         | `it('keeps Footer outside Loader veil when composed by the app')`           |
| Clickable row and non-sticky footer                               | `it('marks non-sticky footer and clickable row without bottom border')`     |
| Filter drop: sort under the filter, outside click closes          | `it('opens a header filter and toggles sort inside the drop')`              |
| `filterActive`                                                    | `it('marks the filter icon when filterActive')`                             |
| `size` / `block` / `hasChecked` (class or attribute is the proof) | `it('applies size, block, and checkbox-column classes')`                    |
| `align` / `noWrap` (class is the proof)                           | `it('applies align and noWrap classes')`                                    |
| `width`                                                           | `it('sets the cell width')`                                                 |
| `dataTestId`                                                      | `it('renders header and body cells')`                                       |
| `ref` on the shell                                                | `it('assigns object ref')`                                                  |
| Context required                                                  | `it('throws when context consumers render outside Table')`                  |
| `PageSize` label, options, disabled                               | `page-size.test.tsx`                                                        |
| `PageSize` keyboard commit                                        | `it('changes the page size from the keyboard')`                             |
| `PageSize` parent ignores `onChange`                              | `it('keeps the page size when the parent ignores onChange')`                |
| Pagination range, prev/next, page jump, disabled ends             | `pagination.test.tsx`                                                       |
| axe default table, disabled row, `PageSize`                       | `it('has no axe violations…')` in `table.test.tsx` and `page-size.test.tsx` |
| `utility`                                                         | n/a — layout class; behavior is the actions and checkbox tests              |
| Clear of `PageSize`                                               | n/a — `clear` is off, so the user cannot emit `null`                        |
| Sticky offset, column overflow                                    | n/a — needs browser                                                         |
| Form                                                              | n/a — no `FormX`                                                            |
