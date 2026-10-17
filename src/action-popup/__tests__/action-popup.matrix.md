# ActionPopup

| Scenario | Proof |
| --- | --- |
| Title, body, confirm and cancel labels | `it('renders title, body and label buttons')` |
| No body when children are omitted | `it('renders without body when children are omitted')` |
| Cancel closes | `it('closes on cancel')` |
| Confirm resolves and closes | `it('calls onConfirm and closes on success')` |
| Confirm rejects and stays open | `it('keeps open when onConfirm rejects')` |
| Buttons disabled while pending | `it('disables buttons while onConfirm is pending')` |
| Escape blocked while pending | `it('does not close on Escape while onConfirm is pending')` |
| Outside click blocked while pending | `it('does not close on outside click while confirm is pending')` |
| `isConfirmDisabled` | `it('disables confirm when isConfirmDisabled')` |
| Escape | `it('closes on Escape')` |
| Outside click / `dismissable` | `it('closes on outside click and stays open when dismissable is false')` |
| Focus in and return to opener | `it('moves focus into the dialog and returns it to the opener')` |
| `onExitComplete` after cancel | `it('calls onExitComplete once after cancel and not while the dialog stays open')` |
| `dataTestId` | `it('renders title, body and label buttons')` |
| Confirm labels from provider | `it('renders title, body and label buttons')` |
| Delete labels and danger tone | `it('renders danger confirm button and delete labels')` |
| Custom `tone` / labels | `it('renders custom labels and tone')` |
| axe open | `it('has no axe violations when open')` |
| Close button | n/a — ActionPopup has no CloseButton |
| `keyboardDismissable` prop | n/a — Escape is off only while confirm is pending |
| `size` / `variant` | n/a — panel size is fixed `sm`; tone is the confirm button variant |
| Nested overlay | n/a — single dialog |
| Swipe | n/a — not a sheet |
| Form | n/a — no FormActionPopup |
