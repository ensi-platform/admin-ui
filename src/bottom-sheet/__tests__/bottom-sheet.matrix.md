# BottomSheet

| Scenario | Proof |
| --- | --- |
| Controlled `open` / `onOpenChange` | `it('calls onOpenChange on Escape when keyboardDismissable')` |
| Parent ignores close | `it('does not finish exit when the parent keeps the sheet open')` |
| Closed render | `it('does not render dialog when closed')` |
| Slots: Header, Title, Body, Footer, CloseButton | `it('renders dialog when open')` |
| Close button, `preventDefault` keeps it open | `it('does not close when CloseButton onClick calls preventDefault')` |
| Close label from provider | `it('names the close button from provider labels')` |
| Escape / `keyboardDismissable` | `it('does not close on Escape when keyboardDismissable is false')` |
| Outside click / `dismissable` | `it('closes on outside click and stays open when dismissable is false')` |
| Focus in, trap, return to opener | `it('moves focus into the dialog and returns it to the opener')` |
| Nested Escape closes only the top layer | `it('Escape closes a nested popover and leaves the sheet open')` |
| `onExitComplete` after close, not while open | `it('calls onExitComplete once after close and not while the sheet stays open')` |
| `dataTestId` on the dialog | `it('renders dialog when open')` |
| Object and callback `ref` | `it('assigns object and callback refs to the panel')` |
| Body outside the sheet | `it('throws when Body is used outside BottomSheet')` |
| `variant` / `fullscreen` (no extra behavior) | `it('applies variant class')` / `it('applies fullscreen class')` |
| Swipe close thresholds | `shouldCloseSheet` in this file |
| Swipe gesture on the handle | needs browser — jsdom has no layout; the pointer test stubs `getBoundingClientRect` |
| axe open | `it('has no axe violations when open')` |
| `disabled` / `invalid` / `size` | n/a — not on the sheet root |
| Uncontrolled `defaultOpen` | n/a — `open` is required |
| Form | n/a — no FormBottomSheet |
