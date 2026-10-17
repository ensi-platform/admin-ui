# Avatar

| Scenario | Proof |
| --- | --- |
| Initials from name, explicit initials, empty name | `it('renders initials from name')`, `it('renders explicit initials')`, `it('renders empty text when name is missing or whitespace')` |
| Image with alt | `it('renders image when src is set')`, `it('has no axe violations for initials and an image')` |
| Children replace initials | `it('renders children over initials')` |
| size / variant classes | `it('applies size class')`, `it('uses the primary variant by default')` |
| `dataTestId` and ref | `it('sets data-test-id from dataTestId')`, `it('points ref at the avatar')` |
| axe | `it('has no axe violations for initials and an image')` |
| Image load error fallback | n/a — the component does not handle `error` |
| `disabled` | n/a — not in the API |
