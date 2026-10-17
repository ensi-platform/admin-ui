# Public hooks

| Scenario | Proof |
| --- | --- |
| `useOverlayExitComplete` fires after open → exiting → closed | `it('calls onExitComplete after open then fully closed')` |
| Does not fire when never opened, including unmount | `it('does not call onExitComplete on unmount when never shown')` |
| Fires on unmount while still open | `it('calls onExitComplete on unmount while still present')` |
| Strict Mode replay does not fire | `it('does not call onExitComplete when Strict Mode replays the mount effect')` |
| Same callback through Modal, Drawer, BottomSheet, ActionPopup | those components' `onExitComplete` tests |
| `usePrevious` returns the previous render, including `0` and `null` | `it('returns the initial value, then the value from the previous render')`, `it('keeps 0 and null instead of treating them as missing')` |
