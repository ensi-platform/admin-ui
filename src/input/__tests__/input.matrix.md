# Input

| Scenario                                                                | Proof                                                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Textbox, accessible name                                                | `it('renders textbox')`                                                                                |
| Controlled value; prop change does not emit                             | `it('follows value and does not call onChange when the prop changes')`                                 |
| Parent ignores `onChange`                                               | `it('keeps the controlled value when the parent ignores onChange')`                                    |
| Uncontrolled type and clear                                             | `it('updates uncontrolled value on type and clear')`                                                   |
| Clear button emits `''`                                                 | `it('clears value when clear is clicked')`                                                             |
| `maxLength` and paste                                                   | `it('blocks input past maxLength and accepts paste')`                                                  |
| Selection replace                                                       | `it('replaces the selected text')`                                                                     |
| `placeholder` and `onBlur`                                              | `it('shows the placeholder and calls onBlur')`                                                         |
| `type`                                                                  | `it('sets the native type')`                                                                           |
| `readOnly` focusable and unchanged; no clear                            | `it('keeps a read-only value focusable and unchanged')`, `it('hides the clear button when read-only')` |
| `disabled` does not emit (enabled typing is the positive control)       | `it('does not call onChange when disabled')`                                                           |
| `invalid`                                                               | `it('sets aria-invalid when invalid')`                                                                 |
| `size` / `variant` / `block` (class is the proof; no separate behavior) | `it('applies size and variant classes on shell')`, `it('omits block class when block={false}')`        |
| `dataTestId`                                                            | `it('sets data-test-id from dataTestId')`                                                              |
| `ref`                                                                   | `it('assigns object ref')`                                                                             |
| Field label, hint, error, `aria-describedby`                            | `it('works with Field via explicit controlProps')`                                                     |
| axe default / disabled / invalid                                        | `it('has no axe violations in the default, disabled, and invalid states')`                             |
| Enter / Escape                                                          | n/a — no Input action; Enter submits a parent form                                                     |
| Form submit, validation, reset, disabled map                            | `form-input.test.tsx`                                                                                  |
| Geometry                                                                | n/a                                                                                                    |
