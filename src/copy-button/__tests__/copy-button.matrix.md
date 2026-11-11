# CopyButton

| Scenario                               | Proof                                                                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Copy, icon swap, timeout               | `it('copies the text and swaps the icon until the timeout')`                                                                        |
| Pointer leave does not reopen the hint | `it('does not reopen the hint when the pointer has left')`                                                                          |
| Unmount clears the timer               | `it('clears the reopen timer on unmount')`                                                                                          |
| Focus during the copied tip            | `it('ignores a focus open while the copied tooltip is closing')`, `it('keeps the copied tip when focus returns during the status')` |
| Hint before click                      | `it('shows the copy hint on focus before a click')`                                                                                 |
| Cancelled click                        | `it('does not copy when the click is cancelled')`                                                                                   |
| Clipboard rejection                    | `it('shows a tooltip and keeps the copy icon when the clipboard rejects')`                                                          |
| Enter copies                           | `it('copies the text when Enter is pressed')`                                                                                       |
| axe default                            | `it('has no axe violations')`                                                                                                       |
