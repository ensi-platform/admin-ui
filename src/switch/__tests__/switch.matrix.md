# Switch

| Scenario                                            | Proof                                                                                    |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Switch, accessible name from children               | `it('renders switch with label')`                                                        |
| Name from `aria-label` when there is no label       | `it('renders without label when children are omitted')`                                  |
| Controlled `checked`; prop change does not emit     | `it('follows checked and does not call onChange when the prop changes')`                 |
| Parent ignores `onChange`                           | `it('keeps the controlled state when the parent ignores onChange')`                      |
| Click toggles and passes `boolean`                  | `it('toggles checked on click')`                                                         |
| Label click toggles                                 | `it('toggles when the label text is clicked')`                                           |
| Space toggles uncontrolled `defaultChecked`         | `it('toggles with Space and keeps defaultChecked')`                                      |
| Enter does not toggle                               | `it('does not toggle on Enter')`                                                         |
| `disabled` blocks click and Space                   | `it('does not call onChange when disabled')`                                             |
| `invalid`                                           | `it('sets aria-invalid when invalid')`                                                   |
| `size` / `variant` (class is the proof)             | `it('applies size and variant classes')`                                                 |
| `dataTestId`                                        | `it('sets data-test-id from dataTestId')`                                                |
| `ref` on the label                                  | `it('assigns object ref')`                                                               |
| axe default / disabled / invalid                    | `it('has no axe violations in the default, disabled, and invalid states')`               |
| Form submit, validation, hint, disabled from `Form` | `form-switch.test.tsx`                                                                   |
