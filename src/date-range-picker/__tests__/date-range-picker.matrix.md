# DateRangePicker

| Scenario                                                                 | Proof                                                                                                          |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Two date inputs                                                          | `it('renders range inputs')`                                                                                   |
| Open, Escape, outside click                                              | `it('opens calendar popover via calendar button')`, `it('closes the calendar on Escape and on outside click')` |
| Pick a range from the popup                                              | `it('selects a range from the calendar')`                                                                      |
| Pick later day first; result is ordered                                  | `it('orders a range picked from the later day to the earlier day')`                                            |
| Typed `end < start` swaps                                                | `it('swaps a typed range when the end date is before the start')`                                              |
| Typed start after end swaps                                              | `it('swaps when the start date is typed after the end date')`                                                  |
| `start === end`                                                          | `it('keeps a single-day range when start and end are equal')`                                                  |
| Year before the default bound rolls back                                 | `it('restores the start date on blur when the year is out of bounds')`                                         |
| `minValue` / `maxValue`: below min rolls back; year equal to min is kept | `it('does not publish an out-of-bounds end year')`, `it('keeps a start date typed exactly on minValue')`       |
| Cleared end year rolls back                                              | `it('restores the end date on blur when its year is cleared')`                                                 |
| Unavailable day does not change the range                                | `it('does not change the range when an unavailable day is clicked')`                                           |
| Parent ignores `onChange`                                                | `it('keeps the controlled value when the parent ignores onChange')`                                            |
| Parent replaces the draft while focused                                  | `it('shows a parent value that replaces the draft while the field is focused')`                                |
| `disabled`                                                               | `it('does not open or change the range when disabled')`                                                        |
| `invalid`                                                                | `it('marks the field invalid')`                                                                                |
| `size` / `variant` / `block`                                             | `it('uses the sm size and primary variant classes')`                                                           |
| Keyboard open focuses a day                                              | `it('focuses selected day on keyboard open')`                                                                  |
| Clear                                                                    | `it('clears value')`                                                                                           |
| axe default / disabled / invalid                                         | `it('has no axe violations in the default, disabled, and invalid states')`                                     |
| Order / commit helpers                                                   | `utils.test.ts`                                                                                                |
| Form submit of a reversed typed range                                    | `form-date-range-picker.test.tsx`                                                                              |
| Hover preview inside the calendar                                        | `it('shows hover preview while selecting range end')` — hit-testing of the real layout is needs browser        |
| Sticky month headers                                                     | needs browser                                                                                                  |
