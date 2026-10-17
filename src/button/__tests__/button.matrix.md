# Button

| Scenario | Proof |
| --- | --- |
| Click when enabled | `it('calls onClick when enabled')` |
| Disabled blocks click and keyboard | `it('does not call onClick when disabled')`, `it('does not activate a disabled button from the keyboard')` |
| Enter and Space | `it('activates with Enter and Space')` |
| `as="a"` | `it('renders as anchor when as="a"')` |
| `type="button"` | `it('defaults type to button for native button')` |
| size / variant / block classes | `it('applies size and variant classes')`, `it('applies secondary and danger variant classes')`, `it('applies block class when block is true')` |
| Icon slots | `it('renders icon before children by default')`, `it('renders icon after children when after is true')` |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| `invalid` | n/a — not in the API |
