# NumberInput

| Scenario                                                              | Proof                                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Controlled value follows the prop; prop change does not emit          | `it('follows value and does not call onChange when the prop changes')`                                 |
| Uncontrolled typing commits a number; clear via keyboard emits `null` | `it('calls onChange with number')`, `it('emits null when input is cleared via typing')`                |
| `0`, negative, paste                                                  | `it('accepts zero, a negative value, and a pasted number')`                                            |
| `NaN` default is empty                                                | `it('treats NaN defaultValue as empty uncontrolled state')`                                            |
| `min` / `max` clamp on blur; ArrowDown does not pass `min`            | `it('clamps a typed value to max on blur')`, `it('does not step below min with ArrowDown')`            |
| `step`, ArrowUp, PageUp, PageDown; letters are not numbers            | `it('steps with ArrowUp and ignores letters')`                                                         |
| `formatOptions` ru-RU comma                                           | `it('parses a ru-RU decimal comma')`                                                                   |
| Clear button → `onChange(null)`, including uncontrolled               | `it('clears value when clear is clicked')`, `it('clears uncontrolled value when clear is clicked')`    |
| `onBlur`                                                              | `it('calls onBlur when the field loses focus')`                                                        |
| `placeholder`                                                         | `it('shows the placeholder')`                                                                          |
| `readOnly` focusable, unchanged, no clear                             | `it('keeps a read-only value focusable and unchanged')`, `it('hides the clear button when read-only')` |
| `disabled`                                                            | `it('disables input when disabled')`                                                                   |
| `invalid`                                                             | `it('sets invalid state')`                                                                             |
| `prefix` / `suffix`                                                   | `it('renders prefix')`, `it('renders suffix')`                                                         |
| `size` / `variant` (no extra behavior)                                | `it('uses the sm size and primary variant classes')`                                                   |
| `block`                                                               | `it('applies block class by default')`, `it('omits block class when block={false}')`                   |
| `dataTestId`                                                          | `it('renders textbox')`                                                                                |
| axe default / disabled / invalid                                      | `it('has no axe violations in the default, disabled, and invalid states')`                             |
| Form submit, validation, readOnly map, `formatOptions`                | `form-number-input.test.tsx`                                                                           |
| Enter                                                                 | n/a — commits on blur; Arrow keys step                                                                 |
| `ref`                                                                 | n/a — same native input path as Input; not a separate NumberInput behavior                             |
| Geometry                                                              | n/a                                                                                                    |
