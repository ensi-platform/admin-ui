# Skill file checklist

Walk the items in order for every skill file you touch: `SKILL.md` and `references/*.md`. Edit a paragraph that disagrees with an item. Leave a paragraph that already matches.

## Order

1. **Who invokes.** Decide who runs the skill. For the model: a `description` with branches, and no `disable-model-invocation`. For a human only: `disable-model-invocation: true` and a one-line `description`.
   Done when: the frontmatter is in one of those two states, and the `description` is written for that state.

2. **description.** Leave it as the only skill text that is read on every turn. One branch, one phrase. Collapse synonyms of the same branch into that phrase. Do not move steps or body rules into `description`.
   Done when: `description` shows when to open the skill, and it contains no step, no rule, and no second name for the same branch.

3. **Steps.** Put the actions in order. Give each step a "Done when" that can be checked against a file or a result: a path exists, an item is closed, a command passed. Replace "until it is clear" with that kind of condition.
   Done when: every step has a condition that shows whether the step is done.

4. **One file, one rule.** A rule lives in one file. A neighbor that needs it links to that file.
   Done when: the same wording appears once under `<skills-dir>`, and the neighbor points at that path.

5. **A reference is not for every branch.** Put material that only some branches read into `references/`, and link it from the step that reads it. Leave material that every branch needs in `SKILL.md`.
   Done when: every file in `references/` is named in a specific step, and that step says when to open it. No `references/` directory means the skill has no such reference.

6. **Write the action.** Write what to do. Keep a prohibition only where a positive action cannot be stated, and in the same sentence say what to do instead of the prohibited action.
   Done when: every sentence names an action; a prohibition with no neighboring action is removed.

7. **What the code does not say.** Do not copy `package.json` scripts or a directory tree that is already visible in the repository into the skill. Write what the code does not say: why a command is run, and which sample file outranks the skill text.
   Done when: the skill has no script list and no directory map; it names the reason for a command, or the sample path the text is checked against.

8. **Check against the code.** Check a claim about the repository against the file it names. A neighboring skill is not a source. Open every path the skill mentions. Compare the frontmatter `name` with the skill folder name.
   Done when: the named path exists; `name` matches the folder name; text that diverged from the file is fixed; a match is left as it is.
