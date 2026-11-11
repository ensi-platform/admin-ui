# Field

| Scenario                                  | Proof                                                                                                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `block` default and off                   | `it('applies block class by default')`, `it('omits block class when block={false}')`                                 |
| Label wired through `controlProps`        | `it('associates label with control via controlProps')`                                                               |
| `dataTestId`                              | `it('sets data-test-id from dataTestId')`                                                                            |
| Hint and error in `aria-describedby`      | `it('links hint through aria-describedby')`, `it('includes both hint and error in aria-describedby')`                |
| `invalid` shows the error; valid does not | `it('sets aria-invalid and shows error when invalid')`, `it('does not render error without children or when valid')` |
| Disabled root and control                 | `it('marks the root invalid and disabled')`, `it('passes disabled through controlProps')`                            |
| `ref`                                     | `it('forwards ref to the root')`                                                                                     |
| `useField` outside Field throws           | `it('throws useField outside Field')`                                                                                |
| Size typography on Label, Hint, Error     | `it('scales Label / Hint / Error typography by size')`                                                               |
| axe default                               | `it('has no axe violations')`                                                                                        |
