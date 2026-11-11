---
name: grill
description: >-
    Resolve a decision the contract does not state, in AskQuestion batches.
    Use when tdd, diagnosing-bugs, or write-component-docs hits a silent
    contract, or when the user runs /grill.
---

# Decisions the contract does not state

The contract is `types.ts`, `docs/Description.ru.md`, and `docs/Description.en.md`, plus the implementation when it already behaves one way. A fact in those files is looked up, not asked. A decision they do not contain is asked. This skill writes no code and does not ask the user to approve a plan.

When another skill invokes this one, grill only the decision it named.

Map the open decisions as a tree. The frontier is every decision whose prerequisites are already settled. Ask the whole frontier in one batch. A question that depends on an answer still open in this batch waits for the next one.

## Steps

1. **List the frontier.** Read the request and the contract files. Drop a decision the contract or the implementation already settles, and write down the value you found. Keep a decision only when those files are silent.
   **Done when:** the list is written, and each dropped item cites the file that settled it. An empty list ends the skill.

2. **Ask one batch.** Send one `AskQuestion` with the independent questions, about five, fewer when that is all that remains. Each question is one decision, with at least two short options. Mark the recommended option `(recommended)` and give a one-line reason. Use `allow_multiple` only when the decision is actually multi-select. Give each question a stable `id`. An open answer (a number, a name) is buckets plus "Other", or one plain-text question.
   No `AskQuestion`: ask one question in the chat, with a recommended answer, and wait.
   **Done when:** that call was sent, or the text question is in the reply and you are waiting.

3. **Next frontier.** Record the answers. Ask the decisions the answers unlocked. Repeat until the named decision, or the frontier the user brought, has an answer or a value from the contract.
   **Done when:** every remaining decision has an answer or a contract citation, and the reply summarizes those decisions.
