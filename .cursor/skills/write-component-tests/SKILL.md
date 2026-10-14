---
name: write-component-tests
description: >-
    Write, review, or fix unit tests for an admin-ui primitive (Vitest + RTL +
    user-event) so they prove the component WORKS, not just that lines are
    executed. Use whenever the user asks to add, rewrite, audit, or fix tests in
    src/*/__tests__/, mentions coverage, a red test, a regression test, or when
    you change component behavior and must update tests. Also use for «напиши
    тесты», «проверь тесты», «покрытие», «упал тест».
---

# Write component tests

Project conventions (read first, short): [`.cursor/rules/component-tests.mdc`](../../rules/component-tests.mdc) and [`.cursor/rules/tdd.mdc`](../../rules/tdd.mdc).

References (read when you reach that step):

- [`references/behavior-matrix.md`](references/behavior-matrix.md) — what to test per kind of component
- [`references/good-vs-bad.md`](references/good-vs-bad.md) — rewritten real examples from this repo

## Why this skill exists

This repo had 100% line / branch / function coverage and still shipped a component (`Select`) with no keyboard, `defaultValue`, selected-label or disabled-option tests, plus tests titled «covers … branches» and tests that mock `react-aria-components` only to reach a `null` branch. **Coverage measures what ran, not what was verified.** A test is valuable only if it fails when the behavior breaks.

## The one rule

> Derive tests from the **contract** (`types.ts`, `Description.ru.md`, `Example.*.md`, `FormX.tsx`, ARIA pattern for the role), never from the **implementation** (which lines/branches exist).

Coverage is a by-product. Never write or keep a test whose reason to exist is "to hit a line/branch".

## User scenarios + code walkthrough (mandatory)

Contract-derived tests are not enough on their own. Two failure modes seen in this repo:

- A bug lives in a case the code never handled, so a test derived from "what the code does" never exists (e.g. `DateRangePicker` accepted `end < start` typed by keyboard; tests only covered min/max bounds).
- Tests bypass real input (force a value via a prop/ref/setter) instead of doing what the user does.

So, for every component with user input:

1. **Walk the source line by line** (`Component.tsx`, hooks, `utils.ts`, `FormX.tsx`). For each handler, validator, guard, and state transition ask: *what can the user do that this code does not handle?* Write the answers into the scenario list, even if the answer is "a bug".
2. **Enumerate user scenarios** as a user would perform them: type, paste, delete, change order, blur, Escape, re-enter, switch mouse ↔ keyboard. Always include:
    - **invalid / contradictory input** (range `end < start`, value outside `min`/`max`, partial input, non-numeric text, empty after non-empty);
    - **boundary input** (`start === end`, exactly `min`/`max`, `0`, first/last item);
    - **sequences** (enter A, then B that conflicts with A; enter, blur, re-enter; open, pick, reopen);
    - **both channels** where both exist (typing into segments AND picking from the popup).
3. **Drive tests through real input** (`userEvent.type` / `keyboard` / `click`). Do not set state through a ref/setter/prop to simulate what the user typed; a prop-driven value is only OK for the controlled-mode scenario itself.
4. If a scenario reveals missing handling: write the failing test first (tdd.mdc), confirm it fails, fix the source. If the intended behavior is unclear (rollback vs `invalid` marker), ask the user before choosing.
5. Report the walkthrough: list of handled / unhandled cases found in the source, and which tests cover them.

## Workflow

1. **Collect the contract.** Read `types.ts`, `docs/Description.ru.md`, `docs/Example.ru.md`, `FormX.tsx` (if any), the stories, the existing tests, and `git log --grep=fix -- src/<name>` (every past fix needs a regression test).
2. **Walk the code and enumerate user scenarios** (section above), then **write the scenario list first**, before any code, using [`behavior-matrix.md`](references/behavior-matrix.md). Every documented prop and every row of the matrix is either a planned `it` or an explicit "n/a — reason". Show the list to the user if the component is non-trivial.
   **Probe the real DOM once** (dump `container.innerHTML` to a scratch file, check `document.activeElement`) before choosing queries. Do not assume where text, roles, or focus end up; react-aria often splits them across elements and restores focus asynchronously.
3. **Write the tests** as user scenarios against the public API (`import … from '..'` / `'../index'`), through the real DOM and `userEvent`.
4. **Mutation check (mandatory, manual).** For each new or rewritten test group, temporarily break the source (invert a condition, drop the `onChange` call, change a key, remove a `disabled` guard), run the test, confirm it **fails for the right reason**, then revert. A test that stays green under a plausible bug is not finished. Remove the breakage before reporting.
5. **Run** `pnpm vitest run src/<name>`, then `pnpm typecheck` and lint on touched files.
6. **Report**: the scenario matrix (covered / n/a with reason), which mutations you tried, anything not testable in jsdom, any dead code you found.

If the component has a bug: write the failing test first (tdd.mdc), see it fail, then fix the source. Never adjust a test to match buggy behavior.

## When a test is red

Decide explicitly, do not just make it green:

- Component violates the contract → fix the component.
- Test asserts something the contract never promised (e.g. querying a node that is the container itself) → fix the test, and say why.
- Never delete, `skip`, loosen to `toBeTruthy`, or wrap in `try/catch` to get green.

## Assertion quality

- Assert the **outcome**, not presence. `toBeInTheDocument()` alone proves only that something rendered. Pair it with value, state, call arguments, or focus.
- Assert callback **arguments and count**: `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith(...)`. For "must not fire" use `not.toHaveBeenCalled()` **after** a positive control proves the same interaction does fire in the enabled case.
- Assert user-visible state: `toHaveValue`, `toHaveFocus`, `aria-expanded`, `aria-selected`, `aria-invalid`, `aria-describedby` target text, `toBeDisabled`, `toBeChecked`, visible label of the selected item.
- Test title is the user scenario: «moves selection with ArrowDown and commits with Enter», not «handles keydown» or «covers branch».
- One behavior per `it`; several `expect`s are fine when they describe one outcome.
- Use `it.each` for data tables (utils, formatting, parsing). Include boundaries: empty, `0`, `null`, min/max, first/last.

## Queries and interaction

- `getByRole` (with `name`) > `getByLabelText` > `getByText` > `getByTestId` (`dataTestId`). `container.querySelector` is a last resort, never for the main assertion.
- `userEvent.setup()` per test; `await` every action. `fireEvent` only for events `userEvent` cannot produce (custom `scroll`, `wheel` deltas, pointer-capture) — leave a one-line comment why.
- Waiting: `findBy*` or `waitFor` with an explicit condition. Never `waitFor(() => {})`, never arbitrary sleeps. Timers: `vi.useFakeTimers({ shouldAdvanceTime: true })` and always restore.
- Default `render` (from the alias) wraps in `AdminUiProvider`. To prove a component works without the provider, import `render` from `@testing-library/react/pure`.

## Forbidden (each of these caused the current situation)

- Test titles containing `covers`, `branch`, `line`, `for coverage`, or listing code names instead of behavior.
- Tests that exist only for a defensive branch unreachable through the public API (`ignores null`, `ignores missing ref`). Either reproduce it with a real user scenario, or **delete the dead branch**, or report it. Do not mock to reach it.
- `vi.mock('react-aria-components')`, `vi.mock` of our own components (`@/select`, `@/autocomplete`) or of the component's own hooks. Mocks are allowed only at external boundaries: network/`fetch`, clipboard, timers, `ResizeObserver`/`matchMedia` polyfills, `localStorage` failures.
- Importing internals (`../components/*`, `../hooks/*`, private helpers) to test them in isolation, unless the file is a pure util with its own `utils.test.ts`, or an exported public hook.
- Snapshots of markup/CSS, pixel or computed-style assertions.
- Class assertions (`toHaveClass(styles.x)`) as the **only** check. Allowed only as secondary evidence for `size`/`variant` on presentational components; the behavior of that variant (if any) must be tested separately.
- Global or broad `console.error` suppression. If a test expects React/RAC to throw, spy locally with `vi.spyOn(console, 'error')`, assert, restore.
- Asserting on the document/container itself via `getBy*` (queries search descendants only).
- Weakening an assertion to make a test pass.

## Layout-dependent behavior (jsdom has no layout)

Tag overflow, popover flip/position, scroll/virtualization, swipe distances, sticky columns, `focus-visible` heuristics cannot be truly verified in jsdom. Do **not** fake geometry with mocks just to execute the branch. Instead: test the logic that is independent of geometry, mark the rest in the report as "needs browser/Storybook play test", and leave a `// jsdom: no layout — see <story>` comment where a stub is unavoidable.

## Regression tests

For every bug fix: the test is named after the observable bug («keeps focus on trigger after Escape closes the list»), lives with the component's other tests, and **must fail without the fix** (verify by stashing the source change). A `fix:` without such a test is incomplete.

## Done checklist

- [ ] Scenario list built from the contract; every documented prop has a behavioral test or an "n/a" reason
- [ ] Source walked line by line; unhandled user cases listed and each has a test (or a reported bug)
- [ ] Invalid, contradictory, boundary, and sequential input scenarios covered via real `userEvent` input (not via ref/setter shortcuts)
- [ ] Matrix rows for this component kind covered (value, interaction + keyboard, states, a11y, Field/Form wiring, overlay lifecycle where applicable)
- [ ] Every new test group failed under at least one deliberate source mutation, then reverted
- [ ] No forbidden patterns (titles, mocks of RAC/own code, internals, snapshots, class-only checks)
- [ ] Positive control exists for every "does not happen" assertion
- [ ] Tests green, `pnpm typecheck` green, source tree has no leftover mutation
- [ ] Report lists jsdom limits and any dead code found
