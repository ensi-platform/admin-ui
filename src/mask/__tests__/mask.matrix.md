# Mask

| Scenario                                                           | Proof                                                                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Digits become the masked string                                    | `it('formats typed digits with the mask literals')`                                                      |
| Partial input is emitted                                           | `it('emits a partial mask before the pattern is complete')`                                              |
| Empty until the user types                                         | `it('stays empty until the user types')`                                                                 |
| Prop change to an already masked string does not emit              | `it('follows value and does not call onChange when the prop changes')`                                   |
| Raw `value` is normalized once and shown                           | `it('normalizes an external raw value once')`                                                            |
| Rejected `value`, then a digit still emits                         | `it('emits a digit after an external value the mask rejects')`                                           |
| Parent ignores `onChange` — screen stays on `value`                | `it('keeps the controlled value when the parent ignores onChange')`                                      |
| Backspace and `user.clear` emit `''` once                          | `it('emits an empty value once when the user deletes the mask')`                                         |
| Clear button emits `''` once and keeps focus                       | `it('emits an empty value once when clear is clicked and keeps focus')`, `it('clears the masked value')` |
| Paste                                                              | `it('formats a pasted number')`                                                                          |
| `defaultValue` formats without `onChange`                          | `it('formats defaultValue without calling onChange')`                                                    |
| `readOnly` blocks input and hides clear                            | `it('keeps a read-only value unchanged and hides clear')`                                                |
| `disabled` does not emit                                           | `it('does not call onChange when disabled')`                                                             |
| `dataTestId`                                                       | `it('sets data-test-id from dataTestId')`                                                                |
| `ref`                                                              | `it('assigns an object ref to the input')`                                                               |
| `opts` identity                                                    | n/a — caller contract, documented on `opts`; a new object every render is IMask's own refresh            |
| `size` / `variant` / `block` / `invalid`                           | n/a — chrome is `Input`; covered in `input.matrix.md`                                                    |
| Enter / Escape                                                     | n/a — no Mask action; Enter submits a parent form                                                        |
| Form submit, raw initial value, reset, blur error, form `disabled` | `form-mask.test.tsx`                                                                                     |
| Geometry                                                           | n/a                                                                                                      |
