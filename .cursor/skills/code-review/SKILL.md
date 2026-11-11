---
name: code-review
description: >-
    Review one task's diff against this repo's rules and the request that
    produced it. Use when the user asks for a review of the work just done,
    of a named file list, or of a primitive's change — including «проверь
    изменения», «ревью».
---

# Review one task diff

Standards and Spec stay in separate reports. A change can follow the rules and still miss the request, or match the request and break a rule. A single verdict lets the passing axis hide the other. The review records the findings. The edit happens later, after the user agrees.

## Steps

1. **Take the file list.** Use the list from the task summary or from the user. The diff is `git diff HEAD -- <files>` plus files on that list that are still untracked. Other dirty files in the tree belong to other work and stay out of the diff. No list: ask for it and stop.
   **Done when:** every path in the diff is on the list and the diff is non-empty, or the reply says the diff is empty and stops.

2. **Review the two axes in parallel.** Start both in the same turn, each in its own subagent, with a fresh context. Hand each one the diff and tell it to review directly and not start another code review.
   - **Standards.** Read the skills whose file-type row matches the diff. The map is in [`../router/SKILL.md`](../router/SKILL.md) (file-type map). Cite the skill file and the rule. Open [`references/smells.md`](references/smells.md) only for a hunk no skill covers. Leave out a finding eslint or prettier would already report. The repo eslint config extends a shared config, so the rule can live in that package rather than in the local `eslint.config.js`. Search both before you keep the finding.
   - **Spec.** The source is the chat message that asked for the change, or `docs/Description.ru.md` and `docs/Description.en.md` when that message points at a primitive. Quote the line next to each finding. Missing, extra, and implemented-but-wrong are the three questions. No source: write `no spec` and do not invent requirements.
   No subagent tool: write the two reports yourself, one after the other, still as two texts.
   **Done when:** two separate texts exist, headed Standards and Spec.

3. **Show them in that order.** End with two lines: the finding count and the most serious finding for Standards, then the same for Spec. Do not merge the axes and do not edit the files.
   **Done when:** both lines are in the reply and `git diff HEAD -- <files>` is unchanged from step 1.
