# TimeField

| Scenario                                                                  | Proof                                                                                                                                        |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Renders segments, `dataTestId`                                            | `it('renders time field')`                                                                                                                   |
| Controlled prop change does not emit                                      | `it('follows value and does not call onChange when the prop changes')`                                                                       |
| Type an hour                                                              | `it('types an hour')`                                                                                                                        |
| Hour 25 and minute 99 are not accepted                                    | `it('does not accept hour 25 or minute 99')`                                                                                                 |
| ArrowUp steps; hour does not pass `minValue`                              | `it('steps the hour with ArrowUp and stops at minValue')`                                                                                    |
| Cleared hour or minute restores the time from focus                       | `it('restores the previous time on blur when the hour is cleared')`, `it('restores the previous time on blur when the minutes are cleared')` |
| Cleared seconds (`granularity="second"`) restore                          | `it('restores seconds on blur when the second segment is cleared')`                                                                          |
| External value, then a cleared hour, restores that focused time           | `it('restores the focused time when the hour is cleared after an external update')`                                                          |
| 12-hour cycle keeps a typed time; day period is not an empty time segment | `it('keeps a typed 12-hour time on blur')`, `it('adds a day-period segment for a 12-hour cycle')`                                            |
| Clear → `null`                                                            | `it('clears value')`, `it('clears uncontrolled defaultValue')`                                                                               |
| `disabled` / `invalid`                                                    | `it('disables segments and marks the field invalid')`                                                                                        |
| `size` / `variant` / `block`                                              | `it('uses the sm size and primary variant classes')`                                                                                         |
| axe default / disabled / invalid                                          | `it('has no axe violations in the default, disabled, and invalid states')`                                                                   |
| Form submit, error, null                                                  | `form-time-field.test.tsx`                                                                                                                   |
| Minute step below `minValue` while the hour is already at the minimum     | n/a — the minute segment still steps (9:30 → 9:29). Hour floor is covered. Rollback vs `invalid` is not specified for that step              |
| Geometry                                                                  | n/a                                                                                                                                          |
