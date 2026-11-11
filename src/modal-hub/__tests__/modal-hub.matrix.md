# ModalHub

| Scenario                                 | Proof                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| Open, close, stack, Escape, focus return | `use-modal.test.tsx`                                                     |
| Lazy open and raced loads                | `use-modal-async.test.tsx`                                               |
| Empty hub axe                            | `modal-hub.test.tsx` `it('has no axe violations when no modal is open')` |
| Dialog geometry                          | n/a — jsdom has no layout; open/close is covered by the hook tests       |
