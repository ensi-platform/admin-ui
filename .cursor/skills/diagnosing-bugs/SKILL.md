---
name: diagnosing-bugs
description: >-
    Find why one admin-ui symptom happens and close it with a regression test.
    Use when the user reports a broken primitive or hook, or asks to diagnose
    it — including «баг», «не работает», «найди причину».
---

# Diagnose one symptom

A theory before a red command sends the fix at the wrong bug. The loop is the work. Phases after it only consume that loop.

Skip a phase only when the reply says why. Replace a secret, token, cookie, or `Authorization` value with `<redacted>` before the reply shows a command, log, or artifact.

The loop for a behavior jsdom can drive is one vitest command. Paint, spacing, color, and a focus ring the user can see are a Storybook story: jsdom has no layout, so a pixel assertion does not catch them. Curl, `git bisect`, and a glossary file do not observe a primitive; run the vitest command or open the story instead.

## Phases

1. **Red loop.** Run `pnpm vitest run` on the narrowest file, or with `-t` on the symptom title, and keep the output. Write the failing test first when none exists; import the public entry and drive the symptom the way the user hit it. For a visual symptom, open the story in the browser and record what is wrong on screen. If this session has no browser, say so, name the story file, and read the CSS that paints the symptom.
   Stop when you are reading the implementation to guess the cause and this command has not run yet. If no loop can be built, list the attempts and ask for the environment or a redacted artifact.
   **Done when:** the reply quotes one command already run and its red output (secrets as `<redacted>`), and that output is the user's symptom. For a visual symptom with no vitest seam, the reply names the story and what was wrong on screen, or names the story file and says the browser was unavailable.

2. **Minimise.** Remove one input, prop, or step and rerun. Keep a piece only when removing it makes the loop go green.
   **Done when:** every remaining piece is required for the red result.

3. **Hypothesise.** Write 3–5 hypotheses before testing any of them and before the first edit of the production file. Each one says: if this is the cause, then changing one named thing removes the bug or makes it worse. Put that list in a message before the first production edit, then test in that order. A list written after the edit can no longer change which probe you run, so it does not count. Keep going with that order when the user is away.
   When `types.ts` and `docs/Description.ru.md` / `docs/Description.en.md` do not say what the correct behavior is, invoke the local `grill` skill for that decision and wait. If that skill is missing and `AskQuestion` is missing, ask that one question in the chat, include a recommended answer, and wait.
   **Done when:** the list was sent before the first production edit, and a silent contract either has an answer or a question waiting on the user.

4. **Probe.** One probe checks one prediction. Change one thing. Tag a debug log `[DEBUG-` plus four characters. On a slow path, measure once, then narrow.
   **Done when:** the probe answers one prediction, and every debug log you added carries that tag.

5. **Fix.** Turn the minimised loop into one failing test at that seam, watch it fail, then make the smallest change that turns it green. Follow the red → green cycle in [`tdd`](../tdd/SKILL.md) for that one test. Rerun the phase 1 command on the original symptom.
   **Done when:** the phase 1 command is green and the new test is green.

6. **Cleanup.** Search `src/` for `[DEBUG-` and delete those lines. Delete a throwaway harness. Leave the changes uncommitted for the user; that stop is the [`no-commits`](../no-commits/SKILL.md) skill. In the reply, name the command that reproduced the bug and the test that closed it.
   **Done when:** both names are in the reply, a search for `[DEBUG-` under `src/` is empty, and `git status` shows the changes uncommitted.
