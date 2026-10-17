# Slider

| Scenario                                                         | Proof                                                                                           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Slider, accessible name, formatted value                         | `it('renders a labelled slider and the current value')`                                        |
| Controlled value; prop change does not emit                      | `it('follows value and does not call onChange when the prop changes')`                          |
| Parent ignores `onChange`                                        | `it('keeps the controlled value when the parent ignores onChange')`                             |
| `defaultValue`; Arrow / PageUp / PageDown update the thumb       | `it('updates from defaultValue and steps with the keyboard')`                                   |
| `step`; clamp at `minValue` / `maxValue`                         | `it('clamps keyboard steps to min and max')`                                                    |
| Home / End / PageDown                                            | `it('jumps to the edges with Home and End and steps by page')`                                  |
| `onChange` argument is the next number                           | `it('calls onChange when the value moves')`                                                     |
| `onBlur`                                                         | `it('calls onBlur when the thumb loses focus')`                                                 |
| `ticks` on each step, hidden when off or when the step floods    | `it('renders a tick for each step')`, `it('hides ticks when ticks is false')`, `it('renders no ticks when the step would flood the track')`, `utils.test.ts` |
| `formatDetail`                                                   | `it('renders formatDetail next to the value')`                                                  |
| `disabled` blocks click and keyboard                             | `it('does not call onChange when disabled')`                                                    |
| `invalid`                                                        | `it('sets aria-invalid when invalid')`                                                          |
| `size` / `variant` / `block` (class is the proof)                | `it('applies size and variant classes')`                                                        |
| `dataTestId`                                                     | `it('sets data-test-id from dataTestId')`                                                       |
| `ref`                                                            | `it('assigns object and callback refs to the thumb input')`                                     |
| axe default / disabled / invalid                                 | `it('has no axe violations in the default, disabled, and invalid states')`                      |
| Drag along the track                                             | needs browser — jsdom has no layout                                                             |
| Form submit, validation, blur commit, nullish → `minValue`       | `form-slider.test.tsx`                                                                          |
