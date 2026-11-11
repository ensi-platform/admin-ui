# ColorField

| Scenario                     | Proof                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Empty stays empty            | `it('keeps an empty field empty and does not publish black')`                                                             |
| Stored hex and unknown value | `it('shows a short stored hex without writing it back')`, `it('shows an unknown stored value as an empty invalid field')` |
| Typing, blur, paste, Enter   | `color-field.test.tsx`                                                                                                    |
| `inputRef`                   | `it('forwards inputRef to the hex input')`                                                                                |
| Parent rejects the change    | `it('falls back to the parent value when the parent rejects the change')`                                                 |
| Form                         | `form-color-field.test.tsx`                                                                                               |
| axe default                  | `it('has no axe violations')`                                                                                             |
| Popover position             | n/a — jsdom has no layout                                                                                                 |
