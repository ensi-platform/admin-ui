# Password

| Scenario                                    | Proof                                                       |
| ------------------------------------------- | ----------------------------------------------------------- |
| Hidden value, toggle shows and hides it     | `it('hides typed characters until the toggle is pressed')`  |
| `autoComplete` stays when set               | `it('keeps a custom autocomplete value')`                   |
| Toggle hidden when disabled or read-only    | `it('hides the toggle when disabled or read-only')`         |
| Custom `rightAddon` stays before the toggle | `it('places the custom right addon before the toggle')`     |
| Form submit                                 | `form-password.test.tsx` `it('submits the typed password')` |
| axe default                                 | `it('has no axe violations')`                               |
| Geometry                                    | n/a — jsdom has no layout                                   |
