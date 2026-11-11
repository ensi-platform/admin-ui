---
name: tdd
description: >-
    Write or fix unit tests for an admin-ui primitive test-first (Vitest, RTL,
    user-event) so a broken contract fails the test. Use when the user adds,
    rewrites, audits, or fixes tests under src/*/__tests__/, mentions coverage,
    a red test, a regression, or a behavior change of a primitive — including
    «напиши тесты», «проверь тесты», «покрытие», «упал тест».
---

# Test-driven component tests

A test is worth keeping when it fails because the behavior broke. Line coverage does not show that. This skill is the red → green loop for one primitive: agree the seams, then one failing test, then only the code that makes that test pass.

## When the loop applies

Run the loop when the change alters behavior of code that already has tests, or adds behavior this package covers with unit tests (a primitive, a util, a hook).

Skip the loop for a docs-only edit, a token or CSS tweak with no behavior contract, a spike the user asked to leave untested, and a change outside the usual test surface.

**Done when:** the reply says the loop runs, or names which skip applies.

Open a reference only at the step that names it:

- [`references/component-tests.md`](references/component-tests.md) — file path, import, what the suite covers, query and title shape. Step 4.
- [`references/behavior-matrix.md`](references/behavior-matrix.md) — which rows apply to this kind of component
- [`references/good-vs-bad.md`](references/good-vs-bad.md) — assertions, mocks, and tautological expected values

## Loop

1. **Read the contract.** Read `types.ts`, `docs/Description.ru.md`, `docs/Description.en.md`, `docs/Example.ru.md`, `docs/Example.en.md`, `FormX.tsx` when it exists, the stories, the current tests, and `git log --grep=fix -- src/<name>`.
   **Done when:** every one of those paths that exists has been read, and each `fix:` commit that touches `src/<name>` is written down.

2. **Name the seams.** A seam is one observable behavior. The seam list is the behavior matrix, not the branch list in the source.
   - **Bug.** Add one row named after the symptom. Leave the rest of the matrix unchanged. Skip step 3.
   - **New or rewritten tests.** Open `references/behavior-matrix.md`. Keep the sections that match this component. For a component that takes user input, include section L. Walk `Component.tsx`, hooks, `utils.ts`, and `FormX.tsx` line by line. For each handler, validator, guard, and state change, add the user action that code does not handle, and mark it as a bug when that is what you found.
   Write the list to `src/<name>/__tests__/<name>.matrix.md`. Copy the shape from `src/input/__tests__/input.matrix.md`: a scenario column and a proof column. The proof is the future `it` title or `n/a — reason`.
   Before choosing a query, render once and read `container.innerHTML` and `document.activeElement` (a throwaway test or a file under `/tmp`, then delete it). React Aria often puts the visible text outside the element you expect and restores focus asynchronously.
   **Done when:** the matrix file exists, and either it gained exactly one bug row, or every applicable row is an `it` title or `n/a — reason`.

3. **Agree the seams.** Show the matrix and wait. Do not edit a test file before that.
   A row whose contract does not say what happens — the value rolls back or `invalid` is set, or the type or state is ambiguous — is not ready to confirm. Invoke the local `grill` skill for that decision, then rewrite the row from the answer. If no `grill` skill is available, ask that one question in the chat, include a recommended answer, and wait.
   **Done when:** the user has confirmed the matrix, or the silent row now states the decision that came back and the matrix was shown again.

4. **Red.** Write one test for the next row that does not have a passing test yet. Open [`references/component-tests.md`](references/component-tests.md) for the file path, the public import, and the query. Import the primitive from `../index`. Drive it with `userEvent` (`type`, `keyboard`, `click`). A prop is the right input only for the controlled-mode row itself. Take the expected value from a literal, a worked example, or the contract. Open `references/good-vs-bad.md` when the assertion is a value, a mock, or a "does not happen" check.
   Run `pnpm vitest run src/<name> -t "<title>"` so this cycle stays on that test.
   **Done when:** that command fails on this test because the behavior is absent. A bug test fails on the current source.

5. **Green.** Write only the code that makes this test pass. Leave the next row for the next cycle.
   **Done when:** the same command exits 0, and the production change covers this behavior only.

6. **Next row.** Repeat steps 4 and 5 until every proof cell that names a test has been red, then green.
   **Done when:** each such row has been through one red run and one green run, or the user stopped the loop.

7. **Mutation check.** For each new or rewritten group, break the source the way a real bug would (drop an `onChange`, skip a `disabled` guard, invert a condition), rerun the test, and confirm it fails because of that break. Then restore the source to the green result from step 6. Skip this step for a bug test that was already red on the real defect.
   **Done when:** you can point at the mutation and the test that went red, and the source matches the green result again.

8. **Run the primitive.** `pnpm vitest run src/<name>` runs this primitive's tests, not the whole package, so the loop stays short.
   **Done when:** that command exits 0.

9. **Refactor.** Do this only after step 8 is green, and only when the user asks. Review in this repo reports findings and does not rewrite the code, so the rewrite stays in this step, outside the red cycle.
   **Done when:** no refactor was requested, or the command from step 8 still exits 0 after the rewrite.

## Assertions

Assert the outcome the user sees: `toHaveValue`, `toHaveFocus`, `aria-expanded`, `aria-selected`, `aria-invalid`, the `aria-describedby` text, `toBeDisabled`, `toBeChecked`, or the visible label of the selected item. Pair `toBeInTheDocument()` with one of those. For a callback, assert `toHaveBeenCalledTimes` and `toHaveBeenCalledWith`. Give every `not.toHaveBeenCalled()` a positive control in the same file that shows the same action does fire when it is allowed.

Title the test as the scenario («moves selection with ArrowDown and commits with Enter»). Use `it.each` for a formatting or parsing table, and include empty, `0`, `null`, min, max, first, and last where those values exist.

`userEvent.setup()` once per test, and `await` each action. Use `fireEvent` only for an event `userEvent` cannot produce, and leave a one-line comment naming that event. Wait with `findBy*` or `waitFor` on a real condition. For timers, call `vi.useFakeTimers({ shouldAdvanceTime: true })` and restore them in the same test. The default `render` wraps `AdminUiProvider`. To prove the component without the provider, import `render` from `@testing-library/react/pure`.

Run `axe` from `src/test/axe.ts` (`color-contrast` and `region` are already off) on the default state and on the key states. Contrast stays in the Storybook Accessibility tab.

## When a test is red

Change the component when it breaks the contract. Change the test when it asserts something the contract never promised, and say why (a query that cannot match `document.body` is the usual case). Keep the assertion: deleting it, `it.skip`, `toBeTruthy`, or `try/catch` does not finish the row.

## jsdom

Tag overflow, popover position, scroll, swipe distance, sticky columns, and `focus-visible` need layout. Test the logic that does not need geometry, mark the matrix row `n/a — jsdom has no layout`, and name the story that covers it. Where a stub is the only way to mount, leave `// jsdom: no layout — see <story>`.

## Symptom the user cannot reach

When no `userEvent` action reaches the code (a handler on a disabled control, a branch behind a guard the browser enforces), do not reach into React internals such as `__reactProps`. Ask whether the symptom can happen in a browser. If it can, drive it through the closest real path and say which one. If it cannot, mark the matrix row `n/a — unreachable: <reason>`, make the guard change only when the user asks for it, and do not add a test that calls the handler directly.

## Report

State the matrix path, which rows are tests and which are `n/a`, the mutations you tried, any jsdom rows, and any dead branch you found while walking the source. For a bug, name the command that showed red and the test that is green after the fix.
