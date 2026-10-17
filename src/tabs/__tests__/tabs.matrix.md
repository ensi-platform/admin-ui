# Tabs

| Scenario | Proof |
| --- | --- |
| Selected panel is visible | `it('renders tabs and the selected panel')` |
| `dataTestId` on root, list, and tab | `it('sets data-test-id from dataTestId')`, `it('puts data-test-id on the list and the tab')` |
| Click selects and calls `onChange` once | `it('calls onChange and switches panel when a tab is clicked')` |
| Controlled parent ignores `onChange`: panel stays | `it('keeps the panel when the parent ignores onChange')` |
| Disabled tab is not selected; keyboard skips it | `it('does not select a disabled tab')`, `it('moves with ArrowRight, skips a disabled tab, and jumps with Home and End')` |
| `disabled` on the root blocks click | `it('does not select a tab when the group is disabled')` |
| ArrowRight / ArrowLeft, Home, End | `it('moves with ArrowRight, skips a disabled tab, and jumps with Home and End')` |
| Manual activation: arrows move focus, Enter selects | `it('selects a tab with Enter when activation is manual')` |
| `value` drives selection and does not call `onChange` | `it('follows the value prop and does not call onChange for it')` |
| `size` / `variant` classes | `it('applies size classes to root, list, and tab')`, `it('applies the primary variant class')` |
| `ref` on the root | `it('points ref at the tabs root')` |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| List outside Tabs throws | `it('throws when List is used outside Tabs')` |
| `invalid` / Form | n/a — not in the API |
