# VerticalTabs

| Scenario | Proof |
| --- | --- |
| Vertical list and selected panel | `it('renders a vertical list and the selected panel')` |
| Click selects; disabled item does not | `it('calls onChange and keeps a disabled item unselected')` |
| ArrowDown / ArrowUp, Home, End, skip disabled | `it('moves with ArrowDown and skips a disabled item')` |
| `disabled` on the root blocks click | `it('does not select an item when the group is disabled')` |
| Controlled parent ignores `onChange` | `it('keeps the panel when the parent ignores onChange')` |
| `value` drives selection | `it('follows the value prop and does not call onChange for it')` |
| `size` / `variant` classes | `it('applies the size class')`, `it('applies the primary variant class')` |
| `dataTestId` and `ref` | `it('puts data-test-id on the list and the item')`, `it('points ref at the root')` |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| List outside VerticalTabs throws | `it('throws when List is used outside VerticalTabs')` |
| `invalid` / Form | n/a — not in the API |
