# CheckboxGroup

| Scenario                                                         | Proof                                                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Select adds the option value to `string[]`                       | `it('selects values as string[]')`                                                             |
| Uncheck removes the value; a disabled option is skipped          | `it('removes a value when it is unchecked and skips a disabled option')`                       |
| Space selects from `defaultValue`                                | `it('selects with Space from defaultValue')`                                                   |
| Tab moves to the next option; Enter and ArrowDown do not select  | `it('moves to the next option with Tab and does not select with Enter or ArrowDown')`          |
| Controlled value; prop change does not emit                      | `it('follows value and does not call onChange when the prop changes')`                         |
| Parent ignores `onChange`                                        | `it('keeps the controlled value when the parent ignores onChange')`                            |
| `size` sets `data-size` (layout rhythm, no visual variant)       | `it('sets data-size from size')`                                                               |
| Group `disabled` disables every option                           | `it('disables every option when the group is disabled')`                                       |
| `invalid`                                                        | `it('sets data-invalid when invalid')`                                                         |
| `dataTestId`                                                     | `it('sets data-test-id from dataTestId')`                                                      |
| `ref`                                                            | `it('assigns object ref')`                                                                     |
| axe default / disabled / invalid                                 | `it('has no axe violations in the default, disabled, and invalid states')`                     |
| Item `size` stays on each `Checkbox`                             | n/a — documented; group `size` does not paint the items                                        |
| Form submit, hint, nullish empty, `dataTestId` on Field          | `form-checkbox-group.test.tsx`                                                                 |
