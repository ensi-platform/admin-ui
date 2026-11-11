# Smell baseline

Open this file from the Standards review, and only for a hunk that no skill under `.cursor/skills` covers. The file-type map is in `router/SKILL.md`. A documented rule wins. A smell is a judgement call, named as "possible …", with the hunk quoted. Skip a smell that eslint or prettier would already report.

Each line is the smell, then the move that would clear it.

- **Mysterious Name** — a function, variable, or type whose name hides what it holds. Rename it.
- **Duplicated Code** — the same shape in more than one hunk. Extract it and call it from both.
- **Feature Envy** — a function that uses another object's data more than its own. Move it onto that data.
- **Data Clumps** — the same few fields travel together. Give them one type.
- **Primitive Obsession** — a string or number standing in for a domain concept. Give the concept a small type.
- **Repeated Switches** — the same `switch` or `if` cascade on the same type in more than one place. One map, or polymorphism.
- **Shotgun Surgery** — one change edits many unrelated files. Gather what changes together.
- **Divergent Change** — one file changes for several unrelated reasons. Split it.
- **Speculative Generality** — a parameter, hook, or abstraction the request does not need. Inline it.
- **Message Chains** — `a.b().c().d()` the caller should not walk. One method on the first object.
- **Middle Man** — a function that only forwards. Call the target.
- **Refused Bequest** — an implementer that ignores most of what it inherits. Composition instead of that inheritance.
