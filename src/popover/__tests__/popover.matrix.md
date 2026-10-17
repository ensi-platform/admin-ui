# Popover

| Scenario | Proof |
| --- | --- |
| Opens on click | `it('opens dialog content on click')` |
| Focus does not open; Enter does | `it('opens with Enter on the trigger and does not open a disabled trigger')` |
| Hover does not open; click does | `it('does not open on hover and opens on click')` |
| Disabled trigger | `it('opens with Enter on the trigger and does not open a disabled trigger')` |
| Escape returns focus to the trigger | `it('closes on Escape and returns focus to the trigger')` |
| Tab stays inside | `it('keeps Tab inside the popover')` |
| Outside click | `it('closes on outside click')` |
| Controlled `isOpen` stays closed | `it('follows the open prop and does not open when it stays closed')` |
| `dataTestId` | `it('sets data-test-id from dataTestId')` |
| `size` / `variant` (no extra behavior) | `it('applies size and variant classes')` |
| `arrow` | `it('renders arrow svg when arrow is set')` |
| axe open | `it('has no axe violations when open')` |
| `disabled` / `invalid` on the panel | n/a — not in the Popover API |
| `onExitComplete` | n/a — DialogTrigger unmounts content; no exit callback |
| Delay | n/a — opens on press, not after a delay |
| Form | n/a — no FormPopover |
| Placement geometry | needs browser — jsdom has no layout |
