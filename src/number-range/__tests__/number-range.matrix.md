# NumberRange

| Scenario                                                                     | Proof                                                                         |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Controlled value, `onChange` shape `{ from, to }`, prop change does not emit | `it('keeps the controlled range when the parent ignores onChange')`           |
| Uncontrolled `defaultValue`                                                  | `it('stores an uncontrolled draft')`                                          |
| Align when one side is empty                                                 | `it('does not touch the other side when one side is empty')`                  |
| `from > to` pulls `to`                                                       | `it('pulls to when from is greater than to')`                                 |
| `to < from` pulls `from`                                                     | `it('pulls from when to is less than from')`                                  |
| `from === to`                                                                | `it('keeps to when from is set equal to to')`                                 |
| Uncontrolled align                                                           | `it('aligns to when an uncontrolled from exceeds it')`                        |
| Clear sets `null` on the changed side only                                   | `it('sets null only on the changed side when cleared')`                       |
| `min` / `max` clamp on blur                                                  | `it('clamps a typed side to max and does not go below min')`                  |
| `step` via ArrowUp on the focused side                                       | `it('steps the focused side with ArrowUp and leaves the other side')`         |
| `formatOptions` (ru-RU decimal)                                              | `it('shows a ru-RU decimal from formatOptions')`                              |
| Paste of non-numeric text, then a number                                     | `it('leaves the side unchanged when non-numeric text is pasted')`             |
| `onBlur`                                                                     | `it('calls onBlur when a side loses focus')`                                  |
| Placeholders and `aria-describedby`                                          | `it('shows a placeholder and described-by on each side')`                     |
| `disabled` blocks typing                                                     | `it('does not change either side when disabled')`                             |
| `invalid` → `aria-invalid`                                                   | `it('marks both fields invalid')`                                             |
| `size` / `variant` (no extra behavior)                                       | `it('uses the sm size class on both fields')`                                 |
| `block`                                                                      | `it('does not stretch the fields when block is off')`                         |
| `dataTestId`                                                                 | `it('renders two inputs with default size md and dataTestId')`                |
| `ref`                                                                        | `it('points ref at the range element')`                                       |
| Without provider                                                             | `it('renders both sides without AdminUiProvider')`                            |
| axe default / disabled / invalid                                             | `it('has no axe violations in the default, disabled, and invalid states')`    |
| Enter                                                                        | n/a — NumberField commits on blur and Arrow keys; Enter is not a range action |
| Form submit, hint, null value                                                | `form-number-range.test.tsx`                                                  |
| Read-only                                                                    | n/a — not in the NumberRange API                                              |
| Popup / calendar                                                             | n/a — two number fields, no overlay                                           |
| Geometry                                                                     | n/a — no layout-dependent behavior                                            |
