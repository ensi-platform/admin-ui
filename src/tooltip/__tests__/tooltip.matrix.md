# Tooltip

| Scenario | Proof |
| --- | --- |
| Disabled trigger does not show | `it('does not show content for a disabled trigger')` |
| Focus shows content immediately (delay does not apply) | `it('shows the tooltip on focus immediately, before the hover delay')` |
| Hover stays hidden before the default delay and shows after it | `it('shows the tooltip on hover only after the default delay')` |
| Escape hides | `it('hides content on Escape')` |
| Blur hides | `it('hides content when focus leaves the trigger')` |
| Controlled `isOpen` | `it('sets data-test-id from dataTestId')` |
| `dataTestId` | `it('sets data-test-id from dataTestId')` |
| `size` / `variant` (no extra behavior) | `it('applies size and variant classes')` |
| `arrow` | `it('renders arrow svg when arrow is set')` |
| axe open | `it('has no axe violations when open')` |
| `invalid` | n/a — not in the Tooltip API |
| `onExitComplete` | n/a — no exit callback |
| Click to toggle | n/a — hover and focus, not press |
| Form | n/a — no FormTooltip |
| Placement geometry | needs browser — jsdom has no layout |
