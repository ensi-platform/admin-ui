# Tree

| Scenario                                                     | Proof                                                                        |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Nested labels when a branch is expanded                      | `it('renders a nested label when the branch is expanded')`                   |
| Leaf and empty children have no chevron; a branch has one    | `it('shows a chevron on a branch only')`                                     |
| Chevron expands and does not select                          | `it('expands from the chevron without selecting the row')`                   |
| Single: click selects, second click keeps the row            | `it('keeps a single selection on the second click')`                         |
| Multiple: second click clears the row                        | `it('clears a row on the second click in multiple mode')`                    |
| None: row click does not select; chevron still expands       | `it('does not select a row when selection is none')`                         |
| Empty selection is allowed                                   | `it('allows an empty selection')`                                            |
| Controlled selection stays until the prop changes            | `it('follows selectedKeys and ignores a click the parent does not apply')`   |
| Uncontrolled selection                                       | `it('updates selection from defaultSelectedKeys')`                           |
| Controlled expansion stays until the prop changes            | `it('follows expandedKeys and ignores a chevron the parent does not apply')` |
| Uncontrolled expansion                                       | `it('expands from defaultExpandedKeys')`                                     |
| Numeric id                                                   | `it('selects a row with a numeric id')`                                      |
| Disabled tree: click and chevron do nothing                  | `it('does not select or expand when the tree is disabled')`                  |
| Disabled row: that row stays closed; a sibling still selects | `it('does not select or expand a disabled row')`                             |
| Read-only: selection stays, chevron expands                  | `it('keeps the selection and still expands when readOnly')`                  |
| `dataTestId`                                                 | `it('sets data-test-id from dataTestId')`                                    |
| `ref`                                                        | `it('assigns object ref')`                                                   |
| axe                                                          | `it('has no axe violations')`                                                |
| `size` / `variant`                                           | n/a — one density, no chrome variants                                        |
| Drag and drop, lazy children                                 | n/a — not in the contract                                                    |
