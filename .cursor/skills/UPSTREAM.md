# Upstream

Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) at commit `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`.

Files read at that commit:

- `skills/engineering/tdd/SKILL.md`
- `skills/engineering/tdd/tests.md`
- `skills/engineering/tdd/mocking.md`
- `skills/engineering/diagnosing-bugs/SKILL.md`
- `skills/engineering/code-review/SKILL.md`
- `skills/productivity/grilling/SKILL.md`
- `skills/productivity/grill-me/SKILL.md`

## License

MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Skills

| Skill | Source | What changed |
| --- | --- | --- |
| `tdd` | `skills/engineering/tdd` (`SKILL.md`, `tests.md`, `mocking.md`). `skills/productivity/grilling` is the interview used when a matrix row has no contract. | Red, then the minimum code, one seam at a time. Refactor stays out of that cycle and runs only when asked, because review here reports findings and does not rewrite the code. Seams are the applicable rows of the behavior matrix for one primitive, written to `src/<name>/__tests__/<name>.matrix.md`. A bug adds one row and a red test; a new or rewritten suite waits until the matrix is confirmed. A row that does not say whether the value rolls back or becomes `invalid` goes through the local `grill` skill. `tests.md` tautological examples are in `tdd/references/good-vs-bad.md`. Mocks stay on external boundaries (`mocking.md`), which here means no `react-aria-components` mock and no mock of our own modules. |
| `diagnosing-bugs` | `skills/engineering/diagnosing-bugs/SKILL.md` | The same six phases, scoped to one admin-ui symptom. The loop is a red `pnpm vitest run`; paint and focus are a Storybook story. Curl, `git bisect`, a glossary, and a commit are out. Secrets are `<redacted>` before they are shown. The report names the command that reproduced the bug and the test that closed it. A silent contract goes through the local `grill` skill. |
| `code-review` | `skills/engineering/code-review/SKILL.md` | Two axes, unmixed, no combined verdict, and no edit. The diff is `git diff HEAD -- <files>` for the task's file list, because the working tree holds other people's files. Standards are the skills under `.cursor/skills` (the file-type map is in `router`); the Fowler smell baseline lives in `references/smells.md` and applies only where a skill is silent. Spec is the chat request or the component Description. No source means `no spec`. |
| `grill` | `skills/productivity/grilling/SKILL.md` and `skills/productivity/grill-me/SKILL.md` | The frontier interview, asked as `AskQuestion` batches. The folder is `grill` so it can be called from other skills and via `/grill` without the phrases that trigger the global grill-me skill. It runs only when a contract is silent. It writes no code. Without `AskQuestion`, one text question with a recommendation. |
