# Component test files

Open this file from `tdd` step 4. Assertions, mocks, `userEvent` and `fireEvent` rules, and what to do when a test is red live in `tdd/SKILL.md` (`Assertions`, `When a test is red`). This file is the path, the import, and what the suite covers.

## Files

- Vitest, `@testing-library/react`, `user-event`, `jest-dom`.
- Put the file at `src/<name>/__tests__/<name>.test.tsx`. Add `form-<name>.test.tsx` when the primitive has `FormX`.
- Name it after the primitive. `index.test`, `Button.test`, a test file in the primitive root, and a `tests/` folder are the wrong paths; use the path above.
- Import the component from `../index` (the public API), not from `../Component`.

## What the suite covers

- The public contract: children, and `dataTestId` rendered as `data-test-id`.
- `variant` and `size` by the presence of a module class. A full-DOM snapshot is not that check.
- `disabled`, and a click that fires or does not fire.
- `as`, by the tag in the DOM.
- Defaults that matter for a11y or HTML (`type="button"`).
- A slot such as `icon` (left / after), with a small stub component in the test.

## Scenarios

Walk the handlers, validators, and guards before writing tests, and add the user action that code does not handle. Cover invalid or contradictory input (`end < start`, outside `min`/`max`, a partial value), boundary values, and sequences (type A, then a conflicting B, then blur). Drive input with `userEvent` (`type`, `keyboard`, `click`). A ref, a setter, or a prop is the input only for the controlled-mode row. An unhandled case starts as a failing test, then the fix (`tdd` steps 4 and 5).

## Shape

- `describe('<Name>')` and a short `it` for one behavior.
- Prefer `getByRole` and `getByTestId` over `container.querySelector`.
- Leave markup and CSS snapshots, pixel checks, and computed styles out. Visual regression is a Storybook story.
- Title the test as the scenario. A title that says `covers`, `branch`, or `line` names a coverage target; rename it to the user action.
- Test the public behavior. `buttonVariants` and private helpers are inside the primitive; the public entry covers them.
- One representative `size` × `variant` pair is enough. The full matrix belongs in cva, not in a duplicated suite.
