# Toast

| Scenario | Proof |
| --- | --- |
| Title and description | `it('renders title after appendToast')` |
| Omitted description | `it('does not render description when omitted')` |
| `variant` including default `neutral` | `it('uses neutral variant by default')` |
| `dataTestId` on the region | `it('sets data-test-id on region from dataTestId')` |
| Close button | `it('closes toast when close button is clicked')` |
| `closeToast(key)` | `it('closes toast when closeToast is called with key')` |
| Default timeout: still open before 5000, gone after | `it('dismisses toast after default timeout of 5000ms')` |
| Provider `defaultTimeout` | `it('uses defaultTimeout from Provider when options.timeout is omitted')` |
| Per-call `timeout` overrides the provider | `it('per-call timeout overrides Provider defaultTimeout')` |
| `timeout: 0` stays | `it('does not auto-dismiss when timeout is 0')` |
| `onClose` from button, timeout, and `closeToast` | `it('calls onClose when toast is closed via button')` |
| `maxVisibleToasts` | `it('limits visible toasts to maxVisibleToasts prop')` |
| Missing provider | `it('throws when useToast is used without ToastProvider')` |
| Reduced motion skips view transition | `it('skips startViewTransition when prefers-reduced-motion')` |
| Hover pauses auto-dismiss | `it('pauses auto-dismiss while toast is hovered')` |
| Focus pauses auto-dismiss | `it('pauses auto-dismiss while toast is focused')` |
| Enter on the close button | `it('closes the toast from the close button with Enter')` |
| axe with a visible toast | `it('has no axe violations when a toast is visible')` |
| `invalid` / `size` | n/a — semantic `variant` only |
| `onExitComplete` | n/a — `onClose` fires on dismiss, not after a panel animation |
| Swipe | n/a — not a sheet |
| Form | n/a — no form field |
