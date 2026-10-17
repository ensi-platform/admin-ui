# ActiveFilters

| Scenario | Proof |
| --- | --- |
| Empty row (`null` / `false` children) is not rendered | `it('renders nothing when there are no chips')` |
| Item label is visible | `it('renders chips and clears them all')` |
| Item remove: click | `it('renders chips and clears them all')` |
| Item remove: Enter and Space | `it('renders chips and clears them all')`, `it('removes a chip with Space')` |
| Remove does not bubble and does not steal focus | `it('does not bubble the remove click and keeps focus on the previous control')` |
| `onClear` link, omitted when the prop is omitted | `it('renders chips and clears them all')`, `it('renders a chip without a remove control')` |
| `clear` / `clearFilters` from provider labels | `it('renders chips and clears them all')` |
| `disabled` blocks click, Enter, and Space; enabled chip still removes | `it('does not remove a disabled chip and still removes an enabled one')` |
| Chip is a `md` `primary` tag | `it('renders the chip as a md primary tag')` |
| Group label and count, including `0` | `it('shows a zero count on the group chip')` |
| Group opens on click; `scroll` `auto` / `virtual` | `it('opens the grouped chip with the filter list')`, `it('lets a virtual list own the drop scroll')` |
| Group opens with Space; Escape returns focus | `it('opens the group with Space and closes it with Escape')` |
| Group remove: click, Enter, Space; list stays closed | `it('clears a group from its remove control')`, `it('removes a group from the keyboard without opening the list')` |
| Outside click closes; nested overlay does not | `it('sizes the drop to the chip and ignores an outside click on a nested overlay')` |
| Drop min width follows the chip | `it('sizes the drop to the chip and ignores an outside click on a nested overlay')` |
| `dataTestId` on the row, chip, and group trigger | `it('renders chips and clears them all')`, `it('points refs at the row, the chip, and the group trigger')`, `it('opens the grouped chip with the filter list')` |
| `ref` on the row, chip, and group button | `it('points refs at the row, the chip, and the group trigger')` |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| `invalid` | n/a — not in the ActiveFilters API |
| Group `disabled` | n/a — only `Item` has `disabled` |
| Form | n/a — no FormActiveFilters |
| Hover border, popover flip, virtual scroll geometry | needs browser |
