# Modal

| Scenario | Proof |
| --- | --- |
| Controlled `open` / `onOpenChange` | `it('calls onOpenChange on Escape when keyboardDismissable')` |
| Parent ignores close | `it('does not finish exit when the parent keeps the dialog open')` |
| Closed render | `it('does not render dialog when closed')` |
| Slots: Header, Title, Body, Footer, CloseButton | `it('renders dialog when open')` |
| Close button, `preventDefault` keeps it open | `it('does not close when CloseButton onClick calls preventDefault')` |
| Close label from provider | `it('names the close button from provider labels')` |
| Escape / `keyboardDismissable` | `it('does not close on Escape when keyboardDismissable is false')` |
| Outside click / `dismissable` | `it('closes on outside click and stays open when dismissable is false')` |
| Focus in, trap, return to opener | `it('moves focus into the dialog and returns it to the opener')` |
| Nested Escape closes only the top layer | `it('Escape closes a nested popover and leaves the modal open')` |
| `onExitComplete` after close, not while open | `it('calls onExitComplete once after close and not while the dialog stays open')` |
| Portal stays in the provider root | `it('portals the dialog inside the provider root')` |
| `dataTestId` on the dialog | `it('renders dialog when open')` |
| `ref` on the panel | `it('points ref at the panel')` |
| `size` / `variant` (no extra behavior) | `it('applies size and variant classes')` |
| `fullscreen` overrides size geometry | `it('applies fullscreen class')` |
| axe open | `it('has no axe violations when open')` |
| `disabled` / `invalid` | n/a — not in the Modal API |
| Uncontrolled `defaultOpen` | n/a — `open` is required |
| Swipe | n/a — not a sheet |
| Form | n/a — no FormModal |
