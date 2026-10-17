# TextArea

| Scenario                                                                | Proof                                                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Textbox, accessible name; works without provider                        | `it('renders textbox')`                                                                                |
| Controlled value; prop change does not emit                             | `it('follows value and does not call onChange when the prop changes')`                                 |
| Parent ignores `onChange`                                               | `it('keeps the controlled value when the parent ignores onChange')`                                    |
| Uncontrolled type and clear                                             | `it('updates uncontrolled value on type and clear')`                                                   |
| Clear button emits `''` and keeps focus                                 | `it('clears value when clear is clicked')`, `it('keeps focus on the textarea after clear')`            |
| Clear hidden when empty, read-only, or disabled                         | `it('hides the clear button when the value is empty')`, `it('hides the clear button when read-only')`, `it('hides the clear button when disabled')` |
| `maxLength` and paste                                                   | `it('blocks input past maxLength and accepts paste')`                                                  |
| Selection replace                                                       | `it('replaces the selected text')`                                                                     |
| `placeholder` and `onBlur`                                              | `it('shows the placeholder and calls onBlur')`                                                         |
| Enter inserts a newline                                                 | `it('inserts a newline on Enter')`                                                                     |
| `rows`                                                                  | `it('sets the rows attribute')`                                                                        |
| `readOnly` focusable and unchanged                                      | `it('keeps a read-only value focusable and unchanged')`                                                |
| `disabled` does not emit                                                | `it('does not call onChange when disabled')`                                                           |
| `invalid`                                                               | `it('sets aria-invalid when invalid')`                                                                 |
| `size` / `variant` / `block` (class is the proof; no separate behavior) | `it('applies size and variant classes on shell')`, `it('omits block class when block={false}')`        |
| `dataTestId`                                                            | `it('sets data-test-id from dataTestId')`                                                              |
| `ref`                                                                   | `it('assigns object ref')`                                                                             |
| Field label, hint, error, `aria-describedby`                            | `it('works with Field via explicit controlProps')`                                                     |
| axe default / disabled / invalid                                        | `it('has no axe violations in the default, disabled, and invalid states')`                             |
| Escape                                                                  | n/a — no TextArea action                                                                                |
| Form submit, validation, reset path, disabled / readOnly map            | `form-textarea.test.tsx`                                                                               |
| Geometry                                                                | n/a                                                                                                    |
