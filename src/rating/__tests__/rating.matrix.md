# Rating

| Scenario                                                | Proof                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Slider, accessible name, value text                     | `it('renders a labelled slider and the locale value text')`                           |
| Controlled value; prop change does not emit             | `it('follows value and does not call onChange when the prop changes')`                |
| Parent ignores `onChange`                               | `it('keeps the controlled value when the parent ignores onChange')`                   |
| Uncontrolled click, second click clears to min          | `it('updates from defaultValue and clears on a second click of the same half')`       |
| `onChange` once per click                               | `it('calls onChange once with the half value')`                                       |
| Drag keeps the zone under the pointer                   | `it('keeps the dragged zone instead of clearing')`                                    |
| Hover fills stars and does not emit                     | `it('previews the half under the pointer without calling onChange')`                  |
| Arrow, Home, End                                        | `it('steps with the arrow keys and jumps with Home and End')`                         |
| Clamp at the ends                                       | `it('does not step past min or max')`                                                 |
| `disabled` blocks click and keyboard                    | `it('does not call onChange when disabled')`                                          |
| `disabled` wins over `readOnly`                         | `it('keeps a disabled slider when readOnly is also set')`                             |
| `readOnly` is an image, no zones, no hover              | `it('renders a read-only image and ignores hover')`                                   |
| `aria-label` prefixes the read-only name                | `it('prefixes the read-only name with aria-label')`                                   |
| `invalid`                                               | `it('sets aria-invalid when invalid')`                                                |
| `size` / `variant` class                                | `it('applies size and variant classes')`                                              |
| `dataTestId`                                            | `it('sets data-test-id from dataTestId')`                                             |
| `ref` on the range input                                | `it('assigns the ref to the range input')`                                            |
| `onBlur`                                                | `it('calls onBlur when the slider loses focus')`                                      |
| Label template and locale override                      | `it('uses the ratingValue label template')`                                           |
| axe default / disabled / invalid / readOnly             | `it('has no axe violations in the default, disabled, invalid, and read-only states')` |
| Without provider                                        | `it('throws without AdminUiProvider')`                                                |
| Pixel hit testing on the track                          | n/a — jsdom has no layout; zones carry the value, see the Rating story                |
| Form submit, validation, reset, nullish → min, readOnly | `form-rating.test.tsx`                                                                |
