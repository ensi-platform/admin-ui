# DatePicker

| Scenario                                               | Proof                                                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Segments render                                        | `it('renders date segments')`                                                                         |
| Open calendar, pointer does not focus a day            | `it('opens calendar popover via calendar button')`, `it('does not focus a day cell on pointer open')` |
| Keyboard open focuses the day; arrows move             | `it('focuses selected day and moves with arrow keys on keyboard open')`                               |
| Escape and outside click close                         | `it('closes the calendar on Escape and on outside click')`                                            |
| Pick a day from the popup                              | `it('selects a day from the calendar')`                                                               |
| Type, then pick another day                            | `it('selects a calendar day after a typed date')`                                                     |
| Typed month scrolls the open calendar                  | `it('scrolls calendar to entered month')`                                                             |
| Controlled value updates the open calendar             | `it('syncs open calendar when the controlled value changes')`                                         |
| Blur rolls back an out-of-bounds year                  | `it('restores last valid value on blur when the year is out of bounds')`                              |
| Blur rolls back a cleared year                         | `it('restores the date on blur when the year segment is cleared')`                                    |
| 31 February is not kept                                | `it('does not keep 31 February after typing that day')`                                               |
| Unavailable day; Enter selects the focused day         | `it('marks unavailable days and selects via Enter on focused day')`                                   |
| `maxValue` limits the year list                        | `it('respects props maxValue over default year max')`                                                 |
| Clear                                                  | `it('clears value')`                                                                                  |
| Minute granularity keeps the time when the day changes | `it('preserves time when selecting a day with minute granularity')`                                   |
| `disabled` blocks the calendar                         | `it('does not open or change the date when disabled')`                                                |
| `invalid`                                              | `it('marks the field invalid')`                                                                       |
| `size` / `variant` / `block` (no extra behavior)       | `it('uses the sm size and primary variant classes')`                                                  |
| axe default / disabled / invalid                       | `it('has no axe violations in the default, disabled, and invalid states')`                            |
| Form submit, error, clear, null                        | `form-date-picker.test.tsx`                                                                           |
| `invalid` instead of rollback                          | n/a — contract is rollback to the last valid date                                                     |
| Sticky calendar scroll                                 | needs browser                                                                                         |
